import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Message = { text: string; isBot: boolean };

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Halo! Saya Asisten Virtual RS Bhayangkara. Ada yang bisa saya bantu?', isBot: true }
    ]);
    const [input, setInput] = useState('');
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        const el = viewportRef.current;
        if (!el) return;
        setTimeout(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: userMsg
            });

            const botReply = response.data.reply;
            setMessages(prev => [...prev, { text: botReply, isBot: true }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { text: "Maaf, sistem sedang sibuk. Mohon coba lagi nanti.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white z-50 transition-all duration-300 hover:scale-105"
                aria-label="Open chat"
            >
                <MessageCircle className="h-7 w-7" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300 border-0 overflow-hidden rounded-2xl ring-1 ring-black/5">

            <div className="flex flex-row items-center justify-between p-3 bg-slate-900 text-white shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="bg-white/10 p-1.5 rounded-lg">
                        <Bot className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold leading-none">Asisten Virtual</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Online • RS Bhayangkara</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 min-h-0 bg-white flex flex-col relative">
                <ScrollArea className="flex-1 px-4 py-4" viewportRef={viewportRef}>
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex w-full", msg.isBot ? "justify-start" : "justify-end")}>
                                <div className={cn(
                                    "px-3.5 py-2.5 max-w-[85%] text-sm shadow-sm break-words",
                                    msg.isBot
                                        ? "bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200/50"
                                        : "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-200/50 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="relative flex items-center"
                >
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="pr-10 h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 text-sm"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 h-8 w-8 bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-none"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <div className="text-[10px] text-center text-slate-400 mt-2">
                    Didukung oleh AI • Informasi mungkin perlu verifikasi
                </div>
            </div>
        </Card>
    );
}
