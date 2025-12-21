import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { CalendarDays, Phone, Stethoscope, Ambulance } from 'lucide-react'

export default function CtaSection() {
    return (
        <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 py-24 overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm shadow-sm">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                            Layanan Gawat Darurat 24 Jam
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                            Siap Melayani Kesehatan Anda <br/>
                            <span className="text-blue-300">Kapan Saja</span>
                        </h2>

                        <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-lg">
                            Jangan ragu untuk berkonsultasi. Tim medis kami siap memberikan penanganan terbaik dengan fasilitas lengkap dan dokter spesialis berpengalaman.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 font-bold h-12 px-8 shadow-xl shadow-blue-900/20 border-0"
                            >
                                <Link href="/jadwal-dokter">
                                    <CalendarDays className="mr-2 h-5 w-5" />
                                    Cek Jadwal Dokter
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-8 backdrop-blur-sm"
                            >
                                <a href="tel:+62651123456">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Call Center IGD
                                </a>
                            </Button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">Siaga IGD</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">15+</div>
                                <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">Poliklinik</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">BPJS</div>
                                <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">Menerima Pasien</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            <img
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                                alt="Fasilitas Medis Modern"
                                className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-1000"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"></div>

                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-100 border border-white/50">
                                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                    <Ambulance className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Ambulans</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Siaga 24 Jam</p>
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 border border-white/50">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Dokter Spesialis</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Jadwal Tersedia</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -z-10 -bottom-10 -right-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-[80px]"></div>
                    </div>

                </div>
            </div>
        </section>
    )
}
