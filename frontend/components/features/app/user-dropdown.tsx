"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, FileText, LogOut } from "lucide-react";

import { trpc } from "@/lib/trpc";
import useAuth from "@/hooks/useAuth";
import { useLocale } from "next-intl";
import Image from "next/image";

export function UserDropdown() {
	const { user } = useAuth();

	const locale = useLocale();

	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	const logoutUser = trpc.logout.useMutation();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (!user) return null;

	const t = {
		profile: locale === "ru" ? "Профиль" : "Profile",
		myEstimates: locale === "ru" ? "Мои сметы" : "My estimates",
		signOut: locale === "ru" ? "Выйти" : "Sign out",
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
			>
				<div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium overflow-hidden">
					<Image
						width={32}
						height={32}
						className="w-full h-full object-cover"
						src={"/images/avatar-placeholder.jpg"}
						alt={user.email}
					/>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-gray-600 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-xs text-gray-500 truncate">
							{user.email}
						</p>
					</div>

					<button
						onClick={() => setIsOpen(false)}
						className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
					>
						<User className="w-4 h-4" />
						{t.profile}
					</button>

					<button
						onClick={() => setIsOpen(false)}
						className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
					>
						<FileText className="w-4 h-4" />
						{t.myEstimates}
					</button>

					<div className="border-t border-gray-100 my-1" />

					<button
						onClick={async () => {
							await logoutUser.mutateAsync();
							setIsOpen(false);
						}}
						className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
					>
						<LogOut className="w-4 h-4" />
						{t.signOut}
					</button>
				</div>
			)}
		</div>
	);
}
