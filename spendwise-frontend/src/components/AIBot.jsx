import { useState } from "react";
import API from "../services/api";
import { useTheme } from "../hooks/useTheme";

function AIBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { tokens } = useTheme();

  const fetchSuggestion = async () => {
    setLoading(true);
    try {
      const res = await API.get("/expenses/ai/suggestion");
      setMessage(res.data);
    } catch {
      setMessage("Could not load AI suggestion at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      fetchSuggestion();
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        title="AI Assistant"
        aria-label="Toggle AI Assistant"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 bg-linear-to-tr from-[#8B7CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white w-12 h-12 rounded-full shadow-lg shadow-[#8B7CF6]/30 flex items-center justify-center text-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="leading-none">🤖</span>
      </button>

      {/* Chat / Suggestion Box */}
      {open && (
        <div className={`fixed bottom-36 sm:bottom-20 right-4 sm:right-6 z-40 w-80 max-w-[calc(100vw-2rem)] ${tokens.card} ${tokens.border} border rounded-2xl shadow-2xl p-4 space-y-3 animate-slide-up-modal`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-inherit">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
              <p className={`text-xs font-bold uppercase tracking-wider ${tokens.text}`}>AI Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-60 hover:opacity-100 ${tokens.text} transition-opacity`}
              aria-label="Close AI Assistant"
            >
              ✕
            </button>
          </div>

          {/* Message Content */}
          <div className="text-xs leading-relaxed max-h-56 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 py-3 text-slate-400">
                <div className="w-4 h-4 border-2 border-[#8B7CF6] border-t-transparent rounded-full animate-spin" />
                <span>Thinking…</span>
              </div>
            ) : (
              <p className={tokens.text}>{message || "Tap below to get quick AI advice on your expenses."}</p>
            )}
          </div>

          {/* Footer action */}
          <button
            onClick={fetchSuggestion}
            disabled={loading}
            className={`w-full py-2 rounded-xl text-xs font-bold ${tokens.btn.primary} active:scale-95 transition-all duration-150 ${loading ? "opacity-60" : ""}`}
          >
            {loading ? "Analyzing..." : "Refresh Suggestion ✨"}
          </button>
        </div>
      )}
    </>
  );
}

export default AIBot;