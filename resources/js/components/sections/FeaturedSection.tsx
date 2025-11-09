import { Link } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stethoscope, HeartPulse, Brain, Baby, Bone, Microscope } from 'lucide-react'

const services = [
    {
        icon: HeartPulse,
        title: "Pusat Jantung & Pembuluh Darah",
        description: "Layanan kardiologi komprehensif mulai dari diagnostik non-invasif hingga intervensi koroner.",
        href: "/layanan/jantung"
    },
    {
        icon: Brain,
        title: "Saraf & Bedah Saraf",
        description: "Penanganan stroke terpadu, bedah tumor otak, dan terapi rehabilitasi saraf pasca trauma.",
        href: "/layanan/saraf"
    },
    {
        icon: Baby,
        title: "Ibu & Anak",
        description: "Layanan kebidanan, kandungan, dan pediatri dengan fasilitas NICU/PICU yang lengkap.",
        href: "/layanan/ibu-anak"
    },
    {
        icon: Bone,
        title: "Ortopedi & Traumatologi",
        description: "Spesialisasi penanganan patah tulang, penggantian sendi, dan cedera olahraga.",
        href: "/layanan/ortopedi"
    },
    {
        icon: Microscope,
        title: "Laboratorium Terpadu",
        description: "Pemeriksaan patologi klinik, mikrobiologi, dan biomolekuler dengan hasil cepat dan akurat.",
        href: "/layanan/laboratorium"
    },
    {
        icon: Stethoscope,
        title: "Medical Check Up (MCU)",
        description: "Paket pemeriksaan kesehatan berkala untuk individu, korporasi, dan calon anggota Polri.",
        href: "/layanan/mcu"
    }
]

export default function ServicesSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto max-w-7xl px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Layanan Medis Unggulan
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Kami menghadirkan layanan kesehatan terdepan dengan dukungan teknologi medis terkini dan tim dokter spesialis yang berpengalaman.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-none shadow-sm">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                                    <service.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <CardTitle className="text-xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {service.description}
                                </CardDescription>
                                <Button asChild variant="link" className="px-0 mt-4 text-blue-600">
                                    <Link href={service.href}>Pelajari lebih lanjut →</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}
