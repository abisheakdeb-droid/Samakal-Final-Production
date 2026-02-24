"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

// Types
export interface VideoData {
  id: string;
  title: string;
  source: 'youtube' | 'facebook' | 'html5';
  url: string; // YouTube ID, Facebook video URL, or direct video URL
  thumbnail?: string;
  startTime?: number; // Start time in seconds
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface UserPreferences {
  pauseBehavior: 'always-ask' | 'auto-pause' | 'never-pause';
  defaultSize: 'mini' | 'expanded';
  autoPlayNext: boolean;
  volume: number;
}

interface VideoPlayerState {
  currentVideo: VideoData | null;
  isPlaying: boolean;
  isMinimized: boolean;
  position: PlayerPosition;
  userPreferences: UserPreferences;
  showPlayer: boolean;
}

interface VideoPlayerContextType extends VideoPlayerState {
  playVideo: (video: VideoData) => void;
  pauseVideo: () => void;
  resumeVideo: () => void;
  closePlayer: () => void;
  toggleMinimize: () => void;
  updatePosition: (position: PlayerPosition) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  pauseBehavior: 'always-ask',
  defaultSize: 'mini',
  autoPlayNext: false,
  volume: 0.7,
};



// Create Context
const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

// Provider Component
export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  // Lazy initialization to avoid React Hooks violations
  const [state, setState] = useState<VideoPlayerState>(() => {
    let savedPrefs = DEFAULT_PREFERENCES;
    let initialPosition = { x: 0, y: 0 };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('samakal_video_preferences');
        if (stored) {
          savedPrefs = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        }
      } catch (e) {
        console.error("Failed to load preferences", e);
      }

      initialPosition = {
        x: window.innerWidth - 360,
        y: window.innerHeight - 240,
      };
    }

    return {
      currentVideo: null,
      isPlaying: false,
      isMinimized: true,
      position: initialPosition,
      userPreferences: savedPrefs,
      showPlayer: false,
    };
  });

  // Play a new video
  const playVideo = useCallback((video: VideoData) => {
    setState(prev => ({
      ...prev,
      currentVideo: video,
      isPlaying: true,
      showPlayer: true,
      isMinimized: prev.userPreferences.defaultSize === 'mini',
    }));
  }, []);

  // Pause current video
  const pauseVideo = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Resume current video
  const resumeVideo = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  // Close player completely
  const closePlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentVideo: null,
      isPlaying: false,
      showPlayer: false,
    }));
  }, []);

  // Toggle minimize/maximize
  const toggleMinimize = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // Update player position
  const updatePosition = useCallback((position: PlayerPosition) => {
    setState(prev => ({ ...prev, position }));
  }, []);

  // Update user preferences
  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState(prev => {
      const newPreferences = { ...prev.userPreferences, ...preferences };
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('samakal_video_preferences', JSON.stringify(newPreferences));
        } catch (error) {
          console.error('Failed to save preferences:', error);
        }
      }
      
      return { ...prev, userPreferences: newPreferences };
    });
  }, []);

  const value: VideoPlayerContextType = {
    ...state,
    playVideo,
    pauseVideo,
    resumeVideo,
    closePlayer,
    toggleMinimize,
    updatePosition,
    updatePreferences,
  };

  return (
    <VideoPlayerContext.Provider value={value}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

// Hook to use the context
export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within VideoPlayerProvider');
  }
  return context;
}
