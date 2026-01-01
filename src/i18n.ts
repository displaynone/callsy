import { i18n } from "@lingui/core";
import * as Localization from "expo-localization";

export const defaultLocale = "en";

const catalogs: Record<string, Record<string, string>> = {
  en: require("./locales/en/messages.json"),
  es: require("./locales/es/messages.json"),
  fr: require("./locales/fr/messages.json"),
  de: require("./locales/de/messages.json"),
  it: require("./locales/it/messages.json"),
  ar: require("./locales/ar/messages.json"),
  pt: require("./locales/pt/messages.json"),
  zh: require("./locales/zh/messages.json"),
  ko: require("./locales/ko/messages.json"),
  ja: require("./locales/ja/messages.json"),
  hi: require("./locales/hi/messages.json"),
  ro: require("./locales/ro/messages.json"),
  uk: require("./locales/uk/messages.json"),
  th: require("./locales/th/messages.json"),
  nl: require("./locales/nl/messages.json"),
  ur: require("./locales/ur/messages.json"),
};

const supportedLocales = new Set(Object.keys(catalogs));

function resolveLocale(tag: string | undefined | null) {
  if (!tag) return defaultLocale;
  const normalized = tag.replace("_", "-").toLowerCase();
  if (supportedLocales.has(normalized)) return normalized;
  const base = normalized.split("-")[0];
  if (supportedLocales.has(base)) return base;
  return defaultLocale;
}

export function detectDeviceLocale() {
  const locales = Localization?.getLocales?.() ?? [];
  const languageTag =
    locales[0]?.languageTag ?? defaultLocale;
  return resolveLocale(languageTag);
}

export function activateLocale(locale: string) {
  const resolved = resolveLocale(locale);
  i18n.load(resolved, catalogs[resolved]);
  i18n.activate(resolved);
  return resolved;
}

export function setupI18n() {
  return activateLocale(detectDeviceLocale());
}

setupI18n();
