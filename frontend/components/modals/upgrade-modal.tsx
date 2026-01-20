"use client";

import type React from "react";

import { X, Check, Sparkles, FileText, Link2, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/context";
import { useLocale, useTranslations } from "next-intl";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "watermark" | "pdf" | "share" | "estimate";
}

export function UpgradeModal({ isOpen, onClose, trigger }: UpgradeModalProps) {
  const locale = useLocale();
  const t = useTranslations("app.modals.upgrade");
  const tAppPricing = useTranslations("app.pricing");
  const { upgradePlan } = useSubscription();

  const handleSelectPlan = (plan: "starter" | "pro") => {
    upgradePlan(plan);
    onClose();
  };

  if (!isOpen) return null;

  const triggerMessages: Record<
    string,
    { title: string; message: string; icon: React.ReactNode }
  > = {
    watermark: {
      title: t("removeWatermark"),
      message: t("watermarkExplanation"),
      icon: <Shield className="w-5 h-5" />,
    },
    pdf: {
      title: t("exportPDF"),
      message: t("pdfExplanation"),
      icon: <FileText className="w-5 h-5" />,
    },
    share: {
      title: t("shareLink"),
      message: t("shareExplanation"),
      icon: <Link2 className="w-5 h-5" />,
    },
    estimate: {
      title: t("estimateLimitReached"),
      message: t("estimateLimitExplanation"),
      icon: <Zap className="w-5 h-5" />,
    },
  };

  const currentTrigger = trigger ? triggerMessages[trigger] : null;

  const benefits = [
    { icon: <Shield className="w-4 h-4" />, text: t("benefitNoWatermark") },
    { icon: <FileText className="w-4 h-4" />, text: t("benefitPDFExport") },
    { icon: <Link2 className="w-4 h-4" />, text: t("benefitShareLinks") },
    { icon: <Zap className="w-4 h-4" />, text: t("benefitMoreEstimates") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header with trigger context */}
        <div className="p-6 border-b border-gray-100 bg-linear-to-r from-amber-50 to-orange-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                {currentTrigger?.icon || <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">
                  {currentTrigger?.title || t("chooseAPlan")}
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-md">
                  {currentTrigger?.message || t("estimateLimitExplanation")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            {t("whyUpgrade")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-green-500">{benefit.icon}</span>
                {benefit.text}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Starter Plan */}
            <div className="p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all bg-white">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  {tAppPricing("pricingSmallName")}
                </h3>
                <p className="text-sm text-gray-500">
                  {tAppPricing("pricingSmallDesc")}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {tAppPricing("pricingSmallPrice")}
                </span>
              </div>

              <ul className="space-y-2.5 mb-5">
                {[...new Array(4)]
                  .map((_, index) =>
                    tAppPricing(`pricingSmallFeatures.${index + 1}`),
                  )
                  .map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2.5 text-sm text-gray-600"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan("starter")}
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("buyNow")}
              </Button>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="p-5 rounded-xl border-2 border-gray-900 bg-linear-to-b from-gray-50 to-white relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 text-white text-xs font-medium rounded-full shadow-md">
                {locale === "ru" ? "Лучший выбор" : "Best value"}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  {tAppPricing("pricingLargeName")}
                </h3>
                <p className="text-sm text-gray-500">
                  {tAppPricing("pricingLargeDesc")}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {tAppPricing("pricingLargePrice")}
                </span>
              </div>

              <ul className="space-y-2.5 mb-5">
                {[...new Array(4)]
                  .map((_, index) =>
                    tAppPricing(`pricingLargeFeatures.${index + 1}`),
                  )
                  .map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2.5 text-sm text-gray-600"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan("pro")}
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {t("buyNow")}
              </Button>
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              {t("oneTimePurchase")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
