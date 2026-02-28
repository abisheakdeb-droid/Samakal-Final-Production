"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Volume2, VolumeX, Play } from "lucide-react";
import { clsx } from "clsx";

/* ────────────────────────────────────────────
   Props — usa la misma forma de relatedVideo 
   que viene del NewsItem type
   ──────────────────────────────────────────── */
interface ArticleVideoPlayerProps {
    video: {
        id: string;
        source: "youtube" | "facebook";
        title?: string;
        thumbnail?: string;
    };
    title: string;
}

/* ────────────────────────────────────────────
   Construye la URL del embed según la fuente
   ──────────────────────────────────────────── */
function buildEmbedUrl(video: ArticleVideoPlayerProps["video"], autoplay = false): string {
    const ap = autoplay ? 1 : 0;

    if (video.source === "youtube") {
        return `https://www.youtube.com/embed/${video.id}?autoplay=${ap}&rel=0&modestbranding=1&enablejsapi=1`;
    }

    // Facebook — usa el plugin de video embebido
    const encodedHref = encodeURIComponent(
        `https://www.facebook.com/watch/?v=${video.id}`
    );
    return `https://www.facebook.com/plugins/video.php?href=${encodedHref}&show_text=false&autoplay=${autoplay}`;
}

/* ────────────────────────────────────────────
   Genera la URL del thumbnail para el poster
   ──────────────────────────────────────────── */
function getThumbnailUrl(video: ArticleVideoPlayerProps["video"]): string | null {
    if (video.thumbnail) return video.thumbnail;
    if (video.source === "youtube") {
        return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
    }
    return null;
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════ */
export default function ArticleVideoPlayer({ video, title }: ArticleVideoPlayerProps) {
    // Estado principal de reproducción
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Referencia al contenedor inline para IntersectionObserver
    const inlineRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef(false);

    /* ── IntersectionObserver: detecta cuándo el player inline sale de la vista ── */
    useEffect(() => {
        if (!hasStartedRef.current || isClosed) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Cuando el contenedor inline NO es visible → flotar
                setIsFloating(!entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        const currentRef = inlineRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [isClosed]);

    /* ── Maneja el primer play (click en el poster) ── */
    const handlePlay = useCallback(() => {
        setIsPlaying(true);
        hasStartedRef.current = true;
    }, []);

    /* ── Cerrar el floating player completamente ── */
    const handleCloseFloat = useCallback(() => {
        setIsClosed(true);
        setIsFloating(false);
    }, []);

    /* ── Construimos la URL y el thumbnail ── */
    const thumbnailUrl = getThumbnailUrl(video);
    const embedUrl = buildEmbedUrl(video, true);

    /* ── Renderiza el iframe del video ── */
    const renderIframe = (isFloatingMode: boolean) => (
        <iframe
            src={`${embedUrl}${isMuted ? "&mute=1" : ""}`}
            title={title}
            className={clsx(
                "border-0",
                isFloatingMode ? "w-full h-full" : "absolute inset-0 w-full h-full"
            )}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );

    return (
        <>
            {/* ━━━━━━━━━━━━━━━━━━━━━━ INLINE PLAYER ━━━━━━━━━━━━━━━━━━━━━━ */}
            <div ref={inlineRef} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl bg-black">
                {!isPlaying ? (
                    /* ── Poster / Thumbnail con botón de Play ── */
                    <button
                        onClick={handlePlay}
                        className="absolute inset-0 w-full h-full group cursor-pointer"
                        aria-label="ভিডিও চালান"
                    >
                        {/* Imagen de fondo */}
                        {thumbnailUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={thumbnailUrl}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        {/* Overlay oscuro */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                        {/* Botón de play central */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-red/90 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                                <Play size={36} className="text-white ml-1.5" fill="white" />
                            </div>
                        </div>

                        {/* Badge "ভিডিও" */}
                        <div className="absolute top-4 left-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            ভিডিও
                        </div>
                    </button>
                ) : (
                    /* ── Video iframe inline (visible cuando está jugando y no está flotando) ── */
                    <>
                        {renderIframe(false)}

                        {/* Cuando flota, mostramos un placeholder en el espacio inline */}
                        {isFloating && !isClosed && (
                            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded-xl">
                                <div className="text-center text-gray-400 dark:text-gray-600">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                        <Play size={20} className="ml-0.5" />
                                    </div>
                                    <p className="text-sm font-medium">ভিডিও নিচে চলছে ↓</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━ FLOATING MINI-PLAYER ━━━━━━━━━━━━━━━━━━━━━━ */}
            {isPlaying && isFloating && !isClosed && (
                <div
                    className={clsx(
                        "fixed bottom-6 right-6 z-[9999]",
                        "w-[340px] aspect-video",
                        "bg-black rounded-xl overflow-hidden",
                        "shadow-2xl border border-white/10",
                        "animate-in slide-in-from-bottom-4 fade-in duration-300"
                    )}
                >
                    {/* Iframe flotante */}
                    {renderIframe(true)}

                    {/* ── Controles superiores del floating player ── */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-2.5 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-bold line-clamp-1 flex-1 mr-2">
                                {video.title || title}
                            </span>
                            <div className="flex items-center gap-1.5">
                                {/* Mute */}
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="text-white hover:text-brand-red transition p-1 rounded hover:bg-white/10"
                                    title={isMuted ? "আনমিউট" : "মিউট"}
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>

                                {/* Close */}
                                <button
                                    onClick={handleCloseFloat}
                                    className="text-white hover:text-red-500 transition p-1 rounded hover:bg-white/10"
                                    title="বন্ধ করুন"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Barra de marca roja en la parte superior ── */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-red" />
                </div>
            )}
        </>
    );
}
