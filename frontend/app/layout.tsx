import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "@/components/layout/providers/providers";

import "./../styles/globals.css";

const geistFont = Geist({ subsets: ["latin", "cyrillic"] });
const geistMonoFont = Geist_Mono({ subsets: ["latin", "cyrillic"] });

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("metadata");
	const locale = await getLocale();

	return {
		title: t("title"),
		description: t("description"),
		keywords: t("keywords")
			.split(",")
			.map((k) => k.trim()),
		openGraph: {
			title: t("title"),
			description: t("description"),
			siteName: "Smetamaker",
			type: "website",
			url: "https://smetamaker.com",
			locale: locale === "ru" ? "ru_RU" : "en_US",
			alternateLocale: ["ru_RU", "en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
		},
		metadataBase: new URL("https://smetamaker.com"),
		robots: {
			index: true,
			follow: true,
		},
		alternates: {
			canonical: "https://smetamaker.com",
			languages: {
				"ru-RU": "https://smetamaker.com",
				"en-US": "https://smetamaker.com",
				"x-default": "https://smetamaker.com",
			},
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body className={`font-sans antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
