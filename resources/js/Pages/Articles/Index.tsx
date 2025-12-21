import AdminLayout from '@/components/layouts/DashboardLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search, Filter } from 'lucide-react'
import { ArticleTable } from '@/components/tables/ArticleTable'
import { InertiaPaginatedResponse, Article } from '@/types'

type ArticlesIndexPageProps = {
    articles: InertiaPaginatedResponse<Article>;
    filters: { q?: string; sort?: string };
}

export default function Index() {
    const { articles, filters } = usePage<ArticlesIndexPageProps>().props;
    const [q, setQ] = useState<string>(filters?.q ?? '')

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(
            route('articles.index'),
            { q, sort: filters?.sort ?? 'updated_desc' },
            { preserveScroll: true, preserveState: true }
        )
    }

    return (
        <AdminLayout title="Manajemen Artikel">
            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Manajemen Artikel
                        </h2>
                        <p className="text-sm text-slate-500">
                            Kelola, sunting, dan terbitkan artikel berita kesehatan RS Bhayangkara.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                        <Link href={route('articles.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Buat Artikel Baru
                        </Link>
                    </Button>
                </div>

                <Card className="border border-slate-200 overflow-hidden shadow-none bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
                        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari judul artikel..."
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="border-slate-300 text-slate-600">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardHeader>

                    <CardContent className="px-6">
                        <ArticleTable articles={articles} q={q} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
