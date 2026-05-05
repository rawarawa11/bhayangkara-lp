import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import {
    ArrowLeft,
    Loader2,
    Save,
    Brain,
    Info,
    BookOpen,
    Lightbulb,
    CheckCircle2,
    Clock,
} from 'lucide-react'

type Note = {
    id: number
    content: string
    created_at: string
    updated_at: string
}

type PageProps = {
    note: Note
    errors: Record<string, string>
}

const tips = [
    'Gunakan kalimat yang jelas dan lengkap, bukan poin-poin singkat.',
    'Satu catatan = satu topik (misal: jam besuk, biaya MCU, cara daftar).',
    'Semakin detail informasinya, semakin akurat jawaban chatbot.',
    'Gunakan angka dan fakta nyata agar tidak menyesatkan pengguna.',
]

export default function KnowledgeBaseEdit() {
    const { note, errors: pageErrors } = usePage<PageProps>().props

    const { data, setData, put, processing, errors, isDirty } = useForm({
        content: note.content,
    })

    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
    const charCount = data.content.length

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route('knowledge.update', note.id))
    }

    return (
        <AdminLayout title="Edit Pengetahuan">
            <Head title="Edit Pengetahuan" />

            <form onSubmit={submit} className="flex flex-col min-h-[calc(100vh-4rem)]">

                {/* Sticky top bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/80 px-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('knowledge.index')}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-slate-500")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Edit Pengetahuan</h1>
                            <p className="text-xs text-slate-500">
                                ID #{note.id} · Dibuat {dayjs(note.created_at).format('DD MMM YYYY')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('knowledge.index')}>Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.content.length < 30 || !isDirty}
                            className="bg-blue-600 hover:bg-blue-700 min-w-[160px]"
                        >
                            {processing
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan…</>
                                : <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                            }
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 bg-slate-50/50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                        {/* Main column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* API error alert */}
                            {pageErrors.api_error && (
                                <Alert variant="destructive">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Gagal Menyimpan</AlertTitle>
                                    <AlertDescription>{pageErrors.api_error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Dirty / unsaved changes notice */}
                            {isDirty && (
                                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                                    <Info className="h-4 w-4 text-amber-600" />
                                    <AlertTitle className="text-amber-800">Ada perubahan belum disimpan</AlertTitle>
                                    <AlertDescription className="text-amber-700">
                                        Embedding AI akan diperbarui otomatis saat Anda menyimpan.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-blue-600" />
                                        Isi Pengetahuan
                                    </CardTitle>
                                    <CardDescription>
                                        Edit informasi yang digunakan chatbot. Embedding AI akan diperbarui saat disimpan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="content">
                                            Informasi / Catatan <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Tulis informasi detail yang akan dipelajari chatbot…"
                                            rows={16}
                                            className={cn(
                                                "resize-none leading-relaxed text-sm",
                                                errors.content && "border-red-400 focus-visible:ring-red-400"
                                            )}
                                            autoFocus
                                        />

                                        {/* Character / word count */}
                                        <div className="flex items-center justify-between">
                                            {errors.content ? (
                                                <p className="text-sm text-red-500">{errors.content}</p>
                                            ) : (
                                                <p className="text-xs text-slate-400">Minimal 30 karakter.</p>
                                            )}
                                            <p className={cn(
                                                "text-xs tabular-nums font-medium",
                                                charCount < 30 ? "text-slate-400" : "text-emerald-600"
                                            )}>
                                                {wordCount} kata · {charCount} karakter
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Status card */}
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-slate-500" />
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    {/* Content length indicator */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                                        <div className={cn(
                                            "h-2.5 w-2.5 rounded-full shrink-0",
                                            charCount >= 30 ? "bg-emerald-500" : "bg-slate-300"
                                        )} />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-700">Panjang konten</p>
                                            <p className="text-[10px] text-slate-400">
                                                {charCount >= 30
                                                    ? `${charCount} karakter — memenuhi syarat`
                                                    : `Perlu ${30 - charCount} karakter lagi`}
                                            </p>
                                        </div>
                                        {charCount >= 30 && (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        )}
                                    </div>

                                    {/* Dirty indicator */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                                        <div className={cn(
                                            "h-2.5 w-2.5 rounded-full shrink-0 transition-colors",
                                            isDirty ? "bg-amber-400" : "bg-slate-200"
                                        )} />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-700">Perubahan</p>
                                            <p className="text-[10px] text-slate-400">
                                                {isDirty ? "Ada perubahan belum disimpan" : "Tidak ada perubahan"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Embedding */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                                        <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-700">Embedding AI</p>
                                            <p className="text-[10px] text-slate-400">
                                                {isDirty
                                                    ? "Akan diperbarui saat disimpan"
                                                    : "Sudah ter-embed oleh Gemini"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timestamps card */}
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        Riwayat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-slate-500 text-xs font-medium">Dibuat</span>
                                        <span className="text-slate-800 text-xs font-semibold">
                                            {dayjs(note.created_at).format('DD MMM YYYY, HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-500 text-xs font-medium">Diperbarui</span>
                                        <span className="text-slate-800 text-xs font-semibold">
                                            {dayjs(note.updated_at).format('DD MMM YYYY, HH:mm')}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips card */}
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-amber-500" />
                                        Tips Penulisan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        {tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                                                <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[9px] font-bold text-amber-600">
                                                    {i + 1}
                                                </span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
