"use client";

import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="flex items-center">
			<img className="w-12 h-12" src="/images/logo.svg" alt="" />
			<span className="text-xl font-semibold text-gray-900">
				Smetamaker
			</span>
		</Link>
	);
}
