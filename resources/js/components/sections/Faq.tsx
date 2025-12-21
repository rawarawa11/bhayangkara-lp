import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "Apakah RS Bhayangkara hanya melayani anggota Polri?",
        answer: "Tidak. RS Bhayangkara Banda Aceh terbuka untuk umum. Kami melayani masyarakat sipil, peserta BPJS Kesehatan, Asuransi Swasta, serta Anggota Polri/ASN dan keluarganya dengan standar pelayanan yang sama."
    },
    {
        question: "Apakah RS Bhayangkara menerima pasien BPJS Kesehatan?",
        answer: "Ya, kami menerima pasien BPJS Kesehatan. Pastikan Anda membawa kartu BPJS aktif dan surat rujukan dari Faskes Tingkat 1 (Puskesmas/Klinik) untuk layanan rawat jalan, kecuali untuk kasus Gawat Darurat (IGD) yang dapat dilayani langsung tanpa rujukan."
    },
    {
        question: "Bagaimana jadwal jam besuk pasien rawat inap?",
        answer: "Untuk kenyamanan dan pemulihan pasien, jam besuk diatur sebagai berikut: Siang pukul 12.00 - 14.00 WIB dan Sore/Malam pukul 17.00 - 20.00 WIB. Peraturan ini dapat berubah menyesuaikan kondisi pandemi atau kebijakan rumah sakit."
    },
    {
        question: "Apakah tersedia layanan Visum et Repertum?",
        answer: "Ya. Sebagai Rumah Sakit Kepolisian, kami memiliki Instalasi Forensik dan Medikolegal yang melayani pembuatan Visum et Repertum untuk keperluan hukum (korban kekerasan, kecelakaan lalu lintas, dll) berdasarkan permintaan tertulis dari penyidik kepolisian."
    },
    {
        question: "Bagaimana cara melakukan pendaftaran rawat jalan?",
        answer: "Pendaftaran dapat dilakukan secara langsung di loket pendaftaran (On-site) mulai pukul 07.30 WIB. Untuk pasien lama, disarankan membawa kartu berobat. Kami juga sedang mengembangkan sistem pendaftaran online untuk memudahkan antrian."
    },
    {
        question: "Layanan apa saja yang tersedia di IGD?",
        answer: "IGD kami beroperasi 24 jam dengan fasilitas Trauma Center, Bedah Minor, Resusitasi Jantung Paru, dan Ambulans Gawat Darurat. Tim dokter jaga dan perawat siap menangani kasus kegawatdaruratan medis maupun kecelakaan."
    }
]

export default function FaqSection() {
    return (
        <section className="bg-white py-20 lg:py-28 border-t border-slate-100">
            <div className="container mx-auto max-w-4xl px-6">

                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                        Informasi Umum
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Jawaban atas pertanyaan umum seputar layanan dan operasional RS Bhayangkara Banda Aceh.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-b border-slate-200 last:border-0 mb-4"
                        >
                            <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-blue-700 hover:no-underline py-5 px-4 rounded-lg transition-colors data-[state=open]:bg-slate-50 data-[state=open]:text-blue-700">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed px-4 pb-6 pt-2 text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

            </div>
        </section>
    )
}
