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
    Newspaper,
    ChevronRight,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    Youtube
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

    const dashboardRoute = user?.roles?.some(r => r.name === 'admin')
        ? route('admin.dashboard')
        : route('dashboard')

    return (
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

            <div className="container mx-auto max-w-screen-2xl flex h-20 items-center justify-between px-4 lg:px-8">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-polri.png"
                            alt="Logo Polri"
                            className="h-11 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />

                        <div className="h-9 w-[1px] bg-slate-200"></div>

                        <img
                            src="/images/logo-rs.png"
                            alt="Logo RS Bhayangkara"
                            className="h-11 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/transparent/png?text=RS'; }}
                        />
                    </div>

                    <div className="hidden md:flex flex-col justify-center">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-none mb-1">
                            Kepolisian Negara Republik Indonesia
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                            RS BHAYANGKARA
                        </span>
                        <span className="text-xs font-semibold text-blue-600 leading-none mt-0.5 tracking-wide">
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
                                                    <div className="mb-2 text-lg font-bold text-slate-900">
                                                        Indeks Berita
                                                    </div>
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
                                                >
                                                </ListItem>
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
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm h-10 px-5 rounded-md text-sm font-medium">
                            <Link href={dashboardRoute} className="flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 h-10 px-5 rounded-md text-sm font-medium hover:text-blue-700 hover:border-blue-200">
                            <Link href={route('login')} className="flex items-center gap-2">
                                <LogIn className="h-4 w-4" />
                                <span>Masuk</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}

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
