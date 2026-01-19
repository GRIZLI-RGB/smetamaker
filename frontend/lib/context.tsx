"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Currency = "RUB" | "USD" | "EUR" | "GBP";
export type TaxMode = "vat" | "no_vat";

interface Settings {
	hourlyRate: number;
	currency: Currency;
	riskBuffer: number;
	taxMode: TaxMode;
	vatRate: number;
}

interface SettingsContextType {
	settings: Settings;
	updateSettings: (updates: Partial<Settings>) => void;
	resetSettings: () => void;
	formatCurrency: (value: number, includeVat?: boolean) => string;
	getCurrencySymbol: () => string;
	calculateWithRisk: (value: number) => number;
	calculateWithVat: (value: number) => number;
}

const defaultSettings: Settings = {
	hourlyRate: 3000,
	currency: "RUB",
	riskBuffer: 15,
	taxMode: "no_vat",
	vatRate: 20,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<Settings>(defaultSettings);

	const updateSettings = (updates: Partial<Settings>) => {
		setSettings((prev) => ({ ...prev, ...updates }));
	};

	const resetSettings = () => {
		setSettings(defaultSettings);
	};

	const getCurrencySymbol = () => {
		switch (settings.currency) {
			case "RUB":
				return "₽";
			case "USD":
				return "$";
			case "EUR":
				return "€";
			case "GBP":
				return "£";
			default:
				return "₽";
		}
	};

	const formatCurrency = (value: number, includeVat = false) => {
		const finalValue =
			includeVat && settings.taxMode === "vat"
				? value * (1 + settings.vatRate / 100)
				: value;

		const formatted = finalValue.toLocaleString(
			settings.currency === "RUB" ? "ru-RU" : "en-US",
			{
				maximumFractionDigits: 0,
			},
		);

		switch (settings.currency) {
			case "RUB":
				return `${formatted} ₽`;
			case "USD":
				return `$${formatted}`;
			case "EUR":
				return `€${formatted}`;
			case "GBP":
				return `£${formatted}`;
			default:
				return `${formatted}`;
		}
	};

	const calculateWithRisk = (value: number) => {
		return value * (1 + settings.riskBuffer / 100);
	};

	const calculateWithVat = (value: number) => {
		if (settings.taxMode === "vat") {
			return value * (1 + settings.vatRate / 100);
		}
		return value;
	};

	return (
		<SettingsContext.Provider
			value={{
				settings,
				updateSettings,
				resetSettings,
				formatCurrency,
				getCurrencySymbol,
				calculateWithRisk,
				calculateWithVat,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}

type PlanType = "free" | "starter" | "pro";

interface SubscriptionState {
	plan: PlanType;
	estimatesUsed: number;
	estimatesLimit: number;
	canRemoveWatermark: boolean;
	canExportPDF: boolean;
	canShare: boolean;
}

interface SubscriptionContextType {
	subscription: SubscriptionState;
	isPaid: boolean;
	canCreateEstimate: boolean;
	remainingEstimates: number;
	upgradePlan: (plan: PlanType) => void;
	useEstimate: () => boolean;
	checkFeatureAccess: (
		feature: "watermark" | "pdf" | "share" | "estimate",
	) => { allowed: boolean; reason: string };
}

const planLimits: Record<PlanType, { estimates: number; features: string[] }> =
	{
		free: { estimates: 1, features: [] },
		starter: { estimates: 3, features: ["watermark", "pdf", "share"] },
		pro: {
			estimates: 10,
			features: ["watermark", "pdf", "share", "priority"],
		},
	};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
	undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
	const [subscription, setSubscription] = useState<SubscriptionState>({
		plan: "free",
		estimatesUsed: 0,
		estimatesLimit: 1,
		canRemoveWatermark: false,
		canExportPDF: false,
		canShare: false,
	});

	const isPaid = subscription.plan !== "free";
	const canCreateEstimate =
		subscription.estimatesUsed < subscription.estimatesLimit;
	const remainingEstimates =
		subscription.estimatesLimit - subscription.estimatesUsed;

	const upgradePlan = (plan: PlanType) => {
		const limits = planLimits[plan];
		setSubscription({
			plan,
			estimatesUsed: subscription.estimatesUsed,
			estimatesLimit: limits.estimates,
			canRemoveWatermark: limits.features.includes("watermark"),
			canExportPDF: limits.features.includes("pdf"),
			canShare: limits.features.includes("share"),
		});
	};

	const useEstimate = () => {
		if (canCreateEstimate) {
			setSubscription((prev) => ({
				...prev,
				estimatesUsed: prev.estimatesUsed + 1,
			}));
			return true;
		}
		return false;
	};

	const checkFeatureAccess = (
		feature: "watermark" | "pdf" | "share" | "estimate",
	) => {
		switch (feature) {
			case "watermark":
				return {
					allowed: subscription.canRemoveWatermark,
					reason: "Upgrade to remove watermarks from your estimates",
				};
			case "pdf":
				return {
					allowed: subscription.canExportPDF,
					reason: "Upgrade to export estimates as PDF files",
				};
			case "share":
				return {
					allowed: subscription.canShare,
					reason: "Upgrade to share estimates via public links",
				};
			case "estimate":
				return {
					allowed: canCreateEstimate,
					reason: `You've used all ${subscription.estimatesLimit} estimate${subscription.estimatesLimit > 1 ? "s" : ""}. Upgrade to create more.`,
				};
			default:
				return { allowed: false, reason: "Feature not available" };
		}
	};

	return (
		<SubscriptionContext.Provider
			value={{
				subscription,
				isPaid,
				canCreateEstimate,
				remainingEstimates,
				upgradePlan,
				useEstimate,
				checkFeatureAccess,
			}}
		>
			{children}
		</SubscriptionContext.Provider>
	);
}

export function useSubscription() {
	const context = useContext(SubscriptionContext);
	if (context === undefined) {
		throw new Error(
			"useSubscription must be used within a SubscriptionProvider",
		);
	}
	return context;
}
