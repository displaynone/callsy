import { NativeModules, Platform } from 'react-native';

export type AllowedContact = {
  id: string;
  name: string;
  phoneNumbers: string[];
  avatarUri?: string;
};

type AllowedPayload = {
  numbers: string[];
  names: string[];
};

type CallsyAndroidModule = {
  setAllowedContacts(payload: AllowedPayload): Promise<void>;
  setWhatsappFilterEnabled(enabled: boolean): Promise<void>;
  enableDndBypassForContacts(contactIds: string[]): Promise<void>;
  disableDndBypass(): Promise<void>;
  openDoNotDisturbSettings(): Promise<void>;
  openNotificationListenerSettings(): Promise<void>;
};

const NativeCallsyAndroid = NativeModules.CallsyAndroid as CallsyAndroidModule | undefined;

export const CallsyAndroid: CallsyAndroidModule = {
  async setAllowedContacts(payload) {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.setAllowedContacts(payload);
  },
  async setWhatsappFilterEnabled(enabled) {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.setWhatsappFilterEnabled(enabled);
  },
  async enableDndBypassForContacts(contactIds) {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.enableDndBypassForContacts(contactIds);
  },
  async disableDndBypass() {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.disableDndBypass();
  },
  async openDoNotDisturbSettings() {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.openDoNotDisturbSettings();
  },
  async openNotificationListenerSettings() {
    if (Platform.OS !== 'android' || !NativeCallsyAndroid) return;
    await NativeCallsyAndroid.openNotificationListenerSettings();
  },
};

export function normalizePhoneNumber(input: string | undefined | null) {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  if (!digits) return '';
  return hasPlus ? `+${digits}` : digits;
}

export function normalizeText(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
