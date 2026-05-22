import { useState } from "react";

export default function ChatBox({ messages, onSend, connectionStatus }) {
  const [draft, setDraft] = useState("");

  const submitMessage = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Live Chat</h2>
        <span className="text-sm text-muted">{connectionStatus}</span>
      </div>

      <div className="h-64 space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a] p-4 text-sm text-white/80">
        {messages.length === 0 ? (
          <p className="text-muted">No chat messages yet. Say hello!</p>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.type}-${index}`} className="space-y-1">
              <p className="text-sm text-white">{message.text || message.content || ""}</p>
              <p className="text-xs text-muted">{message.type}</p>
            </div>
          ))
        )}
      </div>

      <form className="mt-4 flex gap-3" onSubmit={submitMessage}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Send a message to the AI DJ..."
        />
        <button
          type="submit"
          className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Send
        </button>
      </form>
    </section>
  );
}
