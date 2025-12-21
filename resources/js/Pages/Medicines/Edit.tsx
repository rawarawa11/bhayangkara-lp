import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
    ArrowLeft,
    Upload,
    Loader2,
    Save,
    Pill,
    ImageIcon,
    Activity
} from 'lucide-react'

type Medicine = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_available: boolean
}

export default function MedicineEdit({ medicine }: { medicine: Medicine }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: medicine.name,
        slug: medicine.slug,
        description: medicine.description || '',
        is_available: Boolean(medicine.is_available),
        image: null as File | null,
    })

    const getImageUrl = (path: string | null) => path ? `/storage/${path}` : null

    const [imagePreview, setImagePreview] = useState<string | null>(getImageUrl(medicine.image))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('medicines.update', medicine.id), {
            forceFormData: true,
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setData('image', file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    return (
        <AdminLayout title={`Edit: ${medicine.name}`}>
            <Head title={`Edit - ${medicine.name}`} />

            <form onSubmit={handleSubmit} className="flex flex-col min-h-[calc(100vh-4rem)]">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/80 p-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('medicines.index')}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-slate-500")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
                                Edit Data Obat
                            </h1>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                Memperbarui informasi untuk {medicine.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('medicines.index')}>Batal</Link>
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
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Pill className="h-4 w-4 text-blue-600" />
                                        Informasi Dasar
                                    </CardTitle>
                                    <CardDescription>Nama, slug, dan deskripsi obat.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5 px-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Obat <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Contoh: Paracetamol 500mg"
                                            className="text-lg font-medium h-11"
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug URL (Opsional)</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={e => setData('slug', e.target.value)}
                                            placeholder="paracetamol-500mg"
                                            className="font-mono text-sm bg-slate-50"
                                        />
                                        <p className="text-[10px] text-slate-500">Biarkan kosong untuk generate otomatis dari nama obat.</p>
                                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Deskripsi / Indikasi</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Jelaskan kegunaan, dosis, atau informasi penting lainnya."
                                            rows={6}
                                            className="resize-none"
                                        />
                                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-500" />
                                        Status Inventaris
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4 bg-white">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="is_available" className="text-sm font-medium leading-none cursor-pointer">
                                                Tersedia
                                            </Label>
                                            <span className="text-[10px] text-slate-500">
                                                Stok obat ada di apotek.
                                            </span>
                                        </div>
                                        <Switch
                                            id="is_available"
                                            checked={data.is_available}
                                            onCheckedChange={v => setData('is_available', v)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-none">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-slate-500" />
                                        Gambar Obat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="w-full">
                                        <label
                                            htmlFor="image"
                                            className="cursor-pointer group relative flex flex-col items-center justify-center w-full h-56 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden"
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                    <div className="p-3 bg-white rounded-full shadow-none mb-3">
                                                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <p className="mb-1 text-sm text-slate-600 font-medium">Klik untuk ganti gambar</p>
                                                    <p className="text-xs text-slate-400">PNG, JPG (Max 4MB)</p>
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
                                        {imagePreview && (
                                            <p className="mt-2 text-[10px] text-center text-slate-500">
                                                Gambar saat ini ditampilkan. Klik untuk mengubah.
                                            </p>
                                        )}
                                        {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
