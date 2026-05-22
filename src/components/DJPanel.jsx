export default function DJPanel({ announcement, status }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">AI DJ Panel</h2>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
          {status || "Live"}
        </span>
      </div>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0f172a] p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Latest update</p>
          <p className="mt-2 text-base leading-7 text-white">
            {announcement || "The AI DJ is warming up and will be live shortly."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Mood</p>
            <p className="mt-2 text-lg">Energetic</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Update type</p>
            <p className="mt-2 text-lg">{announcement ? "Announcement" : "Standby"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
