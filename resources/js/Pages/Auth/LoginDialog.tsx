import { useForm } from '@inertiajs/react'
import {route} from 'ziggy-js'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupButton,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ReactNode, useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, HospitalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {Spinner} from "@/components/ui/spinner";

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
        <form onSubmit={submit} className="grid gap-4">
            <div className="text-center mb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    <HospitalIcon className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    RS Bhayangkara Banda Aceh
                </h2>
                <p className="text-sm text-gray-600">Silakan masuk untuk melanjutkan</p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email Institusi</Label>
                <InputGroup>
                    <InputGroupAddon>
                        <MailIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="contoh@rsbhayangkara.go.id"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="email"
                        disabled={processing}
                    />
                </InputGroup>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <InputGroup>
                    <InputGroupAddon>
                        <LockIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan kata sandi"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        disabled={processing}
                    />
                    <InputGroupButton
                        type="button"
                        aria-label="Tampilkan kata sandi"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        className={cn('mr-1')}
                    >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </InputGroupButton>
                </InputGroup>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                    disabled={processing}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                    Ingat saya
                </Label>
            </div>

            <Button type="submit" disabled={processing} className="bg-amber-600 hover:bg-amber-700">
                {processing ? <Spinner/> : ''}
                {processing ? 'Sedang diproses …' : 'Masuk'}
            </Button>
        </form>
    )
}

export default function LoginDialog({ children }: { children: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}
