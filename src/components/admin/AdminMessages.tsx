"use client";

import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  projectType: string | null;
  budget: string | null;
  read: boolean | null;
  createdAt: Date;
}

interface AdminMessagesProps {
  messages: Message[];
}

export function AdminMessages({ messages }: AdminMessagesProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [allMessages, setAllMessages] = useState(messages);

  const markAsRead = async (id: number) => {
    await fetch(`/api/admin/messages/${id}/read`, { method: "POST" });
    setAllMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const handleSelect = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-white font-bold text-xl">Messages</h1>
          <p className="text-neutral-600 text-sm">
            {allMessages.filter((m) => !m.read).length} unread of {allMessages.length} total
          </p>
        </div>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Message list */}
          <div className="w-96 border-r border-white/5 overflow-y-auto">
            {allMessages.length === 0 ? (
              <p className="p-8 text-center text-neutral-700 text-sm">No messages yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {allMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left p-4 hover:bg-neutral-900 transition-colors ${
                      selectedMessage?.id === msg.id ? "bg-neutral-900" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {msg.read ? (
                          <MailOpen size={14} className="text-neutral-600" />
                        ) : (
                          <Mail size={14} className="text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${msg.read ? "text-neutral-400" : "text-white"}`}>
                            {msg.name}
                          </p>
                          <p className="text-neutral-700 text-xs flex-shrink-0">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-neutral-600 text-xs truncate">{msg.email}</p>
                        {msg.subject && (
                          <p className="text-neutral-500 text-xs mt-1 truncate">{msg.subject}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail */}
          <div className="flex-1 overflow-y-auto p-8">
            {selectedMessage ? (
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-white font-bold text-xl">{selectedMessage.name}</h2>
                    <a href={`mailto:${selectedMessage.email}`} className="text-neutral-500 hover:text-white text-sm transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {selectedMessage.subject && (
                    <div className="bg-neutral-900 rounded-xl p-4 border border-white/5">
                      <p className="text-neutral-600 text-xs mb-1 uppercase tracking-wide">Subject</p>
                      <p className="text-white text-sm">{selectedMessage.subject}</p>
                    </div>
                  )}
                  {selectedMessage.projectType && (
                    <div className="bg-neutral-900 rounded-xl p-4 border border-white/5">
                      <p className="text-neutral-600 text-xs mb-1 uppercase tracking-wide">Project Type</p>
                      <p className="text-white text-sm">{selectedMessage.projectType}</p>
                    </div>
                  )}
                  {selectedMessage.budget && (
                    <div className="bg-neutral-900 rounded-xl p-4 border border-white/5">
                      <p className="text-neutral-600 text-xs mb-1 uppercase tracking-wide">Budget</p>
                      <p className="text-white text-sm">{selectedMessage.budget}</p>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
                  <p className="text-neutral-600 text-xs mb-3 uppercase tracking-wide">Message</p>
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your inquiry"}`}
                    className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <Mail size={14} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Mail size={48} className="text-neutral-800 mx-auto mb-4" />
                  <p className="text-neutral-600">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
