"use client";

import { trpc } from "@/lib/trpc";

export default function LandingPage() {
	const { data } = trpc.test.useQuery();

	return <>{data?.message}</>;
}
