import AdminLayout from '@/components/layouts/DashboardLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlusCircle } from 'lucide-react'
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
            <div className="container max-w-full p-6">
                <Card className="shadow-none">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Manajemen Artikel</CardTitle>
                                <CardDescription>
                                    Buat, edit, dan kelola semua artikel di sini.
                                </CardDescription>
                            </div>
                            <Button asChild>
                                <Link
                                    href={route('articles.create')}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Buat Artikel Baru
                                </Link>
                            </Button>
                        </div>

                        <form onSubmit={onSearch} className="flex w-full gap-2 pt-4">
                            <Input
                                placeholder="Cari artikel berdasarkan judul..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            <Button type="submit">Cari</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <ArticleTable articles={articles} q={q} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
