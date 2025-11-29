// src/components/ReviewForm.jsx
import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function ReviewForm({ propertyId, onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Please enter your name and review text.");
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("author_name", name.trim());
      fd.append("rating", rating);
      fd.append("text", text.trim());
      if (propertyId) fd.append("property_id", propertyId);

      const res = await fetch(`${API_BASE_URL}/reviews/save.php`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Submission failed");
      }

      // success
      setName("");
      setRating(5);
      setText("");
      alert("Thanks! Your review was submitted and is pending approval.");
      if (onSubmitted) onSubmitted(data);
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Failed to submit review: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium">Your name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10" />
      </div>

      <div>
        <label className="text-sm font-medium">Rating</label>
        <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10">
          <option value={5}>5 — Excellent</option>
          <option value={4}>4 — Very good</option>
          <option value={3}>3 — Good</option>
          <option value={2}>2 — Fair</option>
          <option value={1}>1 — Poor</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Your review</label>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={4} placeholder="Write your experience..." className="w-full px-3 py-2 rounded bg-[#020617] border border-white/10"></textarea>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold">
          {loading ? "Submitting…" : "Submit Review"}
        </button>
        <div className="text-xs text-white/60">Your review will appear after admin approval.</div>
      </div>
    </form>
  );
}
