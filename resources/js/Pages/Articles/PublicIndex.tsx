import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination'
import { Search, CalendarDays, ArrowRight, FileText, Filter, Clock } from 'lucide-react'
import GuestLayout from '@/components/layouts/GuestLayout'
dayjs.locale('id')
dayjs.extend(relativeTime)

type Article = {
    id: number
    title: string
    slug: string
    body: string
    image: string | null
    tags: string[] | null
    published_at: string
    user?: { name: string }
}

type PaginatedLinks = {
    url: string | null
    label: string
    active: boolean
}

type PageProps = {
    articles: {
        data: Article[]
        links: PaginatedLinks[]
        current_page: number
        last_page: number
        total: number
    }
    filters: {
        q?: string
        sort?: string
    }
}

const imgUrl = (path: string | null) =>
    path ? `/storage/${path}` : 'https://placehold.co/800x600/f1f5f9/94a3b8?text=News'

const getExcerpt = (html: string, limit = 100) => {
    const text = html.replace(/<[^>]+>/g, '')
    return text.length > limit ? text.substring(0, limit) + '...' : text
}

export default function PublicIndex() {
    const { articles, filters } = usePage<PageProps>().props
    const [searchQuery, setSearchQuery] = useState(filters.q || '')
    const [sortBy, setSortBy] = useState(filters.sort || 'published_at_desc')

    // Logic to split Featured Article vs Standard List
    const isFirstPage = articles.current_page === 1
    const hasData = articles.data.length > 0
    const featuredArticle = (isFirstPage && hasData && !filters.q) ? articles.data[0] : null
    const gridArticles = (isFirstPage && hasData && !filters.q) ? articles.data.slice(1) : articles.data

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilters()
    }

    const applyFilters = (newSort?: string) => {
        router.get(
            route('articles.public.index'),
            {
                q: searchQuery,
                sort: newSort || sortBy
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        )
    }

    return (
        <GuestLayout>
            <Head title="Berita & Artikel Kesehatan" />

            <div className="min-h-screen bg-slate-50">
                <div className="bg-slate-900 text-white pt-20 pb-32">
                    <div className="container mx-auto max-w-7xl px-4 text-center">
                        <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">
                            Pusat Informasi
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Berita & Artikel Kesehatan
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Akses informasi terkini seputar layanan RS Bhayangkara, agenda kegiatan, serta artikel edukasi kesehatan yang terpercaya.
                        </p>
                    </div>
                </div>

                <div className="-mt-8 max-w-7xl mx-auto mb-8 relative z-10">
                    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
                        <form onSubmit={handleSearch} className="relative w-full flex-grow">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Cari artikel atau topik kesehatan..."
                                className="pl-10 h-12 border-slate-200 bg-slate-50 focus:bg-white text-base focus-visible:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <div className="w-full md:w-auto flex-shrink-0">
                            <Select
                                value={sortBy}
                                onValueChange={(val) => {
                                    setSortBy(val)
                                    applyFilters(val)
                                }}
                            >
                                <SelectTrigger className="w-full md:w-[200px] h-12 border-slate-200 focus:ring-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500" />
                                        <SelectValue placeholder="Urutkan" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published_at_desc">Terbaru</SelectItem>
                                    <SelectItem value="published_at_asc">Terlama</SelectItem>
                                    <SelectItem value="title_asc">Judul (A-Z)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-8">
                    {featuredArticle && (
                        <div className="mb-16 group relative bg-white border border-slate-200 rounded-lg overflow-hidden shadow-none hover:border-blue-200 transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden">
                                    <img
                                        src={imgUrl(featuredArticle.image)}
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                                </div>
                                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md px-2 py-0.5 text-xs font-semibold">
                                            Utama
                                        </Badge>
                                        <span className="text-slate-400 text-xs flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dayjs(featuredArticle.published_at).format('DD MMM YYYY')}
                                        </span>
                                    </div>
                                    <Link href={route('articles.public.show', featuredArticle.slug)}>
                                        <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-700 transition-colors">
                                            {featuredArticle.title}
                                        </h2>
                                    </Link>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
                                        {getExcerpt(featuredArticle.body, 200)}
                                    </p>
                                    <Button asChild variant="outline" size="sm" className="w-fit border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-300">
                                        <Link href={route('articles.public.show', featuredArticle.slug)}>
                                            Baca Selengkapnya <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-bold">
                            <h2 className="text-2xl font-bold text-slate-900">Berita & Artikel Terbaru</h2>
                            <p className="text-lg font-normal text-slate-500">
                                Artikel dan informasi terkini dari RS Bhayangkara.
                            </p>
                        </span>
                        <p className="text-sm text-slate-500">
                            {articles.total} artikel terbaru
                        </p>
                    </div>

                    {gridArticles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridArticles.map((article) => (
                                <article
                                    key={article.id}
                                    className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-200 transition-colors"
                                >
                                    <Link href={route('articles.public.show', article.slug)} className="block aspect-[16/9] overflow-hidden relative bg-slate-100">
                                        <img
                                            src={imgUrl(article.image)}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </Link>

                                    <div className="flex flex-col flex-grow p-5">
                                        <div className="flex items-center justify-between gap-2 mb-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5 font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                <CalendarDays className="h-3 w-3" />
                                                {dayjs(article.published_at).format('DD MMM YYYY')}
                                            </span>
                                            {article.tags && article.tags.length > 0 && (
                                                <span className="truncate max-w-[100px] text-slate-400">
                                                    #{article.tags[0]}
                                                </span>
                                            )}
                                        </div>

                                        <Link href={route('articles.public.show', article.slug)} className="mb-2 block">
                                            <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </Link>

                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                            {getExcerpt(article.body)}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-100">
                                            <Link
                                                href={route('articles.public.show', article.slug)}
                                                className="inline-flex items-center text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors"
                                            >
                                                Baca Artikel <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        !featuredArticle && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center">
                                <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <FileText className="h-7 w-7 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Belum ada artikel</h3>
                                <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
                                    {filters.q
                                        ? `Pencarian untuk "${filters.q}" tidak memberikan hasil.`
                                        : "Saat ini belum ada berita yang dipublikasikan."}
                                </p>
                                {filters.q && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-5 border-slate-300 text-slate-700"
                                        onClick={() => {
                                            setSearchQuery('')
                                            router.get(route('articles.public.index'))
                                        }}
                                    >
                                        Reset Pencarian
                                    </Button>
                                )}
                            </div>
                        )
                    )}

                    {articles.links && articles.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    {articles.links.map((link, i) => {
                                        if (link.url === null && link.label === '...') {
                                            return <PaginationItem key={i}><PaginationEllipsis /></PaginationItem>
                                        }
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationPrevious
                                                        href={link.url || '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            )
                                        }
                                        if (link.label.includes('Next')) {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationNext
                                                        href={link.url || '#'}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            )
                                        }
                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href={link.url || '#'}
                                                    isActive={link.active}
                                                >
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                </div>
            </div>
        </GuestLayout>
    )
}
