"use client";

import type React from "react";
import { Upload, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SettingsCompact } from "./settings-compact";

interface HeroSectionProps {
  specification: string;
  setSpecification: (value: string) => void;
  onCalculate: () => void;
  isCalculated: boolean;
}

const MAX_CHARS = 10000;
const WARNING_THRESHOLD = 0.85;

export function HeroSection({
  specification,
  setSpecification,
  onCalculate,
  isCalculated,
}: HeroSectionProps) {
  const t = useTranslations("app.hero");

  const charsRemaining = MAX_CHARS - specification.length;
  const showCounter = specification.length >= MAX_CHARS * WARNING_THRESHOLD;
  const isAtLimit = specification.length >= MAX_CHARS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setSpecification(value);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 via-white to-gray-50/30 pointer-events-none" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-16 left-[10%] w-125 h-125 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-25 right-[5%] w-150 h-150 bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-75 h-75 bg-pink-100/25 rounded-full blur-[80px] pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#000_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="absolute top-1/4 left-[15%] w-8 h-8 border border-gray-300/30 rounded-lg transform rotate-45 animate-float-slow" />
      <div className="absolute bottom-1/3 right-[12%] w-6 h-6 border border-gray-400/20 rounded-full animate-float" />
      <div className="absolute top-[60%] left-[20%] w-10 h-2 bg-gray-400/10 rounded-full rotate-12" />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance text-gray-900">
            {t("heroTitle")}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {t("heroSubtitle")} ·{" "}
            <span className="text-gray-900 font-medium">
              {t("freeEstimate")}
            </span>
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-150">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="specification"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("specificationLabel")}
                </label>
                {showCounter && (
                  <span
                    className={`text-xs transition-colors ${isAtLimit ? "text-red-600 font-medium" : "text-gray-500"}`}
                  >
                    {isAtLimit
                      ? t("limitReached")
                      : `${charsRemaining} ${t("charactersLeft")}`}
                  </span>
                )}
              </div>
              <Textarea
                id="specification"
                placeholder={t("specificationPlaceholder")}
                value={specification}
                onChange={handleChange}
                className="min-h-50 max-h-100 resize-none bg-gray-50/80 border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-base overflow-y-auto transition-colors"
                disabled={isCalculated}
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 px-5 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50 transition-all duration-200 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-left">
                  <button
                    className="text-sm text-gray-900 hover:text-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCalculated}
                  >
                    {t("uploadFile")}
                  </button>
                  <p className="text-xs text-gray-500">{t("uploadHint")}</p>
                </div>
                <FileText className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </div>

            <SettingsCompact variant="before" />
          </div>

          <Button
            size="lg"
            className="w-full text-base h-12 font-medium bg-gray-900 hover:bg-gray-800 transition-all duration-200 mt-6"
            onClick={onCalculate}
            disabled={!specification.trim() || isCalculated}
          >
            {t("calculate")}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t("heroFooter")}
          </p>
        </div>
      </div>
    </section>
  );
}
