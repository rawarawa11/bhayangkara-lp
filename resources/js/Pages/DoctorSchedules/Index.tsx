import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search, CalendarClock } from 'lucide-react'
import { ScheduleTable } from '@/components/tables/ScheduleTable'
import { PaginatedResponse, Schedule } from '@/types'

type PageProps = {
    schedules: PaginatedResponse<Schedule>;
    filters: { q?: string };
}

export default function ScheduleIndex() {
    const { schedules, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters.q || '')

    const doSearch = () => {
        router.get(
            route('schedules.index'),
            { q },
            { preserveState: true, replace: true }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') doSearch()
    }

    return (
        <AdminLayout title="Jadwal Dokter">
            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <CalendarClock className="h-6 w-6 text-blue-600" />
                            Jadwal Dokter
                        </h2>
                        <p className="text-sm text-slate-500">
                            Atur jadwal praktik, status kehadiran, dan poli dokter spesialis.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-none">
                        <Link href={route('schedules.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Jadwal
                        </Link>
                    </Button>
                </div>

                <Card className="border border-slate-200 shadow-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari nama dokter atau spesialis..."
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <Button variant="secondary" onClick={doSearch}>
                                Cari
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6">
                        <ScheduleTable schedules={schedules} q={q} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
