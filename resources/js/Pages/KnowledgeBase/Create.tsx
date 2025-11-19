import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import AdminLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, Loader2, Info } from 'lucide-react'

export default function KnowledgeBaseCreate() {
    const { errors: pageErrors } = usePage().props
    const { data, setData, post, processing, errors } = useForm({
        content: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('knowledge.store'))
    }

    return (
        <AdminLayout title="Tambah Pengetahuan">
            <Head title="Tambah Pengetahuan Baru" />
            <div className="container mx-auto max-w-3xl p-6">
                <div className="mb-6">
                    <Button asChild variant="ghost" className="pl-0">
                        <Link href={route('knowledge.index')}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Link>
                    </Button>
                </div>
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Pengetahuan Baru</CardTitle>
                            <CardDescription>
                                Tulis informasi detail yang akan digunakan chatbot.
                                Buat satu catatan per topik (cth: satu untuk jam besuk, satu untuk biaya MCU).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pageErrors.api_error && (
                                <Alert variant="destructive" className="mb-4">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{pageErrors.api_error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="content">Informasi / Catatan (Wajib)</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Contoh: Jam besuk pasien di RS Bhayangkara adalah pukul 17:00 - 19:00 setiap hari Senin-Jumat, dan pukul 11:00 - 13:00 di hari Sabtu & Minggu."
                                    rows={15}
                                />
                                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Pengetahuan
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    )
}
