import { Link } from '@inertiajs/react'
import { Hospital, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'
import {route} from 'ziggy-js'

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <li>
        <Link href={href} className="text-gray-400 hover:text-white transition-colors">
            {children}
        </Link>
    </li>
)

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
)

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto max-w-6xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* 1. Kolom Branding */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <Link href="/public" className="flex items-center gap-2 mb-4">
                            <div className="bg-white p-2 rounded-full">
                                <Hospital className="h-6 w-6 text-gray-900" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                RS Bhayangkara
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Memberikan pelayanan kesehatan profesional dan terpercaya bagi semua.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Layanan</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/layanan/igd">IGD 24 Jam</FooterLink>
                            <FooterLink href="/layanan/rawat-inap">Rawat Inap</FooterLink>
                            <FooterLink href="/layanan/rawat-jalan">Rawat Jalan</FooterLink>
                            <FooterLink href="/layanan/laboratorium">Laboratorium</FooterLink>
                            <FooterLink href="/layanan/radiologi">Radiologi</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tautan</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/tentang-kami">Tentang Kami</FooterLink>
                            <FooterLink href={route('articles.public.index')}>Berita</FooterLink>
                            <FooterLink href="/jadwal-dokter">Jadwal Dokter</FooterLink>
                            <FooterLink href="/kontak">Kontak</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hubungi Kami</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span>(0651) 123 456</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span>info@rs-bhayangkara-aceh.id</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-semibold">Lokasi:</span>
                                <span>Jl. Teuku Nyak Arief, Banda Aceh</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="container mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} RS Bhayangkara Banda Aceh. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <SocialIcon href="#">
                            <Facebook className="h-5 w-5" />
                        </SocialIcon>
                        <SocialIcon href="#">
                            <Twitter className="h-5 w-5" />
                        </SocialIcon>
                        <SocialIcon href="#">
                            <Instagram className="h-5 w-5" />
                        </SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    )
}
