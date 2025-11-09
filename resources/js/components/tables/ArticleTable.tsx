import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Article, InertiaPaginatedResponse, PaginatedLink } from '@/types' // Asumsi dari @/types/index.ts
import { Button } from '@/components/ui/button'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, Trash2, FileText, PlusCircle, Loader2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'

const imgUrl = (path: string | null) => (path ? `/storage/${path}` : 'https://placehold.co/100x100/e2e8f0/64748b?text=')

type Props = {
    articles: InertiaPaginatedResponse<Article>;
    q?: string;
}

/**
 * Komponen Paginasi
 * (Tidak ada perubahan, sudah baik)
 */
function ArticlePagination({ links }: { links: PaginatedLink[] }) {
    const mappedLinks = useMemo(() => {
        return links.map((l) => ({
            ...l,
            isPrev: /«|&laquo;|Previous/i.test(l.label),
            isNext: /»|&raquo;|Next/i.test(l.label),
            isEllipsis: l.url === null && /\.\.\./.test(l.label),
        }))
    }, [links])

    return (
        <Pagination className="mt-6">
            <PaginationContent>
                {mappedLinks.map((l, i) => {
                    if (l.isEllipsis) return <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    if (l.isPrev) return <PaginationItem key={`p-${i}`}><PaginationPrevious><Link href={l.url ?? '#'} preserveScroll preserveState /></PaginationPrevious></PaginationItem>
                    if (l.isNext) return <PaginationItem key={`n-${i}`}><PaginationNext ><Link href={l.url ?? '#'} preserveScroll preserveState /></PaginationNext></PaginationItem>
                    return <PaginationItem key={`l-${i}`}><PaginationLink isActive={l.active}><Link href={l.url ?? '#'} preserveScroll preserveState dangerouslySetInnerHTML={{ __html: l.label }} /></PaginationLink></PaginationItem>
                })}
            </PaginationContent>
        </Pagination>
    )
}

function EmptyState({ q }: { q?: string }) {
    return (
        <div className="py-16 text-center text-muted-foreground">
            <FileText className="mx-auto h-16 w-16" />
            <h3 className="mt-4 text-lg font-semibold">
                {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada artikel'}
            </h3>
            <p className="mt-2 text-sm">
                {q ? 'Coba kata kunci lain untuk mencari.' : 'Mulai dengan membuat artikel baru.'}
            </p>
            <Button asChild className="mt-6">
                <Link href={route('articles.create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Artikel Baru
                </Link>
            </Button>
        </div>
    )
}

export function DeleteArticleDialog({ article, children }: { article: Article, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleting(true)
        router.delete(route("articles.destroy", article.id), {
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
                    <DialogTitle>Hapus Artikel?</DialogTitle>
                    <DialogDescription>
                        Artikel <span className="font-semibold">"{article.title}"</span> akan dihapus secara permanen.
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
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
    )
}

export function ArticleTable({ articles, q }: Props) {

    if (articles.data.length === 0) {
        return <EmptyState q={q} />
    }

    return (
        <div className="space-y-6">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dipublikasikan</TableHead>
                            <TableHead className="w-[50px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.data.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell>
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage src={imgUrl(article.image)} className="object-cover" />
                                        <AvatarFallback className="rounded-md">!</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell>
                                    <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                                        {article.status === 'published' ? 'Diterbitkan' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {article.published_at
                                        ? dayjs(article.published_at).format('DD MMM YYYY')
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={route('articles.edit', article.id)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DeleteArticleDialog article={article}>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()} className={cn("text-red-500", "focus:bg-red-50 focus:text-red-600")}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DeleteArticleDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <ArticlePagination links={articles.meta?.links ?? articles.links ?? []} />
        </div>
    )
}
