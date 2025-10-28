import "@/styles/globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
	title: "Clerk Authentication",
	description: "Complete Clerk Authentication By Devwithzain",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				suppressHydrationWarning>
				<body>
					<ToastProvider />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
