import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, Search, Pill, Filter, ArrowUpDown } from 'lucide-react'
import { MedicineTable } from '@/components/tables/MedicineTable'
import { PaginatedResponse, Medicine } from '@/types'

type PageProps = {
    medicines: PaginatedResponse<Medicine>;
    filters: { q?: string; avail?: string; sort?: string }
}

export default function MedicineIndex() {
    const { medicines, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters.q || '')
    const [avail, setAvail] = useState(filters.avail || 'all')
    const [sort, setSort] = useState(filters.sort || 'updated_desc')

    const doSearch = () => {
        router.get(
            route('medicines.index'),
            { q, availability: avail, sort },
            { preserveState: true, replace: true }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') doSearch()
    }

    return (
        <AdminLayout title="Manajemen Obat">
            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            Manajemen Obat
                        </h2>
                        <p className="text-sm text-slate-500">
                            Kelola inventaris obat, update stok, dan status ketersediaan.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-none">
                        <Link href={route('medicines.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Obat
                        </Link>
                    </Button>
                </div>

                <Card className="border border-slate-200 shadow-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                            <div className="relative w-full lg:max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari nama obat, deskripsi..."
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <Select value={avail} onValueChange={(v) => { setAvail(v); setTimeout(doSearch, 0) }}>
                                        <SelectTrigger className="w-[160px] h-9 bg-white border-slate-300">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="available">Tersedia</SelectItem>
                                            <SelectItem value="unavailable">Habis / Tidak Tersedia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                                    <Select value={sort} onValueChange={(v) => { setSort(v); setTimeout(doSearch, 0) }}>
                                        <SelectTrigger className="w-[160px] h-9 bg-white border-slate-300">
                                            <SelectValue placeholder="Urutkan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="updated_desc">Terbaru Diupdate</SelectItem>
                                            <SelectItem value="updated_asc">Terlama Diupdate</SelectItem>
                                            <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                                            <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button variant="secondary" onClick={doSearch} className="h-9 px-4">
                                    Terapkan
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6">
                        <MedicineTable medicines={medicines} q={q} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
