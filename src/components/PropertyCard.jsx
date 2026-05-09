import { MapPin, Bed, ArrowLeft, ArrowRight, Crown } from "lucide-react";
import { useState, useRef } from "react";

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT  = "#1A2347";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

export default function PropertyCard({ item }) {
  const images =
    item.images?.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : [];

  const [index, setIndex] = useState(0);

  /* Touch swipe */
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 36) {
      dx < 0 ? next(e) : prev(e);
    }
    touchStartX.current = null;
  };

  const next = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };
  const prev = (e) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <article
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
      style={{
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
        border: `1px solid ${LINE}`,
        boxShadow: "0 16px 48px rgba(0,0,0,.4)",
      }}
    >
      {/* ── Image + carousel ── */}
      {images.length > 0 && (
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[index]}
            alt={item.title}
            /*
              Image height:
              xs  : h-48 (192px) — compact on small phones
              sm  : h-56 (224px)
              md  : h-60 (240px)
              lg  : h-64 (256px)
              xl  : h-72 (288px)
            */
            className="w-full h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 45%, ${BG}CC 100%)`,
            }}
          />

          {/* Property type badge — top-left */}
          {item.property_type && (
            <div
              className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold"
              style={{
                background: `linear-gradient(135deg, ${GOLD}E6 0%, ${GOLD_D}E6 100%)`,
                color: BG,
                boxShadow: `0 4px 12px ${GOLD}40`,
              }}
            >
              <Crown size={10} />
              {item.property_type}
            </div>
          )}

          {/* Image counter — top-right */}
          {images.length > 1 && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold"
              style={{
                backgroundColor: `${BG}CC`,
                border: `1px solid ${GOLD}35`,
                color: GOLD,
              }}
            >
              {index + 1}/{images.length}
            </div>
          )}

          {/* Arrows
              - Always visible on touch devices (no hover)
              - Fade in on hover for desktop
              - Hidden when only 1 image
          */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2
                           h-8 w-8 sm:h-10 sm:w-10 rounded-xl
                           flex items-center justify-center
                           transition-all
                           opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                style={{
                  backgroundColor: `${BG}CC`,
                  border: `1px solid ${GOLD}40`,
                }}
                aria-label="Previous image"
              >
                <ArrowLeft size={16} color={GOLD} />
              </button>

              <button
                onClick={next}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2
                           h-8 w-8 sm:h-10 sm:w-10 rounded-xl
                           flex items-center justify-center
                           transition-all
                           opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                style={{
                  backgroundColor: `${BG}CC`,
                  border: `1px solid ${GOLD}40`,
                }}
                aria-label="Next image"
              >
                <ArrowRight size={16} color={GOLD} />
              </button>
            </>
          )}

          {/* Dot indicators — xs only (thumbnails show on sm+) */}
          {images.length > 1 && (
            <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 16 : 6,
                    height: 6,
                    background: i === index
                      ? `linear-gradient(90deg, ${GOLD}, ${GOLD_D})`
                      : "rgba(255,255,255,0.35)",
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Thumbnails — sm+ only ── */}
      {images.length > 1 && (
        <div className="hidden sm:flex gap-2 px-3 sm:px-4 py-2.5 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumbnail ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className="object-cover rounded-lg cursor-pointer shrink-0 transition-all"
              style={{
                /* Fluid thumbnail size */
                width: "clamp(56px, 8vw, 80px)",
                height: "clamp(38px, 5.5vw, 56px)",
                border: i === index ? `2px solid ${GOLD}` : `1px solid ${LINE}`,
                opacity: i === index ? 1 : 0.55,
                boxShadow: i === index ? `0 0 12px ${GOLD}40` : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-4 sm:p-5 lg:p-6">
        <h3
          className="font-bold mb-1.5 sm:mb-2 line-clamp-2 leading-snug"
          style={{
            color: TEXT,
            fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
          }}
        >
          {item.title}
        </h3>

        {/* Meta row — locality + bedrooms */}
        <div
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm mb-3 sm:mb-4"
          style={{ color: MUTED }}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} color={GOLD} className="shrink-0" />
            <span className="truncate">{item.locality}</span>
          </span>

          {item.bedrooms && (
            <>
              <span style={{ color: LINE }}>•</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <Bed size={13} color={GOLD} />
                {item.bedrooms} BHK
              </span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div
          className="pt-3 sm:pt-4 border-t flex items-end justify-between gap-2"
          style={{ borderColor: LINE }}
        >
          <div>
            <div className="text-[10px] sm:text-xs mb-0.5" style={{ color: MUTED }}>
              Starting from
            </div>
            <div
              className="font-black leading-none"
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                background: `linear-gradient(135deg, ${GOLD} 0%, #E8C875 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹{item.priceLakh}L
            </div>
          </div>

          <span
            className="text-xs sm:text-sm font-bold shrink-0 pb-0.5"
            style={{ color: GOLD }}
          >
            View →
          </span>
        </div>
      </div>
    </article>
  );
}