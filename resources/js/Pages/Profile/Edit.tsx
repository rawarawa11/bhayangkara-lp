import { Head, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function EditProfile() {
    const user = usePage().props.auth.user

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    })

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault()
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        })
    }

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault()
        passwordForm.put(route('profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        })
    }

    return (
        <AdminLayout title="Pengaturan Akun">
            <Head title="Pengaturan Akun" />

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Pengaturan Akun</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Kelola informasi dasar profil dan pengaturan keamanan akun Anda.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Informasi Profil */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">Informasi Profil</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Perbarui nama lengkap dan alamat email yang terhubung dengan akun Anda.
                            </p>
                        </div>
                        
                        <form onSubmit={submitProfile}>
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="grid gap-2.5 max-w-md">
                                    <Label htmlFor="name" className="text-slate-700 font-medium">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={profileForm.data.name}
                                        onChange={e => profileForm.setData('name', e.target.value)}
                                        className="h-10 transition-shadow focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                    {profileForm.errors.name && <p className="text-sm text-red-500 font-medium">{profileForm.errors.name}</p>}
                                </div>

                                <div className="grid gap-2.5 max-w-md">
                                    <Label htmlFor="email" className="text-slate-700 font-medium">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={e => profileForm.setData('email', e.target.value)}
                                        className="h-10 transition-shadow focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                    {profileForm.errors.email && <p className="text-sm text-red-500 font-medium">{profileForm.errors.email}</p>}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 px-6 py-4 sm:px-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-500 w-full text-center sm:text-left">
                                    Gunakan alamat email yang aktif untuk menerima notifikasi sistem.
                                </p>
                                <div className="flex items-center gap-4 shrink-0">
                                    {profileForm.recentlySuccessful && (
                                        <span className="text-sm font-medium text-emerald-600">Berhasil disimpan.</span>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={profileForm.processing} 
                                        className="bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm h-10 px-6"
                                    >
                                        {profileForm.processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Simpan
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Keamanan Akun */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">Ubah Kata Sandi</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                            </p>
                        </div>
                        
                        <form onSubmit={submitPassword}>
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="grid gap-2.5 max-w-md">
                                    <Label htmlFor="current_password" className="text-slate-700 font-medium">Kata Sandi Saat Ini</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={e => passwordForm.setData('current_password', e.target.value)}
                                        className="h-10 transition-shadow focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                    {passwordForm.errors.current_password && <p className="text-sm text-red-500 font-medium">{passwordForm.errors.current_password}</p>}
                                </div>

                                <div className="grid gap-2.5 max-w-md">
                                    <Label htmlFor="password" className="text-slate-700 font-medium">Kata Sandi Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={e => passwordForm.setData('password', e.target.value)}
                                        className="h-10 transition-shadow focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                    {passwordForm.errors.password && <p className="text-sm text-red-500 font-medium">{passwordForm.errors.password}</p>}
                                </div>

                                <div className="grid gap-2.5 max-w-md">
                                    <Label htmlFor="password_confirmation" className="text-slate-700 font-medium">Konfirmasi Kata Sandi Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="h-10 transition-shadow focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                    {passwordForm.errors.password_confirmation && <p className="text-sm text-red-500 font-medium">{passwordForm.errors.password_confirmation}</p>}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 px-6 py-4 sm:px-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-500 w-full text-center sm:text-left">
                                    Anda mungkin akan diminta untuk masuk kembali setelah mengubah kata sandi.
                                </p>
                                <div className="flex items-center gap-4 shrink-0">
                                    {passwordForm.recentlySuccessful && (
                                        <span className="text-sm font-medium text-emerald-600">Sandi diperbarui.</span>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={passwordForm.processing} 
                                        className="bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm h-10 px-6"
                                    >
                                        {passwordForm.processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Perbarui Sandi
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    )
}
