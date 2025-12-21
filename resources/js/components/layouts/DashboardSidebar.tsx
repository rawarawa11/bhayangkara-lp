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
    Activity,
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
        title: "Artikel & Berita",
        url: "articles.index",
        icon: Newspaper,
        isActive: (currentRoute: string) => currentRoute.startsWith('articles.'),
    },
    {
        title: "Obat-obatan",
        url: "medicines.index",
        icon: Pill,
        isActive: (currentRoute: string) => currentRoute.startsWith('medicines.'),
    },
    {
        title: "Knowledge Base (AI)",
        url: "knowledge.index",
        icon: BookOpen,
        isActive: (currentRoute: string) => currentRoute.startsWith('knowledge.'),
    },
    {
        title: "Jadwal Dokter",
        url: "schedules.index",
        icon: Activity,
        isActive: (currentRoute: string) => currentRoute.startsWith('schedules.'),
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const currentRoute = route().current() as string;

    return (
        <Sidebar collapsible="icon" {...props} className="bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300">
            <SidebarHeader className="bg-slate-950 border-b border-slate-800">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-slate-800 hover:text-white data-[state=open]:bg-slate-800">
                            <Link href={route('dashboard')}>
                                <img
                                    src="/images/logo-rs.webp"
                                    alt="Logo Rumah Sakit Bhayangkara"
                                    className="h-8 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-white tracking-wide">RS BHAYANGKARA</span>
                                    <span className="truncate text-[10px] font-medium text-amber-500 uppercase tracking-widest">
                                        Admin Panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-slate-900 pt-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                        Utama
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive(currentRoute)}
                                        className="
                                            hover:bg-slate-800 hover:text-white text-slate-400
                                            data-[active=true]:bg-amber-500/10
                                            data-[active=true]:text-amber-500
                                            data-[active=true]:border-r-2
                                            data-[active=true]:border-amber-500
                                            rounded-r-none border-r-2 border-transparent
                                            transition-all duration-200
                                        "
                                    >
                                        <Link href={route(item.url)}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mt-4">
                        Manajemen RS
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navManagement.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={item.isActive(currentRoute)}
                                        className="
                                            hover:bg-slate-800 hover:text-white text-slate-400
                                            data-[active=true]:bg-amber-500/10
                                            data-[active=true]:text-amber-500
                                            data-[active=true]:border-r-2
                                            data-[active=true]:border-amber-500
                                            rounded-r-none border-r-2 border-transparent
                                            transition-all duration-200
                                        "
                                    >
                                        <Link href={route(item.url)}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-slate-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="
                            flex items-center gap-3 px-2 py-1.5 rounded-md bg-slate-800 border border-slate-700
                            transition-all duration-200
                            group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-transparent
                        ">
                            <div className="size-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                            <span className="text-xs text-slate-300 font-medium group-data-[collapsible=icon]:hidden">
                                Sistem Online
                            </span>
                        </div>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Pengaturan" className="text-slate-400 hover:text-white hover:bg-slate-800 mt-1">
                            <Link href={"#"}>
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
