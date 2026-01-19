"use client";

import type React from "react";

import { useState } from "react";
import { X, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { trpc } from "@/lib/trpc";

interface SignInModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type AuthStep = "initial" | "email" | "loading" | "success";

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
	const [step, setStep] = useState<AuthStep>("initial");
	const [email, setEmail] = useState("");

	const t = useTranslations("app.modals.auth");
	const locale = useLocale();

	const getGoogleAuthUrl = trpc.auth.getGoogleAuthUrl.useMutation();
	const sendMagicLink = trpc.auth.sendMagicLink.useMutation();

	const handleClose = () => {
		setStep("initial");
		setEmail("");
		onClose();
	};

	const handleGoogleSignIn = async () => {
		setStep("loading");
		const googleAuthUrl = await getGoogleAuthUrl.mutateAsync();
		window.location.href = googleAuthUrl.url;
	};

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		setStep("loading");
		await sendMagicLink.mutateAsync({
			email,
		});
		setStep("success");
	};

	if (!isOpen) return null;

	return (
		<>
			<div
				className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
				onClick={handleClose}
			/>

			<div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
				<div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 animate-in fade-in-0 zoom-in-95">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-semibold text-gray-900">
							{t("signInTitle")}
						</h2>
						<button
							onClick={handleClose}
							className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{step === "initial" && (
						<>
							<p className="text-gray-600 mb-6 leading-relaxed">
								{t("signInDescription")}
							</p>

							<div className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start gap-3 h-12 bg-white hover:bg-gray-50 border-gray-300"
									onClick={handleGoogleSignIn}
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="currentColor"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="currentColor"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="currentColor"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									<span>{t("continueWithGoogle")}</span>
								</Button>

								<Button
									variant="outline"
									className="w-full justify-start gap-3 h-12 bg-white hover:bg-gray-50 border-gray-300"
									onClick={() => setStep("email")}
								>
									<Mail className="w-5 h-5 text-gray-700" />
									<span>{t("emailMagicLink")}</span>
								</Button>
							</div>
						</>
					)}

					{step === "email" && (
						<form
							onSubmit={handleEmailSubmit}
							className="space-y-4"
						>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
									autoFocus
									required
								/>
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									className="flex-1 bg-transparent"
									onClick={() => setStep("initial")}
								>
									{locale === "ru" ? "Назад" : "Back"}
								</Button>
								<Button type="submit" className="flex-1">
									{locale === "ru"
										? "Продолжить"
										: "Continue"}
								</Button>
							</div>
						</form>
					)}

					{step === "loading" && (
						<div className="py-12 flex flex-col items-center justify-center gap-4">
							<Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
							<p className="text-gray-600">{t("signingIn")}</p>
						</div>
					)}

					{step === "success" && (
						<div className="py-12 flex flex-col items-center justify-center gap-4">
							<CheckCircle2 className="w-12 h-12 text-green-600" />
							<p className="text-gray-900 font-medium">
								{locale === "ru"
									? "Письмо отправлено!"
									: "Letter sent!"}
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
