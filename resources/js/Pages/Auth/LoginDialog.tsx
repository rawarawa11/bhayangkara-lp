import { useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState, ReactNode } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, Eye, EyeOff, Hospital, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function LoginForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const [showPassword, setShowPassword] = useState(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('login'), { onSuccess: () => reset('password') })
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                    <Hospital className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Selamat Datang
                </h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                    Masuk ke akun RS Bhayangkara Anda untuk melanjutkan layanan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            className={cn(
                                "pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors",
                                errors.email && "border-red-500 focus-visible:ring-red-500"
                            )}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="email"
                            disabled={processing}
                        />
                    </div>
                    {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                            Lupa sandi?
                        </a>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={cn(
                                "pl-9 pr-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors",
                                errors.password && "border-red-500 focus-visible:ring-red-500"
                            )}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="current-password"
                            disabled={processing}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs font-medium text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                        disabled={processing}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">
                        Ingat saya di perangkat ini
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 shadow-sm"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <span className="flex items-center gap-2">
                            Masuk Akun <ArrowRight className="h-4 w-4 opacity-50" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
                Belum memiliki akun?{' '}
                <Link href={route('register')} className="font-semibold text-blue-600 hover:underline">
                    Daftar sekarang
                </Link>
            </div>
        </div>
    )
}

export default function LoginDialog({ children }: { children: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-8 gap-0">
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}
