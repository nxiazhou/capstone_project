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

  // 拉取所有Schedule并处理逻辑（兼容无panels字段）
  const fetchAndHandleSchedule = useCallback(async () => {
    if (!panelId) return;
    setLoading(true);
    setNoPlayable(false);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/schedules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      const now = new Date();
      // 先拿所有schedule id
      const allIds = (data.content || []).map(sch => sch.id);
      // 并发拉详情
      const detailList = await Promise.all(
        allIds.map(id => fetch(`/api/schedules/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.ok ? r.json() : null).catch(() => null))
      );
      // 过滤出panelId匹配的
      const all = detailList.filter(
        sch => sch && sch.panels && sch.panels.some(p => String(p.id) === String(panelId))
      );
      // 当前时间内的schedule，优先级高的优先
      const valid = all.filter(sch => {
        const start = new Date(sch.startTime);
        const end = new Date(sch.endTime);
        return start <= now && now <= end;
      }).sort((a, b) => b.priority - a.priority);
      if (valid.length > 0) {
        // 有可播的schedule，取第一个
        setCurrentSchedule(valid[0]);
        const items = (valid[0].contents || [])
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
        // 到点自动查找下一个schedule
        if (scheduleTimer) clearTimeout(scheduleTimer);
        const ms = new Date(valid[0].endTime) - now;
        if (ms > 0) {
          const timer = setTimeout(() => {
            fetchAndHandleSchedule();
          }, ms);
          setScheduleTimer(timer);
        }
      } else {
        // 没有当前可播的，找下一个即将开始的
        const future = all.filter(sch => new Date(sch.startTime) > now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        if (future.length > 0) {
          const ms = new Date(future[0].startTime) - now;
          if (scheduleTimer) clearTimeout(scheduleTimer);
          if (ms > 0) {
            const timer = setTimeout(() => {
              fetchAndHandleSchedule();
            }, ms);
            setScheduleTimer(timer);
          }
        }
        setCurrentSchedule(null);
        setContents([]);
        setNoPlayable(true);
        setLoading(false);
      }
    } catch (e) {
      setCurrentSchedule(null);
      setContents([]);
      setNoPlayable(true);
      setLoading(false);
    }
  }, [panelId, scheduleTimer]);

  // 首次加载和panelId变化时拉取
  useEffect(() => {
    fetchAndHandleSchedule();
    return () => {
      if (scheduleTimer) clearTimeout(scheduleTimer);
    };
  }, [fetchAndHandleSchedule, scheduleTimer]);

  // 自动轮播
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, contents.length));
  }, [contents.length]);

  useEffect(() => {
    if (!isPlaying || contents.length === 0) return;
    const current = contents[currentIndex];
    if (current && current.mediaType === "image") {
      imageTimerRef.current = setTimeout(handleNext, 5000);
    }
    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, [isPlaying, currentIndex, contents, handleNext]);

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

  // 播放结束时自动查找下一个schedule
  useEffect(() => {
    if (!currentSchedule || !contents.length) return;
    const now = new Date();
    const end = new Date(currentSchedule.endTime);
    if (now >= end) {
      fetchAndHandleSchedule();
    }
  }, [currentSchedule, contents, fetchAndHandleSchedule]);

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

  const current = contents[currentIndex];

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
        <div className="w-full flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
          {current.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={current.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
            />
          ) : (
            <Image
              src={current.url}
              alt={current.name}
              style={{ maxWidth: "100vw", maxHeight: "80vh", objectFit: "contain" }}
            />
          )}
        </div>
        <div
          className={`w-full max-w-4xl bg-gray-800 p-4 flex flex-col gap-4 transition-opacity duration-300 ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'}`}
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
              Now Playing: {current.name} ({current.mediaType})
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