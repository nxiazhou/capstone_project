import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Image from "next/image";

export default function PanelPlayer() {
  const router = useRouter();
  const { panelId } = router.query;
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [noPlayable, setNoPlayable] = useState(false);
  const [scheduleTimer, setScheduleTimer] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const videoRef = useRef(null);
  const imageTimerRef = useRef(null);
  const containerRef = useRef(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // 1. 只在 panelId 或 reloadTrigger 变化时 fetch scheduleId
  useEffect(() => {
    if (!panelId) return;
    setLoading(true);
    setNoPlayable(false);
    const fetchScheduleId = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/schedules/play-command?panelId=${panelId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch play-command");
        const data = await res.json();
        if (!data.data || !data.data.scheduleId) {
          setNoPlayable(true);
          setLoading(false);
          return;
        }
        setScheduleId(data.data.scheduleId);
      } catch (e) {
        setNoPlayable(true);
        setLoading(false);
      }
    };
    fetchScheduleId();
  }, [panelId, reloadTrigger]);

  // 2. 只在 scheduleId 变化时 fetch schedule detail
  useEffect(() => {
    if (!scheduleId) return;
    setLoading(true);
    setNoPlayable(false);
    const fetchScheduleDetail = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const detailRes = await fetch(`/api/schedules/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!detailRes.ok) throw new Error("Failed to fetch schedule detail");
        const detail = await detailRes.json();
        setCurrentSchedule(detail);
        const items = (detail.contents || [])
          .sort((a, b) => a.orderNo - b.orderNo)
          .map(item => ({
            id: item.id,
            name: item.originalName,
            url: item.url,
            mediaType: item.url.endsWith(".mp4") ? "video" : "image"
          }));
        setContents(items);
        setCurrentIndex(0);
        setNoPlayable(false);
        setLoading(false);
      } catch (e) {
        setNoPlayable(true);
        setLoading(false);
      }
    };
    fetchScheduleDetail();
  }, [scheduleId]);

  // 3. 当前 schedule 快结束前2分钟 setReloadTrigger 触发重新拉取 scheduleId
  useEffect(() => {
    if (!currentSchedule) return;
    const end = new Date(currentSchedule.endTime);
    const now = new Date();
    const ms = end - now - 2 * 60 * 1000;
    if (ms > 0) {
      const timer = setTimeout(() => {
        setReloadTrigger(t => t + 1);
      }, ms);
      return () => clearTimeout(timer);
    }
  }, [currentSchedule]);

  // 轮播逻辑与player.js一致
  const currentContent = contents.length > 0 ? contents[currentIndex % contents.length] : null;

  // 自动轮播图片
  useEffect(() => {
    if (!currentContent || !isPlaying || currentContent.mediaType !== 'image') return;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, contents.length));
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, currentContent, contents.length]);

  // 视频播放结束自动下一项
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentContent || currentContent.mediaType !== 'video') return;
    const handleEnded = () => setCurrentIndex(prev => (prev + 1) % Math.max(1, contents.length));
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentContent, contents.length]);

  // 视频自动播放下一个
  const handleVideoEnded = () => {
    handleNext();
  };

  // 控制播放/暂停
  const handlePlayPause = () => {
    setIsPlaying(p => !p);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  // 上一个内容
  const handlePrevious = () => {
    if (contents.length > 0) {
      setCurrentIndex(prev => {
        const length = contents.length;
        return length === 0 ? 0 : (prev - 1 + length) % length;
      });
    }
  };

  // 全屏切换逻辑
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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
          {/* Exit Player 按钮 */}
          <button
            onClick={() => router.push('/device-management')}
            className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10"
          >
            Exit Player
          </button>
          {/* 全屏按钮 */}
          <button
            onClick={toggleFullscreen}
            className={`absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 z-10`}
          >
            {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
          </button>
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <span className="text-white text-2xl">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (noPlayable || contents.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
          {/* Exit Player 按钮 */}
          <button
            onClick={() => router.push('/device-management')}
            className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10"
          >
            Exit Player
          </button>
          {/* 全屏按钮 */}
          <button
            onClick={toggleFullscreen}
            className={`absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 z-10`}
          >
            {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
          </button>
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <span className="text-white text-2xl">No schedule for this panel at this time.</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentContent) return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
        <span className="text-white text-2xl">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className="flex-1 bg-black flex flex-col items-center justify-center relative"
        onMouseMove={handleMouseMove}
      >
        {/* Exit Player 按钮 */}
        <button
          onClick={() => router.push('/device-management')}
          className={`absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10 ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          Exit Player
        </button>
        {/* 全屏按钮 */}
        <button
          onClick={toggleFullscreen}
          className={`absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 z-10 ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
        </button>
        {/* 播放区 */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
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
            <div className="w-full h-full flex items-center justify-center">
              <Image
                key={currentContent.url}
                src={currentContent.url}
                alt={currentContent.name}
                width={1920}
                height={1080}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: isFullscreen ? "cover" : "contain"
                }}
                priority
                onError={() => setCurrentIndex(prev => (prev + 1) % Math.max(1, contents.length))}
              />
            </div>
          )}
        </div>
        <div
          className={`w-full ${isFullscreen ? 'absolute bottom-0 bg-opacity-80' : 'max-w-6xl'} bg-gray-800 p-4 flex flex-col gap-4 transition-opacity duration-300 ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button onClick={() => setCurrentIndex(prev => (prev - 1 + contents.length) % contents.length)} className="p-2 hover:bg-gray-700 rounded">⏮️</button>
              <button onClick={() => setIsPlaying(p => !p)} className="p-2 hover:bg-gray-700 rounded">
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button onClick={() => setCurrentIndex(prev => (prev + 1) % contents.length)} className="p-2 hover:bg-gray-700 rounded">⏭️</button>
            </div>
            <div className="text-sm">
              Now Playing: {currentContent.name} ({currentContent.mediaType})
            </div>
            <div className="text-sm">
              Schedule Time: {currentSchedule ? new Date(currentSchedule.startTime).toLocaleString() : ''} ~ {currentSchedule ? new Date(currentSchedule.endTime).toLocaleString() : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 