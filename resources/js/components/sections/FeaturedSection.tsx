import { Link } from '@inertiajs/react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from '@/components/ui/card'
import {
    HeartPulse,
    Brain,
    Baby,
    Stethoscope,
    ShieldPlus,
    Activity,
    Ambulance,
    Microscope
} from 'lucide-react'

const services = [
    {
        icon: Ambulance,
        title: "IGD & Trauma Center 24 Jam",
        description: "Penanganan gawat darurat dan kecelakaan lalu lintas dengan respon cepat serta fasilitas bedah minor yang lengkap.",
        href: "#"
    },
    {
        icon: ShieldPlus,
        title: "Kedokteran Kepolisian (Dokpol)",
        description: "Layanan spesifik forensik, DVI (Disaster Victim Identification), dan pemeriksaan kesehatan untuk keperluan kepolisian.",
        href: "#"
    },
    {
        icon: HeartPulse,
        title: "Klinik Jantung & Pembuluh Darah",
        description: "Pemeriksaan EKG, Echocardiography, dan konsultasi spesialis untuk pencegahan dan penanganan penyakit kardiovaskular.",
        href: "#"
    },
    {
        icon: Baby,
        title: "Kesehatan Ibu & Anak (PONEK)",
        description: "Layanan terpadu kebidanan, kandungan, dan pediatri dengan fasilitas ruang bersalin dan perinatologi modern.",
        href: "#"
    },
    {
        icon: Brain,
        title: "Saraf & Bedah Saraf",
        description: "Penanganan stroke, cedera kepala, dan gangguan neurologis lainnya dengan dukungan dokter spesialis ahli.",
        href: "#"
    },
    {
        icon: Microscope,
        title: "Penunjang Medis Lengkap",
        description: "Laboratorium Patologi Klinik, Radiologi (Rontgen/USG), dan Farmasi 24 jam untuk diagnosa yang akurat.",
        href: "#"
    },
    {
        icon: Activity,
        title: "Bedah Sentral & Orthopedi",
        description: "Kamar operasi steril untuk berbagai tindakan bedah umum, tulang (orthopedi), dan digestif.",
        href: "#"
    },
    {
        icon: Stethoscope,
        title: "Medical Check Up (MCU)",
        description: "Paket pemeriksaan kesehatan menyeluruh untuk calon anggota Polri, ASN, karyawan perusahaan, dan umum.",
        href: "#"
    }
]

export default function ServicesSection() {
    return (
        <section className="bg-slate-50 py-24 border-t border-slate-200">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                        Fasilitas & Layanan
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight mb-4">
                        Layanan Kesehatan Unggulan
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Kami menyediakan layanan medis komprehensif dengan standar akreditasi paripurna,
                        didukung oleh teknologi medis terkini dan tenaga ahli yang berdedikasi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Card
                            key={index}
                            className="group relative border border-slate-200 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                            <CardHeader className="pb-3 pt-8">
                                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <service.icon className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                    {service.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <CardDescription className="text-slate-600 leading-relaxed text-sm">
                                    {service.description}
                                </CardDescription>

                                {/* Optional: Link (Invisible but clickable entire card if needed, or specific link) */}
                                {/* Untuk saat ini kita biarkan sebagai informasi, atau bisa tambahkan link spesifik */}
                                {/* <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    Pelajari Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                                </div> */}
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}
