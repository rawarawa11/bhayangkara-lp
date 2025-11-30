import AdminLayout from '@/components/layouts/DashboardLayout'
import {
    FileText,
    CheckCircle2,
    FileClock,
    Edit3,
    Eye,
    TrendingUp,
    Hash
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RecentItem = { id: number; title: string; status: string; published_at: string | null, views: number }
type TopTag = { tag: string; count: number }

type DashboardSummaryProps = {
    total: number
    published: number
    drafts: number
    scheduled: number
    totalViews: number
    recent: RecentItem[]
    popular: RecentItem[]
    topTags: TopTag[]
    totalVisitors:number;
    visitorsToday:number;
}

export default function Dashboard(props: DashboardSummaryProps) {
    return (
        <AdminLayout title="Dashboard">
            <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Artikel"
                        value={props.total}
                        icon={FileText}
                        className="bg-blue-50 text-blue-700 border-blue-200"
                    />
                    <StatCard
                        title="Published"
                        value={props.published}
                        icon={CheckCircle2}
                        className="bg-green-50 text-green-700 border-green-200"
                    />
                    <StatCard
                        title="Total Pembaca"
                        value={props.totalViews}
                        icon={Eye}
                        className="bg-indigo-50 text-indigo-700 border-indigo-200"
                    />
                    <StatCard
                        title="Drafts"
                        value={props.drafts}
                        icon={Edit3}
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    />
                    <StatCard
                        title="Scheduled"
                        value={props.scheduled}
                        icon={FileClock}
                        className="bg-purple-50 text-purple-700 border-purple-200"
                    />
                    <StatCard
                        title="Total Pengunjung"
                        value={props.totalVisitors}
                        icon={TrendingUp}
                        className="bg-orange-50 text-orange-700 border-orange-100"
                    />
                    <StatCard
                        title="Pengunjung Hari Ini"
                        value={props.visitorsToday}
                        icon={CheckCircle2}
                        className="bg-teal-50 text-teal-700 border-teal-100"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Artikel Terpopuler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {props.popular?.length ? props.popular.map((a, i) => (
                                    <div key={a.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
                                                {i + 1}
                                            </div>
                                            <div className="truncate">
                                                <p className="font-medium truncate">{a.title}</p>
                                                <p className="text-xs text-muted-foreground">{a.views.toLocaleString()} kali dibaca</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyState text="Belum ada data view" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileClock className="h-5 w-5 text-primary" />
                                Baru Ditambahkan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {props.recent?.length ? props.recent.map((a) => (
                                    <div key={a.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                        <div className="truncate max-w-[70%]">
                                            <p className="font-medium truncate">{a.title}</p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {a.status} • {a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID') : 'Draft'}
                                            </p>
                                        </div>
                                        <div className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                                            {a.views} views
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyState text="Belum ada artikel" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Hash className="h-5 w-5 text-primary" />
                                Topik Populer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {props.topTags?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {props.topTags.map((t) => (
                                        <div key={t.tag} className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm hover:bg-muted transition-colors cursor-default">
                                            <span className="font-medium">{t.tag}</span>
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground px-1.5">
                                                {t.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="Belum ada tags" />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

function StatCard({ title, value, icon: Icon, className }: { title: string, value: number, icon: any, className?: string }) {
    return (
        <div className={`rounded-xl border p-4  transition-all hover:shadow-md ${className}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium opacity-80">{title}</p>
                <Icon className="h-4 w-4 opacity-70" />
            </div>
            <div className="mt-2 text-2xl font-bold">
                {value.toLocaleString()}
            </div>
        </div>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="py-6 text-center text-sm text-muted-foreground italic">
            {text}
        </div>
    )
}
