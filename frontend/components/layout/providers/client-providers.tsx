"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import SuperJSON from "superjson";

import { trpc } from "@/lib/trpc";
import { SettingsProvider, SubscriptionProvider } from "@/lib/context";

export default function ClientProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/trpc`,
					transformer: SuperJSON,
					fetch: (url, options) =>
						fetch(url, { ...options, credentials: "include" }),
				}),
			],
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<SubscriptionProvider>
					<SettingsProvider>{children}</SettingsProvider>
				</SubscriptionProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
}
