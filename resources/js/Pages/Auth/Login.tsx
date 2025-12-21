import { Head, useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState } from "react"
import { Hospital, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react" // Use consistent imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" // Assuming you have this component
import { cn } from "@/lib/utils"

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
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Hospital className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                    Selamat Datang Kembali
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Silakan masuk ke akun RS Bhayangkara Anda
                </p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={cn(
                                    "pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                                    errors.email && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={processing}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Kata Sandi</Label>
                            {/* Forgot Password Link could go here */}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={cn(
                                    "pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                                    errors.password && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={processing}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                            >
                                Ingat saya
                            </label>
                        </div>
                        <Link
                            href="#" // Replace with your forgot password route if exists
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Lupa kata sandi?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/30"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        'Masuk'
                    )}
                </Button>

                <p className="text-center text-sm text-slate-600">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="font-semibold text-blue-600 hover:text-blue-500">
                        Daftar sekarang
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default function Login() {
    return (
        <>
            <Head title="Masuk - RS Bhayangkara" />

            <div className="min-h-screen grid lg:grid-cols-2">

                {/* Left Side: The Form */}
                <div className="flex flex-col justify-center items-center p-8 bg-white relative">
                    {/* Back Button */}
                    <div className="absolute top-8 left-8">
                        <Button asChild variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-900">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>

                    <LoginForm />

                    <div className="mt-8 text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} RS Bhayangkara Banda Aceh. All rights reserved.
                    </div>
                </div>

                <div className="hidden lg:block relative bg-slate-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                        alt="Hospital Interior"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-slate-900/50 flex flex-col justify-end p-16 text-white">
                        <div className="max-w-md">
                            <div className="mb-6 h-1 w-12 bg-blue-500 rounded-full"></div>
                            <blockquote className="text-2xl font-medium leading-relaxed">
                                "Pelayanan kesehatan yang profesional, modern, dan terpercaya bagi masyarakat dan anggota Polri."
                            </blockquote>
                            <div className="mt-6 flex items-center gap-4">
                                <img
                                    src="/images/logo-polri.png"
                                    alt="Logo Polri"
                                    className="h-10 w-auto opacity-80"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                                <div className="text-sm font-semibold opacity-80">
                                    RS Bhayangkara<br/>Banda Aceh
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
