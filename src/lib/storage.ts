import { Video, Clip } from './types';

const VIDEOS_KEY = 'viral_clips_videos';
const CLIPS_KEY = 'viral_clips_clips';

export const storage = {
  // Videos
  getVideos: (): Video[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(VIDEOS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveVideo: (video: Video): void => {
    if (typeof window === 'undefined') return;
    const videos = storage.getVideos();
    videos.push(video);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  },

  deleteVideo: (videoId: string): void => {
    if (typeof window === 'undefined') return;
    const videos = storage.getVideos().filter(v => v.id !== videoId);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  },

  // Clips
  getClips: (): Clip[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CLIPS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveClip: (clip: Clip): void => {
    if (typeof window === 'undefined') return;
    const clips = storage.getClips();
    clips.push(clip);
    localStorage.setItem(CLIPS_KEY, JSON.stringify(clips));
  },

  deleteClip: (clipId: string): void => {
    if (typeof window === 'undefined') return;
    const clips = storage.getClips().filter(c => c.id !== clipId);
    localStorage.setItem(CLIPS_KEY, JSON.stringify(clips));
  },

  getClipsByVideo: (videoId: string): Clip[] => {
    return storage.getClips().filter(c => c.videoId === videoId);
  }
};

// Utility functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};