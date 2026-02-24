"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendNotificationToAll } from "@/lib/actions-push";
import { toast } from "sonner";

export default function NotificationSender() {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message) return;
    setSending(true);
    try {
        const result = await sendNotificationToAll(message, url);
        if (result.success) {
            toast.success(`Sent to ${result.count || 0} subscribers!`);
            setMessage("");
        } else {
            toast.error("Failed to send notification.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Error sending notification.");
    } finally {
        setSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Send size={20} className="text-blue-600" />
        পুশ নোটিফিকেশন পাঠান (Send Push)
      </h2>
      
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ব্রেকিং নিউজ: ..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
            <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>

        <button 
            onClick={handleSend}
            disabled={sending || !message}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Send Broadcast
        </button>
      </div>
    </div>
  );
}
