import { Head, Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Article, User } from '@/types'

import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Clock, Mail, MessageCircle, Twitter } from 'lucide-react'

type ArticleWithUser = Article & {
    user: User | null;
}

type Props = {
    article: ArticleWithUser;
    recommendedArticles: Article[];
}

// --- Helper Functions ---
const imgUrl = (path: string | null) => (path ? `/storage/${path}` : 'https://placehold.co/1200x630/e2e8f0/64748b?text=Berita')
const clean = (html: string) => html?.replace(/<[^>]+>/g, '') ?? ''
const snip = (t: string, n: number) => (t.length <= n ? t : t.slice(0, n) + '…')

// --- Styling Prose (Sama seperti sebelumnya, ini sudah bagus) ---
const proseStyles = `
.prose-styling p { margin-bottom: 1.25em; line-height: 1.7; font-size: 1.125rem; }
.prose-styling h2, .prose-styling h3, .prose-styling h4 { font-weight: 700; margin-top: 2em; margin-bottom: 1em; }
.prose-styling h2 { font-size: 1.875rem; } .prose-styling h3 { font-size: 1.5rem; } .prose-styling h4 { font-size: 1.25rem; }
.prose-styling ul, .prose-styling ol { margin-left: 1.5em; margin-bottom: 1.25em; font-size: 1.125rem; }
.prose-styling ul { list-style-type: disc; } .prose-styling ol { list-style-type: decimal; }
.prose-styling a { color: #2563eb; text-decoration: underline; }
.prose-styling blockquote { border-left: 4px solid #e2e8f0; padding-left: 1em; font-style: italic; color: #64748b; }
.prose-styling img { border-radius: 0.5rem; margin-top: 2em; margin-bottom: 2em; }
`

// --- Komponen Kartu Rekomendasi (Sub-Komponen) ---
function RecommendedArticleCard({ article }: { article: Article }) {
    return (
        <Link href={route('articles.public.show', article.slug)} className="group space-y-3">
            <AspectRatio ratio={16 / 9}>
                <img
                    src={imgUrl(article.image)}
                    alt={article.title}
                    className="h-full w-full object-cover rounded-lg transition-transform group-hover:scale-105"
                />
            </AspectRatio>
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600">
                {article.title}
            </h3>
            <p className="text-sm text-muted-foreground">
                {dayjs(article.published_at).format('DD MMMM YYYY')}
            </p>
        </Link>
    )
}

// --- Komponen Halaman Utama ---
export default function ArticleShow() {
    const { article, recommendedArticles } = usePage<Props>().props

    // --- Data SEO ---
    const pageTitle = article.meta_title || article.title
    const pageDescription = article.meta_description || snip(clean(article.body), 155)
    const pageImage = imgUrl(article.image)
    const pageUrl = route('articles.public.show', article.slug)

    // --- JSON-LD (Sama seperti sebelumnya, ini sudah bagus) ---
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
            'logo': { '@type': 'ImageObject', 'url': '/logo.png' },
        },
        'description': pageDescription,
    }
    // --- Akhir Data SEO ---

    return (
        <>
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
                <meta property="twitter:url" content={pageUrl} />
                <meta property="twitter:title" content={pageTitle} />
                <meta property="twitter:description" content={pageDescription} />
                <meta property="twitter:image" content={pageImage} />
                <script type={"application/ld+json"}>{JSON.stringify(articleSchema)}</script>
                <style dangerouslySetInnerHTML={{ __html: proseStyles }} />
            </Head>

            <Navbar />

            <main className="bg-white">
                <div className="container mx-auto max-w-4xl px-4 py-12">

                    {/* --- HEADER ARTIKEL --- */}
                    <article className="max-w-3xl mx-auto">
                        <header className="space-y-6">
                            {/* 1. Tags */}
                            <div className="flex flex-wrap gap-2">
                                {article.tags && article.tags.length > 0 && (
                                    article.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-sm">
                                            {tag}
                                        </Badge>
                                    ))
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                                {article.title}
                            </h1>

                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={article.user?.profile_photo_url} alt={article.user?.name} />
                                    <AvatarFallback>{article.user?.name.substring(0, 2) ?? 'RS'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {article.user?.name ?? 'Tim RS Bhayangkara'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Dipublikasikan pada {dayjs(article.published_at).format('DD MMMM YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <span className="text-sm font-semibold text-muted-foreground">Bagikan:</span>
                                <Button asChild variant="outline" size="icon">
                                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="icon">
                                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="icon">
                                    <a href={`mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </header>

                        <figure className="my-8">
                            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border">
                                <img
                                    src={imgUrl(article.image)}
                                    alt={article.title}
                                    className="h-full w-full object-cover"
                                />
                            </AspectRatio>
                            <figcaption className="text-center text-sm text-muted-foreground mt-2">
                                {article.meta_title}
                            </figcaption>
                        </figure>

                        <div
                            className="prose-styling"
                            dangerouslySetInnerHTML={{ __html: article.body }}
                        />

                    </article>

                    <Separator className="my-16" />
                    {recommendedArticles && recommendedArticles.length > 0 && (
                        <section className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8">Baca Juga</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {recommendedArticles.map(recArticle => (
                                    <RecommendedArticleCard key={recArticle.id} article={recArticle} />
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </main>

            <Footer />
        </>
    )
}
