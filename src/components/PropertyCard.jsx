import { MapPin, Bed, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

/* Theme */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const LINE = "#1F2847";

export default function PropertyCard({ item }) {
  const images =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : [];

  const [index, setIndex] = useState(0);

  const next = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <article
      className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all hover:-translate-y-2"
      style={{
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
        border: `1px solid ${LINE}`,
        boxShadow: "0 20px 60px rgba(0,0,0,.4)",
      }}
    >
      {/* ---------- IMAGE CAROUSEL ---------- */}
      <div className="relative overflow-hidden">
        {images.length > 0 && (
          <>
            <img
              src={images[index]}
              alt={item.title}
              className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 50%, ${BG}CC 100%)`,
              }}
            />

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    backgroundColor: `${BG}CC`,
                    border: `1px solid ${GOLD}40`,
                  }}
                >
                  <ArrowLeft size={20} color={GOLD} />
                </button>

                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    backgroundColor: `${BG}CC`,
                    border: `1px solid ${GOLD}40`,
                  }}
                >
                  <ArrowRight size={20} color={GOLD} />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* ---------- THUMBNAILS ---------- */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className="h-14 w-20 object-cover rounded-lg cursor-pointer border transition-all"
              style={{
                border:
                  i === index
                    ? `2px solid ${GOLD}`
                    : `1px solid ${LINE}`,
                opacity: i === index ? 1 : 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* ---------- CONTENT ---------- */}
      <div className="p-6">
        <h3
          className="text-xl font-bold mb-2 line-clamp-2"
          style={{ color: TEXT }}
        >
          {item.title}
        </h3>

        <div
          className="flex items-center gap-3 text-sm mb-3"
          style={{ color: MUTED }}
        >
          <MapPin size={16} color={GOLD} />
          <span>{item.locality}</span>

          {item.bedrooms && (
            <>
              <span style={{ color: LINE }}>•</span>
              <Bed size={16} color={GOLD} />
              <span>{item.bedrooms} BHK</span>
            </>
          )}
        </div>

        <div
          className="pt-4 border-t flex items-center justify-between"
          style={{ borderColor: LINE }}
        >
          <div>
            <div className="text-xs" style={{ color: MUTED }}>
              Starting from
            </div>
            <div
              className="text-3xl font-black"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, #E8C875 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹{item.priceLakh}L
            </div>
          </div>

          <span
            className="text-sm font-semibold"
            style={{ color: GOLD }}
          >
            View →
          </span>
        </div>
      </div>
    </article>
  );
}
