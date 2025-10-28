"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/admin/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

export function NavUser({ user }: { user: UserResource | null }) {
	const { signOut } = useClerk();
	const { isMobile } = useSidebar();
	if (!user) return null;

	const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
	const displayName =
		user.fullName || user.username || user.firstName || "User";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							{/* Avatar */}
							<Avatar className="h-8 w-8 rounded-lg">
								{user.imageUrl ? (
									<AvatarImage
										src={user.imageUrl}
										alt={displayName}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center rounded-lg bg-primary text-primary-foreground uppercase">
										{displayName.charAt(0)}
									</div>
								)}
							</Avatar>

							{/* User info */}
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{displayName}</span>
								<span className="truncate text-xs text-gray-400">
									{primaryEmail}
								</span>
							</div>

							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{user.imageUrl ? (
										<AvatarImage
											src={user.imageUrl}
											alt={displayName}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center rounded-lg bg-primary text-primary-foreground uppercase">
											{displayName.charAt(0)}
										</div>
									)}
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{displayName}</span>
									<span className="truncate text-xs text-gray-400">
										{primaryEmail}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<Link href="/dashboard/account">
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Account
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</Link>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => signOut()}>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
