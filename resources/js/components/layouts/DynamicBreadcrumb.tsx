import { usePage, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from 'lucide-react'

// Enhanced mapping for all your routes
const BREADCRUMB_MAP: Record<string, string> = {
    'admin': 'Dashboard',
    'dashboard': 'Dashboard',
    // Management Modules
    'medicines': 'Obat-obatan',
    'knowledge': 'Knowledge Base',
    'articles': 'Artikel & Berita',
    'schedules': 'Jadwal Dokter',
    // Actions
    'create': 'Tambah Baru',
    'edit': 'Edit Data',
    // System
    'profile': 'Profil Saya',
    'settings': 'Pengaturan',
    'users': 'Manajemen Pengguna',
};

export default function DynamicBreadcrumb() {
    const { url } = usePage();
    const cleanPath = url.split('?')[0].replace(/^\/|\/$/g, '');
    const pathSegments = cleanPath.split('/');

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        // Hide numeric IDs from the breadcrumb trail
        const isNumeric = /^\d+$/.test(segment);
        // Clean up the label
        const label = BREADCRUMB_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return {
            href,
            label,
            isNumeric,
            isLast: index === pathSegments.length - 1
        };
    }).filter(item => !item.isNumeric);

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {/* 1. Home Icon - Styled for Dark Background */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link
                            href="/admin/dashboard"
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="text-slate-600" />

                {breadcrumbs.map((crumb, index) => {
                    // Skip the 'admin' or 'dashboard' text if it's redundant with the Home icon
                    if (crumb.label === 'Dashboard') return null;

                    return (
                        <Fragment key={crumb.href}>
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    // 2. Active Page - White Text
                                    <BreadcrumbPage className="text-white font-medium">
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    // 3. Inactive Link - Light Gray with White Hover
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={crumb.href}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {/* Separator for all except last item */}
                            {!crumb.isLast && (
                                <BreadcrumbSeparator className="text-slate-600" />
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
