import { useEffect, useMemo } from "react";
import Hls from "hls.js";

export default function Player({ streamUrl, audioRef, isPlaying, hasError, togglePlay }) {
  const displayUrl = useMemo(() => streamUrl || "", [streamUrl]);

  useEffect(() => {
    if (!audioRef.current || !displayUrl) return;

    const audioEl = audioRef.current;
    let hls = null;

    if (displayUrl.endsWith(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(displayUrl);
      hls.attachMedia(audioEl);
    } else {
      audioEl.src = displayUrl;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [displayUrl, audioRef]);

  return (
    <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent/80">
            Live AI Radio
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Tune in to the AI DJ
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Stream the show, chat with listeners, and follow the radio queue in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#111827] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Stream Source</p>
            <p className="mt-1 text-sm text-white/80">{displayUrl}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>State: {isPlaying ? "Playing" : "Paused"}</span>
            <span>•</span>
            <span>{hasError ? "Stream unavailable" : "Connected"}</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} hidden preload="metadata" />
    </section>
  );
}
