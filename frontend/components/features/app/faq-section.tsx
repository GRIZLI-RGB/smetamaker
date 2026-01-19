"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export function FAQSection() {
	const t = useTranslations("app.faq");

	const faqs = [...new Array(6)].map((_, i) => ({
		question: t(`faq${i + 1}Q`),
		answer: t(`faq${i + 1}A`),
	}));

	return (
		<section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-900">
					{t("title")}
				</h2>

				<Accordion type="single" collapsible className="space-y-4">
					{faqs.map((faq, index) => (
						<AccordionItem
							key={index}
							value={`item-${index}`}
							className="last:border bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-6 hover:border-gray-300 transition-all duration-300"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 font-medium text-gray-900">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="text-gray-600 leading-relaxed pb-4">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
