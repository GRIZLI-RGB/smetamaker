"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { UserDropdown } from "./user-dropdown";
import { SignInModal } from "@/components/modals/sign-in-modal";
import Logo from "@/components/ui/logo";
import LanguageSwitch from "@/components/ui/language-switch";

export function Header() {
	const t = useTranslations("app.header");

	const { user } = useAuth();

	const [showSignInModal, setShowSignInModal] = useState(false);

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Logo />

						<nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
							<Link
								href="#how"
								className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
							>
								{t("links.howItWorks")}
							</Link>
							<Link
								href="#pricing"
								className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
							>
								{t("links.prices")}
							</Link>
							<Link
								href="#faq"
								className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
							>
								{t("links.faq")}
							</Link>
						</nav>

						<div className="flex items-center gap-3">
							<LanguageSwitch />

							{user ? (
								<UserDropdown />
							) : (
								<Button
									variant="outline"
									size="sm"
									className="text-sm bg-white hover:bg-gray-50 border-gray-300"
									onClick={() => setShowSignInModal(true)}
								>
									{t("signIn")}
								</Button>
							)}
						</div>
					</div>
				</div>
			</header>

			<SignInModal
				isOpen={showSignInModal}
				onClose={() => setShowSignInModal(false)}
			/>
		</>
	);
}
