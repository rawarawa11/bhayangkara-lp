import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
    ArrowLeft,
    Loader2,
    Save,
    UserRound,
    Stethoscope,
    Clock,
    Calendar,
    Activity
} from 'lucide-react'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

type Schedule = {
    id: number;
    doctor_name: string;
    specialist: string;
    day: string;
    time_start: string;
    time_end: string;
    is_available: boolean;
}

export default function ScheduleEdit() {
    const { schedule } = usePage<{ schedule: Schedule }>().props

    const { data, setData, put, processing, errors } = useForm({
        doctor_name: schedule.doctor_name,
        specialist: schedule.specialist,
        day: schedule.day,
        time_start: schedule.time_start?.substring(0, 5),
        time_end: schedule.time_end?.substring(0, 5),
        is_available: Boolean(schedule.is_available),
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route('schedules.update', schedule.id))
    }

    return (
        <AdminLayout title="Edit Jadwal">
            <Head title={`Edit Jadwal - ${schedule.doctor_name}`} />

            <form onSubmit={submit} className="flex flex-col min-h-[calc(100vh-4rem)]">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/80 p-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('schedules.index')}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "text-slate-500")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
                                Edit Jadwal Praktik
                            </h1>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                Memperbarui data untuk dr. {schedule.doctor_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href={route('schedules.index')}>Batal</Link>
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
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <UserRound className="h-4 w-4 text-blue-600" />
                                        Informasi Dokter
                                    </CardTitle>
                                    <CardDescription>Identitas dokter yang bertugas.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 grid gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="doctor_name">Nama Dokter <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="doctor_name"
                                                value={data.doctor_name}
                                                onChange={e => setData('doctor_name', e.target.value)}
                                                className="pl-9 h-11 text-base"
                                            />
                                        </div>
                                        {errors.doctor_name && <p className="text-sm text-red-500">{errors.doctor_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialist">Spesialis / Poli <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="specialist"
                                                value={data.specialist}
                                                onChange={e => setData('specialist', e.target.value)}
                                                className="pl-9 h-11 text-base"
                                            />
                                        </div>
                                        {errors.specialist && <p className="text-sm text-red-500">{errors.specialist}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        Waktu Praktik
                                    </CardTitle>
                                    <CardDescription>Hari dan jam operasional saat ini.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="day">Hari Praktik</Label>
                                        <Select
                                            value={data.day}
                                            onValueChange={val => setData('day', val)}
                                        >
                                            <SelectTrigger className="h-11 bg-white">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <SelectValue placeholder="Pilih Hari" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAYS.map(day => (
                                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.day && <p className="text-sm text-red-500">{errors.day}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="time_start">Jam Mulai</Label>
                                            <Input
                                                id="time_start"
                                                type="time"
                                                value={data.time_start}
                                                onChange={e => setData('time_start', e.target.value)}
                                                className="h-11"
                                            />
                                            {errors.time_start && <p className="text-sm text-red-500">{errors.time_start}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time_end">Jam Selesai</Label>
                                            <Input
                                                id="time_end"
                                                type="time"
                                                value={data.time_end}
                                                onChange={e => setData('time_end', e.target.value)}
                                                className="h-11"
                                            />
                                            {errors.time_end && <p className="text-sm text-red-500">{errors.time_end}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* --- 3. Right Column: Status (33%) --- */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Availability Status */}
                            <Card className="border-slate-200 shadow-sm sticky top-24">
                                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-500" />
                                        Status Kehadiran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4 bg-white hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="is_available" className="text-sm font-medium leading-none cursor-pointer">
                                                Dokter Hadir
                                            </Label>
                                            <span className="text-[10px] text-slate-500">
                                                Aktifkan jika dokter dapat menerima pasien.
                                            </span>
                                        </div>
                                        <Switch
                                            id="is_available"
                                            checked={data.is_available}
                                            onCheckedChange={checked => setData('is_available', checked)}
                                        />
                                    </div>
                                    <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800 leading-relaxed">
                                        <strong>Perhatian:</strong><br/>
                                        Perubahan jadwal akan langsung terlihat di halaman publik. Pastikan jam praktik sudah sesuai.
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
