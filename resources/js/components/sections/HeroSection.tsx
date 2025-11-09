import { Button } from '@/components/ui/button'
import LoginDialog from '@/Pages/Auth/LoginDialog'
import { Hospital } from 'lucide-react'

type User = {
    id: number;
    name: string;
    email: string;
}

type HeroProps = {
    user: User | null | undefined;
}

export default function HeroSection({ user }: HeroProps) {
    return (
        <section className="flex min-h-[60vh] items-center justify-center bg-yellow-50 py-20">
            <div className="text-center max-w-lg px-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-600/10">
                    <Hospital className="h-12 w-12 text-amber-700" />
                </div>
                <h1 className="text-4xl font-bold text-black">RS Bhayangkara Banda Aceh</h1>
                <p className="mt-3 text-lg text-gray-700">
                    Pelayanan kesehatan untuk anggota Polri, ASN, dan masyarakat umum dengan dedikasi dan profesionalisme tinggi.
                </p>
                {!user && (
                    <div className="mt-8">
                        <LoginDialog>
                            <Button className="bg-amber-400 hover:bg-amber-600 text-white px-6 py-2 rounded-md shadow-md">
                                Masuk
                            </Button>
                        </LoginDialog>
                    </div>
                )}
            </div>
        </section>
    )
}
