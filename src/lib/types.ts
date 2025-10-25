export interface Video {
  id: string;
  title: string;
  url: string;
  type: 'upload' | 'youtube';
  thumbnail?: string;
  duration?: number;
  uploadedAt: Date;
}

export interface Clip {
  id: string;
  videoId: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnail?: string;
  description?: string;
  tags: string[];
  createdAt: Date;
}

export interface ClipEdit {
  title?: string;
  description?: string;
  tags?: string[];
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}