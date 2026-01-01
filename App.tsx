import { I18nProvider } from "@lingui/react";
import { AppContent } from "./src/components/AppContent";

import { i18n } from "@lingui/core";
import { getLocales } from "expo-localization";
import arCatalog from "./src/locales/ar/messages.js";
import deCatalog from "./src/locales/de/messages.js";
import enCatalog from "./src/locales/en/messages.js";
import esCatalog from "./src/locales/es/messages.js";
import frCatalog from "./src/locales/fr/messages.js";
import hiCatalog from "./src/locales/hi/messages.js";
import itCatalog from "./src/locales/it/messages.js";
import jaCatalog from "./src/locales/ja/messages.js";
import koCatalog from "./src/locales/ko/messages.js";
import zhCatalog from "./src/locales/zh/messages.js";
import roCatalog from "./src/locales/ro/messages.js";
import thCatalog from "./src/locales/th/messages.js";
import ptCatalog from "./src/locales/pt/messages.js";
import ukCatalog from "./src/locales/uk/messages.js";
import urCatalog from "./src/locales/ur/messages.js";

const catalogs: Record<string, any> = {
	en: enCatalog.messages,
	es: esCatalog.messages,
	fr: frCatalog.messages,
	it: itCatalog.messages,
	de: deCatalog.messages,
	ko: koCatalog.messages,
	ja: jaCatalog.messages,
	ar: arCatalog.messages,
	zh: zhCatalog.messages,
	hi: hiCatalog.messages,
	ro: roCatalog.messages,
	th: thCatalog.messages,
	pt: ptCatalog.messages,
	uk: ukCatalog.messages,
	ur: urCatalog.messages,
};

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const activeLocale = catalogs[deviceLanguage] ? deviceLanguage : "en";

i18n.loadAndActivate({
	locale: activeLocale,
	messages: catalogs[activeLocale],
});

export default function App() {
	return (
		<I18nProvider i18n={i18n}>
			<AppContent />
		</I18nProvider>
	);
}
