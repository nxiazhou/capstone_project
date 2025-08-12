import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// 自动注入token（只在本地调试时使用！）
//if (typeof window !== "undefined") {
//  localStorage.setItem("authToken", "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOjM4LCJzdWIiOiJhZG1pbl9jYnciLCJpYXQiOjE3NTQ2MjIyOTIsImV4cCI6MTc1NDcwODY5Mn0.SVo3mDqNxYaYTJIY0LxagF5MGWBPYcRDZRMMVYBKZ_jExcYdiHtz9sfCsnLbJCJLFZ_RZcxGAwqHw2QDOkSJRg");
//}

export default function AutoPlayer() {
  const router = useRouter();
  const { scheduleId: queryScheduleId, panelId } = router.query;
  const [scheduleId, setScheduleId] = useState(null);
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [noPlayable, setNoPlayable] = useState(false);
  const videoRef = useRef(null);
  const imageTimerRef = useRef(null);

  // 移除自动全屏，让Electron处理
  // useEffect(() => {
  //   if (document.documentElement.requestFullscreen) {
  //     document.documentElement.requestFullscreen().catch(() => {});
  //   }
  // }, []);

  // 自动识别panel当前Schedule
  useEffect(() => {
    if (queryScheduleId) {
      setScheduleId(queryScheduleId);
      return;
    }
    if (panelId) {
      const fetchPlayCommand = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const res = await fetch(`/api/schedules/play-command?panelId=${panelId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error("Failed to fetch play command");
          const data = await res.json();
          if (data && data.data && data.data.scheduleId) {
            setScheduleId(data.data.scheduleId);
          } else {
            setNoPlayable(true);
          }
        } catch (e) {
          setNoPlayable(true);
        }
      };
      fetchPlayCommand();
    }
  }, [queryScheduleId, panelId]);

  // 获取调度详情
  useEffect(() => {
    if (!scheduleId) return;
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch schedule");
        const data = await res.json();
        setStartTime(new Date(data.startTime));
        setEndTime(new Date(data.endTime));
        const items = data.contents
          .sort((a, b) => a.orderNo - b.orderNo)
          .map(item => ({
            id: item.id,
            name: item.originalName,
            url: item.url,
            mediaType: item.url.endsWith(".mp4") ? "video" : "image"
          }));
        setContents(items);
      } catch (e) {
        setNoPlayable(true);
      }
    };
    fetchSchedule();
  }, [scheduleId]);


  // 自动轮播
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, contents.length));
  }, [contents.length]);

  useEffect(() => {
    if (!isPlaying || contents.length === 0) return;
    const current = contents[currentIndex];
    if (current.mediaType === "image") {
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

  if (noPlayable) {
    return <div style={{ color: "#fff", background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>No playable schedule for this panel at this time.</div>;
  }

  if (contents.length === 0) {
    return <div style={{ color: "#fff", background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  const current = contents[currentIndex];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      {current.mediaType === "video" ? (
        <video
          ref={videoRef}
          src={current.url}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "contain",
            background: "#000"
          }}
          autoPlay
          muted
          controls={true}
          onEnded={handleVideoEnded}
        />
      ) : (
        <Image
          src={current.url}
          alt={current.name}
          fill
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
} 