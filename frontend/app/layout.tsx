import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import Providers from "@/components/layout/providers/providers";

import "./../styles/globals.css";

export const metadata: Metadata = {
	title: "Smetamaker",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body className={`antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
