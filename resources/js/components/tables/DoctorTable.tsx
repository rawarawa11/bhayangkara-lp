import { useState, useMemo } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    Hospital,
    Stethoscope,
    UserRound, PlusCircle
} from 'lucide-react'
import { Doctor, PaginatedLink, PaginatedResponse } from '@/types'

type Props = {
    doctors: PaginatedResponse<Doctor>;
    q?: string;
}

function DoctorPagination({ links }: { links: PaginatedLink[] }) {
    const mappedLinks = useMemo(() => {
        return links.map((l) => ({
            ...l,
            isPrev: /«|&laquo;|Previous/i.test(l.label),
            isNext: /»|&raquo;|Next/i.test(l.label),
            isEllipsis: l.url === null && /\.\.\./.test(l.label),
        }))
    }, [links])

    return (
        <Pagination className="mt-0">
            <PaginationContent>
                {mappedLinks.map((l, i) => {
                    if (l.isEllipsis) return <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    if (l.isPrev) return <PaginationItem key={`p-${i}`}><PaginationPrevious href={l.url || '#'} className={!l.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    if (l.isNext) return <PaginationItem key={`n-${i}`}><PaginationNext href={l.url || '#'} className={!l.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    return <PaginationItem key={`l-${i}`}>
                        <PaginationLink
                            href={l.url || '#'}
                            isActive={l.active}
                            className={l.active ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : ""}
                        >
                            <span dangerouslySetInnerHTML={{ __html: l.label }} />
                        </PaginationLink>
                    </PaginationItem>
                })}
            </PaginationContent>
        </Pagination>
    )
}

function EmptyState({ q }: { q?: string }) {
    return (
        <div className="py-16 text-center text-muted-foreground">
            <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Hospital className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {q ? `Tidak ada dokter untuk "${q}"` : 'Belum ada data dokter'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                {q ? 'Coba cari dengan nama atau spesialis lain.' : 'Tambahkan data dokter untuk menampilkannya di sini.'}
            </p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Link href={route('doctors.create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Dokter
                </Link>
            </Button>
        </div>
    )
}

function DeleteDoctorDialog({ doctor, children }: { doctor: Doctor, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(route("doctors.destroy", doctor.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false)
                setIsDeleting(false)
            },
            onError: () => setIsDeleting(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Dokter?</DialogTitle>
                    <DialogDescription>
                        Anda akan menghapus data dokter <strong>{doctor.name}</strong>.
                        Tindakan ini tidak dapat dibatalkan dan akan menghapus semua jadwal terkait.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>Batal</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ya, Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function DoctorTable({ doctors, q }: Props) {
    if (doctors.data.length === 0) {
        return <EmptyState q={q} />
    }

    return (
        <div className="space-y-0">
            <div className="rounded-md border border-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="pl-6 w-[250px]">Nama Dokter</TableHead>
                            <TableHead>Spesialis</TableHead>
                            <TableHead className="w-[80px] text-right pr-6">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.data.map((doctor) => (
                            <TableRow key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <UserRound className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">{doctor.name}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Stethoscope className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm">{doctor.specialist}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('doctors.edit', doctor.id)} className="cursor-pointer">
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Dokter
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DeleteDoctorDialog doctor={doctor}>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DeleteDoctorDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="border-t border-slate-100 p-4">
                <DoctorPagination links={doctors.links} />
            </div>
        </div>
    )
}
