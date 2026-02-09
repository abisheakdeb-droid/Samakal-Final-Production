"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createArticle } from "@/lib/actions-article";
import Sidebar from "./Sidebar";
import { Toolbar } from "./Toolbar";
import {
  NewsType,
  ArticleData,
  ArticleImage,
  Contributor,
  Event,
} from "./types";
import { Save, Monitor, Settings, Clock, Sparkles } from "lucide-react";
import { useAI } from "@/hooks/use-ai";
import {
  generateHeadlines,
  generateMetaDescription,
} from "@/lib/ai/writing-assistant";

export function Editor({ initialData }: { initialData?: ArticleData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Metadata State
  const [subHeadline, setSubHeadline] = useState(
    initialData?.sub_headline || "",
  );
  const [newsType, setNewsType] = useState<NewsType>(
    initialData?.news_type || "regular",
  );
  const [location, setLocation] = useState(initialData?.location || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords || [],
  );

  // UX Polish State
  const [lastSaved, setLastSaved] = useState<Date | null>(
    initialData?.updated_at ? new Date(initialData.updated_at) : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Media State
  const [images, setImages] = useState<ArticleImage[]>(
    initialData?.images || [],
  );

  // AI State
  const { isGenerating, generate } = useAI();
  const [showHeadlineSuggestions, setShowHeadlineSuggestions] = useState(false);
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || "");

  // Attribution & SEO State
  const [contributors, setContributors] = useState<Contributor[]>(
    initialData?.contributors || [],
  );
  const [source, setSource] = useState(initialData?.source || "");
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description || "",
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialData?.canonical_url || "",
  );

  // Events (Placeholder for now)
  const [eventId, setEventId] = useState(initialData?.event_id || "");
  const [events] = useState<Event[]>([]);

  // Publication State
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.created_at
      ? new Date(initialData.created_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [scheduledAt, setScheduledAt] = useState("");

  const handleGenerateSEO = async () => {
    if (!editor || !title) {
      toast.error("SEO জেনারেট করার জন্য শিরোনাম এবং কন্টেন্ট প্রয়োজন");
      return;
    }
    const content = editor.getText();
    if (content.length < 100) {
      toast.error("আরও কন্টেন্ট লিখুন");
      return;
    }

    await generate(
      "Generating SEO Meta Description...",
      () => generateMetaDescription(title, content),
      (desc) => {
        setSeoDescription(desc);
        toast.success("মেটা বর্ণনা তৈরি হয়েছে!");
      },
    );
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline cursor-pointer",
        },
      }),
      Youtube.configure({
        controls: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder: "এখানে লেখা শুরু করুন...",
        emptyEditorClass:
          "is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none",
      }),
      CharacterCount,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[900px] px-8 py-10",
      },
    },
    onUpdate: ({ editor }) => {
      setWordCount(editor.storage.characterCount.words());
    },
    immediatelyRender: false,
  });

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (title && !isPublishing) {
        setIsSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [title, isPublishing]);

  const handlePublish = async (metadata: Partial<ArticleData>) => {
    if (!editor || !title) {
      toast.error("শিরোনাম লিখুন");
      return;
    }

    setIsPublishing(true);
    const content = editor.getHTML();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("status", metadata.status || status);
    formData.append("category", category || "General");
    formData.append("published_at", publishedAt);
    formData.append("scheduled_at", scheduledAt);

    // Core Metadata
    formData.append("sub_headline", subHeadline);
    formData.append("news_type", newsType);
    formData.append("location", location);
    formData.append("tags", JSON.stringify(tags));
    formData.append("keywords", JSON.stringify(keywords));

    // Media
    formData.append("images", JSON.stringify(images));
    formData.append("video_url", videoUrl);

    // Attribution & SEO
    formData.append("contributors", JSON.stringify(contributors));
    formData.append("source", source);
    formData.append("source_url", sourceUrl);
    formData.append("seo_title", seoTitle);
    formData.append("seo_description", seoDescription);
    formData.append("canonical_url", canonicalUrl);

    try {
      await createArticle(formData);
      toast.success(
        metadata.status === "draft"
          ? "খসড়া সংরক্ষিত হয়েছে!"
          : "আর্টিকেল প্রকাশিত হয়েছে!",
      );
      setLastSaved(new Date());
    } catch {
      toast.error("সংরক্ষণ করা যায়নি");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateHeadlines = async () => {
    if (!editor) return;
    const content = editor.getText();
    if (content.length < 100) {
      toast.error("শিরোনাম জেনারেট করার জন্য আরও কন্টেন্ট লিখুন");
      return;
    }

    await generate(
      "Generating headlines...",
      () => generateHeadlines(content),
      (headlines) => {
        setSuggestedHeadlines(headlines);
        setShowHeadlineSuggestions(true);
        toast.success("৫টি আকর্ষণীয় শিরোনাম তৈরি হয়েছে!");
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 selection:bg-blue-100 font-serif">
      {/* 1. MAIN HEADER (Sticky) */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Back Button / Logo could go here */}
          <div className="text-xl font-black text-gray-900 tracking-tight font-serif">
            SAMAKAL{" "}
            <span className="text-blue-600 font-serif italic text-lg">
              Editor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-gray-400 mr-2 border-r border-gray-200 pr-4">
            <span>{wordCount} Words</span>
            <span className="flex items-center gap-1">
              {isSaving ? (
                <Clock size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              {isSaving ? "Saving..." : lastSaved ? "Saved" : "Unsaved"}
            </span>
          </div>

          <button
            onClick={() => handlePublish({ status: "draft" })}
            disabled={isPublishing}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Draft
          </button>

          <button
            onClick={() => handlePublish({ status: "published" })}
            disabled={isPublishing}
            className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-white bg-black hover:bg-gray-800 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            {isPublishing ? (
              "..."
            ) : (
              <>
                <Monitor size={14} />
                Publish
              </>
            )}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-all ${isSidebarOpen ? "bg-blue-50 text-blue-600 ring-2 ring-blue-100" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"}`}
            title={isSidebarOpen ? "Hide Settings" : "Show Settings"}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* 2. TOP RIBBON (Metadata) */}
      {isSidebarOpen && (
        <div className="relative z-20 animate-in slide-in-from-top-2 duration-200">
          <Sidebar
            onPublish={handlePublish}
            isPublishing={isPublishing}
            category={category}
            setCategory={setCategory}
            newsType={newsType}
            setNewsType={setNewsType}
            location={location}
            setLocation={setLocation}
            tags={tags}
            setTags={setTags}
            keywords={keywords}
            setKeywords={setKeywords}
            images={images}
            setImages={setImages}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            contributors={contributors}
            setContributors={setContributors}
            source={source}
            setSource={setSource}
            sourceUrl={sourceUrl}
            setSourceUrl={setSourceUrl}
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            canonicalUrl={canonicalUrl}
            setCanonicalUrl={setCanonicalUrl}
            onGenerateSEO={handleGenerateSEO}
            isGeneratingAI={isGenerating}
            events={events}
            eventId={eventId}
            setEventId={setEventId}
            status={status}
            setStatus={setStatus}
            publishedAt={publishedAt}
            setPublishedAt={setPublishedAt}
            scheduledAt={scheduledAt}
            setScheduledAt={setScheduledAt}
          />
        </div>
      )}

      {/* 3. TOOLBAR (Sticky below Header/Ribbon) */}
      <div className="sticky top-[60px] z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm min-h-[50px]">
        {editor && <Toolbar editor={editor} />}
      </div>

      {/* 4. DOCUMENT CANVAS (No inner scroll, page scrolls) */}
      <div
        className="flex-1 py-12 md:py-16 px-4 md:px-8 cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <div
          className="max-w-[900px] mx-auto bg-white min-h-[1000px] shadow-sm border border-gray-200/60 rounded-none md:rounded-lg p-12 md:p-20 relative transition-shadow hover:shadow-md"
          style={{ fontFamily: "var(--font-tiro-bangla), serif" }}
        >
          {/* Title Input - H1 Style (Auto-expanding) */}
          <textarea
            placeholder="শিরোনাম লিখুন..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Auto-expand on change
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "var(--font-tiro-bangla), serif" }}
            className="w-full text-3xl md:text-4xl font-black text-gray-900 placeholder-gray-300 outline-none bg-transparent leading-normal py-2 mb-6 resize-none overflow-hidden"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />

          {/* AI Headline Suggestions */}
          {/* Headline Generator Button */}
          <div className="absolute top-14 right-12 md:right-20">
            <button
              onClick={handleGenerateHeadlines}
              disabled={isGenerating}
              className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all shadow-sm ring-1 ring-purple-200 opacity-60 hover:opacity-100 flex items-center gap-2 text-xs font-bold"
              title="Generate Headlines with AI"
            >
              <Sparkles
                size={14}
                className={isGenerating ? "animate-spin" : ""}
              />
              {isGenerating ? "Thinking..." : "AI Title"}
            </button>
          </div>

          {showHeadlineSuggestions && (
            <div className="mb-8 bg-purple-50 rounded-xl p-4 border border-purple-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                  <Sparkles size={14} /> suggested Headlines
                </h4>
                <button
                  onClick={() => setShowHeadlineSuggestions(false)}
                  className="text-purple-400 hover:text-purple-700 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {suggestedHeadlines.map((headline, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTitle(headline);
                      setShowHeadlineSuggestions(false);
                      toast.success("শিরোনাম আপডেট করা হয়েছে!");
                    }}
                    className="w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all text-gray-800 font-serif text-lg leading-relaxed hover:bg-purple-50/50"
                  >
                    {headline}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-headline Input - H2/Lead Style */}
          <textarea
            placeholder="উপ-শিরোনাম লিখুন..."
            value={subHeadline}
            onChange={(e) => setSubHeadline(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "var(--font-tiro-bangla), serif" }}
            className="w-full text-xl md:text-2xl text-gray-500 placeholder-gray-300 outline-none bg-transparent font-medium resize-none overflow-hidden mb-12 leading-normal h-auto"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />

          {/* Main Editor Content */}
          <div
            className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-xl prose-p:pl-0 prose-p:pr-0 text-justify"
            style={{ fontFamily: "var(--font-tiro-bangla), serif" }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-gray-400 font-medium">
          End of Document
        </div>
      </div>
    </div>
  );
}
