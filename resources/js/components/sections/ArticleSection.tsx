import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FileText, Calendar, ArrowRight } from 'lucide-react'

type ArticleSummary = {
    id: number
    title: string
    slug: string
    image: string | null
    published_at: string
    meta_title?: string | null
    excerpt?: string // Added excerpt field
}

// Professional image handling with fallback
const getImageUrl = (path: string | null) =>
    path ? `/storage/${path}` : '/images/placeholder-news.jpg'

export default function ArticlesSection({ articles }: { articles: ArticleSummary[] }) {
    const hasArticles = articles && articles.length > 0

    return (
        <section className="bg-white py-16 lg:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                {/* Section Header - More professional styling */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Berita & Artikel Terkini
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Informasi terbaru dan perkembangan terkini dari RS Bhayangkara Polri Banda Aceh
                    </p>
                </div>

                {/* Articles Grid */}
                {hasArticles ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Card
                                key={article.id}
                                className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-100"
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <AspectRatio ratio={16 / 9}>
                                        <img
                                            src={getImageUrl(article.image)}
                                            alt={article.meta_title || article.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </AspectRatio>
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <CardHeader className="space-y-3 pb-4">
                                    {/* Date with icon */}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {dayjs(article.published_at).format('DD MMMM YYYY')}
                                    </div>

                                    {/* Article Title */}
                                    <CardTitle className="line-clamp-2 text-lg font-semibold leading-7 text-gray-900 group-hover:text-blue-600 transition-colors">
                                        <Link
                                            href={route('articles.public.show', article.slug)}
                                            className="hover:no-underline"
                                        >
                                            {article.title}
                                        </Link>
                                    </CardTitle>

                                    {/* Excerpt - First two lines of content */}
                                    {article.excerpt && (
                                        <CardDescription className="line-clamp-2 text-sm leading-6 text-gray-600 mt-2">
                                            {article.excerpt}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="group/btn px-0 font-medium text-blue-600 hover:text-blue-700 hover:bg-transparent"
                                    >
                                        <Link
                                            href={route('articles.public.show', article.slug)}
                                            className="flex items-center gap-1"
                                        >
                                            Baca Selengkapnya
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Enhanced Empty State */
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <FileText className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-6 text-xl font-semibold text-gray-900">
                            Belum Ada Artikel Terbaru
                        </h3>
                        <p className="mt-3 text-gray-600 max-w-md mx-auto">
                            Kami sedang mempersiapkan informasi dan berita terbaru untuk Anda.
                            Silakan kunjungi kembali halaman ini untuk update terkini.
                        </p>
                    </div>
                )}

                {/* View All Button - Centered */}
                {hasArticles && (
                    <div className="mt-12 text-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                        >
                            <Link href={route('articles.public.index')} className="flex items-center gap-2">
                                Lihat Semua Artikel
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
