"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { subscribeUser, unsubscribeUser, getVapidPublicKey } from "@/lib/actions-push";
import { toast } from "sonner"; // Assuming sonner is installed as per package.json

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const publicKey = await getVapidPublicKey();
      if (!publicKey) {
        throw new Error("VAPID public key not found");
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send to backend
      const result = await subscribeUser(JSON.parse(JSON.stringify(sub)));

      if (result.success) {
        setSubscription(sub);
        toast.success("Notifications enabled!");
      } else {
        toast.error("Failed to save subscription.");
        sub.unsubscribe(); // Rollback
      }

    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Failed to subscribe to notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscription) return;
    setLoading(true);
    try {
      await subscription.unsubscribe();
      await unsubscribeUser(subscription.endpoint);
      setSubscription(null);
      toast.success("Notifications disabled.");
    } catch (error) {
      console.error("Unsubscribe failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  if (loading) {
    return (
      <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100" disabled>
        <Loader2 size={20} className="animate-spin" />
      </button>
    );
  }

  return (
    <div className="relative group">
      {subscription ? (
        <button
          onClick={handleUnsubscribe}
          className="p-2 text-brand-red bg-red-50 rounded-full hover:bg-red-100 transition"
          title="Disable Notifications"
        >
          <BellOff size={20} />
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          className="p-2 text-gray-600 rounded-full transition hover:text-brand-red"
          title="Enable Notifications"
        >
          <Bell size={22} />
        </button>
      )}
    </div>
  );
}
