import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Sidebar from "../components/Sidebar";

export default function Player() {
  const router = useRouter();
  const { scheduleId } = router.query;

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  const currentContent = contents.length > 0 ? contents[currentIndex % contents.length] : null;

  const [isClient, setIsClient] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      return (prev + 1) % Math.max(1, contents.length);
    });
  }, [contents.length]);
    
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  const handlePrevious = () => {
    if (contents.length > 0) {
      setCurrentIndex(prev => {
        const length = contents.length;
        return length === 0 ? 0 : (prev - 1 + length) % length;
      });
    }
  };

  const handleExit = () => {
    if (isFullscreen) toggleFullscreen();
    router.push('/schedule-management');
  };

  // 获取调度详情
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient || !scheduleId) return;

    const fetchScheduleDetail = async () => {
      if (!scheduleId) return;

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch schedule");

        const data = await res.json();

        // 只获取内容信息，不处理时间范围
        const items = data.contents
          .sort((a, b) => a.orderNo - b.orderNo)
          .map(item => ({
            id: item.id,
            name: item.originalName,
            url: item.url,
            mediaType: item.url.endsWith(".mp4") ? "video" : "image"
          }));

        setContents(items);
      } catch (error) {
        console.error("Error loading schedule:", error);
      }
    };

    fetchScheduleDetail();
  }, [scheduleId, isClient]);

  // 图片自动播放逻辑（简单可靠的实现）
  useEffect(() => {
    if (!isPlaying || !currentContent || currentContent.mediaType !== 'image') return;
    
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, currentContent, handleNext]);

  // 视频播放结束处理
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentContent || currentContent.mediaType !== 'video') return;
    
    const handleEnded = () => handleNext();
    
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentContent, handleNext]);

  // 全屏切换监听
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isFullscreen) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current.requestFullscreen) await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  if (!currentContent) return <div className="text-white p-10">Loading schedule content...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className="flex-1 bg-black flex flex-col items-center justify-center relative h-[calc(100vh-120px)]"
        onMouseMove={handleMouseMove}
      >
        <button
          onClick={handleExit}
          className={`absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          Exit Player
        </button>

        <button
          onClick={toggleFullscreen}
          className={`absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 z-10 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
        </button>

        <div className="relative w-full" style={{ height: 'calc(100vh - 120px)' }}>
          {currentContent.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentContent.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <Image
              key={currentContent.url}
              src={currentContent.url}
              alt={currentContent.name}
              fill
              sizes="(min-width: 1280px) 85vw, 100vw"
              style={{ objectFit: 'contain' }}
              priority
              onError={() => handleNext()} // 图片加载失败时自动跳过
            />
          )}
        </div>

        <div
          className={`w-full ${isFullscreen ? 'absolute bottom-0 bg-opacity-80' : 'max-w-6xl'} bg-gray-800 p-4 flex flex-col gap-4 transition-opacity duration-300 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button onClick={handlePrevious} className="p-2 hover:bg-gray-700 rounded">⏮️</button>
              <button onClick={handlePlayPause} className="p-2 hover:bg-gray-700 rounded">
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button onClick={handleNext} className="p-2 hover:bg-gray-700 rounded">⏭️</button>
            </div>
            <div className="text-sm">
              Now Playing: {currentContent.name} ({currentContent.mediaType})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}