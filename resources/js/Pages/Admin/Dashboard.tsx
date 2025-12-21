import { useState } from 'react'
import AdminLayout from '@/components/layouts/DashboardLayout'
import {
    FileText,
    CheckCircle2,
    Edit3,
    Eye,
    TrendingUp,
    Users,
    Activity,
    Calendar,
    ArrowUpRight,
    FilePlus,
    Hash,
    BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

// --- Types ---
type RecentItem = { id: number; title: string; status: string; published_at: string | null, views: number }
type TopTag = { tag: string; count: number }
type ChartData = { name: string; visitors: number; articles: number }

type DashboardProps = {
    total: number
    published: number
    drafts: number
    scheduled: number
    totalViews: number
    recent: RecentItem[]
    popular: RecentItem[]
    topTags: TopTag[]
    totalVisitors: number
    visitorsToday: number
    chartData: ChartData[]
}

export default function Dashboard(props: DashboardProps) {
    const [viewMode, setViewMode] = useState<'7d' | '30d'>('7d')
    const chartData = props.chartData || [];
    const displayedData = viewMode === '7d'
        ? chartData.slice(-7)
        : chartData;

    const hasChartData = displayedData.some(d => d.visitors > 0 || d.articles > 0);

    return (
        <AdminLayout title="Dashboard">
            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MainStatCard
                        title="Pengunjung Hari Ini"
                        value={props.visitorsToday}
                        trend="Realtime Tracking"
                        icon={Activity}
                        color="teal"
                    />
                    <MainStatCard
                        title="Total Pengunjung"
                        value={props.totalVisitors}
                        trend="Sejak Awal"
                        icon={Users}
                        color="orange"
                    />
                    <MainStatCard
                        title="Total Pembaca Artikel"
                        value={props.totalViews}
                        trend="Akumulasi Total"
                        icon={Eye}
                        color="indigo"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-none border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                    Statistik Kunjungan
                                </CardTitle>
                                <CardDescription>Tren pengunjung vs artikel yang diterbitkan.</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                                {['7d', '30d'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setViewMode(range as '7d' | '30d')}
                                        className={cn(
                                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                            viewMode === range
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {range.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[350px] w-full flex items-center justify-center">
                                {hasChartData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={displayedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 12, fill: '#64748b'}}
                                                dy={10}
                                                interval={viewMode === '30d' ? 4 : 0}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{fontSize: 12, fill: '#64748b'}}
                                            />
                                            <Tooltip
                                                contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                            />
                                            <Legend verticalAlign="top" height={36} iconType="circle" />

                                            <Area
                                                type="monotone"
                                                dataKey="articles"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorArticles)"
                                                name="Artikel Rilis"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="visitors"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorVisitors)"
                                                name="Pengunjung"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">Belum ada data statistik untuk periode ini.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. STATUS SIDEBAR */}
                    <div className="space-y-6">
                        <Card className="shadow-none border-slate-200">
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    Status Konten
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 pt-4">
                                <StatusBadge
                                    label="Published"
                                    value={props.published}
                                    color="bg-emerald-100 text-emerald-700"
                                    icon={CheckCircle2}
                                />
                                <StatusBadge
                                    label="Drafts"
                                    value={props.drafts}
                                    color="bg-amber-100 text-amber-700"
                                    icon={Edit3}
                                />
                                <StatusBadge
                                    label="Scheduled"
                                    value={props.scheduled}
                                    color="bg-purple-100 text-purple-700"
                                    icon={Calendar}
                                />
                                <StatusBadge
                                    label="Total"
                                    value={props.total}
                                    color="bg-slate-100 text-slate-700"
                                    icon={FileText}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-none border-slate-200">
                            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Topik Populer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {props.topTags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {props.topTags.map((t) => (
                                            <div key={t.tag} className="flex items-center gap-2 rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                                                <span>#{t.tag}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-blue-600 font-bold">{t.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState text="Belum ada data tag" />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-none border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                <CardTitle className="text-base font-bold text-slate-800">Artikel Terpopuler</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {props.popular.length > 0 ? props.popular.map((a, i) => (
                                    <div key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className={cn(
                                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-bold text-xs shadow-sm",
                                                i === 0 ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                                            )}>
                                                {i + 1}
                                            </div>
                                            <div className="truncate">
                                                <p className="font-medium text-sm text-slate-700 truncate group-hover:text-blue-600 transition-colors">{a.title}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                                                    {(a.views ?? 0).toLocaleString()} Views
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <EmptyState text="Belum ada data" />}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    <Card className="shadow-none border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FilePlus className="h-4 w-4 text-blue-600" />
                                <CardTitle className="text-base font-bold text-slate-800">Baru Ditambahkan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {props.recent.length > 0 ? props.recent.map((a) => (
                                    <div key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="font-medium text-sm text-slate-700 line-clamp-1">{a.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                {a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID') : 'Draft'}
                                            </p>
                                        </div>
                                        <Badge status={a.status} />
                                    </div>
                                )) : <EmptyState text="Belum ada artikel" />}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

function MainStatCard({ title, value, trend, icon: Icon, color }: any) {
    const colors: Record<string, string> = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        slate: "bg-slate-50 text-slate-600 border-slate-200",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200",
        teal: "bg-teal-50 text-teal-600 border-teal-200",
    }

    return (
        <Card className={cn("border-l-4 shadow-sm", colors[color])}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 text-slate-500">{title}</p>
                        <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                            {(value ?? 0).toLocaleString()}
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-lg bg-white shadow-sm border border-slate-100")}>
                        <Icon className="h-5 w-5 opacity-80" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-slate-500 opacity-80">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {trend}
                </div>
            </CardContent>
        </Card>
    )
}

function StatusBadge({ label, value, color, icon: Icon }: any) {
    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all cursor-default">
            <div className={cn("p-1.5 rounded-full mb-2", color)}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-slate-800">{(value ?? 0).toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase">{label}</span>
        </div>
    )
}

function Badge({ status }: { status: string }) {
    const isPublished = status === 'published';
    return (
        <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
            isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        )}>
            {isPublished ? 'Published' : 'Draft'}
        </span>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="py-8 text-center">
            <div className="mx-auto h-1 w-8 bg-slate-200 rounded-full mb-2"></div>
            <p className="text-xs text-slate-400">{text}</p>
        </div>
    )
}
