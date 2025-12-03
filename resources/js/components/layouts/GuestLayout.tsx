import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import CookieConsent from '@/components/CookiesConsent'

interface GuestLayoutProps {
    children: ReactNode
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col relative">
            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
            <ChatWidget />
            <CookieConsent />
        </div>
    )
}
