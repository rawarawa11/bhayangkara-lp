import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { CalendarDays, PhoneCall } from 'lucide-react'

export default function CtaSection() {
    return (
        <section className="bg-blue-900 py-16 text-white">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                            Butuh Konsultasi Medis?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8">
                            Jangan tunda kesehatan Anda. Cek jadwal dokter spesialis kami hari ini atau hubungi layanan darurat kami jika Anda membutuhkan bantuan segera.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                                <Link href="/jadwal-dokter">
                                    <CalendarDays className="mr-2 h-5 w-5" />
                                    Lihat Jadwal Dokter
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-blue-800">
                                <a href="tel:+62651123456">
                                    <PhoneCall className="mr-2 h-5 w-5" />
                                    IGD (0651) 123-456
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        {/* Ilustrasi atau gambar yang relevan bisa diletakkan di sini */}
                        {/*  */}
                        <img
                            src="https://placehold.co/600x400/1e3a8a/ffffff?text=Ilustrasi+Dokter+&+Pasien"
                            alt="Konsultasi Dokter"
                            className="rounded-xl shadow-2xl opacity-90"
                        />
                    </div>

                </div>
            </div>
        </section>
    )
}
