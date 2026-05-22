import { useEffect, useMemo, useState } from "react";
import Player from "../components/Player";
import NowPlaying from "../components/NowPlaying";
import ChatBox from "../components/ChatBox";
import Queue from "../components/Queue";
import DJPanel from "../components/DJPanel";
import { getQueue, getShows, getStatus } from "../services/api";
import { useWebSocket } from "../hooks/useWebSocket";
import { useRadioStream } from "../hooks/useRadioStream";

export default function Home() {
  const [queue, setQueue] = useState([]);
  const [shows, setShows] = useState([]);
  const [showStatus, setShowStatus] = useState({});
  const [nowPlaying, setNowPlaying] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);

  const { audioRef, streamUrl, isPlaying, hasError, togglePlay } = useRadioStream();
  const { status, events, listeners, sendMessage } = useWebSocket();

  const latestUpdates = useMemo(
    () => events.slice(0, 5),
    [events]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [queueResponse, showsResponse, statusResponse] = await Promise.all([
          getQueue(),
          getShows(),
          getStatus(),
        ]);

        setQueue(queueResponse.queue || []);
        setShows(showsResponse.shows || []);
        setShowStatus(statusResponse);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!events.length) return;

    const latest = events[0];
    if (latest.type === "track_play") {
      setNowPlaying(latest.track || null);
    }
    if (latest.type === "announcement" || latest.type === "ai_speech") {
      setAnnouncement(latest.text || latest.message || "Live update from the AI DJ...");
    }
    if (latest.type === "queue_update") {
      setQueue(latest.queue || queue);
    }
  }, [events]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <Player
            streamUrl={streamUrl}
            audioRef={audioRef}
            isPlaying={isPlaying}
            hasError={hasError}
            togglePlay={togglePlay}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <NowPlaying track={nowPlaying} />
            <DJPanel announcement={announcement} status={showStatus?.services?.ai_dj?.status || "Live"} />
          </div>

          <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent/80">Current show</p>
                <h2 className="text-2xl font-semibold text-white">{showStatus?.services?.ai_dj?.context?.show_name || "AI Radio Presenter"}</h2>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
                {loading ? "Loading" : showStatus?.app_ready ? "Live" : "Starting"}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#0f172a] p-5 text-sm text-white/80">
                <p className="font-semibold text-white">Show status</p>
                <p className="mt-2">{showStatus?.services?.ai_dj?.status || "Ready"}</p>
              </div>
              <div className="rounded-3xl bg-[#0f172a] p-5 text-sm text-white/80">
                <p className="font-semibold text-white">Live listeners</p>
                <p className="mt-2">{listeners}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-background/80 p-5 text-sm text-white/70">
              <h3 className="font-semibold text-white">Upcoming shows</h3>
              {shows.length === 0 ? (
                <p className="mt-3 text-muted">No scheduled shows available yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {shows.slice(0, 3).map((show) => (
                    <li key={show.id || show.name} className="rounded-2xl bg-surface p-4">
                      <p className="font-medium text-white">{show.name || show.title}</p>
                      <p className="text-sm text-muted">{show.start_time || show.schedule || "Schedule pending"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <ChatBox
            messages={events.filter((event) => event.type === "chat_message")}
            onSend={sendMessage}
            connectionStatus={status}
          />

          <Queue items={queue} />

          <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Live updates</h2>
              <span className="text-sm text-muted">Real-time</span>
            </div>
            <div className="space-y-3 text-sm text-white/80">
              {latestUpdates.length === 0 ? (
                <p className="text-muted">Waiting for new AI DJ events...</p>
              ) : (
                latestUpdates.map((item, index) => (
                  <div key={index} className="rounded-3xl bg-[#0f172a] p-4">
                    <p className="font-medium text-white">{item.type.replaceAll("_", " ")}</p>
                    <p className="mt-2 text-sm text-white/70">{item.text || item.message || item?.track?.title || JSON.stringify(item)}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
