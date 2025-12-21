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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    PlusCircle,
    Pill,
    Loader2,
    ToggleLeft,
    ToggleRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Medicine, PaginatedResponse, PaginatedLink } from '@/types'

type Props = {
    medicines: PaginatedResponse<Medicine>;
    q?: string;
}

const imgUrl = (path: string | null) => path ? `/storage/${path}` : 'https://placehold.co/100x100/f1f5f9/94a3b8?text=IMG'

function MedicinePagination({ links }: { links: PaginatedLink[] }) {
    const mappedLinks = useMemo(() => {
        return links.map((l) => ({
            ...l,
            isPrev: /«|&laquo;|Previous/i.test(l.label),
            isNext: /»|&raquo;|Next/i.test(l.label),
            isEllipsis: l.url === null && /\.\.\./.test(l.label),
        }))
    }, [links])

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                {mappedLinks.map((l, i) => {
                    if (l.isEllipsis) return <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    if (l.isPrev) return <PaginationItem key={`p-${i}`}><PaginationPrevious href={l.url || '#'} className={!l.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    if (l.isNext) return <PaginationItem key={`n-${i}`}><PaginationNext href={l.url || '#'} className={!l.url ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    return <PaginationItem key={`l-${i}`}>
                        <PaginationLink href={l.url || '#'} isActive={l.active} dangerouslySetInnerHTML={{ __html: l.label }} />
                    </PaginationItem>
                })}
            </PaginationContent>
        </Pagination>
    )
}

function EmptyState({ q }: { q?: string }) {
    return (
        <div className="py-16 text-center text-muted-foreground">
            <Pill className="mx-auto h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold">
                {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada obat'}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
                {q ? 'Coba kata kunci lain untuk mencari.' : 'Mulai dengan menambahkan obat baru ke inventaris.'}
            </p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700">
                <Link href={route('medicines.create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Obat
                </Link>
            </Button>
        </div>
    )
}

export function DeleteMedicineDialog({ medicine, children }: { medicine: Medicine, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(route("medicines.destroy", medicine.id), {
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
                    <DialogTitle>Hapus Obat?</DialogTitle>
                    <DialogDescription>
                        Obat <span className="font-semibold">"{medicine.name}"</span> akan dihapus secara permanen dari inventaris.
                        Tindakan ini tidak dapat dibatalkan.
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

export function MedicineTable({ medicines, q }: Props) {

    const toggleAvailability = (medicine: Medicine) => {
        router.patch(route('medicines.toggle-availability', medicine.id), {}, { preserveScroll: true })
    }

    if (medicines.data.length === 0) {
        return <EmptyState q={q} />
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[80px] pl-6">Gambar</TableHead>
                            <TableHead>Informasi Obat</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                            <TableHead className="w-[80px] text-right pr-6">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medicines.data.map((medicine) => (
                            <TableRow key={medicine.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6">
                                    <Avatar className="h-12 w-12 rounded-lg border border-slate-200">
                                        <AvatarImage src={imgUrl(medicine.image)} alt={medicine.name} className="object-cover" />
                                        <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400">IMG</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">{medicine.name}</span>
                                        <span className="text-xs text-slate-500 line-clamp-1 max-w-[400px]">
                                            {medicine.description || '-'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            medicine.is_available
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                        )}
                                    >
                                        {medicine.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('medicines.edit', medicine.id)} className="cursor-pointer">
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Detail
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleAvailability(medicine)} className="cursor-pointer">
                                                {medicine.is_available ? (
                                                    <>
                                                        <ToggleLeft className="mr-2 h-4 w-4 text-slate-500" />
                                                        Set Tidak Tersedia
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleRight className="mr-2 h-4 w-4 text-emerald-600" />
                                                        Set Tersedia
                                                    </>
                                                )}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DeleteMedicineDialog medicine={medicine}>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DeleteMedicineDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <MedicinePagination links={medicines.links} />
        </div>
    )
}
