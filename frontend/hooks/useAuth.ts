import { trpc } from "@/lib/trpc";

export default function useAuth() {
	const query = trpc.user.me.useQuery();

	return {
		user: query.data ?? null,
		isAuthenticatedUser: !!query.data,
		isLoadingUser: query.isLoading,
		isErrorUser: query.isError,
		refetchUser: query.refetch,
	};
}
