import ClientProviders from "./client-providers";
import ServerProviders from "./server-providers";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ServerProviders>
			<ClientProviders>{children}</ClientProviders>
		</ServerProviders>
	);
}
