import { Head, Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'
import GuestLayout from '@/components/layouts/GuestLayout'
import { Article, User } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Clock,
    Mail,
    MessageCircle,
    Twitter,
    CalendarDays,
    Share2,
    Tag,
    UserRound,
    ArrowLeft
} from 'lucide-react'

dayjs.locale('id')
dayjs.extend(relativeTime)

type ArticleWithUser = Article & {
    user: User | null;
}

type Props = {
    article: ArticleWithUser;
    recommendedArticles: Article[];
}

const imgUrl = (path: string | null) => (path ? `/storage/${path}` : 'https://placehold.co/1200x630/f1f5f9/94a3b8?text=News')
const clean = (html: string) => html?.replace(/<[^>]+>/g, '') ?? ''
const snip = (t: string, n: number) => (t.length <= n ? t : t.slice(0, n) + '…')

const proseStyles = `
    .prose-styling {
        color: #334155;
        font-size: 1.125rem;
        line-height: 1.7;
    }

    .prose-styling p,
    .prose-styling ul,
    .prose-styling ol,
    .prose-styling blockquote {
        margin-bottom: 1.5em;
        margin-top: 0;
    }

    .prose-styling h2 {
        font-weight: 700;
        font-size: 1.75rem;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        color: #0f172a;
        line-height: 1.3;
    }

    .prose-styling h3 {
        font-weight: 600;
        font-size: 1.5rem;
        margin-top: 1em;
        margin-bottom: 0.5em;
        color: #1e293b;
    }

    .prose-styling ul,
    .prose-styling ol {
        padding-left: 1.5em;
    }
    .prose-styling ul { list-style-type: disc; }
    .prose-styling ol { list-style-type: decimal; }

    .prose-styling li {
        margin-bottom: 0.25em; /* Tighter spacing between items */
        padding-left: 0.25em;
    }

    .prose-styling li p {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }

    .prose-styling a {
        color: #2563eb;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s;
    }
    .prose-styling a:hover { color: #1d4ed8; }

    .prose-styling blockquote {
        border-left: 4px solid #cbd5e1;
        padding-left: 1.25em;
        font-style: italic;
        color: #64748b;
        background: #f8fafc;
        padding-top: 1em;
        padding-bottom: 1em;
        border-radius: 0 0.5rem 0.5rem 0;
    }

    /* Images */
    .prose-styling img {
        border-radius: 0.5rem;
        margin-top: 2em;
        margin-bottom: 2em;
        width: 100%;
        height: auto;
        border: 1px solid #e2e8f0;
    }
`

function RecommendedArticleCard({ article }: { article: Article }) {
    return (
        <Link href={route('articles.public.show', article.slug)} className="group flex items-start gap-4 px-4 py-2 hover:bg-slate-50 transition-colors border border-transparent">
            <div className="shrink-0 w-24 h-24 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <img
                    src={imgUrl(article.image)}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {dayjs(article.published_at).format('DD MMM YYYY')}
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-xs text-slate-500 pt-2 line-clamp-2">{snip(clean(article.body), 100)}</p>
            </div>
        </Link>
    )
}

export default function ArticleShow() {
    const { article, recommendedArticles } = usePage<Props>().props
    const pageTitle = article.meta_title || article.title
    const pageDescription = article.meta_description || snip(clean(article.body), 155)
    const pageImage = imgUrl(article.image)
    const pageUrl = route('articles.public.show', article.slug)
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'mainEntityOfPage': { '@type': 'WebPage', '@id': pageUrl },
        'headline': pageTitle,
        'image': pageImage,
        'datePublished': dayjs(article.published_at).toISOString(),
        'dateModified': dayjs(article.updated_at).toISOString(),
        'author': {
            '@type': 'Person',
            'name': article.user?.name ?? 'Tim RS Bhayangkara',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'RS Bhayangkara Banda Aceh',
            'logo': { '@type': 'ImageObject', 'url': '/images/logo-rs.png' },
        },
        'description': pageDescription,
    }

    return (
        <GuestLayout>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={pageUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />
                <meta property="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
                <style dangerouslySetInnerHTML={{ __html: proseStyles }} />
            </Head>

            <div className="min-h-screen bg-slate-50">
                <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
                    <div className="container mx-auto max-w-7xl px-4 h-14 flex items-center">
                        <Link
                            href={route('articles.public.index')}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Indeks Berita
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <article className="lg:col-span-8">
                            <header className="mb-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {article.tags && article.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-medium">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] mb-6">
                                    {article.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-slate-200">
                                            <AvatarImage src={article.user?.profile_photo_url} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600">
                                                <UserRound className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{article.user?.name ?? 'Redaksi'}</div>
                                            <div className="text-xs text-slate-500">Penulis</div>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">
                                            {dayjs(article.published_at).format('dddd, DD MMMM YYYY')}
                                        </span>
                                    </div>
                                </div>
                            </header>

                            <div className="rounded-xl overflow-hidden shadow-none border border-slate-200 mb-10">
                                <img
                                    src={imgUrl(article.image)}
                                    alt={article.title}
                                    className="w-full h-auto object-cover max-h-[500px]"
                                />
                                {article.meta_title && (
                                    <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 text-center border-t border-slate-200 italic">
                                        {article.meta_title}
                                    </div>
                                )}
                            </div>
                            <div className="bg-white rounded-xl shadow-none border border-slate-200 p-6 md:p-10 lg:p-12">
                                <div
                                    className="prose-styling"
                                    dangerouslySetInnerHTML={{ __html: article.body }}
                                />
                            </div>
                        </article>
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="sticky top-32 space-y-8">
                                <Card className="border-slate-200 shadow-none overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 py-3">
                                        <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <Share2 className="w-4 h-4 text-blue-600" />
                                            Bagikan Artikel
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 grid grid-cols-1 gap-2">
                                        <Button asChild variant="outline" className="justify-start border-slate-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50">
                                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`} target="_blank">
                                                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline" className="justify-start border-slate-200 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50">
                                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`} target="_blank">
                                                <Twitter className="w-4 h-4 mr-2" /> Twitter / X
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                                {recommendedArticles.length > 0 && (
                                    <Card className="border-slate-200 shadow-none overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                                            <CardTitle className="text-sm font-bold text-slate-800">
                                                Baca Juga
                                            </CardTitle>
                                        </CardHeader>
                                        <div className="divide-y divide-slate-100">
                                            {recommendedArticles.map(rec => (
                                                <RecommendedArticleCard key={rec.id} article={rec} />
                                            ))}
                                        </div>
                                    </Card>
                                )}
                                {article.tags && article.tags.length > 0 && (
                                    <Card className="border-slate-200 shadow-none overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                                            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                Topik Terkait
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {article.tags.map(tag => (
                                                    <Link
                                                        key={tag}
                                                        href={route('articles.public.index', { q: tag })}
                                                        className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all"
                                                    >
                                                        {tag}
                                                    </Link>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
