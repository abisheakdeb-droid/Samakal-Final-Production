"use client";

import { useEffect, useState, useRef } from "react";
import { useVideoPlayer } from "@/contexts/VideoPlayerContext";
import { usePathname } from "next/navigation";
import PausePromptModal from "./PausePromptModal";
import SettingsPanel from "./SettingsPanel";
import {
  X,
  Maximize2,
  Minimize2,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { clsx } from "clsx";

// Type definitions for external video APIs
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface FacebookPlayerInstance {
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: () => boolean;
  getCurrentPosition: () => number;
  getDuration: () => number;
  subscribe: (event: string, callback: () => void) => void;
}

interface YouTubeAPI {
  Player: new (
    element: HTMLIFrameElement | null,
    options: Record<string, unknown>,
  ) => YouTubePlayer;
}

interface FacebookAPI {
  init: (options: Record<string, unknown>) => void;
  XFBML: {
    parse: (element: HTMLElement | null, callback?: () => void) => void;
  };
  Event: {
    subscribe: (
      event: string,
      callback: (msg: {
        type: string;
        id: string;
        instance: FacebookPlayerInstance;
      }) => void,
    ) => void;
  };
}

declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
    FB?: FacebookAPI;
    fbAsyncInit?: () => void;
  }
}

export default function FloatingVideoPlayer() {
  const {
    currentVideo,
    isPlaying,
    isMinimized,
    position,
    showPlayer,
    userPreferences,
    pauseVideo,
    resumeVideo,
    closePlayer,
    toggleMinimize,
    updatePosition,
    updatePreferences,
  } = useVideoPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [showPausePrompt, setShowPausePrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // Smart Pause Logic
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (pathname?.startsWith("/article/") && isPlaying) {
        if (userPreferences.pauseBehavior === "auto-pause") {
          pauseVideo();
        } else if (userPreferences.pauseBehavior === "always-ask") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setShowPausePrompt(true);
        }
      }
    }
  }, [pathname, isPlaying, userPreferences.pauseBehavior, pauseVideo]);

  // Handlers for Pause Prompt
  const handlePromptPause = () => {
    pauseVideo();
    setShowPausePrompt(false);
  };

  const handlePromptContinue = () => {
    setShowPausePrompt(false);
  };

  const handlePromptNeverAsk = () => {
    updatePreferences({ pauseBehavior: "auto-pause" });
    pauseVideo();
    setShowPausePrompt(false);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clickStartTimeRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const fbPlayerRef = useRef<FacebookPlayerInstance | null>(null);

  // Load YouTube & Facebook APIs
  useEffect(() => {
    // YouTube
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    window.onYouTubeIframeAPIReady = () => {};

    // Facebook
    if (!window.FB) {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
      const fjs = document.getElementsByTagName("script")[0];
      fjs.parentNode?.insertBefore(fbScript, fjs);
    }

    window.fbAsyncInit = function () {
      window.FB?.init({
        xfbml: true,
        version: "v18.0",
      });
      // Auto-detect if there's a pending player
    };
  }, []);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    if (isPlaying) event.target.playVideo();
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event: { data: number }) => {
    // Sync Play/Pause state with context if it changes externally (e.g. end of video)
    // 1 = Playing, 2 = Paused, 0 = Ended
    if (event.data === 1 && !isPlaying) resumeVideo();
    if (event.data === 2 && isPlaying) pauseVideo();
    if (event.data === 0) {
      // Ended
      if (userPreferences.autoPlayNext) {
        // Logic to play next video
      }
    }
  };

  // Initialize YT Player
  useEffect(() => {
    if (
      !currentVideo ||
      currentVideo.source !== "youtube" ||
      !iframeRef.current
    )
      return;
    // ... (YT Init Logic same as before)
    const initPlayer = () => {
      if (window.YT?.Player) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };
    if (window.YT?.Player) initPlayer();
    else {
      const interval = setInterval(() => {
        if (window.YT?.Player) {
          initPlayer();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [currentVideo?.url]);

  // Initialize Facebook Player
  useEffect(() => {
    if (!currentVideo || currentVideo.source !== "facebook") return;

    const initFBPlayer = () => {
      if (window.FB) {
        // Parse XFBML to render the player
        window.FB.XFBML.parse(
          document.getElementById("fb-player-container"),
          () => {
            // After parsing, try to get the player instance?
            // FB API is tricky. We subscribe to events globally or via 'FB.Event.subscribe'
            window.FB?.Event.subscribe("xfbml.ready", function (msg) {
              if (msg.type === "video" && msg.id === currentVideo.url) {
                fbPlayerRef.current = msg.instance;

                // Subscribe to events
                msg.instance.subscribe("startedPlaying", () => resumeVideo()); // Update context
                msg.instance.subscribe("paused", () => pauseVideo()); // Update context
                msg.instance.subscribe("finishedPlaying", () => {
                  /* Handle End */
                });

                // Initial Play if needed
                if (isPlaying) msg.instance.play();

                setDuration(msg.instance.getDuration());
                setIsMuted(msg.instance.isMuted());
              }
            });
          },
        );
      }
    };

    if (window.FB) initFBPlayer();
    else {
      const interval = setInterval(() => {
        if (window.FB) {
          initFBPlayer();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      fbPlayerRef.current = null;
    };
  }, [currentVideo?.url]);

  // Sync Play/Pause/Seek/Mute for FB
  useEffect(() => {
    if (!fbPlayerRef.current || currentVideo?.source !== "facebook") return;

    if (isPlaying) fbPlayerRef.current.play();
    else fbPlayerRef.current.pause();

    if (isMuted) fbPlayerRef.current?.mute();
    else fbPlayerRef.current?.unmute();
  }, [isPlaying, isMuted]);

  // FB Progress Polling (No built-in timeupdate)
  useEffect(() => {
    if (
      currentVideo?.source !== "facebook" ||
      !isPlaying ||
      !fbPlayerRef.current
    )
      return;

    const interval = setInterval(() => {
      if (!fbPlayerRef.current) return;
      const curr = fbPlayerRef.current.getCurrentPosition();
      const dur = fbPlayerRef.current.getDuration(); // Duration might update later
      if (dur > 0) {
        setDuration(dur);
        setCurrentTime(curr);
        setProgress((curr / dur) * 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentVideo]);

  // Render YouTube helper
  const renderYouTubePlayer = () => {
    // ... (Same as before)
    if (!currentVideo) return null;
    const videoId = currentVideo.url;
    return (
      <iframe
        id="yt-player-iframe"
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&enablejsapi=1&controls=0&rel=0&modestbranding=1&disablekb=1`}
        title={currentVideo.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full pointer-events-none"
      />
    );
  };

  // Render Facebook Helper
  const renderFacebookPlayer = () => {
    if (!currentVideo) return null;
    // FB Video URL format: https://www.facebook.com/facebook/videos/{VIDEO_ID}/
    // Or just ID if we construct it. Assuming currentVideo.url is the ID for FB too?
    // If it's a full URL, we use it directly.
    const videoHref = `https://www.facebook.com/watch/?v=${currentVideo.url}`;

    return (
      <div
        id="fb-player-container"
        className="w-full h-full bg-black flex items-center justify-center pointer-events-none"
      >
        <div
          className="fb-video"
          data-href={videoHref}
          data-width="auto"
          data-show-text="false"
          data-allowfullscreen="true"
          data-controls="false" // We want custom controls, but FB might force its own. 'false' hides minimal controls?
          // FB API says data-controls="true" shows native. We might need native if custom seeking is hard?
          // Actually, let's try custom controls.
          // Pointer events none on container might block interaction, allowing our overlay.
        ></div>
      </div>
    );
  };

  // Drag & Click Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(".player-controls") ||
      (e.target as HTMLElement).closest(".settings-panel")
    )
      return;

    e.preventDefault();
    setIsDragging(true);
    clickStartTimeRef.current = Date.now();
    startPosRef.current = { x: e.clientX, y: e.clientY };

    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const maxX = window.innerWidth - (isMinimized ? 320 : 640);
      const maxY = window.innerHeight - (isMinimized ? 180 : 360);

      updatePosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Check for Click (short time, short distance)
      const duration = Date.now() - clickStartTimeRef.current;
      const dist = Math.sqrt(
        Math.pow(e.clientX - startPosRef.current.x, 2) +
          Math.pow(e.clientY - startPosRef.current.y, 2),
      );

      if (duration < 200 && dist < 5) {
        // It's a click! Toggle Play/Pause
        if (isPlaying) pauseVideo();
        else resumeVideo();
      }

      setIsDragging(false);
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragOffset,
    position,
    isMinimized,
    updatePosition,
    isPlaying,
    pauseVideo,
    resumeVideo,
  ]);

  // Handle Window Resize (Keep player in bounds)
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - (isMinimized ? 320 : 640);
      const maxY = window.innerHeight - (isMinimized ? 180 : 360);

      // If current position is out of bounds, adjust it
      if (position.x > maxX || position.y > maxY) {
        updatePosition({
          x: Math.max(0, Math.min(position.x, maxX)),
          y: Math.max(0, Math.min(position.y, maxY)),
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, isMinimized, updatePosition]);

  // Render main player content
  const renderPlayerContent = () => {
    if (currentVideo?.source === "youtube") return renderYouTubePlayer();
    if (currentVideo?.source === "facebook") return renderFacebookPlayer();
    return null;
  };

  // Keyboard Shortcuts (Updated for generic player)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentVideo || !showPlayer) return;
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      const seek = (seconds: number) => {
        // YouTube
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const newTime = Math.max(
            0,
            Math.min(playerRef.current.getCurrentTime() + seconds, duration),
          );
          playerRef.current.seekTo(newTime, true);
          setCurrentTime(newTime);
        }
        // Facebook
        if (fbPlayerRef.current) {
          const newTime = Math.max(
            0,
            Math.min(
              fbPlayerRef.current.getCurrentPosition() + seconds,
              duration,
            ),
          );
          fbPlayerRef.current.seek(newTime);
          setCurrentTime(newTime);
        }
      };

      switch (e.code) {
        case "Space":
        case "k": // YouTube standard
          e.preventDefault();
          if (isPlaying) pauseVideo();
          else resumeVideo();
          break;
        case "ArrowRight":
          seek(5);
          break;
        case "ArrowLeft":
          seek(-5);
          break;
        case "KeyM":
          setIsMuted((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVideo, showPlayer, isPlaying, duration, pauseVideo, resumeVideo]);

  // Click on Progress Bar (Generalized)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * duration;

    // YouTube
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
    // Facebook
    if (fbPlayerRef.current) {
      fbPlayerRef.current.seek(newTime);
    }

    setCurrentTime(newTime);
    setProgress(percent * 100);
  };

  if (!showPlayer || !currentVideo) return null;

  const playerWidth = isMinimized ? 320 : 640;
  const playerHeight = isMinimized ? 180 : 360;

  if (showPausePrompt) {
    return (
      <>
        <PausePromptModal
          onPause={handlePromptPause}
          onContinue={handlePromptContinue}
          onNeverAsk={handlePromptNeverAsk}
        />
        <div
          className="fixed z-9999 bg-black rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border-2 border-white/10 opacity-50 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${playerWidth}px`,
            height: `${playerHeight}px`,
          }}
        >
          <div className="w-full h-full relative">{renderPlayerContent()}</div>
        </div>
      </>
    );
  }

  return (
    <div
      className={clsx(
        "fixed z-9999 bg-black rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95",
        "border-2 border-white/10",
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${playerWidth}px`,
        height: `${playerHeight}px`,
      }}
    >
      {/* Video Container */}
      <div
        className="w-full h-full relative bg-black cursor-move"
        onMouseDown={handleMouseDown}
      >
        {renderPlayerContent()}

        {/* Invisible Drag Overlay */}
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="settings-panel absolute inset-0 z-20">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Control Overlay */}
      <div className="player-controls absolute top-0 left-0 right-0 bg-linear-to-b from-black/80 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-white text-sm font-bold flex-1 line-clamp-1 mr-2">
            {currentVideo.title}
          </h4>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-brand-red transition p-1 rounded hover:bg-white/10"
              title="Settings"
            >
              <SettingsIcon size={18} />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:text-red-400 transition p-1 rounded hover:bg-white/10"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              onClick={toggleMinimize}
              className="text-white hover:text-red-400 transition p-1 rounded hover:bg-white/10"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>

            <button
              onClick={closePlayer}
              className="text-white hover:text-red-600 transition p-1 rounded hover:bg-white/10"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      {!isMinimized && (
        <div className="player-controls absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity z-10">
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? pauseVideo : resumeVideo}
              className="text-white hover:text-brand-red transition"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm">
                {isPlaying ? (
                  <div className="w-3 h-3 bg-white rounded-sm" />
                ) : (
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-white border-b-[6px] border-b-transparent ml-1" />
                )}
              </div>
            </button>

            {/* Time Display */}
            <span className="text-white text-xs font-medium tabular-nums">
              {formatTime(currentTime)}
            </span>

            {/* Progress Bar */}
            <div
              className="flex-1 h-3 flex items-center cursor-pointer group relative"
              onClick={handleSeek}
            >
              {/* Track */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                {/* Fill */}
                <div
                  className="h-full bg-brand-red rounded-full relative"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Thumb (visible on hover) */}
              <div
                className="absolute h-3 w-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, marginLeft: "-6px" }}
              />
            </div>

            {/* Duration Display */}
            <span className="text-white text-xs font-medium tabular-nums opacity-70">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
