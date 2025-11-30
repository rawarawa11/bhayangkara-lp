import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader2 } from 'lucide-react'

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
        time_start: schedule.time_start?.substring(0, 5), // Format HH:mm
        time_end: schedule.time_end?.substring(0, 5),     // Format HH:mm
        is_available: schedule.is_available,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        put(route('schedules.update', schedule.id))
    }

    return (
        <AdminLayout title="Edit Jadwal">
            <Head title={`Edit Jadwal - ${schedule.doctor_name}`} />
            <div className="container mx-auto max-w-2xl p-6">
                <div className="mb-6">
                    <Button asChild variant="ghost" className="pl-0">
                        <Link href={route('schedules.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Jadwal Praktik</CardTitle>
                            <CardDescription>
                                Perbarui informasi jadwal untuk dr. {schedule.doctor_name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Doctor Info */}
                            <div className="space-y-2">
                                <Label htmlFor="doctor_name">Nama Dokter</Label>
                                <Input
                                    id="doctor_name"
                                    value={data.doctor_name}
                                    onChange={e => setData('doctor_name', e.target.value)}
                                />
                                {errors.doctor_name && <p className="text-sm text-red-500">{errors.doctor_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialist">Spesialis / Poli</Label>
                                <Input
                                    id="specialist"
                                    value={data.specialist}
                                    onChange={e => setData('specialist', e.target.value)}
                                />
                                {errors.specialist && <p className="text-sm text-red-500">{errors.specialist}</p>}
                            </div>

                            {/* Schedule Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label htmlFor="day">Hari Praktik</Label>
                                    <Select
                                        value={data.day}
                                        onValueChange={val => setData('day', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Hari" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS.map(day => (
                                                <SelectItem key={day} value={day}>{day}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.day && <p className="text-sm text-red-500">{errors.day}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="time_start">Jam Mulai</Label>
                                    <Input
                                        id="time_start"
                                        type="time"
                                        value={data.time_start}
                                        onChange={e => setData('time_start', e.target.value)}
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
                                    />
                                    {errors.time_end && <p className="text-sm text-red-500">{errors.time_end}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <Switch
                                    id="is_available"
                                    checked={data.is_available}
                                    onCheckedChange={checked => setData('is_available', checked)}
                                />
                                <div className="flex flex-col">
                                    <Label htmlFor="is_available" className="cursor-pointer">Status Kehadiran</Label>
                                    <span className="text-xs text-muted-foreground">Aktifkan jika dokter hadir sesuai jadwal.</span>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    )
}
