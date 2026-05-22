import { useEffect, useRef, useState } from "react";

export function useRadioStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const audioRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:10000";

  useEffect(() => {
    setStreamUrl(`${apiBase}/stream/live.m3u8`);
  }, [apiBase]);

  const togglePlay = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      setHasError(true);
    }
  };

  return {
    audioRef,
    streamUrl,
    isPlaying,
    hasError,
    togglePlay,
  };
}
