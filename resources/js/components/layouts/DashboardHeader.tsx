import { Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { LogOut, Settings, User as UserIcon, Bell, ChevronsUpDown } from 'lucide-react'
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
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
                <div className="hidden md:block">
                    <DynamicBreadcrumb />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifikasi</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-full justify-start gap-3 rounded-lg px-2 hover:bg-accent md:w-auto text-left transition-colors">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={user?.profile_photo_url} alt={user?.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-foreground">{user?.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </div>

                            <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground hidden md:block" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={"#"} className="w-full cursor-pointer flex items-center">
                                    <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Settings</span>
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
