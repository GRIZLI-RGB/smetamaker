import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
	const cookiesStore = await cookies();
	const headersStore = await headers();

	// сначала проверяем cookies
	const localeFromCookies = cookiesStore.get("locale")?.value;

	// затем пробуем достать из заголовков
	const acceptLanguage = headersStore.get("accept-language");

	// простое извлечение: берем до первой запятой
	const localeFromHeaders = acceptLanguage?.split(",")?.[0]?.split("-")?.[0];

	const locale = localeFromCookies || localeFromHeaders || "en";

	return {
		locale,
		messages: (await import(`./../translations/${locale}.json`)).default,
	};
});
