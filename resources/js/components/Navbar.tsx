import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import {
    LayoutDashboard,
    LogIn,
    ChevronRight,
    ChevronDown,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Pill,
    Menu,
    X,
    Home,
    Newspaper,
    Calendar,
    Phone,
} from 'lucide-react'

type NavbarProps = {
    auth: {
        user: {
            id: number;
            name: string;
            roles?: { name: string }[];
        } | null
    }
    navbar: {
        featured_articles: Array<{
            id: number
            title: string
            slug: string
            image: string | null
            body?: string
            published_at: string
        }>
    }
}

const imgUrl = (path: string | null) =>
    path ? `/storage/${path}` : 'https://placehold.co/100x100/f1f5f9/94a3b8?text=IMG'

export default function Navbar() {
    const { auth, navbar } = usePage<NavbarProps>().props
    const user = auth?.user
    const [mobileOpen, setMobileOpen] = useState(false)
    const [newsOpen, setNewsOpen] = useState(false)

    const dashboardRoute = user?.roles?.some(r => r.name === 'admin')
        ? route('admin.dashboard')
        : route('dashboard')

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const closeMobile = () => {
        setMobileOpen(false)
        setNewsOpen(false)
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">

                <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 hidden lg:block">
                    <div className="container mx-auto max-w-screen-2xl flex justify-between items-center px-4">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded font-bold text-[10px] tracking-wide uppercase">IGD 24 Jam</span>
                                <span className="font-semibold text-white tracking-wide font-mono">(0651) 123-456</span>
                            </span>
                            <span className="hidden xl:inline text-slate-400">
                                Jl. Cut Nyak Dhien No.23, Lamtemen Bar., Kec. Jaya Baru, Kota Banda Aceh, Aceh 23232
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-500">Ikuti Kami:</span>
                            <div className="flex items-center gap-3">
                                <a href="#" className="hover:text-white transition-colors"><Facebook className="h-3.5 w-3.5" /></a>
                                <a href="#" className="hover:text-white transition-colors"><Instagram className="h-3.5 w-3.5" /></a>
                                <a href="#" className="hover:text-white transition-colors"><Twitter className="h-3.5 w-3.5" /></a>
                                <a href="#" className="hover:text-white transition-colors"><Youtube className="h-3.5 w-3.5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-screen-2xl flex h-16 lg:h-20 items-center justify-between px-4 lg:px-8">

                    <Link href="/" className="flex items-center gap-3 group" onClick={closeMobile}>
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/images/logo-polri.png"
                                alt="Logo Polri"
                                className="h-9 lg:h-11 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="h-8 w-[1px] bg-slate-200"></div>
                            <img
                                src="/images/logo-rs.webp"
                                alt="Logo RS Bhayangkara"
                                className="h-9 lg:h-11 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/transparent/png?text=RS'; }}
                            />
                        </div>
                        <div className="hidden sm:flex flex-col justify-center">
                            <span className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-none mb-1">
                                Kepolisian Negara Republik Indonesia
                            </span>
                            <span className="text-base lg:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                                RS BHAYANGKARA
                            </span>
                            <span className="text-[10px] lg:text-xs font-semibold text-blue-600 leading-none mt-0.5 tracking-wide">
                                BANDA ACEH
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="/" className={cn(navigationMenuTriggerStyle(), "h-10 text-base bg-transparent text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium")}>
                                        Beranda
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="h-10 text-base bg-transparent text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                                        Berita & Informasi
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[700px] lg:grid-cols-[240px_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-lg border border-slate-100 bg-slate-50 p-6 no-underline outline-none transition-colors hover:bg-slate-100 hover:border-slate-200 focus:shadow-md"
                                                        href={route('articles.public.index')}
                                                    >
                                                        <div className="mb-2 text-lg font-bold text-slate-900">Indeks Berita</div>
                                                        <p className="text-sm leading-relaxed text-slate-500 mb-4">
                                                            Jelajahi arsip lengkap berita, artikel kesehatan, dan agenda kegiatan terbaru.
                                                        </p>
                                                        <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group">
                                                            Lihat Semua <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>

                                            <div className="flex flex-col gap-2">
                                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    Terbaru
                                                </div>
                                                {navbar.featured_articles.map((article) => (
                                                    <ListItem
                                                        key={article.id}
                                                        href={route('articles.public.show', article.slug)}
                                                        title={article.title}
                                                        image={article.image}
                                                        body={article.body}
                                                        date={article.published_at}
                                                    />
                                                ))}
                                                {navbar.featured_articles.length === 0 && (
                                                    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                                        Belum ada berita terbaru.
                                                    </div>
                                                )}
                                            </div>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Link href="/jadwal-dokter" className={cn(navigationMenuTriggerStyle(), "h-10 text-base bg-transparent text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium")}>
                                        Jadwal Dokter
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Link href={route('medicines.public.index')} className={cn(navigationMenuTriggerStyle(), "h-10 text-base bg-transparent text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium")}>
                                        Obat-Obatan
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        {user ? (
                            <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm h-9 lg:h-10 px-3 lg:px-5 rounded-md text-sm font-medium">
                                <Link href={dashboardRoute} className="flex items-center gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 h-9 lg:h-10 px-3 lg:px-5 rounded-md text-sm font-medium hover:text-blue-700 hover:border-blue-200">
                                <Link href={route('login')} className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    <span className="hidden sm:inline">Masuk</span>
                                </Link>
                            </Button>
                        )}

                        <button
                            id="mobile-menu-toggle"
                            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className={cn("transition-all duration-200", mobileOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100")}>
                                <Menu className="h-5 w-5" />
                            </span>
                            <span className={cn("transition-all duration-200", mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute")}>
                                <X className="h-5 w-5" />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={cn(
                    "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={closeMobile}
                aria-hidden="true"
            />

            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">RS Bhayangkara</span>
                        <span className="text-sm font-extrabold text-slate-900 tracking-tight">Banda Aceh</span>
                    </div>
                    <button
                        onClick={closeMobile}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 bg-red-600 text-white">
                    <Phone className="h-4 w-4 shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">IGD 24 Jam</p>
                        <a href="tel:0651123456" className="font-mono font-bold text-sm hover:opacity-80 transition-opacity">
                            (0651) 123-456
                        </a>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-3">
                    <MobileNavLink href="/" icon={Home} onClick={closeMobile}>
                        Beranda
                    </MobileNavLink>

                    <div>
                        <button
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors text-sm font-semibold"
                            onClick={() => setNewsOpen(o => !o)}
                        >
                            <Newspaper className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                            <span className="flex-1 text-left">Berita & Informasi</span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                                    newsOpen ? "rotate-180" : ""
                                )}
                            />
                        </button>

                        <div className={cn(
                            "overflow-hidden transition-all duration-300",
                            newsOpen ? "max-h-[600px]" : "max-h-0"
                        )}>
                            <div className="bg-slate-50 border-t border-b border-slate-100 px-5 py-3 space-y-1">
                                <Link
                                    href={route('articles.public.index')}
                                    onClick={closeMobile}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    <span>Indeks Berita</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>

                                {navbar.featured_articles.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">Terbaru</p>
                                        <div className="space-y-1">
                                            {navbar.featured_articles.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href={route('articles.public.show', article.slug)}
                                                    onClick={closeMobile}
                                                    className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-white transition-colors group"
                                                >
                                                    <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-slate-200">
                                                        <img
                                                            src={imgUrl(article.image)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                                                            {article.title}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            {dayjs(article.published_at).format('DD MMM YYYY')}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <MobileNavLink href="/jadwal-dokter" icon={Calendar} onClick={closeMobile}>
                        Jadwal Dokter
                    </MobileNavLink>

                    <MobileNavLink href={route('medicines.public.index')} icon={Pill} onClick={closeMobile}>
                        Obat-Obatan
                    </MobileNavLink>
                </nav>

                {/* Drawer footer — social + auth */}
                <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-medium">Ikuti Kami:</span>
                        <div className="flex items-center gap-2">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {user ? (
                        <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 font-medium">
                            <Link href={dashboardRoute} onClick={closeMobile} className="flex items-center justify-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="w-full border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-200 h-10 font-medium">
                            <Link href={route('login')} onClick={closeMobile} className="flex items-center justify-center gap-2">
                                <LogIn className="h-4 w-4" />
                                Masuk ke Akun
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}

const MobileNavLink = ({
    href,
    icon: Icon,
    onClick,
    children,
}: {
    href: string
    icon: React.ElementType
    onClick: () => void
    children: React.ReactNode
}) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-3 px-5 py-3.5 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors text-sm font-semibold"
    >
        <Icon className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        {children}
    </Link>
)

const ListItem = ({ className, title, image, date, body, href, ...props }: any) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        "group flex flex-row items-start w-full gap-4 select-none rounded-lg p-3 no-underline outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50",
                        className
                    )}
                    {...props}
                >
                    <div className="shrink-0 h-16 w-24 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                            src={imgUrl(image)}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 truncate">
                            {title}
                        </div>
                        <div className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {body || 'Belum ada deskripsi.'}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
                            {dayjs(date).format('DD MMM YYYY')}
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
