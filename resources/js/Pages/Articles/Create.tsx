import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import dayjs from 'dayjs'
import AdminLayout from '@/components/layouts/DashboardLayout'

// --- Komponen ShadCN ---
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { ArrowLeft, CalendarIcon, Loader2, UploadCloud } from 'lucide-react'

// --- Tipe Data Form (sesuai validasi controller) ---
interface ArticleFormData {
    title: string;
    body: string;
    image: File | null;
    tags: string[]; // Ini akan dikelola oleh `tagsInput`
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: 'draft' | 'published';
    published_at: Date | null;
}

// --- Komponen DatePicker (helper) ---
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
            <PopoverContent className="w-auto p-0">
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

// --- Halaman Utama ---
export default function ArticleCreate() {

    // State tambahan untuk UI
    const [tagsInput, setTagsInput] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Hook Form dari Inertia
    const { data, setData, post, processing, errors, transform } = useForm<ArticleFormData>({
        title: '',
        body: '',
        image: null,
        tags: [],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        status: 'draft',
        published_at: null,
    });

    // Transformasi data sebelum dikirim
    // Mengubah string tag menjadi array dan memformat tanggal
    transform((formData) => ({
        ...formData,
        tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        published_at: formData.published_at ? dayjs(formData.published_at).format('YYYY-MM-DD HH:mm:ss') : null,
    }));

    // Handler untuk pengiriman form
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('articles.store'));
    };

    // Handler untuk perubahan gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout title="Buat Artikel Baru">
            <Head title="Buat Artikel Baru" />

            <form onSubmit={submit}>
                <div className="container mx-auto p-4 md:p-6">

                    {/* Header Halaman */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('articles.index')}
                                className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <h1 className="text-2xl font-semibold">Buat Artikel Baru</h1>
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Artikel
                        </Button>
                    </div>

                    {/* Konten Grid 2 Kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Kolom Utama (Kiri) */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Konten Utama</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Judul Artikel</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Judul yang menarik..."
                                            autoFocus
                                        />
                                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="body">Isi (Body)</Label>
                                        <Textarea
                                            id="body"
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Tulis isi artikel Anda di sini..."
                                            rows={15}
                                        />
                                        {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Gambar Utama (Featured Image)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full">
                                        {imagePreview ? (
                                            <div className="mb-4">
                                                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-md border" />
                                            </div>
                                        ) : (
                                            <div className="mb-4 flex items-center justify-center h-48 w-full rounded-md border-2 border-dashed">
                                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                        )}
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Kolom Samping (Kanan) */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publikasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value: 'draft' | 'published') => setData('status', value)}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Diterbitkan (Published)</SelectItem>
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
                                        <p className="text-xs text-muted-foreground">
                                            {data.status === 'draft' ? 'Atur status ke "Diterbitkan" untuk memilih tanggal.' : 'Kosongkan untuk langsung terbit.'}
                                        </p>
                                        {errors.published_at && <p className="text-sm text-red-500">{errors.published_at}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tag</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Input
                                            id="tags"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            placeholder="teknologi, kesehatan, ..."
                                        />
                                        <p className="text-xs text-muted-foreground">Pisahkan setiap tag dengan koma (,).</p>
                                        {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Meta Data</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title">Meta Title</Label>
                                        <Input
                                            id="meta_title"
                                            value={data.meta_title}
                                            onChange={(e) => setData('meta_title', e.target.value)}
                                            placeholder="Judul untuk mesin pencari..."
                                        />
                                        {errors.meta_title && <p className="text-sm text-red-500">{errors.meta_title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description">Meta Description</Label>
                                        <Textarea
                                            id="meta_description"
                                            value={data.meta_description}
                                            onChange={(e) => setData('meta_description', e.target.value)}
                                            placeholder="Deskripsi singkat untuk mesin pencari..."
                                            rows={4}
                                        />
                                        {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                        <Input
                                            id="meta_keywords"
                                            value={data.meta_keywords}
                                            onChange={(e) => setData('meta_keywords', e.target.value)}
                                            placeholder="kata, kunci, dipisah, koma"
                                        />
                                        {errors.meta_keywords && <p className="text-sm text-red-500">{errors.meta_keywords}</p>}
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
