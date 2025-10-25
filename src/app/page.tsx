'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Link, 
  Play, 
  Scissors, 
  Share2, 
  Download, 
  Edit3, 
  Trash2,
  Youtube,
  Sparkles,
  Clock,
  Tag,
  Filter,
  Sun,
  Circle,
  Palette
} from 'lucide-react';
import { Video, Clip, ClipEdit } from '@/lib/types';
import { storage, generateId, extractYouTubeId, getYouTubeThumbnail, formatDuration } from '@/lib/storage';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'clips' | 'edit'>('upload');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingClip, setEditingClip] = useState<ClipEdit>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVideos(storage.getVideos());
    setClips(storage.getClips());
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const video: Video = {
      id: generateId(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
      type: 'upload',
      uploadedAt: new Date()
    };

    storage.saveVideo(video);
    setVideos(storage.getVideos());
  };

  const handleYouTubeSubmit = () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      alert('URL do YouTube inválida');
      return;
    }

    const video: Video = {
      id: generateId(),
      title: `Vídeo do YouTube - ${videoId}`,
      url: youtubeUrl,
      type: 'youtube',
      thumbnail: getYouTubeThumbnail(videoId),
      uploadedAt: new Date()
    };

    storage.saveVideo(video);
    setVideos(storage.getVideos());
    setYoutubeUrl('');
  };

  const generateClips = async (video: Video) => {
    setIsGenerating(true);
    setSelectedVideo(video);

    // Simular processamento de IA
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Gerar clipes simulados
    const mockClips: Clip[] = [
      {
        id: generateId(),
        videoId: video.id,
        title: 'Momento Viral #1',
        startTime: 15,
        endTime: 45,
        duration: 30,
        description: 'Clipe com maior potencial viral detectado pela IA',
        tags: ['viral', 'trending', 'highlights'],
        createdAt: new Date()
      },
      {
        id: generateId(),
        videoId: video.id,
        title: 'Momento Épico #2',
        startTime: 120,
        endTime: 135,
        duration: 15,
        description: 'Sequência de ação identificada como engajante',
        tags: ['action', 'epic', 'short'],
        createdAt: new Date()
      },
      {
        id: generateId(),
        videoId: video.id,
        title: 'Quote Inspiracional',
        startTime: 200,
        endTime: 230,
        duration: 30,
        description: 'Frase marcante ideal para compartilhamento',
        tags: ['quote', 'inspirational', 'wisdom'],
        createdAt: new Date()
      }
    ];

    mockClips.forEach(clip => storage.saveClip(clip));
    setClips(storage.getClips());
    setIsGenerating(false);
    setActiveTab('clips');
  };

  const deleteVideo = (videoId: string) => {
    storage.deleteVideo(videoId);
    setVideos(storage.getVideos());
    
    // Deletar clipes relacionados
    const videoClips = storage.getClipsByVideo(videoId);
    videoClips.forEach(clip => storage.deleteClip(clip.id));
    setClips(storage.getClips());
  };

  const deleteClip = (clipId: string) => {
    storage.deleteClip(clipId);
    setClips(storage.getClips());
  };

  const shareClip = (clip: Clip, platform: string) => {
    const shareText = `Confira este clipe viral: ${clip.title}`;
    const shareUrl = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
    }
  };

  const updateClipEdit = (field: keyof ClipEdit, value: any) => {
    setEditingClip(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ViralClips AI
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {videos.length} vídeos • {clips.length} clipes gerados
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload & Links
          </button>
          <button
            onClick={() => setActiveTab('clips')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'clips'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Scissors className="w-4 h-4 inline mr-2" />
            Clipes Gerados ({clips.length})
          </button>
          {selectedClip && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'edit'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Edit3 className="w-4 h-4 inline mr-2" />
              Editar Clipe
            </button>
          )}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Adicionar Vídeo
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Upload Direto
                  </h3>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors duration-300 bg-purple-50/50 dark:bg-purple-900/20"
                  >
                    <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Clique para fazer upload
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      MP4, MOV, AVI até 500MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* YouTube Link */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Link do YouTube
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={handleYouTubeSubmit}
                      disabled={!youtubeUrl}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <Link className="w-4 h-4 inline mr-2" />
                      Adicionar do YouTube
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos List */}
            {videos.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Seus Vídeos ({videos.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {video.type === 'youtube' && video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <Play className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {video.type === 'youtube' ? 'YouTube' : 'Upload'} • {new Date(video.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateClips(video)}
                          disabled={isGenerating}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-300"
                        >
                          <Sparkles className="w-4 h-4 inline mr-1" />
                          {isGenerating && selectedVideo?.id === video.id ? 'Gerando...' : 'Gerar Clipes'}
                        </button>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  IA Analisando Vídeo...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Identificando os melhores momentos para clipes virais
                </p>
              </div>
            )}
          </div>
        )}

        {/* Clips Tab */}
        {activeTab === 'clips' && (
          <div className="space-y-8">
            {clips.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl text-center">
                <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum clipe gerado ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Faça upload de um vídeo e use nossa IA para gerar clipes virais automaticamente
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Começar Agora
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Clipes Gerados ({clips.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clips.map((clip) => (
                    <div key={clip.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {clip.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Clock className="w-4 h-4" />
                        {formatDuration(clip.startTime)} - {formatDuration(clip.endTime)} ({formatDuration(clip.duration)})
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {clip.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {clip.tags.map((tag, index) => (
                          <span key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedClip(clip);
                            setActiveTab('edit');
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
                        >
                          <Edit3 className="w-4 h-4 inline mr-1" />
                          Editar
                        </button>
                        <div className="relative group">
                          <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button onClick={() => shareClip(clip, 'twitter')} className="hover:text-blue-400">Twitter</button>
                                <button onClick={() => shareClip(clip, 'facebook')} className="hover:text-blue-600">Facebook</button>
                                <button onClick={() => shareClip(clip, 'whatsapp')} className="hover:text-green-400">WhatsApp</button>
                                <button onClick={() => shareClip(clip, 'telegram')} className="hover:text-blue-400">Telegram</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteClip(clip.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Tab */}
        {activeTab === 'edit' && selectedClip && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Editar Clipe: {selectedClip.title}
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Preview</h3>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                    <Play className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(selectedClip.startTime)} - {formatDuration(selectedClip.endTime)} ({formatDuration(selectedClip.duration)})
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Informações</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={editingClip.title || selectedClip.title}
                        onChange={(e) => updateClipEdit('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={editingClip.description || selectedClip.description}
                        onChange={(e) => updateClipEdit('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={editingClip.tags?.join(', ') || selectedClip.tags.join(', ')}
                        onChange={(e) => updateClipEdit('tags', e.target.value.split(',').map(tag => tag.trim()))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filtros
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Brilho
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={editingClip.filters?.brightness || 100}
                          onChange={(e) => updateClipEdit('filters', { ...editingClip.filters, brightness: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          {editingClip.filters?.brightness || 100}%
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Circle className="w-4 h-4 mr-2" />
                          Contraste
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={editingClip.filters?.contrast || 100}
                          onChange={(e) => updateClipEdit('filters', { ...editingClip.filters, contrast: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          {editingClip.filters?.contrast || 100}%
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          Saturação
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={editingClip.filters?.saturation || 100}
                          onChange={(e) => updateClipEdit('filters', { ...editingClip.filters, saturation: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          {editingClip.filters?.saturation || 100}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                      <Download className="w-4 h-4 inline mr-2" />
                      Salvar Alterações
                    </button>
                    <button 
                      onClick={() => setActiveTab('clips')}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}