import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
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
import { PlusCircle, MoreHorizontal, Trash2, Loader2 } from 'lucide-react'

type Note = { id: number; content: string; created_at: string }
type PageProps = { notes: Note[] }

export default function KnowledgeBaseIndex() {
    const { notes } = usePage<PageProps>().props
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const confirmDelete = (note: Note) => {
        setNoteToDelete(note)
        setDeleteOpen(true)
    }

    const handleDelete = () => {
        if (!noteToDelete) return
        setIsDeleting(true)
        router.delete(route('knowledge.destroy', noteToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false)
                setNoteToDelete(null)
                setIsDeleting(false)
            },
            onError: () => setIsDeleting(false),
        })
    }

    return (
        <AdminLayout title="Knowledge Base">
            <Head title="Chatbot Knowledge Base" />
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chatbot Knowledge Base</h1>
                        <p className="text-muted-foreground">
                            Kelola informasi dan konteks yang digunakan oleh AI chatbot.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('knowledge.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengetahuan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengetahuan</CardTitle>
                        <CardDescription>
                            Total {notes.length} catatan pengetahuan tersimpan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Isi Konten</TableHead>
                                    <TableHead className="w-[180px]">Ditambahkan</TableHead>
                                    <TableHead className="w-[80px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                            Belum ada pengetahuan yang ditambahkan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notes.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell>
                                                <p className="line-clamp-2 max-w-3xl text-sm leading-relaxed" title={note.content}>
                                                    {note.content}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                                {dayjs(note.created_at).format('DD MMM YYYY')}
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
                                                        <DropdownMenuItem
                                                            onClick={() => confirmDelete(note)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
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
                        <DialogTitle>Hapus Pengetahuan?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan dan chatbot tidak akan lagi mengetahui informasi ini.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>Batal</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
