import {Head, useForm } from '@inertiajs/react'
import {route} from 'ziggy-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
    InputGroupAddon,
} from '@/components/ui/input-group'
import {
    Field,
    FieldDescription,
    FieldContent,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import {UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, HospitalIcon} from 'lucide-react'
import {cn} from "@/lib/utils";
import Navbar from "@/components/Navbar";
import {Spinner} from "@/components/ui/spinner";

function RegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('register'))
    }

    return (
        <Card className="w-md max-w-full shadow-none">
            <CardHeader>
                <div className="text-center mb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <HospitalIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                        RS Bhayangkara Banda Aceh
                    </h2>
                    <p className="text-sm text-gray-600">Silakan masuk untuk melanjutkan</p>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                                <FieldDescription>Masukkan nama sesuai identitas.</FieldDescription>
                                <FieldContent>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <UserIcon />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="name"
                                            type="text"
                                            placeholder="Nama lengkap"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            aria-invalid={!!errors.name}
                                            disabled={processing}
                                        />
                                    </InputGroup>
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <FieldDescription>Gunakan email aktif Anda.</FieldDescription>
                                <FieldContent>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <MailIcon />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="email"
                                            type="email"
                                            placeholder="pengguna123@gmail.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            aria-invalid={!!errors.email}
                                            disabled={processing}
                                            autoComplete="email"
                                        />
                                    </InputGroup>
                                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                                <FieldDescription>Minimal 8 karakter.</FieldDescription>
                                <FieldContent>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <LockIcon />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Buat kata sandi"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            aria-invalid={!!errors.password}
                                            disabled={processing}
                                            autoComplete="new-password"
                                        />
                                        <InputGroupButton
                                            type="button"
                                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                            onClick={() => setShowPassword((v) => !v)}
                                            variant="ghost"
                                            className={cn('mr-1')}
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </InputGroupButton>
                                    </InputGroup>
                                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password_confirmation">Konfirmasi Kata Sandi</FieldLabel>
                                <FieldContent>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <LockIcon />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="password_confirmation"
                                            type={showPassword2 ? 'text' : 'password'}
                                            placeholder="Ulangi kata sandi"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            autoComplete="new-password"
                                        />
                                        <InputGroupButton
                                            type="button"
                                            aria-label={showPassword2 ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                                            onClick={() => setShowPassword2((v) => !v)}
                                            variant="ghost"
                                            className={cn('mr-1')}
                                        >
                                            {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
                                        </InputGroupButton>
                                    </InputGroup>
                                </FieldContent>
                            </Field>

                        </FieldGroup>
                    </FieldSet>

                    <CardFooter className="px-0">
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? <Spinner/> : ''}
                            {processing ? 'Mendaftarkan…' : 'Daftar'}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    )
}

export default function Register() {
    return (
        <>
            <Head>
                <title>Daftar Akun</title>
                <meta name="description" content="Buat akun baru untuk mulai menggunakan layanan." />
            </Head>

            <div className="flex flex-col min-h-screen bg-yellow-50 dark:bg-background">
                <Navbar />
                <main className="flex mx-auto flex-grow items-center justify-center p-4">
                    <RegisterForm />
                </main>
            </div>
        </>
    )
}


