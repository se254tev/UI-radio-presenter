export default function NowPlaying({ track }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Now Playing</h2>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
          Live
        </span>
      </div>
      {track ? (
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-white">{track.title}</p>
          <p className="text-sm text-muted">{track.artist}</p>
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
            Duration: {track.duration}s
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No track information currently available.</p>
      )}
    </section>
  );
}
