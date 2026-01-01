import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Toggle } from "./Toggle";

export type OptionCardProps = {
	label: string;
	icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
	value: boolean;
	onValueChange: (next: boolean) => void | Promise<void>;
};

export function OptionCard(props: OptionCardProps) {
	const { label, icon, value, onValueChange } = props;
	const theme = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);
	return (
		<View style={styles.optionCard}>
			<View>
				<Toggle value={value} onValueChange={onValueChange} />
			</View>
			<MaterialCommunityIcons
				name={icon}
				size={20}
				color={theme.colors.onSurfaceVariant}
			/>
			<Text style={styles.optionLabel}>{label}</Text>
		</View>
	);
}

function createStyles(theme: any) {
	return StyleSheet.create({
		optionCard: {
			backgroundColor: theme.colors.elevation.level1,
			borderRadius: 14,
			flexDirection: "row",
			alignItems: "center",
			padding: 10,
			gap: 10,
		},
		optionLabel: {
			color: theme.colors.onSurface,
			fontWeight: "500",
		},
	});
}
