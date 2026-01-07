import { NextIntlClientProvider } from "next-intl";

export default function ServerProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
