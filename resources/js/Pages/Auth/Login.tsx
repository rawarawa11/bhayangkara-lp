import {Head, useForm} from '@inertiajs/react'
import { route } from 'ziggy-js'
import { useState } from "react";
import {HospitalIcon, LockIcon, MailIcon, UserIcon} from "lucide-react";
import {
    EyeIcon,
    EyeOffIcon,
} from 'lucide-react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupButton,
} from '@/components/ui/input-group'
import {Label} from "@/components/ui/label";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet
} from "@/components/ui/field";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner';

function LoginFrom() {
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
                                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                        </FieldGroup>
                    </FieldSet>

                    <CardFooter className="px-0">
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? <Spinner/> : ''}
                            {processing ? 'Sedang Masuk…' : 'Masuk'}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    )
}

export default function Login() {
    return (
        <>
            <Head>
                <title>Login Akun</title>
                <meta name="description" content="Buat akun baru untuk mulai menggunakan layanan." />
            </Head>

            <div className="flex flex-col min-h-screen bg-yellow-50 dark:bg-background">
                <Navbar />
                <main className="flex mx-auto flex-grow items-center justify-center p-4">
                    <LoginFrom />
                </main>
            </div>
        </>
    )
}
