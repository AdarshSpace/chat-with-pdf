"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { Send } from "lucide-react";

interface DocumentChatProps {
  documentId: string;
}

export default function DocumentChat({ documentId }: DocumentChatProps) {
  const { messages, addMessage, setMessages, loading, setLoading } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/chat/fetch?documentId=${documentId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.chat);
        }
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };
    fetchChat();
  }, [documentId, setMessages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date().toISOString(),
      relevantChunks: [],
    };

    addMessage(userMessage); // update store immediately
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/chat?documentId=${documentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      console.log({ documentId, message: userMessage.content });
      console.log("res :", res);

      const data = await res.json();
      console.log("data :", data.AiResponse);
      if (data.success) {
        const assistantMessage = {
          role: "assistant" as const,
          content: String(data?.AiResponse ?? ""),
          timestamp: new Date().toISOString()
        };
      
        addMessage(assistantMessage);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[75vh] border rounded p-4 bg-white">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-4  rounded-2xl max-w-lg shadow-sm ${
                msg.role === "user" ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md" 
                : "bg-white border border-slate-200/60 text-slate-800 rounede-bl-md "
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your question "
          className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 foucs:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center "
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}