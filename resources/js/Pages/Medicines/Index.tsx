import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlusCircle, MoreHorizontal, Pencil, Trash2, ToggleRight, ToggleLeft, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Medicine = { id: number; name: string; slug: string; description: string | null; image: string | null; is_available: boolean; updated_at: string }
type PaginatedResponse<T> = { data: T[]; links: any[]; meta: any }
type PageProps = { medicines: PaginatedResponse<Medicine>; filters: { q?: string; avail?: string; sort?: string } }

const imgUrl = (path: string | null) => path ? `/storage/${path}` : 'https://placehold.co/100x100/e2e8f0/64748b?text=Obat'

export default function MedicineIndex() {
    const { medicines, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters.q || '')
    const [avail, setAvail] = useState(filters.avail || 'all')
    const [sort, setSort] = useState(filters.sort || 'updated_desc')
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null)

    const doSearch = () => {
        router.get(route('medicines.index'), { q, availability: avail, sort }, { preserveState: true, replace: true })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') doSearch()
    }

    const confirmDelete = (medicine: Medicine) => {
        setMedicineToDelete(medicine)
        setDeleteOpen(true)
    }

    const handleDelete = () => {
        if (!medicineToDelete) return
        router.delete(route('medicines.destroy', medicineToDelete.id), {
            onSuccess: () => setDeleteOpen(false),
        })
    }

    const toggleAvailability = (medicine: Medicine) => {
        router.patch(route('medicines.toggle-availability', medicine.id), {}, { preserveScroll: true })
    }

    return (
        <AdminLayout title="Manajemen Obat">
            <Head title="Manajemen Obat" />
            <div className="container mx-auto p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Obat-obatan</h1>
                        <p className="text-muted-foreground">Kelola daftar obat RS Bhayangkara.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('medicines.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Obat
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Obat</CardTitle>
                        {/*@ts-ignore*/}
                        <CardDescription>Total {medicines.total} obat ditemukan.</CardDescription>
                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input placeholder="Cari nama obat..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleKeyDown} />
                                <Button type="button" onClick={doSearch} size="icon"><Search className="h-4 w-4" /></Button>
                            </div>
                            <Select value={avail} onValueChange={(v) => { setAvail(v); setTimeout(doSearch, 0) }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status Ketersediaan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="available">Tersedia</SelectItem>
                                    <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sort} onValueChange={(v) => { setSort(v); setTimeout(doSearch, 0) }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="updated_desc">Terbaru Diubah</SelectItem>
                                    <SelectItem value="updated_asc">Terlama Diubah</SelectItem>
                                    <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                                    <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Gambar</TableHead>
                                    <TableHead>Nama Obat</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {medicines.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">Tidak ada obat ditemukan.</TableCell>
                                    </TableRow>
                                ) : (
                                    medicines.data.map((medicine) => (
                                        <TableRow key={medicine.id}>
                                            <TableCell>
                                                <Avatar className="h-10 w-10 rounded-md border">
                                                    <AvatarImage src={imgUrl(medicine.image)} alt={medicine.name} className="object-cover" />
                                                    <AvatarFallback className="rounded-md">IMG</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{medicine.name}</div>
                                                <div className="text-xs text-muted-foreground hidden md:block truncate max-w-[300px]">{medicine.description}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={medicine.is_available ? 'default' : 'secondary'} className={medicine.is_available ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                    {medicine.is_available ? 'Tersedia' : 'Kosong'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Buka menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild><Link href={route('medicines.edit', medicine.id)}><Pencil className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleAvailability(medicine)}>
                                                            {medicine.is_available ? <><ToggleLeft className="mr-2 h-4 w-4" /> Set Tidak Tersedia</> : <><ToggleRight className="mr-2 h-4 w-4" /> Set Tersedia</>}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => confirmDelete(medicine)} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    {medicines.links.map((link: any, i: number) => {
                                        if (link.url === null && link.label === '...') return <PaginationItem key={i}><PaginationEllipsis /></PaginationItem>
                                        if (link.label.includes('Previous')) return <PaginationItem key={i}><PaginationPrevious href={link.url || '#'} onClick={e => { if (!link.url) e.preventDefault() }} className={!link.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                                        if (link.label.includes('Next')) return <PaginationItem key={i}><PaginationNext href={link.url || '#'} onClick={e => { if (!link.url) e.preventDefault() }} className={!link.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                                        return <PaginationItem key={i}><PaginationLink href={link.url || '#'} isActive={link.active}>{link.label}</PaginationLink></PaginationItem>
                                    })}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Obat?</DialogTitle>
                        <DialogDescription>Apakah Anda yakin ingin menghapus obat <strong>{medicineToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
