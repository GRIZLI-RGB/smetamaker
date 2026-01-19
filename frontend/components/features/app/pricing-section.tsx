"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function PricingSection() {
	const t = useTranslations("app.pricing");

	const plans = [
		{
			name: t("pricingFreeName"),
			price: t("pricingFreePrice"),
			description: t("pricingFreeDesc"),
			features: [...new Array(4)].map((_, index) =>
				t(`pricingFreeFeatures.${index + 1}`),
			),
			cta: t("pricingFreeCTA"),
			highlighted: false,
		},
		{
			name: t("pricingSmallName"),
			price: t("pricingSmallPrice"),
			description: t("pricingSmallDesc"),
			features: [...new Array(4)].map((_, index) =>
				t(`pricingSmallFeatures.${index + 1}`),
			),
			cta: t("pricingSmallCTA"),
			highlighted: true,
		},
		{
			name: t("pricingLargeName"),
			price: t("pricingLargePrice"),
			description: t("pricingLargeDesc"),
			features: [...new Array(4)].map((_, index) =>
				t(`pricingLargeFeatures.${index + 1}`),
			),
			cta: t("pricingLargeCTA"),
			highlighted: false,
		},
	];

	return (
		<section
			id="pricing"
			className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-linear-to-b from-gray-50/80 via-gray-100/50 to-gray-50/80 pointer-events-none" />
			<div className="absolute top-0 left-1/4 w-125 h-125 bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-0 right-1/4 w-125 h-125 bg-indigo-100/15 rounded-full blur-[120px] pointer-events-none" />

			<div className="max-w-6xl mx-auto relative">
				<div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
						{t("pricingTitle")}
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						{t("pricingSubtitle")}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-12">
					{plans.map((plan, index) => (
						<div
							key={index}
							className={`bg-white/90 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 ${
								plan.highlighted
									? "border-gray-900 shadow-xl ring-1 ring-gray-900/10"
									: "border-gray-200 hover:border-gray-300"
							}`}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<div className="mb-6">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">
									{plan.name}
								</h3>
								<div className="mb-3">
									<span className="text-3xl font-bold text-gray-900">
										{plan.price}
									</span>
								</div>
								<p className="text-sm text-gray-600">
									{plan.description}
								</p>
							</div>

							<ul className="space-y-3 mb-6 flex-1">
								{plan.features.map((feature, featureIndex) => (
									<li
										key={featureIndex}
										className="flex items-start gap-2.5 text-sm text-gray-700"
									>
										<Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" />
										<span>{feature}</span>
									</li>
								))}
							</ul>

							<Button
								variant={
									plan.highlighted ? "default" : "outline"
								}
								className={`w-full transition-colors ${
									plan.highlighted
										? "bg-gray-900 hover:bg-gray-800"
										: "border-gray-300 hover:bg-gray-50"
								}`}
								disabled={index === 0}
							>
								{plan.cta}
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
