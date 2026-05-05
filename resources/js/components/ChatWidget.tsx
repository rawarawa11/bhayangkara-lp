import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
    text: string;
    isBot: boolean;
    timestamp: Date;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const QUICK_QUESTIONS = [
    'Apa saja layanan yang tersedia?',
    'Bagaimana cara mendaftar rawat jalan?',
    'Berapa jam operasional apotek?',
    'Jadwal dokter spesialis hari ini?',
    'Bagaimana prosedur IGD?',
    'Apakah menerima BPJS Kesehatan?',
];

const GREETING = 'Halo! 👋 Saya **Asisten Virtual RS Bhayangkara**. Saya siap membantu menjawab pertanyaan Anda seputar layanan rumah sakit.\n\nSilakan pilih topik di bawah atau ketik pertanyaan Anda.';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Render plain-text with **bold** and newlines into JSX */
function renderText(text: string) {
    return text.split('\n').map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={lineIdx}>
                {parts.map((part, i) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={i}>{part.slice(2, -2)}</strong>
                        : <span key={i}>{part}</span>
                )}
                {lineIdx < text.split('\n').length - 1 && <br />}
            </span>
        );
    });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function BotAvatar() {
    return (
        <div className="shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm mt-0.5">
            <Bot className="h-3.5 w-3.5 text-white" />
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-200/70 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
}

function QuickQuestions({ onSelect }: { onSelect: (q: string) => void }) {
    return (
        <div className="px-4 pb-3 pt-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-blue-400" />
                Pertanyaan Umum
            </p>
            <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                    <button
                        key={q}
                        onClick={() => onSelect(q)}
                        className="text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-full px-3 py-1.5 transition-all duration-150 hover:shadow-sm active:scale-95 text-left leading-tight"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: GREETING, isBot: true, timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Only show quick questions before the first user message
    const hasUserMessage = messages.some(m => !m.isBot);

    const scrollToBottom = () => {
        const el = viewportRef.current;
        if (!el) return;
        setTimeout(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }, 80);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const sendMessage = async (text?: string) => {
        const userMsg = (text ?? input).trim();
        if (!userMsg || isLoading) return;

        setMessages(prev => [...prev, { text: userMsg, isBot: false, timestamp: new Date() }]);
        setInput('');
        setIsLoading(true);

        try {
            // Attach CSRF token if available (web session cookies)
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

            const response = await axios.post('/api/chat', { message: userMsg }, {
                headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
            });

            const botReply = response.data.reply ?? 'Maaf, saya tidak mendapatkan respons.';
            setMessages(prev => [...prev, { text: botReply, isBot: true, timestamp: new Date() }]);
        } catch {
            setMessages(prev => [...prev, {
                text: 'Maaf, sistem sedang sibuk. Mohon coba lagi dalam beberapa saat. 🙏',
                isBot: true,
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([{ text: GREETING, isBot: true, timestamp: new Date() }]);
        setInput('');
    };

    // ── Closed state: FAB button ──────────────────────────────────────────────
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Buka asisten virtual"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white z-50 transition-all duration-300 hover:scale-110 hover:shadow-blue-300/50 flex items-center justify-center group"
            >
                <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-25 pointer-events-none" />
            </button>
        );
    }

    // ── Open state: Chat panel ────────────────────────────────────────────────
    return (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[390px] h-[560px] flex flex-col shadow-2xl z-50 rounded-2xl ring-1 ring-black/10 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 bg-white">

            {/* Header */}
            <div className="shrink-0 bg-white border-b border-slate-100">
                {/* Top strip — blue accent */}
                <div className="h-1 w-full bg-blue-600" />

                <div className="flex items-center justify-between px-4 py-3">
                    {/* Identity */}
                    <div className="flex items-center gap-3">
                        {/* Hospital logo */}
                        <div className="relative shrink-0">
                            <img
                                src="/images/logo-rs.webp"
                                alt="RS Bhayangkara"
                                className="h-9 w-9 rounded-lg object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }}
                            />
                            {/* Fallback initials */}
                            <div className="h-9 w-9 rounded-lg bg-blue-600 items-center justify-center hidden">
                                <span className="text-xs font-black text-white">RS</span>
                            </div>
                            {/* Online dot */}
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                        </div>

                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                                RS Bhayangkara
                            </p>
                            <h3 className="text-sm font-bold text-slate-900 leading-none">
                                Pusat Layanan Informasi
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                                Banda Aceh &middot; Aktif sekarang
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-0.5">
                        <button
                            onClick={handleReset}
                            title="Mulai percakapan baru"
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Tutup chat"
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 min-h-0 bg-slate-50/80 flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 py-4" ref={viewportRef}>
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex w-full gap-2",
                                    msg.isBot ? "justify-start items-end" : "justify-end items-end"
                                )}
                            >
                                {/* Bot avatar — only left side */}
                                {msg.isBot && <BotAvatar />}

                                <div className={cn(
                                    "flex flex-col gap-1",
                                    msg.isBot ? "items-start" : "items-end"
                                )}>
                                    <div className={cn(
                                        "px-3.5 py-2.5 max-w-[82%] text-sm shadow-sm break-words leading-relaxed",
                                        msg.isBot
                                            ? "bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200/60"
                                            : "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm"
                                    )}>
                                        {renderText(msg.text)}
                                    </div>
                                    <span className="text-[9px] text-slate-400 px-1">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && <TypingIndicator />}
                    </div>
                </div>

                {/* Quick question chips — only before first user message */}
                {!hasUserMessage && !isLoading && (
                    <QuickQuestions onSelect={(q) => sendMessage(q)} />
                )}
            </div>

            {/* Input area */}
            <div className="px-3 py-3 bg-white border-t border-slate-100 shrink-0">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex items-center gap-2"
                >
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ketik pertanyaan Anda…"
                        className="flex-1 h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-sm rounded-xl"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-none shrink-0 disabled:opacity-40"
                    >
                        {isLoading
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Send className="h-4 w-4" />
                        }
                    </Button>
                </form>
                <p className="text-[9px] text-center text-slate-400 mt-2 leading-tight">
                    Didukung oleh Gemini AI · Informasi sebaiknya diverifikasi ke petugas RS
                </p>
            </div>
        </div>
    );
}
