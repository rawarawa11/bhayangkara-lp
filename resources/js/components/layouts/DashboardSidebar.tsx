import * as React from "react"
import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    LayoutDashboard,
    Newspaper,
    Pill,
    BookOpen,
    Hospital,
    Settings,
    LifeBuoy
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarSeparator,
} from '@/components/ui/sidebar'

// Pengaturan Menu NAvigasi
const navMain = [
    {
        title: "Dashboard",
        url: "dashboard",
        icon: LayoutDashboard,
        isActive: (currentRoute: string) => currentRoute === 'dashboard',
    },
]

const navManagement = [
    {
        title: "Artikel",
        url: "articles.index",
        icon: Newspaper,
        isActive: (currentRoute: string) => currentRoute.startsWith('articles'),
    },
    {
        title: "Obat-obatan",
        url: "medicines.index",
        icon: Pill,
        isActive: (currentRoute: string) => currentRoute.startsWith('medicines'),
    },
    {
        title: "Knowledge Base",
        url: "knowledge.index",
        icon: BookOpen,
        isActive: (currentRoute: string) => currentRoute.startsWith('knowledge'),
    },
    {
        title: "Jadwal Dokter",
        url: "schedules.index",
        icon: LifeBuoy,
        isActive: (currentRoute: string) => currentRoute.startsWith('schedules'),
    }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const currentRoute = route().current() as string;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Hospital className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">RS Bhayangkara</span>
                                    <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Group 1: General */}
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive(currentRoute)}
                                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Link href={route(item.url)}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Group 2: Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navManagement.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive(currentRoute)}
                                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Link href={route(item.url)}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="border-t border-gray-200 my-2" />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Pengaturan">
                            <Link href={'#'}>
                                <Settings className="size-4" />
                                <span>Pengaturan Akun</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
