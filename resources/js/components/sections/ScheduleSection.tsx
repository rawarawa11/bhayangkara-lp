import { Link } from '@inertiajs/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, ArrowRight, Stethoscope, UserRound } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

type Schedule = {
    id: number
    doctor_name: string
    specialist: string
    day: string
    time_start: string
    time_end: string
    is_available: boolean
}

export default function DoctorScheduleSection({ schedules = [] }: { schedules?: Schedule[] }) {
    const today = dayjs().format('dddd')

    return (
        <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                            Jadwal Praktik
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Dokter Tersedia Hari Ini
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                            Jadwal praktik dokter spesialis RS Bhayangkara Banda Aceh untuk hari <strong>{today}</strong>.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="hidden md:inline-flex border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-white hover:border-blue-200 h-10 px-6">
                        <Link href="/jadwal-dokter" className="flex items-center gap-2">
                            Lihat Jadwal Lengkap <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {schedules && schedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.map((schedule) => (
                            <Card key={schedule.id} className="group border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6 flex items-start gap-4">
                                        <Avatar className="h-16 w-16 border-2 border-slate-100 group-hover:border-blue-100 transition-colors">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${schedule.doctor_name}&background=eff6ff&color=2563eb&bold=true`} />
                                            <AvatarFallback className="bg-blue-50 text-blue-600">
                                                <UserRound className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                                                {schedule.doctor_name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                                <Stethoscope className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate font-medium">{schedule.specialist}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span>
                                                {schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)} WIB
                                            </span>
                                        </div>

                                        {schedule.is_available ? (
                                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm px-3">
                                                Hadir
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-slate-200 text-slate-500 hover:bg-slate-300">
                                                Cuti / Absen
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 text-center">
                        <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Calendar className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Tidak ada jadwal praktik hari ini</h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            Kemungkinan hari ini adalah hari libur atau belum ada jadwal yang diperbarui.
                        </p>
                        <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/jadwal-dokter">Cek Jadwal Mingguan</Link>
                        </Button>
                    </div>
                )}

                {/* Mobile Button */}
                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" className="w-full border-slate-300 text-slate-700">
                        <Link href="/jadwal-dokter">
                            Lihat Jadwal Lengkap
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}
