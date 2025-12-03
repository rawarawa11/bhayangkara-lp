import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js' // Ensure you import route
import { Button } from '@/components/ui/button'
import LoginDialog from '@/Pages/Auth/LoginDialog'
import { ArrowRight, ShieldCheck, Clock, Activity, MapPin } from 'lucide-react'

type User = {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
}

type HeroProps = {
    user: User | null | undefined;
}

export default function HeroSection({ user }: HeroProps) {
    const dashboardRoute = user?.roles?.some(r => r.name === 'admin')
        ? route('admin.dashboard')
        : route('dashboard');

    return (
        <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 mb-6 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                            Rumah Sakit Bhayangkara Tingkat II
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-[1.15]">
                            Layanan Kesehatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Presisi</span> & Terpercaya
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Kami berdedikasi memberikan pelayanan medis prima bagi anggota Polri, ASN, dan masyarakat umum dengan dukungan tenaga medis profesional dan fasilitas modern.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            {!user ? (
                                <LoginDialog>
                                    <Button size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white h-12 px-8 text-base font-semibold shadow-lg shadow-blue-900/10 transition-all hover:shadow-blue-900/20">
                                        Masuk Akun
                                    </Button>
                                </LoginDialog>
                            ) : (
                                <Button asChild size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white h-12 px-8 text-base font-semibold shadow-lg shadow-blue-900/10">
                                    <Link href={dashboardRoute}>
                                        Ke Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            )}

                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 hover:border-blue-200 bg-white">
                                <Link href="/jadwal-dokter">
                                    Cek Jadwal Dokter
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold text-slate-900 text-lg">Paripurna</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Akreditasi KARS</p>
                            </div>
                            <div className="text-center lg:text-left relative after:content-[''] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-[1px] after:bg-slate-100 lg:after:-left-3 pl-0 lg:pl-3">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold text-slate-900 text-lg">24 Jam</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Layanan IGD</p>
                            </div>
                            <div className="text-center lg:text-left relative after:content-[''] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-[1px] after:bg-slate-100 lg:after:-left-3 pl-0 lg:pl-3">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold text-slate-900 text-lg">Modern</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fasilitas Lengkap</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
                            <img
                                src="https://placehold.co/800x1000/f8fafc/cbd5e1?text=Gedung+RS+Bhayangkara"
                                alt="Fasilitas RS Bhayangkara"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            Lokasi Strategis
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            Jl. Cut Nyak Dhien No.23, Lamtemen Bar., Kec. Jaya Baru, Kota Banda Aceh, Aceh 23232
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
                    </div>

                </div>
            </div>
        </section>
    )
}
