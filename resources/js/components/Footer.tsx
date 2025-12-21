import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Clock,
    ShieldCheck,
    Youtube
} from 'lucide-react'

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <li>
        <Link
            href={href}
            className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
        >
            <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-blue-500 transition-colors"></span>
            {children}
        </Link>
    </li>
)

const SocialIcon = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-700 hover:border-blue-500"
        aria-label={label}
    >
        <Icon className="h-5 w-5" />
    </a>
)

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="border-b border-slate-800 bg-slate-950/50">
                <div className="container mx-auto max-w-7xl px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-400">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Terakreditasi Paripurna (Bintang 5)</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-slate-400">
                                <Clock className="h-4 w-4 text-green-500" />
                                <span>IGD & Ambulans 24 Jam</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">Gawat Darurat:</span>
                            <span className="text-white font-bold font-mono text-lg tracking-wide">(0651) 123-456</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-polri.png"
                                alt="Logo Polri"
                                className="h-12 w-auto"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                            <div className="w-[1px] h-10 bg-slate-700"></div>
                            <img
                                src="/images/logo-rs.webp"
                                alt="Logo RS Bhayangkara"
                                className="h-12 w-auto"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight">RS Bhayangkara Banda Aceh</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Rumah Sakit Tingkat II yang berdedikasi memberikan pelayanan kesehatan presisi dan profesional bagi anggota Polri, ASN, dan masyarakat umum di Provinsi Aceh.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <SocialIcon href="#" icon={Facebook} label="Facebook" />
                            <SocialIcon href="#" icon={Instagram} label="Instagram" />
                            <SocialIcon href="#" icon={Twitter} label="Twitter" />
                            <SocialIcon href="#" icon={Youtube} label="Youtube" />
                        </div>
                    </div>

                    <div className="lg:col-span-3 lg:pl-8">
                        <h4 className="text-white font-semibold text-base mb-6 relative inline-block">
                            Layanan Unggulan
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink href="/layanan/igd">Instalasi Gawat Darurat</FooterLink>
                            <FooterLink href="/layanan/jantung">Pusat Jantung & Pembuluh</FooterLink>
                            <FooterLink href="/layanan/mcu">Medical Check Up</FooterLink>
                            <FooterLink href="/layanan/dokpol">Kedokteran Kepolisian</FooterLink>
                            <FooterLink href="/layanan/bedah">Bedah Sentral</FooterLink>
                            <FooterLink href="/layanan/rawat-inap">Rawat Inap VIP</FooterLink>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-semibold text-base mb-6 relative inline-block">
                            Informasi Publik
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink href={route('articles.public.index')}>Berita & Artikel</FooterLink>
                            <FooterLink href="/jadwal-dokter">Jadwal Dokter</FooterLink>
                            <FooterLink href="/tentang-kami">Profil Rumah Sakit</FooterLink>
                            <FooterLink href="/karir">Karir & Lowongan</FooterLink>
                            <FooterLink href="/pengaduan">Layanan Pengaduan</FooterLink>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-white font-semibold text-base mb-6 relative inline-block">
                            Hubungi Kami
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                        </h4>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start gap-3 text-slate-400">
                                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">
                                    Jl. Teuku Nyak Arief No. 23, Jeulingke, Kec. Syiah Kuala, Kota Banda Aceh, Aceh 23114
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 group">
                                <Phone className="h-5 w-5 text-blue-500 shrink-0 group-hover:text-white transition-colors" />
                                <span className="group-hover:text-white transition-colors">(0651) 123 456 (Hunting)</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 group">
                                <Mail className="h-5 w-5 text-blue-500 shrink-0 group-hover:text-white transition-colors" />
                                <a href="mailto:info@rs-bhayangkara-aceh.id" className="group-hover:text-white transition-colors hover:underline">
                                    info@rs-bhayangkara-aceh.id
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <div className="border-t border-slate-800 bg-slate-950">
                <div className="container mx-auto max-w-7xl px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>
                            &copy; {new Date().getFullYear()} RS Bhayangkara Tk. II Banda Aceh. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Peta Situs</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
