"use client";

import { useState } from "react";
import {
	ChevronDown,
	DollarSign,
	Calculator,
	Percent,
	Info,
} from "lucide-react";
import { useSettings, type Currency } from "@/lib/settings-context";

interface SettingsCompactProps {
	variant?: "before" | "after";
	onChange?: () => void;
}

export function SettingsCompact({
	variant = "before",
	onChange,
}: SettingsCompactProps) {
	const { language } = useLanguage();
	const t = useTranslation(language);
	const { settings, updateSettings, getCurrencySymbol } = useSettings();

	const [isExpanded, setIsExpanded] = useState(false);

	const currencies: {
		value: Currency;
		label: string;
		symbol: string;
		flag: string;
	}[] = [
		{
			value: "RUB",
			label: t.currencyRUB || "Российский рубль",
			symbol: "₽",
			flag: "🇷🇺",
		},
		{
			value: "USD",
			label: t.currencyUSD || "US Dollar",
			symbol: "$",
			flag: "🇺🇸",
		},
		{
			value: "EUR",
			label: t.currencyEUR || "Euro",
			symbol: "€",
			flag: "🇪🇺",
		},
		{
			value: "GBP",
			label: t.currencyGBP || "British Pound",
			symbol: "£",
			flag: "🇬🇧",
		},
	];

	const riskOptions = [0, 10, 15, 20, 25, 30];

	const handleSettingChange = (updates: Partial<typeof settings>) => {
		updateSettings(updates);
		if (onChange) {
			onChange();
		}
	};

	return (
		<div
			className={`border rounded-xl transition-all duration-200 ${
				variant === "before"
					? "bg-gray-50/80 border-gray-200"
					: isExpanded
						? "bg-blue-50/50 border-blue-200"
						: "bg-gray-50/50 border-gray-200"
			}`}
		>
			{/* Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 hover:bg-gray-100/50 transition-colors rounded-xl"
			>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
						<Calculator className="w-4 h-4 text-gray-600" />
					</div>
					<div className="text-left">
						<div className="text-sm font-medium text-gray-900">
							{variant === "before"
								? t.settingsTitle
								: language === "ru"
									? "Настройки расчёта"
									: "Calculation settings"}
						</div>
						{variant === "before" && (
							<div className="text-xs text-gray-500">
								{language === "ru"
									? "Влияют на итоговую стоимость"
									: "Affects final cost"}
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center gap-3">
					{!isExpanded && (
						<div className="flex items-center gap-2 text-xs text-gray-600">
							<span className="font-mono">
								{getCurrencySymbol()}
								{settings.hourlyRate}
							</span>
							<span className="text-gray-400">·</span>
							<span>
								{settings.taxMode === "vat"
									? t.vatIncluded
									: t.vatNotIncluded}
							</span>
							{settings.riskBuffer > 0 && (
								<>
									<span className="text-gray-400">·</span>
									<span>+{settings.riskBuffer}%</span>
								</>
							)}
						</div>
					)}
					<ChevronDown
						className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</div>
			</button>

			{/* Expanded Settings */}
			{isExpanded && (
				<div className="px-4 pb-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
					<div className="h-px bg-gray-200 -mx-4" />

					{/* Hourly Rate */}
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<DollarSign className="w-3.5 h-3.5 text-gray-400" />
							<label className="text-xs font-medium text-gray-700">
								{t.hourlyRate}
							</label>
						</div>
						<div className="relative">
							<input
								type="number"
								value={settings.hourlyRate}
								onChange={(e) =>
									handleSettingChange({
										hourlyRate: Number(e.target.value) || 0,
									})
								}
								className="w-full h-10 px-3 pr-20 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-sm font-mono"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
								{getCurrencySymbol()}/
								{language === "ru" ? "час" : "hr"}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Currency */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-gray-700">
								{t.currency}
							</label>
							<select
								value={settings.currency}
								onChange={(e) =>
									handleSettingChange({
										currency: e.target.value as Currency,
									})
								}
								className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-sm"
							>
								{currencies.map((curr) => (
									<option key={curr.value} value={curr.value}>
										{curr.flag} {curr.symbol}
									</option>
								))}
							</select>
						</div>

						{/* Tax Mode */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-gray-700">
								{t.taxMode}
							</label>
							<div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg h-10">
								<button
									onClick={() =>
										handleSettingChange({
											taxMode: "no_vat",
										})
									}
									className={`flex-1 rounded-md text-xs font-medium transition-all ${
										settings.taxMode === "no_vat"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{language === "ru" ? "Без НДС" : "No VAT"}
								</button>
								<button
									onClick={() =>
										handleSettingChange({ taxMode: "vat" })
									}
									className={`flex-1 rounded-md text-xs font-medium transition-all ${
										settings.taxMode === "vat"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{language === "ru" ? "С НДС" : "VAT"}
								</button>
							</div>
						</div>
					</div>

					{/* Risk Buffer */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Percent className="w-3.5 h-3.5 text-gray-400" />
								<label className="text-xs font-medium text-gray-700">
									{t.riskBuffer}
								</label>
							</div>
							<div className="flex items-center gap-1 text-xs text-gray-500">
								<Info className="w-3 h-3" />
								<span>
									{language === "ru"
										? "Буфер на риски"
										: "Risk margin"}
								</span>
							</div>
						</div>
						<div className="grid grid-cols-6 gap-1.5">
							{riskOptions.map((risk) => (
								<button
									key={risk}
									onClick={() =>
										handleSettingChange({
											riskBuffer: risk,
										})
									}
									className={`h-9 rounded-lg text-xs font-medium transition-all ${
										settings.riskBuffer === risk
											? "bg-gray-900 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{risk === 0 ? "0" : `+${risk}%`}
								</button>
							))}
						</div>
					</div>

					{variant === "after" && (
						<div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
							<Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-blue-900">
								{language === "ru"
									? "Изменение настроек автоматически пересчитает смету"
									: "Changing settings will automatically recalculate the estimate"}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
