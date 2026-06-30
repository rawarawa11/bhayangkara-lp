// resources/js/Pages/Welcome.tsx
import { lazy, Suspense } from 'react'
import { Head, usePage } from '@inertiajs/react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import { ArticleSummary, Medicine } from '@/types'

import FeaturedSection from '@/components/sections/FeaturedSection'
import MedicineSection from '@/components/sections/MedicineSection'

// Lazy-load sections that are completely below the fold
const DoctorScheduleSection = lazy(() => import('@/components/sections/ScheduleSection'))
const ArticlesSection      = lazy(() => import('@/components/sections/ArticleSection'))
const FaqSection           = lazy(() => import('@/components/sections/Faq'))
const CtaSection           = lazy(() => import('@/components/sections/CtaSection'))
const Footer               = lazy(() => import('@/components/Footer'))
const ChatWidget           = lazy(() => import('@/components/ChatWidget'))
const CookieConsent        = lazy(() => import('@/components/CookiesConsent'))

type User = {
    id: number;
    name: string;
    email: string;
}

//@ts-ignore
type WelcomePageProps = PageProps & {
    auth: { user: User | null };
    articles?: ArticleSummary[];
    schedules?: any[];
    medicines?: Medicine[];
}

export default function Welcome() {
    const { auth, articles, schedules, medicines } = usePage<WelcomePageProps>().props
    const user = auth?.user
    const latestArticles = articles as ArticleSummary[] | undefined
    const featuredMedicines = (medicines ?? []) as Medicine[]

    return (
        <>
            <Head>
                <title>Beranda Pusat Informasi</title>
                <meta name="description" content="RS Bhayangkara Banda Aceh merupakan rumah sakit kepolisian yang memberikan pelayanan kesehatan profesional dan terpercaya bagi anggota Polri, ASN, serta masyarakat umum di Banda Aceh." />
                <meta property="og:title" content="RS Bhayangkara Banda Aceh" />
                <meta property="og:description" content="Rumah sakit kepolisian terpercaya di Banda Aceh dengan pelayanan medis profesional dan fasilitas lengkap." />
                <meta property="og:image" content="/images/rs-bhayangkara-og.jpg" />
            </Head>

            <Navbar />

            <main>
                <HeroSection user={user} />
                <FeaturedSection/>
                <MedicineSection medicines={featuredMedicines} />
                <Suspense fallback={<div className="min-h-screen" />}>
                    <DoctorScheduleSection schedules={schedules}/>
                    <ArticlesSection articles={latestArticles ?? []} />
                    <FaqSection/>
                    <CtaSection/>
                </Suspense>
            </main>

            <Suspense fallback={null}>
                <Footer />
                <ChatWidget />
                <CookieConsent/>
            </Suspense>
        </>
    )
}
