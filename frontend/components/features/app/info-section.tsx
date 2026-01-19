"use client";

import {
	Zap,
	Target,
	CheckCircle,
	FileText,
	Sparkles,
	Send,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function InfoSection() {
	const t = useTranslations("app.info");

	const features = [
		{
			icon: Zap,
			title: t("fastTitle"),
			description: t("fastDesc"),
		},
		{
			icon: Target,
			title: t("accurateTitle"),
			description: t("accurateDesc"),
		},
		{
			icon: CheckCircle,
			title: t("professionalTitle"),
			description: t("professionalDesc"),
		},
	];

	const steps = [
		{
			icon: FileText,
			title: t("step1"),
			description: t("step1Desc"),
			gradient: "from-blue-500/10 to-blue-600/5",
		},
		{
			icon: Sparkles,
			title: t("step2"),
			description: t("step2Desc"),
			gradient: "from-indigo-500/10 to-indigo-600/5",
		},
		{
			icon: Send,
			title: t("step3"),
			description: t("step3Desc"),
			gradient: "from-gray-500/10 to-gray-600/5",
		},
	];

	return (
		<section
			id="how"
			className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white pointer-events-none" />

			<div className="max-w-6xl mx-auto relative">
				<div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance text-gray-900">
						{t("infoTitle")}
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						{t("infoSubtitle")}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-24">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={index}
								className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group animate-in fade-in-0 slide-in-from-bottom-4"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors duration-300">
									<Icon className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors duration-300" />
								</div>
								<h3 className="text-xl font-semibold mb-2 text-gray-900">
									{feature.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>

				<div className="mt-20">
					<h3 className="text-2xl sm:text-3xl font-bold mb-12 text-center text-gray-900">
						{t("howTitle")}
					</h3>

					<div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{steps.map((step, index) => {
							const Icon = step.icon;
							return (
								<div
									key={index}
									className="relative group animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
									style={{
										animationDelay: `${index * 150}ms`,
									}}
								>
									{/* Step card */}
									<div
										className={`bg-linear-to-br ${step.gradient} backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full`}
									>
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
												{index + 1}
											</div>
											<Icon className="w-6 h-6 text-gray-600" />
										</div>

										<h4 className="text-base font-semibold text-gray-900 mb-2">
											{step.title}
										</h4>
										<p className="text-sm text-gray-600">
											{step.description}
										</p>

										<div className="mt-6 p-3 bg-white/70 rounded-lg border border-gray-200/80">
											<div className="space-y-1.5">
												<div className="h-2 bg-gray-200 rounded w-4/5" />
												<div className="h-2 bg-gray-200/70 rounded w-full" />
												<div className="h-2 bg-gray-200/50 rounded w-3/5" />
											</div>
										</div>
									</div>

									{/* Connector line */}
									{index < steps.length - 1 && (
										<div className="hidden sm:block absolute top-1/2 -right-4 w-8 h-0.5 bg-linear-to-r from-gray-300 to-gray-200 z-10">
											<div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45" />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
