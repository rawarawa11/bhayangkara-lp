import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { PlusCircle, Trash2 } from 'lucide-react'

type Note = { id: number; content: string; created_at: string }
type PageProps = { notes: Note[] }

export default function KnowledgeBaseIndex() {
    const { notes } = usePage<PageProps>().props

    const handleDelete = (note: Note) => {
        router.delete(route('knowledge.destroy', note.id))
    }

    return (
        <AdminLayout title="Knowledge Base">
            <Head title="Chatbot Knowledge Base" />
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chatbot Knowledge Base</h1>
                        <p className="text-muted-foreground">Daftar informasi yang digunakan oleh AI chatbot.</p>
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
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Isi Konten</TableHead>
                                    <TableHead className="w-[150px]">Ditambahkan</TableHead>
                                    <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">Belum ada pengetahuan.</TableCell>
                                    </TableRow>
                                ) : (
                                    notes.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell>
                                                <p className="font-medium line-clamp-2">{note.content}</p>
                                            </TableCell>
                                            <TableCell>{dayjs(note.created_at).format('DD MMM YYYY')}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Hapus Pengetahuan?</DialogTitle>
                                                            <DialogDescription>
                                                                Apakah Anda yakin ingin menghapus catatan ini?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                                                            <Button variant="destructive" onClick={() => handleDelete(note)}>Hapus</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
