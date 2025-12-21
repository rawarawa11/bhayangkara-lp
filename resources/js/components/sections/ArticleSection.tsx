import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { CalendarDays, ArrowRight, FileText, Clock } from 'lucide-react'

dayjs.locale('id')
dayjs.extend(relativeTime)

type ArticleSummary = {
    id: number
    title: string
    slug: string
    image: string | null
    published_at: string
    meta_title?: string | null
    body?: string
}

const getImageUrl = (path: string | null) =>
    path ? `/storage/${path}` : 'https://placehold.co/800x600/f1f5f9/94a3b8?text=News'

const getExcerpt = (html: string = '', limit = 100) => {
    const text = html.replace(/<[^>]+>/g, '')
    return text.length > limit ? text.substring(0, limit) + '...' : text
}

export default function ArticlesSection({ articles }: { articles: ArticleSummary[] }) {
    const hasArticles = articles && articles.length > 0

    return (
        <section className="bg-slate-50 py-20 lg:py-28 border-t border-slate-200">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                            Informasi Terkini
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Berita & Artikel Kesehatan
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                            Dapatkan update terbaru seputar layanan RS Bhayangkara, agenda kegiatan, serta artikel edukasi kesehatan yang terpercaya.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="hidden md:inline-flex border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-white hover:border-blue-200"
                    >
                        <Link href={route('articles.public.index')} className="group">
                            Lihat Semua Berita
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {hasArticles ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <article
                                key={article.id}
                                className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <Link href={route('articles.public.show', article.slug)} className="block aspect-[16/9] overflow-hidden relative bg-slate-100">
                                    <img
                                        src={getImageUrl(article.image)}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                </Link>

                                <div className="flex flex-col flex-grow p-6">
                                    <div className="flex items-center justify-between gap-2 mb-3 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {dayjs(article.published_at).format('DD MMM YYYY')}
                                        </span>
                                        <span className="flex items-center gap-1 text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            {dayjs(article.published_at).fromNow(true)} yang lalu
                                        </span>
                                    </div>

                                    <Link href={route('articles.public.show', article.slug)} className="mb-3 block">
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                                        {article.body
                                            ? getExcerpt(article.body, 120)
                                            : (article.meta_title || "Baca selengkapnya untuk informasi lebih lanjut.")}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <Link
                                            href={route('articles.public.show', article.slug)}
                                            className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                                        >
                                            Baca Artikel <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-200 text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">
                            Belum Ada Berita Terbaru
                        </h3>
                        <p className="mt-2 text-slate-500 max-w-md mx-auto leading-relaxed">
                            Tim kami sedang menyiapkan informasi terkini untuk Anda.
                            Silakan kunjungi kembali halaman ini dalam waktu dekat.
                        </p>
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-300"
                    >
                        <Link href={route('articles.public.index')}>
                            Lihat Semua Berita
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
