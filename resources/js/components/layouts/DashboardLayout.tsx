import { Head } from "@inertiajs/react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/DashboardSidebar"

export default function AdminLayout({ children, title }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Head title={title ?? "Dashboard"} />
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                    <header className="p-2">
                        <SidebarTrigger />
                    </header>
                    <main className="min-h-screen bg-gray-50">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
