import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Pill,
    Search,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Phone,
    ArrowLeft,
} from 'lucide-react'
import { Medicine, PaginatedResponse } from '@/types'

type PageProps = {
    medicines: PaginatedResponse<Medicine>
    filters: { q?: string }
}

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
        <div className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={medicine.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-slate-100">
                        <div className="h-16 w-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                            <span className="text-blue-600 font-black text-2xl leading-none">{initials}</span>
                        </div>
                        <Pill className="h-5 w-5 text-slate-300" />
                    </div>
                )}

                {/* Availability Overlay Badge */}
                <div className="absolute top-3 right-3">
                    {medicine.is_available ? (
                        <Badge className="bg-emerald-600 text-white border-0 shadow-md text-xs px-2.5 py-1 font-semibold">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Tersedia
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-slate-700/80 text-white border-0 shadow-md text-xs px-2.5 py-1 font-semibold backdrop-blur-sm">
                            <XCircle className="h-3 w-3 mr-1" />
                            Habis
                        </Badge>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                    {medicine.name}
                </h3>

                {medicine.description ? (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                        {medicine.description.replace(/<[^>]+>/g, '')}
                    </p>
                ) : (
                    <p className="text-sm text-slate-400 italic flex-1">Tidak ada deskripsi.</p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className={`flex items-center gap-2 text-sm font-medium ${medicine.is_available ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {medicine.is_available ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Stok tersedia di apotek</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4" />
                                <span>Stok sedang habis</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function MedicinePublicIndex() {
    const { medicines, filters } = usePage<PageProps>().props
    const [q, setQ] = useState(filters.q || '')

    const doSearch = () => {
        router.get(
            route('medicines.public.index'),
            q ? { q } : {},
            { preserveState: true, replace: true }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') doSearch()
    }

    const goToPage = (url: string | null) => {
        if (!url) return
        router.visit(url, { preserveState: true })
    }

    const totalAvailable = medicines.data.filter(m => m.is_available).length

    return (
        <>
            <Head>
                <title>Ketersediaan Obat — RS Bhayangkara Banda Aceh</title>
                <meta
                    name="description"
                    content="Cek ketersediaan obat di apotek RS Bhayangkara Banda Aceh secara real-time. Temukan obat yang Anda butuhkan sebelum kunjungan."
                />
            </Head>

            <Navbar />

            <main>
                {/* Hero / Page Header */}
                <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2" />
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl translate-y-1/2" />
                    </div>

                    <div className="relative container mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="mb-6">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </div>

                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
                                <Pill className="h-4 w-4 text-blue-300" />
                                <span className="text-blue-200 text-sm font-semibold tracking-wide uppercase">Instalasi Farmasi</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
                                Ketersediaan Obat
                            </h1>
                            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
                                Cek stok obat di apotek RS Bhayangkara Banda Aceh secara real-time.
                                Temukan obat yang Anda butuhkan sebelum berkunjung.
                            </p>

                            {/* Search Bar */}
                            <div className="flex gap-3 max-w-xl">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="search-medicine"
                                        type="text"
                                        placeholder="Cari nama obat..."
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:bg-white/15 backdrop-blur-sm rounded-xl"
                                    />
                                </div>
                                <Button
                                    onClick={doSearch}
                                    size="lg"
                                    className="bg-blue-500 hover:bg-blue-400 text-white border-0 h-12 px-6 font-semibold rounded-xl shadow-lg"
                                >
                                    Cari
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
                                <p className="text-3xl font-extrabold text-white">{medicines.total}</p>
                                <p className="text-blue-200 text-xs mt-1 font-medium uppercase tracking-wide">Total Obat</p>
                            </div>
                            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-4 text-center">
                                <p className="text-3xl font-extrabold text-emerald-300">{totalAvailable}</p>
                                <p className="text-emerald-200 text-xs mt-1 font-medium uppercase tracking-wide">Tersedia</p>
                            </div>
                            <div className="hidden sm:block bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
                                <p className="text-3xl font-extrabold text-white">24<span className="text-lg">J</span></p>
                                <p className="text-blue-200 text-xs mt-1 font-medium uppercase tracking-wide">Apotek Buka</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Banner */}
                <div className="bg-blue-50 border-b border-blue-100">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-800">
                                Data ketersediaan diperbarui secara berkala. Untuk informasi terkini, hubungi apotek kami di{' '}
                                <a href="tel:0651123456" className="font-bold underline hover:no-underline">
                                    (0651) 123-456
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <section className="bg-slate-50 py-12 min-h-[60vh]">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6">

                        {/* Search state / results header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
                            <div>
                                {filters.q ? (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            Hasil pencarian untuk{' '}
                                            <span className="text-blue-600">"{filters.q}"</span>
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Ditemukan {medicines.total} obat yang cocok.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Semua Obat Tersedia</h2>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Menampilkan {medicines.data.length} dari {medicines.total} obat.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {filters.q && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setQ('')
                                        router.get(route('medicines.public.index'), {}, { preserveState: false })
                                    }}
                                    className="border-slate-300 text-slate-600 hover:text-slate-900 shrink-0"
                                >
                                    Hapus Pencarian
                                </Button>
                            )}
                        </div>

                        {/* Grid */}
                        {medicines.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {medicines.data.map((medicine) => (
                                        <MedicineCard key={medicine.id} medicine={medicine} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {(medicines.last_page > 1) && (
                                    <div className="mt-12 flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={medicines.current_page <= 1}
                                            onClick={() => {
                                                const prevLink = medicines.links.find(l => l.label === '&laquo; Previous')
                                                goToPage(prevLink?.url ?? null)
                                            }}
                                            className="border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-200 disabled:opacity-40"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Sebelumnya
                                        </Button>

                                        <span className="text-sm text-slate-600 px-4 font-medium">
                                            Halaman {medicines.current_page} dari {medicines.last_page}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={medicines.current_page >= medicines.last_page}
                                            onClick={() => {
                                                const nextLink = medicines.links.find(l => l.label === 'Next &raquo;')
                                                goToPage(nextLink?.url ?? null)
                                            }}
                                            className="border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-200 disabled:opacity-40"
                                        >
                                            Berikutnya
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty state */
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                <div className="h-20 w-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                                    <Pill className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    {filters.q ? 'Obat Tidak Ditemukan' : 'Belum Ada Data Obat'}
                                </h3>
                                <p className="text-slate-500 max-w-md leading-relaxed mb-8">
                                    {filters.q
                                        ? `Kami tidak menemukan obat dengan kata kunci "${filters.q}". Coba kata kunci lain atau hubungi apotek kami.`
                                        : 'Data ketersediaan obat sedang diperbarui. Silakan hubungi apotek kami untuk informasi lebih lanjut.'}
                                </p>
                                {filters.q ? (
                                    <Button
                                        onClick={() => {
                                            setQ('')
                                            router.get(route('medicines.public.index'), {}, { preserveState: false })
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Lihat Semua Obat
                                    </Button>
                                ) : (
                                    <a
                                        href="tel:0651123456"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Hubungi Apotek
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-slate-900 py-16">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Butuh Bantuan atau Informasi Lebih Lanjut?
                                </h2>
                                <p className="text-slate-400 text-base leading-relaxed max-w-xl">
                                    Tim apoteker kami siap membantu Anda menemukan obat yang tepat dan memberikan konsultasi kefarmasian.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <a
                                    href="tel:0651123456"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                                >
                                    <Phone className="h-4 w-4" />
                                    (0651) 123-456
                                </a>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/20"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <ChatWidget />
        </>
    )
}
