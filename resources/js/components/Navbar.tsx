import { Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react" // Icons

const getInitials = (name: string) => {
    if (!name) return '?'
    const names = name.split(' ')
    const initials = names.map(n => n[0]).join('')
    return initials.toUpperCase().substring(0, 2)
}

export default function Navbar() {
    const { props } = usePage()
    const user = (props as any)?.auth?.user

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

                <div className="flex items-center gap-4">
                    <Link href={route('home') ?? '/'} className="font-semibold">
                        RS Bhayangkara
                    </Link>

                    <NavigationMenu className="hidden sm:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={route('home') ?? '/'}>Beranda</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {user && (
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={route('dashboard')}>Dashboard</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        {/* Update this src if your user object uses a different property
                                          e.g., user.avatar or user.image
                                        */}
                                        <AvatarImage src={user.profile_photo_url} alt={user.name} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('dashboard')}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('register')}>Daftar</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('login')}>Login</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
