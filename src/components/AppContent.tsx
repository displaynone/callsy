import * as Contacts from "expo-contacts";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	PermissionsAndroid,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	useColorScheme,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	Avatar,
	Button,
	MD3DarkTheme,
	MD3LightTheme,
	Provider as PaperProvider,
	Snackbar,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	CallsyAndroid,
	normalizePhoneNumber,
	normalizeText,
	type AllowedContact,
} from "../callsy";
import { ContactListItem } from "./ContactListItem";
import { LogoIcon } from "./LogoIcon";
import { OptionCard } from "./OptionCard";
import { getInitials, parsedAllowedFromSelection } from "../utils/contacts";
import { useLingui } from "@lingui/react/macro";

export function AppContent() {
	const { t } = useLingui();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const [loadingContacts, setLoadingContacts] = useState(false);
	const [contacts, setContacts] = useState<AllowedContact[]>([]);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const [dndBypassEnabled, setDndBypassEnabled] = useState(false);
	const [whatsappFilterEnabled, setWhatsappFilterEnabled] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const filteredContacts = useMemo(() => {
		const q = normalizeText(search.trim());
		if (!q) return contacts;
		return contacts.filter((c) => normalizeText(c.name).includes(q));
	}, [contacts, search]);
	const selectedContacts = useMemo(() => {
		return contacts.filter((c) => selectedIds.has(c.id));
	}, [contacts, selectedIds]);

	useEffect(() => {
		(async () => {
			let loadedAllowed: AllowedContact[] = [];
			const raw = await AsyncStorage.getItem("callsy.allowedContacts.v1");
			if (raw) {
				loadedAllowed = JSON.parse(raw) as AllowedContact[];
				setContacts(loadedAllowed);
				setSelectedIds(new Set(loadedAllowed.map((c) => c.id)));
			}

			const dndEnabled =
				(await AsyncStorage.getItem("callsy.dndBypassEnabled.v1")) === "1";
			const showAvatarsEnabled =
				(await AsyncStorage.getItem("callsy.showAvatars.v1")) !== "0";
			const waEnabled =
				(await AsyncStorage.getItem("callsy.whatsappFilterEnabled.v1")) === "1";
			setDndBypassEnabled(dndEnabled);
			setWhatsappFilterEnabled(waEnabled);

			if (Platform.OS === "android") {
				await CallsyAndroid.setWhatsappFilterEnabled(waEnabled);
				await CallsyAndroid.setAllowedContacts(
					parsedAllowedFromSelection(loadedAllowed)
				);
				if (dndEnabled && loadedAllowed.length > 0) {
					await CallsyAndroid.enableDndBypassForContacts(
						loadedAllowed.map((c) => c.id)
					);
				}
			}
		})().catch((e) => {
			console.warn(e);
		});
	}, []);

	async function loadDeviceContacts() {
		setLoadingContacts(true);
		try {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					t`Permission required`,
					t`I need access to your contacts.`
				);
				return;
			}

			const result = await Contacts.getContactsAsync({
				fields: [
					Contacts.Fields.PhoneNumbers,
					Contacts.Fields.Image,
					Contacts.Fields.ImageAvailable,
				],
				pageSize: 1000,
			});

			const items: AllowedContact[] = (result.data ?? [])
				.map((c) => {
					const phoneNumbers =
						c.phoneNumbers
							?.map((p) => p.number)
							.map(normalizePhoneNumber)
							.filter(Boolean) ?? [];

					return {
						id: c.id,
						name: c.name ?? t`(No name)`,
						phoneNumbers,
						avatarUri: c.image?.uri,
					};
				})
				.filter((c) => c.phoneNumbers.length > 0)
				.sort((a, b) => a.name.localeCompare(b.name));

			setContacts(items);
		} finally {
			setLoadingContacts(false);
		}
	}

	function toggleSelected(id: string) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	async function persistSelection() {
		const selected = contacts.filter((c) => selectedIds.has(c.id));
		await AsyncStorage.setItem(
			"callsy.allowedContacts.v1",
			JSON.stringify(selected)
		);

		if (Platform.OS === "android") {
			await CallsyAndroid.setAllowedContacts(
				parsedAllowedFromSelection(selected)
			);
			if (dndBypassEnabled) {
				await CallsyAndroid.enableDndBypassForContacts(
					selected.map((c) => c.id)
				);
			}
		}

		setSnackbarMessage(t`Saved: Allowed contacts: ${selected.length}`);
		setSnackbarVisible(true);
	}

	async function onToggleDndBypass(enabled: boolean) {
		if (!enabled) {
			setDndBypassEnabled(false);
			await AsyncStorage.setItem("callsy.dndBypassEnabled.v1", "0");
			if (Platform.OS === "android") {
				await CallsyAndroid.disableDndBypass();
			}
			return;
		}

		if (Platform.OS !== "android") {
			setDndBypassEnabled(true);
			await AsyncStorage.setItem("callsy.dndBypassEnabled.v1", "1");
			return;
		}

		{
			const writeGranted =
				(await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
				)) === PermissionsAndroid.RESULTS.GRANTED;
			if (!writeGranted) {
				Alert.alert(
					t`Permission required`,
					t`To mark favorites (and allow calls during Do Not Disturb), Callsy needs permission to modify contacts (WRITE_CONTACTS).`
				);
				return;
			}

			const ids = Array.from(selectedIds);
			if (ids.length === 0) {
				Alert.alert(
					t`Select contacts`,
					t`Select allowed contacts and save first.`
				);
				return;
			}

			setDndBypassEnabled(true);
			await AsyncStorage.setItem("callsy.dndBypassEnabled.v1", "1");
			await CallsyAndroid.enableDndBypassForContacts(ids);
			Alert.alert(
				t`Setup required`,
				t`Callsy marked your allowed contacts as favorites. Now go to Do Not Disturb -> People/Calls and allow calls from Favorites/Starred contacts. If your phone doesn't offer that option, you can only allow Contacts or Repeated calls.`,
				[
					{
						text: t`Open Do Not Disturb`,
						onPress: async () => {
							try {
								await CallsyAndroid.openDoNotDisturbSettings();
							} catch (e) {
								console.warn(e);
							}
						},
					},
					{ text: t`OK` },
				]
			);
		}
	}

	async function onToggleWhatsapp(enabled: boolean) {
		setWhatsappFilterEnabled(enabled);
		await AsyncStorage.setItem(
			"callsy.whatsappFilterEnabled.v1",
			enabled ? "1" : "0"
		);
		if (Platform.OS === "android") {
			await CallsyAndroid.setWhatsappFilterEnabled(enabled);
			if (enabled) {
				Alert.alert(
					t`Requires notification access`,
					t`Enable notification access for Callsy (used to filter WhatsApp notifications).`,
					[
						{
							text: t`Open settings`,
							onPress: async () => {
								try {
									await CallsyAndroid.openNotificationListenerSettings();
								} catch (e) {
									console.warn(e);
									Alert.alert(
										t`Error`,
										t`Could not open notification access settings.`
									);
								}
							},
						},
						{ text: t`OK` },
					]
				);
			}
		}
	}

	const theme = useMemo(() => {
		const base = isDark ? MD3DarkTheme : MD3LightTheme;
		return {
			...base,
			colors: {
				...base.colors,
				primary: "#0097a7",
				secondary: "#afb42b",
			},
		};
	}, [isDark]);

	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<PaperProvider theme={theme}>
			<GestureHandlerRootView style={styles.root}>
				<SafeAreaProvider>
					<SafeAreaView style={styles.container} edges={["top"]}>
						<StatusBar
							style={isDark ? "light" : "dark"}
							backgroundColor={theme.colors.background}
						/>
						<View style={styles.titleContainer}>
							<LogoIcon size={32} />
							<Text style={styles.title}>Callsy</Text>
						</View>
						<Text style={styles.subtitle}>
							{t`Select allowed contacts to mark them as favorites.`}
						</Text>

						<View style={styles.options}>
							<OptionCard
								label={t`Calls`}
								icon="phone"
								value={dndBypassEnabled}
								onValueChange={onToggleDndBypass}
							/>
							<OptionCard
								label={t`WhatsApp`}
								icon="whatsapp"
								value={whatsappFilterEnabled}
								onValueChange={onToggleWhatsapp}
							/>
						</View>

						{selectedContacts.length > 0 ? (
							<View style={styles.selectedAvatarsRow}>
								{selectedContacts.slice(0, 12).map((c, idx) => (
									<View
										key={c.id}
										style={[
											styles.selectedAvatar,
											idx !== 0 && styles.selectedAvatarOver,
										]}
									>
										{c.avatarUri ? (
											<Avatar.Image size={34} source={{ uri: c.avatarUri }} />
										) : (
											<Avatar.Text size={34} label={getInitials(c.name)} />
										)}
									</View>
								))}
								{selectedContacts.length > 12 ? (
									<View
										style={[styles.selectedAvatar, styles.selectedAvatarOver]}
									>
										<Avatar.Text
											size={34}
											label={`+${selectedContacts.length - 12}`}
										/>
									</View>
								) : null}
							</View>
						) : null}

						<View style={styles.controls}>
							<Button
								mode="contained"
								buttonColor={theme.colors.primary}
								textColor={theme.colors.onPrimary}
								style={styles.primaryButton}
								contentStyle={styles.buttonContent}
								labelStyle={styles.buttonLabel}
								onPress={loadDeviceContacts}
							>
								{t`Load contacts`}
							</Button>
							<Button
								mode="contained"
								buttonColor={theme.colors.secondary}
								textColor={theme.colors.onSecondary}
								style={styles.secondaryButton}
								contentStyle={styles.buttonContent}
								labelStyle={styles.buttonLabel}
								onPress={persistSelection}
							>
								{t`Save selection`}
							</Button>
						</View>

						<TextInput
							value={search}
							onChangeText={setSearch}
							placeholder={t`Search...`}
							autoCorrect={false}
							style={styles.search}
							placeholderTextColor={theme.colors.onSurfaceVariant}
						/>

						{loadingContacts ? (
							<View style={styles.loading}>
								<ActivityIndicator color={theme.colors.primary} />
								<Text style={styles.loadingText}>
									{t`Loading...`}
								</Text>
							</View>
						) : (
							<FlatList
								data={filteredContacts}
								keyExtractor={(item) => item.id}
								contentContainerStyle={styles.listContent}
								renderItem={({ item }) => (
									<ContactListItem
										contact={item}
										selected={selectedIds.has(item.id)}
										onToggle={() => toggleSelected(item.id)}
									/>
								)}
							/>
						)}
						<Snackbar
							visible={snackbarVisible}
							onDismiss={() => setSnackbarVisible(false)}
							duration={2200}
						>
							{snackbarMessage}
						</Snackbar>
					</SafeAreaView>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</PaperProvider>
	);
}

function createStyles(theme: any) {
	return StyleSheet.create({
		root: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
			padding: 16,
		},
		title: {
			color: theme.colors.primary,
			fontSize: 28,
			fontWeight: "700",
		},
		titleContainer: {
			marginBottom: 6,
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
		},
		subtitle: {
			color: theme.colors.onSurfaceVariant,
			marginBottom: 14,
			lineHeight: 18,
		},
		options: {
			gap: 10,
			marginBottom: 10,
			flexDirection: "row",
		},
		selectedAvatarsRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 12,
			paddingLeft: 2,
		},
		selectedAvatar: {
			borderRadius: 999,
			borderWidth: 2,
			borderColor: theme.colors.background,
			backgroundColor: theme.colors.background,
		},
		selectedAvatarOver: {
			marginLeft: -10,
		},
		controls: {
			flexDirection: "row",
			gap: 10,
			marginTop: 6,
			marginBottom: 12,
		},
		primaryButton: {
			flex: 1,
			borderRadius: 12,
		},
		secondaryButton: {
			flex: 1,
			borderRadius: 12,
		},
		buttonContent: {
			paddingVertical: 6,
		},
		buttonLabel: {
			fontWeight: "700",
		},
		search: {
			backgroundColor: theme.colors.elevation.level1,
			color: theme.colors.onSurface,
			paddingVertical: 10,
			paddingHorizontal: 12,
			borderRadius: 12,
			marginBottom: 10,
		},
		loading: {
			paddingVertical: 18,
			alignItems: "center",
			justifyContent: "center",
			gap: 10,
		},
		loadingText: {
			color: theme.colors.onSurfaceVariant,
		},
		listContent: {
			paddingBottom: 28,
		},
	});
}
