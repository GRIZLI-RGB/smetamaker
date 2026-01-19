"use client";

import { useState } from "react";

import { FAQSection } from "@/components/features/app/faq-section";
import { Header } from "@/components/features/app/header";
import { HeroSection } from "@/components/features/app/hero-section";
import { InfoSection } from "@/components/features/app/info-section";
import { PricingSection } from "@/components/features/app/pricing-section";
import { ResultSection } from "@/components/features/app/result-section";

export default function AppPage() {
	const [showResult, setShowResult] = useState(false);
	const [specification, setSpecification] = useState("");

	const handleCalculate = () => {
		if (specification.trim()) {
			setShowResult(true);
			setTimeout(() => {
				document.getElementById("result")?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 100);
		}
	};

	const handleReset = () => {
		setShowResult(false);
		setSpecification("");
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<main className="min-h-screen bg-white relative overflow-hidden">
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_20%,rgba(59,130,246,0.06),transparent_50%)]" />
				<div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_80%,rgba(99,102,241,0.05),transparent_50%)]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(236,72,153,0.02),transparent_60%)]" />
			</div>

			<div className="relative z-10">
				<Header />
				<HeroSection
					specification={specification}
					setSpecification={setSpecification}
					onCalculate={handleCalculate}
					isCalculated={showResult}
				/>
				{showResult && <ResultSection onReset={handleReset} />}
				<InfoSection />
				<PricingSection />
				<FAQSection />
			</div>
		</main>
	);
}
