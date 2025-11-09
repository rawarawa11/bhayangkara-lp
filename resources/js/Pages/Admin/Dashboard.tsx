import AdminLayout from '@/components/layouts/DashboardLayout'

export default function Dashboard(props: any) {
    return (
        <AdminLayout title="Dashboard">
            <DashboardSummary {...props} />
        </AdminLayout>
    )
}

type RecentItem = { id: number; title: string; status: string; published_at: string | null }
type TopTag = { tag: string; count: number }

type DashboardSummaryProps = {
    total: number
    published: number
    drafts: number
    scheduled: number
    publishedToday: number
    recent: RecentItem[]
    topTags: TopTag[]
}

function DashboardSummary({
                                             total,
                                             published,
                                             drafts,
                                             scheduled,
                                             publishedToday,
                                             recent = [],
                                             topTags = [],
                                         }: DashboardSummaryProps) {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <CardStat label="Total" value={total} />
                <CardStat label="Published" value={published} />
                <CardStat label="Drafts" value={drafts} />
                <CardStat label="Scheduled" value={scheduled} />
                <CardStat label="Published Today" value={publishedToday} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardPanel title="Recent Articles">
                    <ul className="divide-y">
                        {recent.map((a) => (
                            <li key={a.id} className="py-2 flex items-center justify-between">
                                <div className="truncate">
                                    <div className="font-medium truncate">{a.title}</div>
                                    <div className="text-xs text-gray-500">{a.status} • {a.published_at ?? '—'}</div>
                                </div>
                            </li>
                        ))}
                        {recent.length === 0 && <li className="py-4 text-sm text-gray-500">No recent items</li>}
                    </ul>
                </CardPanel>

                <CardPanel title="Top Tags">
                    <ul className="grid grid-cols-2 gap-2">
                        {topTags.map((t) => (
                            <li key={t.tag} className="flex items-center justify-between rounded border px-3 py-1 text-sm">
                                <span className="truncate">{t.tag}</span>
                                <span className="text-gray-500">{t.count}</span>
                            </li>
                        ))}
                        {topTags.length === 0 && <li className="text-sm text-gray-500">No tags</li>}
                    </ul>
                </CardPanel>
            </div>
        </div>
    )
}

function CardStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    )
}

function CardPanel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="mb-3 text-sm font-medium text-gray-700">{title}</div>
            {children}
        </div>
    )
}

