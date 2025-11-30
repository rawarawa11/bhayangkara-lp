import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2, CalendarClock } from 'lucide-react'

// Adjust type based on your API response
type Schedule = {
    id: number;
    doctor_name: string;
    specialist: string;
    day: string;
    time_start: string;
    time_end: string;
    is_available: boolean;
}

type PageProps = { schedules: { data: Schedule[], meta?: any } }

export default function ScheduleIndex() {
    const { schedules } = usePage<PageProps>().props
    const scheduleList = schedules.data || []

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Schedule | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const confirmDelete = (item: Schedule) => {
        setItemToDelete(item)
        setDeleteOpen(true)
    }

    const handleDelete = () => {
        if (!itemToDelete) return

        setIsDeleting(true)
        router.delete(route('schedules.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false)
                setItemToDelete(null)
                setIsDeleting(false)
            },
            onError: () => setIsDeleting(false),
        })
    }

    return (
        <AdminLayout title="Jadwal Dokter">
            <Head title="Jadwal Dokter" />
            <div className="container mx-auto p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Jadwal Dokter</h1>
                        <p className="text-muted-foreground">
                            Atur jadwal praktik dokter spesialis.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('schedules.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jadwal</CardTitle>
                        <CardDescription>
                            Total {scheduleList.length} jadwal terdaftar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Dokter</TableHead>
                                    <TableHead>Spesialis</TableHead>
                                    <TableHead>Hari</TableHead>
                                    <TableHead>Jam Praktik</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduleList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Belum ada jadwal dokter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scheduleList.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.doctor_name}
                                            </TableCell>
                                            <TableCell>{item.specialist}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.day}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.time_start} - {item.time_end}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.is_available ? 'default' : 'secondary'} className={item.is_available ? 'bg-green-600' : 'bg-gray-400'}>
                                                    {item.is_available ? 'Hadir' : 'Cuti/Absen'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('schedules.edit', item.id)}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => confirmDelete(item)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Jadwal?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus jadwal untuk <strong>{itemToDelete?.doctor_name}</strong> pada hari {itemToDelete?.day}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>Batal</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
