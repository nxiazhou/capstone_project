import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Sidebar from "../components/Sidebar";

const mockSchedules = [
  {
    id: 1,
    name: "Morning Promotion",
    mediaType: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    startTime: "2024-06-10T08:00",
    endTime: "2024-06-10T10:00",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Event Poster",
    mediaType: "image",
    url: "/images/sample-poster.jpg",
    startTime: "2024-06-11T09:00",
    endTime: "2024-06-11T18:00",
    status: "Scheduled",
  }
];

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

  const currentContent = contents[currentIndex];

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      if (!scheduleId) {
        // fallback mock data
        setContents(mockSchedules);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch schedule");

        const data = await res.json();

        const items = data.contents.map(item => ({
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
  }, [scheduleId]);

  useEffect(() => {
    if (!currentContent || !isPlaying) return;

    let timer;
    if (currentContent.mediaType === 'image') {
      timer = setTimeout(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentContent, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const handleNext = () => {
    if (contents.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % contents.length);
    }
  };

  const handlePrevious = () => {
    if (contents.length > 0) {
      setCurrentIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));
    }
  };

  const handleExit = () => {
    if (isFullscreen) toggleFullscreen();
    router.push('/dashboard');
  };

  if (!currentContent) return <div className="text-white p-10">Loading schedule content...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className="flex-1 bg-black flex flex-col items-center justify-center relative"
        onMouseMove={handleMouseMove}
      >
        {/* Exit */}
        <button
          onClick={handleExit}
          className={`absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          Exit Player
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 z-10 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        >
          {isFullscreen ? '⤓ Exit Fullscreen' : '⤢ Fullscreen'}
        </button>

        {/* 播放区域 */}
        <div className={`w-full ${isFullscreen ? 'h-full' : 'max-w-6xl aspect-video'} bg-gray-900 relative`}>
          {currentContent.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentContent.url}
              className="w-full h-full object-contain"
              controls={false}
              autoPlay
              onEnded={handleNext}
              muted
            />
          ) : (
            <div className="w-full h-full relative">
              <Image
                src={currentContent.url}
                alt={currentContent.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </div>

        {/* 控制栏 */}
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