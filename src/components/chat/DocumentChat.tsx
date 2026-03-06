"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";

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
        const res = await fetch(`/api/chat?documentId=${documentId}`);
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
      role: "user",
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
          role: "assistant",
          content: data.AiResponse,
          timestamp: new Date(),
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
    <div className="flex flex-col h-full border rounded p-4 bg-white">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded max-w-[70%] ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
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
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}