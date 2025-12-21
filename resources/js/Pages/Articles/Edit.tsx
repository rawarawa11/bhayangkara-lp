import { useState } from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Article } from '@/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { ArrowLeft, CalendarIcon, Loader2, UploadCloud, Save, Image as ImageIcon, FileText, Hash, Globe } from 'lucide-react'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

interface ArticleEditFormData {
    title: string;
    body: string;
    image: File | null;
    tags: string[];
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: 'draft' | 'published';
    published_at: Date | null;
    _method: 'PUT';
}

type Props = {
    article: Article;
}

// Helper to get full image URL
const imgUrl = (path: string | null) => (path ? `/storage/${path}` : null)

function DatePicker({ value, onChange, disabled }: { value: Date | null, onChange: (date: Date | undefined) => void, disabled?: boolean }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? dayjs(value).format('DD MMMM YYYY') : <span>Pilih tanggal</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default function ArticleEdit() {
    const { article } = usePage<Props>().props;
    const [tagsInput, setTagsInput] = useState<string>(article.tags?.join(', ') ?? '');
    const [imagePreview, setImagePreview] = useState<string | null>(imgUrl(article.image));

    const { data, setData, post, processing, errors, transform } = useForm<ArticleEditFormData>({
        title: article.title ?? '',
        body: article.body ?? '',
        image: null,
        tags: article.tags ?? [],
        meta_title: article.meta_title ?? '',
        meta_description: article.meta_description ?? '',
        meta_keywords: article.meta_keywords ?? '',
        status: article.status ?? 'draft',
        published_at: article.published_at ? dayjs(article.published_at).toDate() : null,
        _method: 'PUT',
    });

    transform((formData) => ({
        ...formData,
        tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        published_at: formData.published_at ? dayjs(formData.published_at).format('YYYY-MM-DD HH:mm:ss') : null,
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('articles.update', article.id), {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout title={`Edit: ${article.title}`}>
            <Head title={`Edit: ${article.title}`} />

            <form onSubmit={submit} className="flex flex-col min-h-[calc(100vh-4rem)]">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/80 px-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('articles.index')}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-slate-500")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
                                Edit Artikel
                            </h1>
                            <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                                {article.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('articles.index')}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[140px]">
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50/50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-slate-200 shadow-none overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6 border-b border-slate-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-slate-600 font-semibold">Judul Artikel</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Judul artikel..."
                                                className="text-lg font-medium border-slate-200 focus-visible:ring-blue-500 h-12"
                                            />
                                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white min-h-[500px]">
                                        <SimpleEditor
                                            value={data.body}
                                            onChange={(val) => setData('body', val)}
                                        />
                                    </div>
                                    {errors.body && <div className="px-6 pb-4 text-sm text-red-500">{errors.body}</div>}
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-slate-500" />
                                        Konfigurasi SEO
                                    </CardTitle>
                                    <CardDescription>Update metadata untuk mesin pencari.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title">Meta Title</Label>
                                        <Input
                                            id="meta_title"
                                            value={data.meta_title}
                                            onChange={(e) => setData('meta_title', e.target.value)}
                                            placeholder="Judul di Google Search"
                                        />
                                        {errors.meta_title && <p className="text-sm text-red-500">{errors.meta_title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description">Meta Description</Label>
                                        <Textarea
                                            id="meta_description"
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            placeholder="Deskripsi singkat..."
                                            rows={3}
                                            className="resize-none"
                                        />
                                        {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-slate-500" />
                                        Publikasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value: 'draft' | 'published') => setData('status', value)}
                                        >
                                            <SelectTrigger id="status" className="bg-white">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-slate-400" /> Draft
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="published">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Published
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Tanggal Publikasi</Label>
                                        <DatePicker
                                            value={data.published_at}
                                            onChange={(date) => setData('published_at', date ?? null)}
                                            disabled={data.status === 'draft'}
                                        />
                                        {errors.published_at && <p className="text-sm text-red-500">{errors.published_at}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-slate-500" />
                                        Topik & Tag
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>
                                        <Input
                                            id="tags"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            placeholder="Kesehatan, Berita, dll..."
                                        />
                                        <p className="text-[10px] text-slate-500">Pisahkan dengan koma.</p>
                                        {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-slate-500" />
                                        Gambar Utama
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="w-full">
                                        <label
                                            htmlFor="image"
                                            className="cursor-pointer group relative flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden"
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="p-3 bg-white rounded-full shadow-none mb-3">
                                                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <p className="mb-1 text-sm text-slate-500 font-medium">Klik untuk ganti gambar</p>
                                                    <p className="text-xs text-slate-400">PNG, JPG (Max. 2MB)</p>
                                                </div>
                                            )}
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
