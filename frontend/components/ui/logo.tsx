"use client";

import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="flex items-center">
			<img className="w-8 h-8" src="/images/logo.png" alt="" />
			<span className="ml-2 text-xl font-bold text-gray-900">SmetaMaker</span>
		</Link>
	);
}
