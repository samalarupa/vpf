import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GOLD   = "#D4AF37";
const GOLD_D = "#B8963A";

export default function ImageCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  /* Touch / swipe */
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!images.length) return null;

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const ArrowBtn = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-2xl
                  bg-black/50 backdrop-blur-md
                  border border-yellow-400/40
                  hover:bg-black/80 hover:scale-110
                  transition-all shadow-xl ${className}`}
      style={{ borderColor: `${GOLD}55` }}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full space-y-3 sm:space-y-4">

      {/* ── Main viewer row ──
          Arrows sit INSIDE the image on xs/sm (overlaid),
          OUTSIDE on md+ (flanking) to avoid taking width.
      */}
      <div className="relative w-full">

        {/* Image frame — fully fluid */}
        <div
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black border border-white/10"
          style={{
            /*
              Aspect ratio scales the height automatically:
              - xs/sm : 4/3  → taller, suits portrait crops on phones
              - md+   : 16/9 → cinematic landscape on desktop
              Tailwind doesn't ship aspect-ratio utilities for arbitrary values,
              so we use the padding-top trick via inline style.
            */
            aspectRatio: "16/9",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={index}               /* remount on change for a crisp swap */
            src={images[index]}
            alt={`Property image ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Counter badge */}
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4
                         px-3 py-1 sm:px-4 sm:py-1.5 rounded-full
                         text-xs sm:text-sm font-semibold
                         bg-black/70"
              style={{ color: GOLD, border: `1px solid ${GOLD}40` }}
            >
              {index + 1} / {images.length}
            </div>
          )}

          {/* Overlaid arrows — xs/sm only */}
          {images.length > 1 && (
            <>
              <ArrowBtn
                onClick={prev}
                className="md:hidden absolute left-2 sm:left-3 top-1/2 -translate-y-1/2
                           h-9 w-9 sm:h-11 sm:w-11"
              >
                <ChevronLeft size={20} style={{ color: GOLD }} />
              </ArrowBtn>
              <ArrowBtn
                onClick={next}
                className="md:hidden absolute right-2 sm:right-3 top-1/2 -translate-y-1/2
                           h-9 w-9 sm:h-11 sm:w-11"
              >
                <ChevronRight size={20} style={{ color: GOLD }} />
              </ArrowBtn>
            </>
          )}
        </div>

        {/* Flanking arrows — md+ only, sit outside the frame */}
        {images.length > 1 && (
          <>
            <ArrowBtn
              onClick={prev}
              className="hidden md:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2
                         h-12 w-12 lg:h-14 lg:w-14 z-10"
            >
              <ChevronLeft size={24} style={{ color: GOLD }} />
            </ArrowBtn>
            <ArrowBtn
              onClick={next}
              className="hidden md:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2
                         h-12 w-12 lg:h-14 lg:w-14 z-10"
            >
              <ChevronRight size={24} style={{ color: GOLD }} />
            </ArrowBtn>
          </>
        )}
      </div>

      {/* ── Dot indicators (xs/sm) — compact alternative to thumbnails ── */}
      {images.length > 1 && (
        <div className="flex sm:hidden justify-center gap-1.5 pt-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="rounded-full transition-all"
              style={{
                width:  i === index ? 20 : 8,
                height: 8,
                background: i === index
                  ? `linear-gradient(90deg, ${GOLD}, ${GOLD_D})`
                  : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnails — sm+ only ──
          Horizontally scrollable row, thumbnails scale with breakpoint.
      */}
      {images.length > 1 && (
        <div className="hidden sm:flex gap-2 sm:gap-3 justify-center overflow-x-auto pb-1 px-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                /*
                  Thumbnail size:
                  sm: 80×56  md: 96×64  lg: 112×76
                  We use inline style so clamp() works without custom config.
                */
                width:  "clamp(80px, 10vw, 112px)",
                height: "clamp(56px, 7vw,  76px)",
                border: i === index
                  ? `2px solid ${GOLD}`
                  : "1px solid rgba(255,255,255,0.12)",
                opacity: i === index ? 1 : 0.65,
                boxShadow: i === index ? `0 0 20px ${GOLD}45` : "none",
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}