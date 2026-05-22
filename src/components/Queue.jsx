export default function Queue({ items }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Queue</h2>
        <span className="text-sm text-muted">Next up</span>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Queue is empty. Add tracks to keep the show moving.</p>
        ) : (
          items.map((track, index) => (
            <div key={track.id || index} className="rounded-3xl border border-white/10 bg-[#0f172a] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{track.title}</p>
                  <p className="text-sm text-muted">{track.artist}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.24em] text-muted">
                  {track.duration}s
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
