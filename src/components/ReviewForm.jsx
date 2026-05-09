import { useState } from "react";
import { Star, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../config";

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT  = "#1A2347";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function ReviewForm({ propertyId, onSubmitted }) {
  const [name,    setName]    = useState("");
  const [rating,  setRating]  = useState(5);
  const [hovered, setHovered] = useState(0);
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null); // "success" | "error" | null
  const [errMsg,  setErrMsg]  = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setStatus("error");
      setErrMsg("Please enter your name and review text.");
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const fd = new FormData();
      fd.append("author_name", name.trim());
      fd.append("rating",      rating);
      fd.append("text",        text.trim());
      if (propertyId) fd.append("property_id", propertyId);

      const res  = await fetch(`${API_BASE_URL}/reviews/save.php`, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "Submission failed");

      setName(""); setRating(5); setText("");
      setStatus("success");
      if (onSubmitted) onSubmitted(data);
    } catch (err) {
      console.error("Review submit error:", err);
      setStatus("error");
      setErrMsg(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
    outline: "none",
    width: "100%",
  };

  const focusStyle = (e) =>
    Object.assign(e.currentTarget.style, {
      borderColor: `${GOLD}55`,
      boxShadow: `0 0 0 3px ${GOLD}20`,
    });
  const blurStyle = (e) =>
    Object.assign(e.currentTarget.style, {
      borderColor: LINE,
      boxShadow: "none",
    });

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-4 sm:p-5 space-y-4"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}50 0%, ${SURFACE}30 100%)`,
        border: `1px solid ${LINE}`,
      }}
    >
      {/* ── Success banner ── */}
      {status === "success" && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: `rgba(212,175,55,0.1)`,
            border: `1px solid ${GOLD}40`,
            color: GOLD,
          }}
        >
          <CheckCircle size={16} className="shrink-0 mt-0.5" />
          <span>Thanks! Your review was submitted and is pending approval.</span>
        </div>
      )}

      {/* ── Error banner ── */}
      {status === "error" && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#FCA5A5",
          }}
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errMsg}</span>
        </div>
      )}

      {/* ── Name + Rating row ──
          xs: stacked
          sm+: side by side
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <label
            className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
            style={{ color: MUTED }}
          >
            <User size={12} />
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="px-3 py-2.5 rounded-xl text-sm transition"
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Star rating */}
        <div>
          <label
            className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
            style={{ color: MUTED }}
          >
            <Star size={12} />
            Rating
            {(hovered || rating) > 0 && (
              <span
                className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${GOLD}20`,
                  color: GOLD,
                  border: `1px solid ${GOLD}30`,
                }}
              >
                {LABELS[hovered || rating]}
              </span>
            )}
          </label>

          {/* Interactive stars */}
          <div className="flex items-center gap-1 h-[42px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95 p-0.5"
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  size={24}
                  fill={(hovered || rating) >= n ? GOLD : "none"}
                  color={(hovered || rating) >= n ? GOLD : LINE}
                  strokeWidth={1.5}
                  className="transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Review textarea ── */}
      <div>
        <label
          className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
          style={{ color: MUTED }}
        >
          <MessageSquare size={12} />
          Your Review
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Share your experience with this property…"
          className="px-3 py-2.5 rounded-xl text-sm transition resize-none"
          style={{ ...inputStyle, minHeight: 100 }}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        {/* Character hint */}
        <div
          className="mt-1 text-right text-[10px]"
          style={{ color: text.length > 20 ? MUTED : `${MUTED}60` }}
        >
          {text.length} chars
        </div>
      </div>

      {/* ── Submit row ──
          xs: stacked (button full-width, note below)
          sm+: side by side
      */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
          style={{
            background: loading
              ? `${GOLD}80`
              : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
            color: BG,
            boxShadow: loading ? "none" : `0 6px 20px ${GOLD}30`,
          }}
        >
          {loading ? (
            <>
              <span
                className="h-3.5 w-3.5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${BG}60`, borderTopColor: "transparent" }}
              />
              Submitting…
            </>
          ) : (
            <>
              <Star size={14} fill={BG} color={BG} />
              Submit Review
            </>
          )}
        </button>

        <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
          Your review appears after admin approval.
        </p>
      </div>
    </form>
  );
}