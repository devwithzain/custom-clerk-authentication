"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/admin/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useUser } from "@clerk/nextjs";
import { sideBarItem } from "@/constants";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { isLoaded, user } = useUser();

	return (
		<Sidebar
			collapsible="icon"
			{...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={sideBarItem.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={isLoaded ? user : null} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
