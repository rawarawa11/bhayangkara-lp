import { Head } from "@inertiajs/react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/DashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"

export default function AdminLayout({ children, title }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Head title={title ?? "Dashboard"} />
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                    <DashboardHeader />
                    <main className="min-h-screen bg-gray-50">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
