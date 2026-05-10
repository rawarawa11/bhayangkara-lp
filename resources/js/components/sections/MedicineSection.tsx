import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pill, ArrowRight, CheckCircle2, Search, ShieldCheck } from 'lucide-react'
import { Medicine } from '@/types'

const getMedicineImage = (path: string | null) =>
    path ? `/storage/${path}` : null

const MedicineCard = ({ medicine }: { medicine: Medicine }) => {
    const imgUrl = getMedicineImage(medicine.image)
    const initials = medicine.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-blue-50 border border-slate-100 flex items-center justify-center">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={medicine.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <span className="text-blue-600 font-black text-lg leading-none">{initials}</span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-700 transition-colors">
                    {medicine.name}
                </p>
                {medicine.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                        {medicine.description.replace(/<[^>]+>/g, '')}
                    </p>
                )}
            </div>

            <Badge className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-none text-[10px] px-2 py-0.5 font-semibold">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Tersedia
            </Badge>
        </div>
    )
}

export default function MedicineSection({ medicines }: { medicines: Medicine[] }) {
    const hasData = medicines && medicines.length > 0

    return (
        <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                            Farmasi & Apotek
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Ketersediaan Obat
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                            Cek ketersediaan obat di apotek RS Bhayangkara Banda Aceh secara
                            real-time sebelum kunjungan Anda.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="hidden md:inline-flex border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-white hover:border-blue-200"
                    >
                        <Link href={route('medicines.public.index')} className="group">
                            Cek Semua Obat
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="mb-8 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                        Daftar obat ini diperbarui secara berkala oleh tim farmasi kami. Status ketersediaan dapat berubah sewaktu-waktu. Untuk informasi lebih lanjut, hubungi apotek kami di{' '}
                        <strong className="font-semibold">(0651) 123-456</strong>.
                    </p>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {medicines.map((medicine) => (
                            <MedicineCard key={medicine.id} medicine={medicine} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Pill className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Belum Ada Data Obat</h3>
                        <p className="text-slate-500 mt-2 max-w-sm leading-relaxed">
                            Data ketersediaan obat sedang diperbarui. Silakan hubungi apotek kami secara langsung.
                        </p>
                    </div>
                )}

                {hasData && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Search className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight">Cari Obat yang Anda Butuhkan</p>
                                <p className="text-blue-100 text-sm mt-0.5">
                                    Telusuri {medicines.length > 6 ? 'ratusan' : 'seluruh'} daftar obat tersedia di apotek kami.
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg shrink-0 px-8"
                        >
                            <Link href={route('medicines.public.index')}>
                                Lihat Semua Obat
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" className="w-full border-slate-300 text-slate-700">
                        <Link href={route('medicines.public.index')}>
                            Cek Semua Obat
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
