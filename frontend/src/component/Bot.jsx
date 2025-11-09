import React, { useEffect, useRef, useState } from 'react'
import { User, Send, MessageSquare, Sparkles } from 'lucide-react'

function Bot() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const handleSendMessage = async () => {
        setLoading(true);
        if (!input.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://localhost:4002/bot/v1/message", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: input
                })
            })
            if (res.status === 200) {
                const data = await res.json();
                setMessages([...messages, { text: data.userMessage, sender: 'user' }, { text: data.botMessage, sender: 'bot' }]);
                console.log(data)
            } else if (res.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/signin';
            }
        } catch (error) {
            console.log("Error sending message:", error);
        }
        setInput("");
        setLoading(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage()
    }

    return (
        <div className='flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
            {/* Navbar */}
            <header className="sticky top-0 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50 z-50 shadow-lg">
                <div className="container mx-auto flex justify-between items-center px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            BotSpoof
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-all duration-200 border border-slate-700">
                            <User size={20} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat area */}
            <main className="flex-1 overflow-y-auto">
                <div className="w-full max-w-4xl mx-auto px-4 py-8">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center mb-6 animate-pulse">
                                <Sparkles size={32} className="text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Welcome to BotSpoof
                            </h2>
                            <p className="text-slate-400 text-lg max-w-md">
                                Your intelligent AI assistant is ready to help. Ask me anything!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                                >
                                    <div
                                        className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.sender === "user"
                                                    ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                                                    : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"
                                                }`}
                                        >
                                            {msg.sender === "user" ? (
                                                <User size={16} className="text-white" />
                                            ) : (
                                                <MessageSquare size={16} className="text-white" />
                                            )}
                                        </div>
                                        <div
                                            className={`px-5 py-3 rounded-2xl ${msg.sender === "user"
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "bg-slate-800/80 text-slate-100 border border-slate-700/50 backdrop-blur-sm"
                                                }`}
                                        >
                                            <p className="leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start animate-fadeIn">
                                    <div className="flex items-start gap-3 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                                            <MessageSquare size={16} className="text-white" />
                                        </div>
                                        <div className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Input Footer */}
            <footer className="sticky bottom-0 backdrop-blur-md bg-slate-950/80 border-t border-slate-800/50 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 bg-slate-800/50 rounded-2xl px-4 py-2 border border-slate-700/50 shadow-xl backdrop-blur-sm hover:border-slate-600/50 transition-all duration-200">
                        <input
                            type="text"
                            className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 px-2 py-2"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || loading}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
                        >
                            <Send size={18} />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                    <p className="text-center text-slate-500 text-xs mt-3">
                        BotSpoof may produce inaccurate information
                    </p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Bot