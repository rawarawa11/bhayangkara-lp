import { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Upload, Loader2 } from 'lucide-react'

type Medicine = { id: number; name: string; slug: string; description: string | null; image: string | null; is_available: boolean }

export default function MedicineEdit({ medicine }: { medicine: Medicine }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: medicine.name,
        slug: medicine.slug,
        description: medicine.description || '',
        is_available: Boolean(medicine.is_available),
        image: null as File | null,
    })
    const [imagePreview, setImagePreview] = useState<string | null>(medicine.image ? `/storage/${medicine.image}` : null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('medicines.update', medicine.id))
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
        <AdminLayout title={`Edit ${medicine.name}`}>
            <Head title={`Edit ${medicine.name}`} />
            <div className="container mx-auto max-w-3xl p-6">
                <div className="mb-6">
                    <Button asChild variant="ghost" className="pl-0">
                        <Link href={route('medicines.index')}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Obat</Link>
                    </Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Obat</CardTitle>
                            <CardDescription>Perbarui informasi obat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Obat <span className="text-red-500">*</span></Label>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={data.slug} onChange={e => setData('slug', e.target.value)} />
                                <p className="text-xs text-muted-foreground">Ubah jika perlu URL yang berbeda.</p>
                                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi / Indikasi</Label>
                                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} rows={4} />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Gambar Obat</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex h-32 w-32 items-center justify-center rounded-md border border-dashed bg-muted overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="image" className="sr-only">Ganti Gambar</Label>
                                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                                        <p className="text-xs text-muted-foreground">Biarkan kosong jika tidak ingin mengganti gambar.</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                                <Switch id="is_available" checked={data.is_available} onCheckedChange={v => setData('is_available', v)} />
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="is_available" className="text-base">Tersedia</Label>
                                    <p className="text-sm text-muted-foreground">Status ketersediaan obat saat ini.</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" asChild><Link href={route('medicines.index')}>Batal</Link></Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    )
}
