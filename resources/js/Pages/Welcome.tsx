// resources/js/Pages/Welcome.tsx
import { Head, usePage } from '@inertiajs/react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedSection from '@/components/sections/FeaturedSection'
import ArticlesSection from '@/components/sections/ArticleSection'
import Footer from '@/components/Footer'
import { ArticleSummary } from '@/types'
import CtaSection from "@/components/sections/CtaSection";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookiesConsent"
import FaqSection from "@/components/sections/Faq";
import DoctorScheduleSection from "@/components/sections/ScheduleSection";

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
}

export default function Welcome() {
    const { auth, articles, schedules } = usePage<WelcomePageProps>().props
    const user = auth?.user
    const latestArticles = articles as ArticleSummary[] | undefined

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
                <DoctorScheduleSection schedules={schedules}/>
                <ArticlesSection articles={latestArticles ?? []} />
                <FaqSection/>
                <CtaSection/>
            </main>
            <Footer />
            <ChatWidget />
            <CookieConsent/>
        </>
    )
}
