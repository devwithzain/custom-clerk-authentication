"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/admin/sidebar";

export default function Navbar() {
	const pathName = usePathname();
	const pathSegments = pathName.split("/").filter(Boolean);

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper justify-between">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{pathSegments.map((segment: string, index: number) => {
							const isLast = index === pathSegments.length - 1;
							const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
							const label =
								segment.replace(/-/g, " ").charAt(0).toUpperCase() +
								segment.replace(/-/g, " ").slice(1).toLowerCase();

							return (
								<React.Fragment key={href}>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={href}>{label}</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && (
										<BreadcrumbSeparator>
											<FiChevronRight />
										</BreadcrumbSeparator>
									)}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="px-4">
				<ModeToggle />
			</div>
		</header>
	);
}
