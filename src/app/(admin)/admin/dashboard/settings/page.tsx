"use client";

import { useEffect, useState } from "react";
import {
  fetchSettings,
  updateSettings,
  SiteSettings,
} from "@/lib/actions-settings";
import {
  Save,
  Facebook,
  Youtube,
  Rss,
  Loader2,
  Settings,
  Menu,
  GripVertical,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "identity" | "general" | "social" | "navigation"
  >("identity");

  // Load settings on mount
  useEffect(() => {
    async function load() {
      const data = await fetchSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const res = await updateSettings(settings);
    if (res.success) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error("Failed to update settings.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  if (!settings) return <div>Error loading settings</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Settings & Control Room
          </h1>
          <p className="text-gray-500">
            Manage site-wide configurations and widgets
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-red/90 transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("identity")}
            className={`flex-1 min-w-[120px] py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "identity"
                ? "bg-gray-50 text-brand-red border-b-2 border-brand-red"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings size={18} />
            Site Identity
          </button>
          <button
            onClick={() => setActiveTab("navigation")}
            className={`flex-1 min-w-[120px] py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "navigation"
                ? "bg-gray-50 text-brand-red border-b-2 border-brand-red"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Menu size={18} />
            Navigation
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex-1 min-w-[120px] py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "social"
                ? "bg-gray-50 text-brand-red border-b-2 border-brand-red"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Facebook size={18} />
            Social Widgets
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 min-w-[120px] py-4 font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === "general"
                ? "bg-gray-50 text-brand-red border-b-2 border-brand-red"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Rss size={18} />
            Ticker & SEO
          </button>
        </div>

        <div className="p-8">
          {/* IDENTITY TAB */}
          {activeTab === "identity" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Site Name (Bengali)
                  </label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) =>
                      setSettings({ ...settings, site_name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.site_tagline || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_tagline: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={settings.site_logo || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_logo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="/samakal-logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    value={settings.site_favicon || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_favicon: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Footer Copyright Text
                </label>
                <input
                  type="text"
                  value={settings.footer_copyright || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer_copyright: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                />
              </div>
            </div>
          )}

          {/* SOCIAL MEDIA TAB (Already exists, keeping it similar but adding small polish) */}
          {activeTab === "social" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* ... existing social fields ... */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                    <Facebook />
                    <h3>Facebook Live Integration</h3>
                  </div>
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {settings.facebook_is_live
                        ? "Widget Updated (LIVE)"
                        : "Widget Hidden"}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={settings.facebook_is_live}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            facebook_is_live: e.target.checked,
                          })
                        }
                      />
                      <div
                        className={`w-14 h-7 rounded-full transition-colors ${settings.facebook_is_live ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.facebook_is_live ? "translate-x-7" : "translate-x-0"}`}
                      ></div>
                    </div>
                  </label>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <input
                    type="text"
                    value={settings.facebook_live_url || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        facebook_live_url: e.target.value,
                      })
                    }
                    placeholder="e.g., 10153231379946729"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <hr />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                  <Youtube />
                  <h3>YouTube Channel & Playlist</h3>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <input
                    type="text"
                    value={settings.youtube_playlist_id || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        youtube_playlist_id: e.target.value,
                      })
                    }
                    placeholder="e.g., PL12345678"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GENERAL & SEO TAB */}
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800">
                    Breaking News Ticker
                  </h3>
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {settings.breaking_news_is_active
                        ? "Ticker Active"
                        : "Ticker Hidden"}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={settings.breaking_news_is_active}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            breaking_news_is_active: e.target.checked,
                          })
                        }
                      />
                      <div
                        className={`w-14 h-7 rounded-full transition-colors ${settings.breaking_news_is_active ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.breaking_news_is_active ? "translate-x-7" : "translate-x-0"}`}
                      ></div>
                    </div>
                  </label>
                </div>
                <textarea
                  value={settings.breaking_news_ticker || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      breaking_news_ticker: e.target.value,
                    })
                  }
                  placeholder="Enter breaking news text..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                />
              </div>

              <hr />

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">
                  Global SEO & Analytics
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Default SEO Title
                    </label>
                    <input
                      type="text"
                      value={settings.seo_title || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, seo_title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Global Meta Description
                    </label>
                    <textarea
                      value={settings.seo_description || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          seo_description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Google Analytics ID (G-XXXXXX)
                    </label>
                    <input
                      type="text"
                      value={settings.google_analytics_id || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          google_analytics_id: e.target.value,
                        })
                      }
                      placeholder="G-..."
                      className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION TAB */}
          {activeTab === "navigation" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6 flex items-start gap-3">
                <div className="mt-0.5 text-amber-600">
                  <AlertCircle size={20} />
                </div>
                <p className="text-sm text-amber-800">
                  <strong>Navigation Menu Management</strong>
                  <br />
                  This area allows you to control the main site header. Ensure
                  each link exists before publishing. (Draft Phase: Full nested
                  editor coming in Phase 7).
                </p>
              </div>

              <div className="space-y-4">
                {(
                  (settings.navigation_menu || []) as Array<{
                    label: string;
                    href: string;
                  }>
                ).map((item, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl group"
                  >
                    <div className="cursor-grab text-gray-300 hover:text-gray-500">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={item.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const newMenu = [
                            ...((settings.navigation_menu || []) as Array<{
                              label: string;
                              href: string;
                            }>),
                          ];
                          newMenu[idx] = { ...item, label: e.target.value };
                          setSettings({
                            ...settings,
                            navigation_menu: newMenu,
                          });
                        }}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-red"
                      />
                      <input
                        type="text"
                        value={item.href}
                        placeholder="Link"
                        onChange={(e) => {
                          const newMenu = [
                            ...((settings.navigation_menu || []) as Array<{
                              label: string;
                              href: string;
                            }>),
                          ];
                          newMenu[idx] = { ...item, href: e.target.value };
                          setSettings({
                            ...settings,
                            navigation_menu: newMenu,
                          });
                        }}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-red font-mono"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newMenu = settings.navigation_menu?.filter(
                          (_, i) => i !== idx,
                        );
                        setSettings({ ...settings, navigation_menu: newMenu });
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newItem = { label: "New Link", href: "/" };
                    setSettings({
                      ...settings,
                      navigation_menu: [
                        ...(settings.navigation_menu || []),
                        newItem,
                      ],
                    });
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-brand-red hover:text-brand-red transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Menu Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
