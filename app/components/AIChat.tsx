"use client";
import { useState, useRef, useEffect } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "describe the website you want to bring to life." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "connection lost. try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
              m.role === "user" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-muted/50 border border-border/50 backdrop-blur-md"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted/50 rounded-2xl px-5 py-3 text-sm animate-pulse">
              🌸 crafting...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 mt-auto">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="e.g. create a dark landing page for a coffee shop..."
            className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
