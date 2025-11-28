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

const BREADCRUMB_MAP: Record<string, string> = {
    'admin': 'Dashboard',
    'medicines': 'Obat-obatan',
    'knowledge': 'Knowledge Base',
    'articles': 'Artikel',
    'create': 'Tambah Baru',
    'edit': 'Edit Data',
};

export default function DynamicBreadcrumb() {
    const { url } = usePage();
    const cleanPath = url.split('?')[0].replace(/^\/|\/$/g, '');
    const pathSegments = cleanPath.split('/');
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isNumeric = /^\d+$/.test(segment);
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
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/admin/dashboard">
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {breadcrumbs.map((crumb, index) => {
                    if (crumb.label === 'Dashboard') return null;

                    return (
                        <Fragment key={crumb.href}>
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!crumb.isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
