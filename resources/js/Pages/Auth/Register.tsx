import { Head, useForm, Link } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Hospital, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { cn } from "@/lib/utils"

function RegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('register'))
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Hospital className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                    Buat Akun Baru
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Bergabunglah untuk mengakses layanan kesehatan RS Bhayangkara
                </p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nama lengkap sesuai identitas"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={cn(
                                    "pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                                    errors.name && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={processing}
                                autoComplete="name"
                            />
                        </div>
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Minimal 8 karakter"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={cn(
                                    "pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                                    errors.password && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={processing}
                                autoComplete="new-password"
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

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Ulangi kata sandi"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                disabled={processing}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
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
                            Mendaftarkan...
                        </>
                    ) : (
                        'Daftar Sekarang'
                    )}
                </Button>

                <p className="text-center text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="font-semibold text-blue-600 hover:text-blue-500">
                        Masuk di sini
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default function Register() {
    return (
        <>
            <Head title="Daftar Akun - RS Bhayangkara" />

            <div className="min-h-screen grid lg:grid-cols-2">
                <div className="flex flex-col justify-center items-center p-8 bg-white relative order-2 lg:order-1">
                    <div className="absolute top-8 left-8">
                        <Button asChild variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-900">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} RS Bhayangkara Banda Aceh. All rights reserved.
                    </div>
                </div>

                <div className="hidden lg:block relative bg-slate-900 overflow-hidden order-1 lg:order-2">
                    <img
                        src="https://images.unsplash.com/photo-1538108149393-fbbd8189718c?q=80&w=1974&auto=format&fit=crop"
                        alt="Medical Team"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-slate-900/50 flex flex-col justify-end p-16 text-white">
                        <div className="max-w-md">
                            <div className="mb-6 h-1 w-12 bg-blue-500 rounded-full"></div>
                            <blockquote className="text-2xl font-medium leading-relaxed">
                                "Bergabunglah bersama kami untuk mendapatkan akses layanan kesehatan yang mudah, cepat, dan terintegrasi."
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
