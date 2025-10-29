import { AppSidebar } from "@/components/admin/app-sidebar";
import Navbar from "@/components/admin/navbar";
import { SidebarInset, SidebarProvider } from "@/components/admin/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<Navbar />
							{children}
						</SidebarInset>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
