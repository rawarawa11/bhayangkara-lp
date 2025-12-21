import { useState } from 'react'
import { Head } from '@inertiajs/react'
import GuestLayout from '@/components/layouts/GuestLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Clock, Stethoscope, UserRound, CalendarDays, MapPin } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

// Data Types
type Schedule = {
    id: number
    doctor_name: string
    specialist: string
    day: string
    time_start: string
    time_end: string
    is_available: boolean
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function PublicList({ schedules }: { schedules: Schedule[] }) {
    const [searchTerm, setSearchTerm] = useState('')

    // Determine today's day to set as default tab
    // dayjs().format('dddd') returns 'Senin', 'Selasa', etc. in 'id' locale
    const today = dayjs().format('dddd')
    const defaultTab = DAYS.includes(today) ? today : 'Senin'

    // Filter logic
    const filteredSchedules = schedules.filter(item =>
        item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.specialist.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <GuestLayout>
            <Head title="Jadwal Dokter Spesialis" />

            <div className="min-h-screen bg-slate-50">

                {/* --- 1. Page Header --- */}
                <div className="bg-white border-b border-slate-200">
                    <div className="container mx-auto max-w-7xl px-4 py-16 text-center lg:text-left lg:py-20">
                        <div className="max-w-3xl">
                            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">
                                Poliklinik Eksekutif & Reguler
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Jadwal Praktik Dokter
                            </h1>
                            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                                Temukan jadwal terkini dokter spesialis kami. Silakan datang 30 menit sebelum jam praktik dimulai untuk proses pendaftaran.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-12">

                    {/* --- 2. Search Bar --- */}
                    <div className="mb-8 relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Cari nama dokter atau spesialis..."
                            className="pl-10 h-12 bg-white border-slate-200 focus:border-blue-500 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* --- 3. Weekly Tabs --- */}
                    <Tabs defaultValue={defaultTab} className="w-full">
                        {/* Scrollable Tab List for Mobile */}
                        <div className="overflow-x-auto pb-4 mb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                            <TabsList className="h-auto p-1 bg-white border border-slate-200 rounded-xl inline-flex w-auto min-w-full md:w-full md:grid md:grid-cols-7 gap-1">
                                {DAYS.map((day) => (
                                    <TabsTrigger
                                        key={day}
                                        value={day}
                                        className="py-2.5 px-4 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-medium text-slate-600"
                                    >
                                        {day}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Tab Contents */}
                        {DAYS.map((day) => {
                            const daysSchedules = filteredSchedules.filter(s => s.day === day)

                            return (
                                <TabsContent key={day} value={day} className="mt-0">
                                    {daysSchedules.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {daysSchedules.map((schedule) => (
                                                <DoctorCard key={schedule.id} schedule={schedule} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState day={day} hasSearch={searchTerm.length > 0} />
                                    )}
                                </TabsContent>
                            )
                        })}
                    </Tabs>

                    {/* --- 4. Information Note --- */}
                    <div className="mt-16 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                            <CalendarDays className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-blue-900 mb-1">Informasi Pendaftaran</h4>
                            <p className="text-blue-700/80 text-sm leading-relaxed">
                                Jadwal dokter dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya dikarenakan tugas kedinasan atau hal mendesak lainnya.
                                Untuk kepastian jadwal dan pendaftaran, silakan hubungi bagian informasi kami di <span className="font-semibold">(0651) 123-456</span>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </GuestLayout>
    )
}

// --- Sub-Component: Doctor Card ---
function DoctorCard({ schedule }: { schedule: Schedule }) {
    return (
        <Card className="group overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
                <div className="p-6 flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-slate-100 group-hover:border-blue-100 transition-colors">
                            <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${schedule.doctor_name}&background=eff6ff&color=2563eb&bold=true`}
                                alt={schedule.doctor_name}
                            />
                            <AvatarFallback className="bg-blue-50 text-blue-600">
                                <UserRound className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        {/* Status Dot */}
                        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                            {schedule.doctor_name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 mb-3">
                            <Stethoscope className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            <span className="truncate font-medium">{schedule.specialist}</span>
                        </div>
                    </div>
                </div>

                {/* Time Strip */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Poliklinik</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EmptyState({ day, hasSearch }: { day: string, hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <UserRound className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
                {hasSearch ? 'Tidak ada dokter ditemukan' : `Tidak ada jadwal pada hari ${day}`}
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
                {hasSearch
                    ? "Coba gunakan kata kunci pencarian yang lain atau periksa ejaan nama dokter."
                    : "Belum ada dokter yang dijadwalkan praktik pada hari ini. Silakan cek hari lain."}
            </p>
        </div>
    )
}
