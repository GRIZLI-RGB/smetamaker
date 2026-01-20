"use client";

import { useSettings } from "@/lib/context";
import { useLocale, useTranslations } from "next-intl";

export function SettingsSummaryBadge() {
  const locale = useLocale();
  const t = useTranslations("app.settings");
  const { settings, getCurrencySymbol } = useSettings();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-700">
      <span className="font-medium text-gray-500">
        {locale === "ru" ? "Рассчитано с:" : "Calculated with:"}
      </span>
      <span className="font-mono font-medium">
        {getCurrencySymbol()}
        {settings.hourlyRate}/{locale === "ru" ? "час" : "hr"}
      </span>
      <span className="text-gray-400">·</span>
      <span>
        {currencies.find((c) => c.value === settings.currency)?.symbol ||
          getCurrencySymbol()}
      </span>
      <span className="text-gray-400">·</span>
      <span>
        {settings.taxMode === "vat" ? t("vatIncluded") : t("vatNotIncluded")}
      </span>
      {settings.riskBuffer > 0 && (
        <>
          <span className="text-gray-400">·</span>
          <span>
            +{settings.riskBuffer}% {locale === "ru" ? "риск" : "risk"}
          </span>
        </>
      )}
    </div>
  );
}

const currencies = [
  { value: "RUB", symbol: "₽" },
  { value: "USD", symbol: "$" },
  { value: "EUR", symbol: "€" },
  { value: "GBP", symbol: "£" },
] as const;
