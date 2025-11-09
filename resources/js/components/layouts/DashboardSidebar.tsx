import { Home, Newspaper, Pill, Search, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    type SidebarProps,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"
import {route} from "ziggy-js"

type Item = {
    title: string
    routeName?: string
    href?: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: Item[] = [
    { title: "Dashboard", routeName: "dashboard", icon: Home },
    { title: "Manajemen Artikel", routeName: "articles.index", icon: Newspaper },
    { title: "Manajemen Obat", routeName: "medicines.index", icon: Pill },
    { title: "Search", href: "#", icon: Search },
    { title: "Settings", href: "#", icon: Settings },
]

export function AppSidebar(props: SidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const Icon = item.icon
                                const href = item.routeName ? route(item.routeName) : item.href ?? "#"
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={href}>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
