import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Trash2, Loader2, Brain, PlusCircle, Pencil } from 'lucide-react'

export type Note = {
    id: number;
    content: string;
    created_at: string
}

type Props = {
    notes: Note[];
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                <Brain className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Belum ada data pengetahuan
            </h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                Tambahkan informasi agar AI Chatbot dapat menjawab pertanyaan pasien dengan akurat.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-none">
                <Link href={route('knowledge.create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Pengetahuan Pertama
                </Link>
            </Button>
        </div>
    )
}

function DeleteNoteDialog({ note, children }: { note: Note, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(route("knowledge.destroy", note.id), {
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
                    <DialogTitle>Hapus Pengetahuan?</DialogTitle>
                    <DialogDescription>
                        Data ini akan dihapus permanen. Chatbot tidak akan bisa lagi menjawab pertanyaan terkait informasi ini.
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

export function KnowledgeBaseTable({ notes }: Props) {
    if (notes.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="rounded-md border border-slate-200">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="pl-6">Isi Konten</TableHead>
                        <TableHead className="w-[180px]">Ditambahkan</TableHead>
                        <TableHead className="w-[80px] text-right pr-6">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notes.map((note) => (
                        <TableRow key={note.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="pl-6 py-4">
                                <p className="line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-700" title={note.content}>
                                    {note.content}
                                </p>
                            </TableCell>
                            <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                                {dayjs(note.created_at).format('DD MMM YYYY')}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('knowledge.edit', note.id)}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DeleteNoteDialog note={note}>
                                            <DropdownMenuItem
                                                onSelect={(e) => e.preventDefault()}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                            </DropdownMenuItem>
                                        </DeleteNoteDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
