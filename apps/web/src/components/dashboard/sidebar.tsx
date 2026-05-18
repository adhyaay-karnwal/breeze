"use client";

import { WorkerOrb } from "@/components/automations/worker-card";
import { openIntercomMessenger } from "@/components/providers/intercom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	BlocksIcon,
	BreezeLoadingIcon2,
	CoworkersIcon,
	IntegrationsIcon,
	OpenCodeIcon,
	SessionsGridIcon,
	SidebarCollapseIcon,
	SidebarExpandIcon,
} from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { useWorkers } from "@/hooks/automations/use-workers";
import { useBillingState } from "@/hooks/org/use-billing";
import { useSessions } from "@/hooks/sessions/use-sessions";
import { useSignOut } from "@/hooks/ui/use-sign-out";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/display/utils";
import { useDashboardStore } from "@/stores/dashboard";
import { env } from "@breeze/environment/public";
import {
	ArrowLeft,
	Building2,
	ChevronDown,
	ChevronRight,
	Coins,
	CreditCard,
	FolderGit2,
	Home,
	LifeBuoy,
	LogOut,
	Menu,
	Moon,
	Search,
	Settings,
	Sun,
	User,
	Users,
	X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SearchTrigger } from "./command-search";
import { OrgSwitcher } from "./org-switcher";

// Mobile sidebar trigger button - shown in mobile header
export function MobileSidebarTrigger() {
	const { setMobileSidebarOpen } = useDashboardStore();

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-9 w-9 md:hidden"
			onClick={() => setMobileSidebarOpen(true)}
		>
			<Menu className="h-5 w-5" />
			<span className="sr-only">Open menu</span>
		</Button>
	);
}

// Mobile sidebar drawer - full width on mobile
export function MobileSidebar() {
	const { mobileSidebarOpen, setMobileSidebarOpen } = useDashboardStore();
	const pathname = usePathname();
	const isSettingsPage = pathname?.startsWith("/settings");

	return (
		<Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
			<SheetContent side="left" className="w-full max-w-full p-0">
				<SidebarShell onClose={() => setMobileSidebarOpen(false)}>
					{isSettingsPage ? (
						<SettingsNav onNavigate={() => setMobileSidebarOpen(false)} />
					) : (
						<DashboardNav onNavigate={() => setMobileSidebarOpen(false)} />
					)}
				</SidebarShell>
			</SheetContent>
		</Sheet>
	);
}

function BrandIcon({
	className,
	hovered,
	collapsed = false,
}: { className?: string; hovered: boolean; collapsed?: boolean }) {
	return (
		<span className="flex items-center gap-2">
			{hovered ? (
				collapsed ? (
					<SidebarExpandIcon className="h-4 w-4" />
				) : (
					<BreezeLoadingIcon2 className={className} />
				)
			) : (
				<BlocksIcon className={className} />
			)}
			{!collapsed && <span className="text-sm font-semibold">Breeze</span>}
		</span>
	);
}

// Desktop sidebar - hidden on mobile
export function Sidebar() {
	const { sidebarCollapsed, toggleSidebar, setCommandSearchOpen } = useDashboardStore();
	const pathname = usePathname();
	const router = useRouter();
	const { data: authSession } = useSession();
	const billing = useBillingState();

	const isSettingsPage = pathname?.startsWith("/settings");
	const isHomePage = pathname === "/" || pathname === "/dashboard";
	const isSessionsPage = pathname?.startsWith("/sessions") || pathname?.startsWith("/workspace");
	const isCoworkersPage = pathname?.startsWith("/coworkers");
	const isIntegrationsPage = pathname?.startsWith("/integrations");

	const user = authSession?.user;
	const userInitials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user?.email?.[0]?.toUpperCase() || "?";

	return (
		<aside
			className={cn(
				"hidden md:grid grid-cols-1 grid-rows-1 h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-hidden",
				"transition-all duration-200 ease-out",
				sidebarCollapsed ? "w-12 cursor-pointer hover:bg-accent/50 transition-colors" : "w-64",
			)}
			onClick={sidebarCollapsed ? toggleSidebar : undefined}
		>
			{/* Collapsed view — icon-only nav, overlaid in same grid cell */}
			<div
				className={cn(
					"col-start-1 row-start-1 flex flex-col items-center gap-1 overflow-hidden transition-opacity duration-200 ease-out",
					sidebarCollapsed ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
			>
				<div className="flex flex-col items-center gap-1 pt-2">
					<SidebarCollapsedBrandButton toggleSidebar={toggleSidebar} />
					<div className="my-1" />
					<Button
						variant={isHomePage ? "secondary" : "ghost"}
						size="icon"
						className={cn(
							"h-8 w-8 text-muted-foreground hover:text-foreground",
							isHomePage && "bg-foreground/[0.07]",
						)}
						onClick={(e) => {
							e.stopPropagation();
							router.push("/");
						}}
						title="Home"
					>
						<Home className="h-4 w-4" />
					</Button>
					<Button
						variant={isSessionsPage ? "secondary" : "ghost"}
						size="icon"
						className={cn(
							"h-8 w-8 text-muted-foreground hover:text-foreground",
							isSessionsPage && "bg-foreground/[0.07]",
						)}
						onClick={(e) => {
							e.stopPropagation();
							router.push("/sessions");
						}}
						title="Sessions"
					>
						<SessionsGridIcon className="h-4 w-4" />
					</Button>
					<Button
						variant={isCoworkersPage ? "secondary" : "ghost"}
						size="icon"
						className={cn(
							"h-8 w-8 text-muted-foreground hover:text-foreground",
							isCoworkersPage && "bg-foreground/[0.07]",
						)}
						onClick={(e) => {
							e.stopPropagation();
							router.push("/coworkers");
						}}
						title="Coworkers"
					>
						<CoworkersIcon className="h-4 w-4" />
					</Button>
					<Button
						variant={isIntegrationsPage ? "secondary" : "ghost"}
						size="icon"
						className={cn(
							"h-8 w-8 text-muted-foreground hover:text-foreground",
							isIntegrationsPage && "bg-foreground/[0.07]",
						)}
						onClick={(e) => {
							e.stopPropagation();
							router.push("/integrations");
						}}
						title="Integrations"
					>
						<IntegrationsIcon className="h-4 w-4" />
					</Button>
					<Button
						variant={isSettingsPage ? "secondary" : "ghost"}
						size="icon"
						className={cn(
							"h-8 w-8 text-muted-foreground hover:text-foreground",
							isSettingsPage && "bg-foreground/[0.07]",
						)}
						onClick={(e) => {
							e.stopPropagation();
							router.push("/settings/profile");
						}}
						title="Settings"
					>
						<Settings className="h-4 w-4" />
					</Button>
				</div>
				<div className="border-t border-sidebar-border w-full flex flex-col items-center gap-1 pt-2 pb-1 mt-auto">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
						onClick={(e) => {
							e.stopPropagation();
							setCommandSearchOpen(true);
						}}
						title="Search"
					>
						<Search className="h-4 w-4" />
					</Button>
					{billing.isLoaded && (
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground hover:text-foreground"
							onClick={(e) => {
								e.stopPropagation();
								router.push("/settings/billing");
							}}
							title={`${billing.creditBalance} credits`}
						>
							<Coins className="h-4 w-4" />
						</Button>
					)}
					{user && (
						<Avatar className="h-6 w-6">
							<AvatarImage src={user.image || undefined} alt={user.name || "User"} />
							<AvatarFallback className="text-[9px]">{userInitials}</AvatarFallback>
						</Avatar>
					)}
				</div>
			</div>

			{/* Full content - overlaid in same grid cell */}
			<div
				className={cn(
					"col-start-1 row-start-1 flex flex-col transition-opacity duration-200 ease-out",
					sidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100",
				)}
			>
				<div className="px-3 pt-2 pb-1 mb-1 flex items-center justify-between shrink-0">
					<SidebarExpandedBrand />
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-muted-foreground hover:text-foreground"
						onClick={toggleSidebar}
						title="Collapse sidebar"
					>
						<SidebarCollapseIcon className="h-4 w-4" />
					</Button>
				</div>
				{!isSettingsPage && (
					<div className="px-3 mt-2 mb-1 shrink-0">
						<CoreNav />
					</div>
				)}
				<SidebarShell hideHeader>
					{isSettingsPage ? <SettingsNav /> : <DashboardNav secondaryOnly />}
				</SidebarShell>
			</div>
		</aside>
	);
}

function SidebarCollapsedBrandButton({ toggleSidebar }: { toggleSidebar: () => void }) {
	const [hovered, setHovered] = useState(false);
	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8 text-foreground"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={(e) => {
				e.stopPropagation();
				toggleSidebar();
			}}
			title="Expand sidebar"
		>
			<BrandIcon className="h-5 w-5" collapsed hovered={hovered} />
		</Button>
	);
}

function SidebarExpandedBrand() {
	const [hovered, setHovered] = useState(false);
	return (
		<div
			className="flex items-center gap-2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<BrandIcon className="h-5 w-5 shrink-0" hovered={hovered} />
		</div>
	);
}

// --- Exported building blocks for reuse (e.g. settings sidebar) ---

export function NavItem({
	icon: Icon,
	label,
	active,
	badge,
	onClick,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	active: boolean;
	badge?: number;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="ghost"
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 w-full px-2 h-8 rounded-xl text-sm font-medium justify-start",
				active
					? "bg-foreground/[0.05] text-foreground"
					: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]",
			)}
		>
			<Icon className="h-5 w-5 shrink-0" />
			<span className="truncate">{label}</span>
			{badge !== undefined && badge > 0 && (
				<span className="ml-auto h-5 min-w-5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-medium flex items-center justify-center px-1.5 shrink-0">
					{badge > 99 ? "99+" : badge}
				</span>
			)}
		</Button>
	);
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
	return <h2 className="px-2 text-sm font-medium text-muted-foreground">{children}</h2>;
}

// Shared sidebar shell — header (logo + search) + nav area (children) + footer (support + user card)
export function SidebarShell({
	children,
	onClose,
	showCollapseButton = false,
	hideHeader = false,
}: {
	children: React.ReactNode;
	onClose?: () => void;
	showCollapseButton?: boolean;
	hideHeader?: boolean;
}) {
	const handleSignOut = useSignOut();
	const { data: authSession } = useSession();
	const { theme, setTheme } = useTheme();
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const billing = useBillingState();

	// Fetch Slack status for support popup
	const { toggleSidebar, setCommandSearchOpen } = useDashboardStore();

	const [brandHovered, setBrandHovered] = useState(false);

	const user = authSession?.user;
	const userInitials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user?.email?.[0]?.toUpperCase() || "?";

	return (
		<>
			{!hideHeader && (
				<div className="p-3 flex items-center justify-between gap-2">
					<div
						className="flex items-center gap-2"
						onMouseEnter={() => setBrandHovered(true)}
						onMouseLeave={() => setBrandHovered(false)}
					>
						<BrandIcon className="h-6 w-6 shrink-0" hovered={brandHovered} />
					</div>
					<div className="flex items-center gap-1">
						{showCollapseButton && (
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-foreground"
								onClick={toggleSidebar}
								title="Collapse sidebar"
							>
								<SidebarCollapseIcon className="h-4 w-4" />
							</Button>
						)}
						{onClose && (
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-foreground"
								onClick={onClose}
								title="Close menu"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Scrollable nav — content provided by caller */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden px-3">
				<div className="flex flex-col gap-5">{children}</div>
			</nav>

			{/* Search */}
			<div className="px-3 mb-2">
				<SearchTrigger onClick={() => setCommandSearchOpen(true)} />
			</div>

			{/* Footer */}
			<div className="border-t border-sidebar-border px-3 py-3 flex flex-col gap-2">
				{/* Credits */}
				{billing.isLoaded && (
					<Link
						href="/settings/billing"
						className="flex items-center justify-center gap-2 w-full h-8 rounded-lg text-sm font-medium border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border"
					>
						<Coins className="h-4 w-4" />
						<span>
							{billing.creditBalance.toFixed(1)} credit
							{billing.creditBalance !== 1 ? "s" : ""}
						</span>
					</Link>
				)}
				{/* Support - Intercom if available, docs fallback */}
				<Button
					type="button"
					variant="outline"
					className="flex items-center justify-center gap-2 w-full h-8 rounded-lg text-sm font-medium border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border"
					onClick={() => {
						if (!openIntercomMessenger()) {
							window.open("https://docs.breeze.engineer", "_blank", "noopener,noreferrer");
						}
					}}
				>
					<LifeBuoy className="h-4 w-4" />
					<span>Support</span>
				</Button>

				{/* Organization switcher */}
				<OrgSwitcher />

				{/* User card */}
				<Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							className="flex items-center gap-3 w-full p-2 h-auto rounded-xl bg-muted/30 hover:bg-muted text-left justify-start"
						>
							<Avatar className="h-7 w-7">
								<AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
								<AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<Text variant="small" className="font-medium truncate block text-xs">
									{user?.name || "User"}
								</Text>
								<Text variant="small" color="muted" className="text-[11px] truncate block">
									{user?.email || ""}
								</Text>
							</div>
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" align="end" className="w-56 p-1 z-[60]" sideOffset={8}>
						<div className="flex flex-col">
							<Button
								type="button"
								variant="ghost"
								className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted h-auto w-full"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							>
								<div className="flex items-center gap-2">
									{theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
									{theme === "dark" ? "Dark mode" : "Light mode"}
								</div>
								<div className="text-xs text-muted-foreground">
									{theme === "dark" ? "On" : "Off"}
								</div>
							</Button>
							<div className="my-1 h-px bg-border" />
							<Button
								type="button"
								variant="ghost"
								className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted h-auto justify-start text-left text-muted-foreground hover:text-foreground w-full"
								onClick={() => {
									setUserMenuOpen(false);
									handleSignOut();
								}}
							>
								<LogOut className="h-4 w-4" />
								Log out
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}

function CoreNav({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const router = useRouter();

	const isHomePage = pathname === "/" || pathname === "/dashboard";
	const isSessionsPage = pathname?.startsWith("/sessions") || pathname?.startsWith("/workspace");
	const isCoworkersPage = pathname?.startsWith("/coworkers");
	const isIntegrationsPage = pathname?.startsWith("/integrations");
	const isSettingsPage = pathname?.startsWith("/settings");

	const handleNavigate = (path: string) => {
		router.push(path);
		onNavigate?.();
	};

	return (
		<div className="flex flex-col gap-1">
			<NavItem icon={Home} label="Home" active={!!isHomePage} onClick={() => handleNavigate("/")} />
			<NavItem
				icon={SessionsGridIcon}
				label="Sessions"
				active={!!isSessionsPage}
				onClick={() => handleNavigate("/sessions")}
			/>
			<NavItem
				icon={CoworkersIcon}
				label="Coworkers"
				active={!!isCoworkersPage}
				onClick={() => handleNavigate("/coworkers")}
			/>
			<NavItem
				icon={IntegrationsIcon}
				label="Integrations"
				active={!!isIntegrationsPage}
				onClick={() => handleNavigate("/integrations")}
			/>
			<NavItem
				icon={Settings}
				label="Settings"
				active={!!isSettingsPage}
				onClick={() => handleNavigate("/settings/profile")}
			/>
		</div>
	);
}

// Dashboard-specific nav items
function DashboardNav({
	onNavigate,
	secondaryOnly,
}: { onNavigate?: () => void; secondaryOnly?: boolean }) {
	const pathname = usePathname();
	const router = useRouter();
	const { sidebarRecentsOpen, toggleSidebarRecents } = useDashboardStore();

	const { data: recentSessions } = useSessions({
		limit: 8,
		sortBy: "recency",
		refetchInterval: 10000,
	});
	const { data: workers } = useWorkers();

	const managerSessionIds = new Set((workers ?? []).map((w) => w.managerSessionId).filter(Boolean));
	const nonManagerSessions = (recentSessions ?? [])
		.filter((s) => !managerSessionIds.has(s.id) && s.kind !== "manager")
		.slice(0, 5);

	const handleNavigate = (path: string) => {
		router.push(path);
		onNavigate?.();
	};

	return (
		<>
			{!secondaryOnly && <CoreNav onNavigate={onNavigate} />}

			{/* Coworkers */}
			{workers && workers.length > 0 && (
				<div className="flex flex-col gap-1">
					<SectionLabel>Coworkers</SectionLabel>
					{workers.slice(0, 5).map((worker) => {
						const isActive =
							pathname === `/workspace/${worker.managerSessionId}` ||
							pathname === `/coworkers/${worker.id}`;
						return (
							<Button
								key={worker.id}
								type="button"
								variant="ghost"
								onClick={() =>
									handleNavigate(
										worker.managerSessionId
											? `/workspace/${worker.managerSessionId}`
											: `/coworkers/${worker.id}`,
									)
								}
								className={cn(
									"flex items-center gap-2 w-full px-2 h-7 rounded-lg text-xs font-normal justify-start",
									isActive
										? "bg-foreground/[0.05] text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]",
								)}
							>
								<div className="shrink-0">
									<WorkerOrb name={worker.name} size={14} />
								</div>
								<span className="truncate">{worker.name}</span>
							</Button>
						);
					})}
				</div>
			)}

			{/* Recent sessions */}
			{nonManagerSessions.length > 0 && (
				<div className="flex flex-col gap-1">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={toggleSidebarRecents}
						className="flex items-center justify-between px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						<span>Recent</span>
						{sidebarRecentsOpen ? (
							<ChevronDown className="h-3 w-3" />
						) : (
							<ChevronRight className="h-3 w-3" />
						)}
					</Button>
					{sidebarRecentsOpen &&
						nonManagerSessions.map((session) => {
							const title = session.title || session.promptSnippet || "Untitled";
							const isActive = pathname === `/workspace/${session.id}`;
							const isSetup = session.kind === "setup" || session.sessionType === "setup";
							return (
								<Button
									key={session.id}
									type="button"
									variant="ghost"
									onClick={() => handleNavigate(`/workspace/${session.id}`)}
									className={cn(
										"flex items-center gap-2 w-full px-2 h-7 rounded-lg text-xs font-normal justify-start",
										isActive
											? "bg-foreground/[0.05] text-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]",
									)}
								>
									<OpenCodeIcon className="h-3 w-3 shrink-0" />
									<span className="truncate">{isSetup ? `Setup: ${title}` : title}</span>
								</Button>
							);
						})}
				</div>
			)}
		</>
	);
}

const BILLING_ENABLED = env.NEXT_PUBLIC_BILLING_ENABLED;

// Settings-specific nav items
function SettingsNav({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const router = useRouter();

	const isProfilePage = pathname === "/settings/profile";
	const isGeneralPage = pathname === "/settings/general";
	const isMembersPage = pathname === "/settings/members";
	const isEnvironmentsPage =
		pathname?.startsWith("/settings/environments") ||
		pathname?.startsWith("/settings/repositories");
	const isBillingPage = pathname === "/settings/billing";

	const handleNavigate = (path: string) => {
		router.push(path);
		onNavigate?.();
	};

	return (
		<>
			{/* Back to dashboard */}
			<div className="flex flex-col gap-1">
				<NavItem
					icon={ArrowLeft}
					label="Back"
					active={false}
					onClick={() => handleNavigate("/sessions")}
				/>
			</div>

			{/* Account */}
			<div className="flex flex-col gap-1">
				<SectionLabel>Account</SectionLabel>
				<NavItem
					icon={User}
					label="Profile"
					active={!!isProfilePage}
					onClick={() => handleNavigate("/settings/profile")}
				/>
			</div>

			{/* Workspace */}
			<div className="flex flex-col gap-1">
				<SectionLabel>Workspace</SectionLabel>
				<NavItem
					icon={Building2}
					label="General"
					active={!!isGeneralPage}
					onClick={() => handleNavigate("/settings/general")}
				/>
				<NavItem
					icon={Users}
					label="Members"
					active={!!isMembersPage}
					onClick={() => handleNavigate("/settings/members")}
				/>
				<NavItem
					icon={FolderGit2}
					label="Environments"
					active={!!isEnvironmentsPage}
					onClick={() => handleNavigate("/settings/environments")}
				/>
				{BILLING_ENABLED && (
					<NavItem
						icon={CreditCard}
						label="Billing"
						active={!!isBillingPage}
						onClick={() => handleNavigate("/settings/billing")}
					/>
				)}
			</div>
		</>
	);
}
