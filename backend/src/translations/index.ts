export const translations = {
	en: {
		auth: {
			magicLinkSubject: "Your login link",
			magicLinkBody: (link: string) =>
				`<p>Click to login: <a href="${link}">${link}</a></p>`,
		},
	},
	ru: {
		auth: {
			magicLinkSubject: "Ваша ссылка для входа",
			magicLinkBody: (link: string) =>
				`<p>Нажмите на ссылку для входа: <a href="${link}">${link}</a></p>`,
		},
	},
};

export type Locale = keyof typeof translations;

export function getTranslations(locale?: string) {
	const loc = (locale as Locale) ?? "en";
	return translations[loc] ?? translations.en;
}
