import { Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {LogOut, Settings, User as UserIcon, Bell, ChevronsUpDown, HomeIcon} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import DynamicBreadcrumb from '@/components/layouts/DynamicBreadcrumb'

export default function DashboardHeader() {
    const { auth } = usePage().props as any
    const user = auth?.user

    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || 'U'
    }

    return (
        <header className="sticky bg-slate-950 top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-slate-50 hover:text-slate-600" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
                <div className="hidden md:block">
                    <DynamicBreadcrumb />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-50 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifikasi</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-full justify-start gap-3 rounded-lg px-2 hover:bg-slate-800 md:w-auto text-left transition-colors">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={user?.profile_photo_url} alt={user?.name} className="object-cover" />
                                <AvatarFallback className="bg-orange-400 text-primary font-medium">
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-50 hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-black">{user?.name}</p>
                                <p className="text-xs leading-none text-slate-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={"/"} className="w-full cursor-pointer flex items-center">
                                    <HomeIcon className="mr-2 h-4 w-4 text-black-500 hover:text-slate-500 transition-colors dark:text-slate-400 dark:hover:text-white" />
                                    <span>Beranda</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={"#"} className="w-full cursor-pointer flex items-center">
                                    <UserIcon className="mr-2 h-4 w-4 text-black-500 hover:text-slate-500 transition-colors dark:text-slate-400 dark:hover:text-white" />
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4 text-black-500 hover:text-slate-500 transition-colors dark:text-slate-400 dark:hover:text-white" />
                                <span>Pengaturan</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full cursor-pointer flex items-center text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
