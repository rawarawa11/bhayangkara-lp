import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Cookie } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion' // Optional: install framer-motion for smooth animation

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Cek apakah user sudah pernah setuju
        const consent = localStorage.getItem('cookie_consent')
        if (!consent) {
            // Beri sedikit delay agar tidak kaget saat load page
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center pointer-events-none">
            {/* Pointer events auto agar bisa klik tombol, tapi area kosong tembus pandang */}
            <Card className="pointer-events-auto w-full max-w-4xl bg-white/95 backdrop-blur shadow-2xl border-t md:border md:rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 animate-in slide-in-from-bottom-10 fade-in duration-500">

                <div className="flex items-start gap-4 flex-1">
                    <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Cookie className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">Kami menghargai privasi Anda</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Website RS Bhayangkara menggunakan cookie untuk menganalisis trafik pengunjung dan meningkatkan pengalaman pelayanan kami. Data Anda aman bersama kami.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        onClick={handleAccept}
                        className="w-full md:w-auto whitespace-nowrap bg-blue-700 hover:bg-blue-800"
                    >
                        Saya Mengerti
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVisible(false)}
                        className="shrink-0 text-gray-400 hover:text-gray-900 md:hidden"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

            </Card>
        </div>
    )
}
