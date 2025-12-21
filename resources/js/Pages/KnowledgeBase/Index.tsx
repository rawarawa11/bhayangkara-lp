import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlusCircle, BookOpen, Search } from 'lucide-react'
import { KnowledgeBaseTable, Note } from '@/components/tables/KnowledgeBaseTable'

type PageProps = {
    notes: Note[];
    filters: { q?: string };
}

export default function KnowledgeBaseIndex() {
    const { notes, filters } = usePage<PageProps>().props

    const [q, setQ] = useState(filters.q || '')

    const doSearch = () => {
        router.get(
            route('knowledge.index'),
            { q },
            { preserveState: true, replace: true }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') doSearch()
    }

    return (
        <AdminLayout title="Knowledge Base">
            <Head title="Chatbot Knowledge Base" />

            <div className="p-6 space-y-6 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            Knowledge Base
                        </h2>
                        <p className="text-sm text-slate-500">
                            Kelola data dan konteks yang digunakan oleh AI Chatbot.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-none">
                        <Link href={route('knowledge.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Data
                        </Link>
                    </Button>
                </div>

                <Card className="border border-slate-200 shadow-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari konten pengetahuan..."
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <Button variant="secondary" onClick={doSearch}>
                                Cari
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6">
                        <KnowledgeBaseTable notes={notes} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
