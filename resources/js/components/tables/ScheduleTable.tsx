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
import { Badge } from '@/components/ui/badge'
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    CalendarClock,
    Stethoscope,
    Clock,
    UserRound, PlusCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Schedule, PaginatedLink, PaginatedResponse } from '@/types'

type Props = {
    schedules: PaginatedResponse<Schedule>;
    q?: string;
}


function SchedulePagination({ links }: { links: PaginatedLink[] }) {
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
                <CalendarClock className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {q ? `Tidak ada jadwal untuk "${q}"` : 'Belum ada jadwal dokter'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                {q ? 'Coba cari dengan nama dokter atau spesialis lain.' : 'Tambahkan jadwal praktik dokter untuk menampilkannya di sini.'}
            </p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Link href={route('schedules.create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Jadwal
                </Link>
            </Button>
        </div>
    )
}

function DeleteScheduleDialog({ schedule, children }: { schedule: Schedule, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(route("schedules.destroy", schedule.id), {
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
                    <DialogTitle>Hapus Jadwal?</DialogTitle>
                    <DialogDescription>
                        Anda akan menghapus jadwal praktik <strong>{schedule.doctor_name}</strong> pada hari {schedule.day}.
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

export function ScheduleTable({ schedules, q }: Props) {
    if (schedules.data.length === 0) {
        return <EmptyState q={q} />
    }

    return (
        <div className="space-y-0">
            <div className="rounded-md border border-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="pl-6 w-[250px]">Dokter</TableHead>
                            <TableHead>Spesialis</TableHead>
                            <TableHead>Hari</TableHead>
                            <TableHead>Jam Praktik</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px] text-right pr-6">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedules.data.map((schedule) => (
                            <TableRow key={schedule.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <UserRound className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">{schedule.doctor_name}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Stethoscope className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm">{schedule.specialist}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 font-medium">
                                        {schedule.day}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                            schedule.is_available
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                        )}
                                    >
                                        {schedule.is_available ? 'Hadir' : 'Cuti/Absen'}
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
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('schedules.edit', schedule.id)} className="cursor-pointer">
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Jadwal
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DeleteScheduleDialog schedule={schedule}>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DeleteScheduleDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="border-t border-slate-100 p-4">
                <SchedulePagination links={schedules.links} />
            </div>
        </div>
    )
}
