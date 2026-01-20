"use client";

import { useState, useEffect } from "react";
import {
	Share2,
	Edit3,
	CheckCircle,
	X,
	Save,
	Lock,
	FileText,
	RefreshCw,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettingsCompact } from "./settings-compact";
import { ShareModal } from "@/components/modals/share-modal";
import { UpgradeModal } from "@/components/modals/upgrade-modal";
import { useSettings, useSubscription } from "@/lib/context";
import { SettingsSummaryBadge } from "./settings-summary-badge";

interface ResultSectionProps {
	onReset: () => void;
}

interface EstimateRow {
	name: string;
	hours: number;
	rate: number;
	total: number;
}

export function ResultSection({ onReset }: ResultSectionProps) {
	const locale = useLocale();
	const t = useTranslations("app.result");

	const { settings, formatCurrency, calculateWithRisk, calculateWithVat } =
		useSettings();
	const { isPaid, canCreateEstimate, checkFeatureAccess } = useSubscription();

	const [isEditMode, setIsEditMode] = useState(false);
	const [showSavedMessage, setShowSavedMessage] = useState(false);
	const [showRecalculated, setShowRecalculated] = useState(false);
	const [editingCell, setEditingCell] = useState<{
		row: number;
		field: "hours" | "rate";
	} | null>(null);
	const [shareOpen, setShareOpen] = useState(false);
	const [upgradeOpen, setUpgradeOpen] = useState(false);
	const [upgradeTrigger, setUpgradeTrigger] = useState<
		"watermark" | "pdf" | "share" | "estimate" | undefined
	>();

	const getInitialEstimate = (): EstimateRow[] => {
		return [
			{
				name: t("analysis"),
				hours: 40,
				rate: settings.hourlyRate,
				total: 0,
			},
			{
				name: t("frontend"),
				hours: 80,
				rate: settings.hourlyRate,
				total: 0,
			},
			{
				name: t("backend"),
				hours: 60,
				rate: settings.hourlyRate,
				total: 0,
			},
			{
				name: t("integration"),
				hours: 30,
				rate: settings.hourlyRate,
				total: 0,
			},
			{
				name: t("deployment"),
				hours: 20,
				rate: settings.hourlyRate,
				total: 0,
			},
		].map((row) => ({ ...row, total: row.hours * row.rate }));
	};

	const [estimate, setEstimate] =
		useState<EstimateRow[]>(getInitialEstimate());
	const [originalEstimate, setOriginalEstimate] =
		useState<EstimateRow[]>(getInitialEstimate());

	useEffect(() => {
		// eslint-disable-next-line
		setEstimate((prev) =>
			prev.map((row) => ({
				...row,
				rate: settings.hourlyRate,
				total: row.hours * settings.hourlyRate,
			})),
		);
	}, [settings.hourlyRate]);

	const totalHours = estimate.reduce((sum, stage) => sum + stage.hours, 0);
	const subtotal = estimate.reduce((sum, stage) => sum + stage.total, 0);
	const withRisk = calculateWithRisk(subtotal);
	const totalCost = calculateWithVat(withRisk);

	const handleEditValue = (
		rowIndex: number,
		field: "hours" | "rate",
		value: string,
	) => {
		const numValue = Number.parseInt(value) || 0;
		setEstimate((prev) =>
			prev.map((row, idx) => {
				if (idx === rowIndex) {
					const updated = { ...row, [field]: numValue };
					updated.total = updated.hours * updated.rate;
					return updated;
				}
				return row;
			}),
		);
	};

	const handleEnterEditMode = () => {
		setOriginalEstimate([...estimate]);
		setIsEditMode(true);
	};

	const handleSaveChanges = () => {
		setIsEditMode(false);
		setEditingCell(null);
		setShowSavedMessage(true);
		setTimeout(() => setShowSavedMessage(false), 2000);
	};

	const handleDiscardChanges = () => {
		setEstimate([...originalEstimate]);
		setIsEditMode(false);
		setEditingCell(null);
	};

	const handleNewEstimate = () => {
		const access = checkFeatureAccess("estimate");
		if (!access.allowed) {
			setUpgradeTrigger("estimate");
			setUpgradeOpen(true);
		} else {
			onReset();
		}
	};

	const handleOpenUpgrade = (
		trigger?: "watermark" | "pdf" | "share" | "estimate",
	) => {
		setUpgradeTrigger(trigger);
		setShareOpen(false);
		setUpgradeOpen(true);
	};

	const handleSettingsChange = () => {
		setShowRecalculated(true);
		setTimeout(() => setShowRecalculated(false), 2000);
	};

	return (
		<section
			id="result"
			className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50/80 to-white relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

			<div className="max-w-4xl mx-auto relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
							<CheckCircle className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
								{t("resultTitle")}
							</h2>
							<p className="text-sm text-gray-600 mt-0.5">
								{t("resultSubtitle")}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{!isEditMode ? (
							<Button
								variant="outline"
								size="sm"
								onClick={handleEnterEditMode}
								className="gap-2 bg-white hover:bg-gray-50 border-gray-200"
							>
								<Edit3 className="w-4 h-4" />
								<span className="hidden sm:inline">
									{t("editEstimate")}
								</span>
							</Button>
						) : (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={handleDiscardChanges}
									className="gap-1.5 bg-white hover:bg-gray-50 border-gray-200"
								>
									<X className="w-4 h-4" />
									<span className="hidden sm:inline">
										{t("discardChanges")}
									</span>
								</Button>
								<Button
									size="sm"
									onClick={handleSaveChanges}
									className="gap-1.5 bg-gray-900 hover:bg-gray-800"
								>
									<Save className="w-4 h-4" />
									<span className="hidden sm:inline">
										{t("saveChanges")}
									</span>
								</Button>
							</>
						)}
					</div>
				</div>

				<div className="space-y-3 mb-6">
					<SettingsSummaryBadge />
					<SettingsCompact
						variant="after"
						onChange={handleSettingsChange}
					/>
				</div>

				{showRecalculated && (
					<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in-0 slide-in-from-top-2 duration-300 flex items-center gap-2 shadow-lg">
						<RefreshCw className="w-4 h-4" />
						{locale === "ru"
							? "Смета обновлена"
							: "Estimate updated"}
					</div>
				)}

				{showSavedMessage && (
					<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in-0 slide-in-from-top-2 duration-300 flex items-center gap-2 shadow-lg">
						<CheckCircle className="w-4 h-4" />
						{t("changesSaved")}
					</div>
				)}

				<Card
					className={`p-6 sm:p-8 mb-6 bg-white/90 backdrop-blur-sm border transition-all duration-300 relative overflow-hidden shadow-sm ${isEditMode ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"}`}
				>
					{!isPaid && (
						<div className="absolute inset-0 pointer-events-none overflow-hidden">
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 whitespace-nowrap">
								<span className="text-5xl sm:text-6xl font-bold text-gray-200/60 tracking-wider select-none">
									SMETAMAKER
								</span>
							</div>
						</div>
					)}

					{isEditMode && (
						<div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
							<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
							<span className="text-sm font-medium text-blue-700">
								{t("editMode")}
							</span>
							<span className="text-xs text-gray-500 ml-2 hidden sm:inline">
								{t("editingTip")}
							</span>
						</div>
					)}

					<div className="overflow-x-auto relative z-10">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 pr-4 font-medium text-sm text-gray-500">
										{t("stage")}
									</th>
									<th className="text-right py-3 px-4 font-medium text-sm text-gray-500">
										{t("hours")}
									</th>
									<th className="text-right py-3 px-4 font-medium text-sm text-gray-500 hidden sm:table-cell">
										{t("rate")}
									</th>
									<th className="text-right py-3 pl-4 font-medium text-sm text-gray-500">
										{t("cost")}
									</th>
								</tr>
							</thead>
							<tbody>
								{estimate.map((stage, index) => (
									<tr
										key={index}
										className="border-b border-gray-100 last:border-0 transition-colors"
									>
										<td className="py-4 pr-4 text-sm text-gray-900">
											{stage.name}
										</td>

										<td className="text-right py-4 px-4">
											{isEditMode ? (
												<input
													type="number"
													value={stage.hours}
													onChange={(e) =>
														handleEditValue(
															index,
															"hours",
															e.target.value,
														)
													}
													onFocus={() =>
														setEditingCell({
															row: index,
															field: "hours",
														})
													}
													onBlur={() =>
														setEditingCell(null)
													}
													className={`w-16 text-right text-sm font-mono px-2 py-1.5 rounded-lg border transition-colors ${
														editingCell?.row ===
															index &&
														editingCell?.field ===
															"hours"
															? "border-blue-400 ring-2 ring-blue-100 bg-white"
															: "border-gray-200 bg-gray-50 hover:border-gray-300"
													}`}
												/>
											) : (
												<span className="text-sm font-mono text-gray-900">
													{stage.hours}
												</span>
											)}
										</td>

										<td className="text-right py-4 px-4 hidden sm:table-cell">
											{isEditMode ? (
												<input
													type="number"
													value={stage.rate}
													onChange={(e) =>
														handleEditValue(
															index,
															"rate",
															e.target.value,
														)
													}
													onFocus={() =>
														setEditingCell({
															row: index,
															field: "rate",
														})
													}
													onBlur={() =>
														setEditingCell(null)
													}
													className={`w-20 text-right text-sm font-mono px-2 py-1.5 rounded-lg border transition-colors ${
														editingCell?.row ===
															index &&
														editingCell?.field ===
															"rate"
															? "border-blue-400 ring-2 ring-blue-100 bg-white"
															: "border-gray-200 bg-gray-50 hover:border-gray-300"
													}`}
												/>
											) : (
												<span className="text-sm font-mono text-gray-500">
													{formatCurrency(stage.rate)}
													/
													{locale === "ru"
														? "час"
														: "hr"}
												</span>
											)}
										</td>

										<td className="text-right py-4 pl-4 text-sm font-mono font-medium text-gray-900">
											{formatCurrency(stage.total)}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t border-gray-200">
									<td className="py-3 pr-4 text-sm text-gray-600">
										{locale === "ru"
											? "Подытог"
											: "Subtotal"}
									</td>
									<td className="text-right py-3 px-4 font-mono text-sm text-gray-600">
										{totalHours}
									</td>
									<td className="hidden sm:table-cell"></td>
									<td className="text-right py-3 pl-4 font-mono text-sm text-gray-600">
										{formatCurrency(subtotal)}
									</td>
								</tr>

								{settings.riskBuffer > 0 && (
									<tr>
										<td className="py-2 pr-4 text-sm text-gray-500">
											{t("riskBuffer")} (+
											{settings.riskBuffer}%)
										</td>
										<td></td>
										<td className="hidden sm:table-cell"></td>
										<td className="text-right py-2 pl-4 font-mono text-sm text-gray-500">
											+
											{formatCurrency(
												withRisk - subtotal,
											)}
										</td>
									</tr>
								)}

								{settings.taxMode === "vat" && (
									<tr>
										<td className="py-2 pr-4 text-sm text-gray-500">
											{locale === "ru" ? "НДС" : "VAT"} (
											{settings.vatRate}%)
										</td>
										<td></td>
										<td className="hidden sm:table-cell"></td>
										<td className="text-right py-2 pl-4 font-mono text-sm text-gray-500">
											+
											{formatCurrency(
												totalCost - withRisk,
											)}
										</td>
									</tr>
								)}

								<tr className="border-t-2 border-gray-300 font-semibold">
									<td className="py-4 pr-4 text-gray-900">
										{t("total")}
									</td>
									<td className="text-right py-4 px-4 font-mono text-gray-900">
										{totalHours}
									</td>
									<td className="hidden sm:table-cell"></td>
									<td className="text-right py-4 pl-4 font-mono text-lg text-gray-900">
										{formatCurrency(totalCost)}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>

					{!isPaid && (
						<div className="mt-6 pt-4 border-t border-gray-100">
							<button
								onClick={() => handleOpenUpgrade("watermark")}
								className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
							>
								<Lock className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
								<span>{t("removeWatermark")}</span>
								<span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-1">
									PRO
								</span>
							</button>
						</div>
					)}
				</Card>

				<div className="flex flex-col sm:flex-row gap-3 mb-6">
					<Button
						variant="outline"
						className="flex-1 h-11 bg-white hover:bg-gray-50 border-gray-200 transition-colors"
						onClick={() => setShareOpen(true)}
					>
						<Share2 className="w-4 h-4 mr-2" />
						{t("shareEstimate")}
					</Button>

					<Button
						variant="outline"
						className="flex-1 h-11 bg-white hover:bg-gray-50 border-gray-200 transition-colors"
						onClick={handleNewEstimate}
					>
						{!canCreateEstimate && (
							<Lock className="w-4 h-4 mr-2 text-amber-500" />
						)}
						{t("newEstimate")}
					</Button>
				</div>

				<div className="p-6 bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
					<div className="flex items-start gap-4">
						<div className="w-14 h-18 bg-white rounded-lg border border-gray-200 shrink-0 flex flex-col items-center justify-center shadow-sm p-2">
							<FileText className="w-6 h-6 text-gray-400" />
							<div className="mt-1 space-y-0.5 w-full">
								<div className="h-0.5 bg-gray-200 rounded w-full" />
								<div className="h-0.5 bg-gray-200 rounded w-3/4" />
								<div className="h-0.5 bg-gray-200 rounded w-full" />
							</div>
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-700">
								{locale === "ru"
									? "Экспортируйте смету для клиента"
									: "Export estimate for your client"}
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{locale === "ru"
									? "Скачайте PDF или создайте публичную ссылку для просмотра"
									: "Download PDF or create a public view-only link"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<ShareModal
				isOpen={shareOpen}
				onClose={() => setShareOpen(false)}
				onUpgradeClick={() => handleOpenUpgrade("pdf")}
			/>
			<UpgradeModal
				isOpen={upgradeOpen}
				onClose={() => setUpgradeOpen(false)}
				trigger={upgradeTrigger}
			/>
		</section>
	);
}
