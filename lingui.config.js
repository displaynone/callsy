/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
	sourceLocale: "en",
	locales: [
		"en",
		"es",
		"fr",
		"de",
		"it",
		"ar",
		"pt",
		"zh",
		"ko",
		"ja",
		"hi",
		"ro",
		"uk",
		"th",
		"nl",
		"ur",
	],
	catalogs: [
		{
			path: "<rootDir>/src/locales/{locale}/messages",
			include: ["src"],
		},
	],
	format: "po",
};
