import { useEffect, useRef, useState } from "react";
import { HTTP_API } from "../services/config";

export function useRadioStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setStreamUrl(`${HTTP_API}/stream/live.m3u8`);
  }, []);

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
