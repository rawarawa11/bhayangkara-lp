import { Head, Link, useForm } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
    ArrowLeft,
    Loader2,
    Save,
    UserRound,
    Stethoscope,
} from 'lucide-react'

export default function DoctorCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        specialist: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('doctors.store'))
    }

    return (
        <AdminLayout title="Tambah Dokter">
            <Head title="Tambah Dokter" />

            <form onSubmit={submit} className="flex flex-col min-h-[calc(100vh-4rem)]">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/80 p-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('doctors.index')}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-slate-500")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Tambah Dokter Baru</h1>
                            <p className="text-xs text-slate-500">Tambahkan data dokter spesialis.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('doctors.index')}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[140px]">
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Dokter
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50/50 p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Card className="border-slate-200 shadow-none">
                            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <UserRound className="h-4 w-4 text-blue-600" />
                                    Informasi Dokter
                                </CardTitle>
                                <CardDescription>Identitas dokter yang bertugas.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-6 grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Dokter <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="Contoh: dr. Budi Santoso, Sp.PD"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="pl-9 h-11 text-base"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialist">Spesialis / Poli <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="specialist"
                                            placeholder="Contoh: Spesialis Penyakit Dalam"
                                            value={data.specialist}
                                            onChange={e => setData('specialist', e.target.value)}
                                            className="pl-9 h-11 text-base"
                                        />
                                    </div>
                                    {errors.specialist && <p className="text-sm text-red-500">{errors.specialist}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
