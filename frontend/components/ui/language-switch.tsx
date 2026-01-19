"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LanguageSwitch() {
	const locale = useLocale();
	const router = useRouter();

	const [showLangDropdown, setShowLangDropdown] = useState(false);
	const langRef = useRef<HTMLDivElement>(null);

	const languages = [
		{ code: "ru", label: "Русский" },
		{ code: "en", label: "English" },
	];

	useEffect(() => {
		const handler = (event: MouseEvent) => {
			if (
				langRef.current &&
				!langRef.current.contains(event.target as Node)
			) {
				setShowLangDropdown(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	function switchLanguage(nextLocale: string) {
		if (nextLocale === locale) return;

		let cookieString = `locale=${nextLocale}; path=/; max-age=31536000;`;

		if (process.env.NODE_ENV === "production") {
			cookieString += ` domain=smetamaker.com; Secure; SameSite=None`;
		}

		document.cookie = cookieString;

		setTimeout(() => router.refresh(), 100);
	}

	return (
		<div ref={langRef} className="relative">
			<button
				onClick={() => setShowLangDropdown(!showLangDropdown)}
				className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
			>
				<img
					className="block w-5.5 h-4 rounded-xs object-cover border border-gray-300"
					src={`/images/countries/${locale}.svg`}
					alt={locale}
				/>

				<span className="font-medium text-gray-700">
					{locale.toUpperCase()}
				</span>
				<ChevronDown className="w-3.5 h-3.5 text-gray-500" />
			</button>

			{showLangDropdown && (
				<div className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-150">
					{languages.map(({ code, label }) => (
						<button
							key={code}
							onClick={() => {
								switchLanguage(code);
								setShowLangDropdown(false);
							}}
							className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
								locale === code ? "bg-gray-50 font-medium" : ""
							}`}
						>
							<img
								className="block w-5.5 h-4 rounded-xs object-cover border border-gray-300"
								src={`/images/countries/${code}.svg`}
								alt={code}
							/>
							<span className="text-gray-900">{label}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
