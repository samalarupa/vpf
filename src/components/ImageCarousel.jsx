import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-6">
      {/* ===== Main Row ===== */}
      <div className="flex items-center justify-center gap-8">
        {/* LEFT ARROW */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="hidden md:flex h-14 w-14 rounded-2xl
                       items-center justify-center
                       bg-black/50 backdrop-blur-md
                       border border-yellow-400/40
                       hover:bg-black/80 hover:scale-110
                       transition-all shadow-xl"
          >
            <ChevronLeft size={28} className="text-yellow-400" />
          </button>
        )}

        {/* IMAGE FRAME (FIXED SIZE) */}
        <div
          className="
            relative
            w-[2000px]          /* FIXED WIDTH */
            h-[580px]          /* FIXED HEIGHT */
            rounded-3xl
            overflow-hidden
            border border-white/10
            shadow-[0_40px_100px_rgba(0,0,0,0.6)]
            bg-black
          "
        >
          <img
            src={images[index]}
            alt={`Property image ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Counter */}
          {images.length > 1 && (
            <div
              className="
                absolute bottom-4 right-4
                px-4 py-1.5 rounded-full
                text-sm font-semibold
                bg-black/70 text-yellow-400
                border border-yellow-400/30
              "
            >
              {index + 1} / {images.length}
            </div>
          )}
        </div>

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="hidden md:flex h-14 w-14 rounded-2xl
                       items-center justify-center
                       bg-black/50 backdrop-blur-md
                       border border-yellow-400/40
                       hover:bg-black/80 hover:scale-110
                       transition-all shadow-xl"
          >
            <ChevronRight size={28} className="text-yellow-400" />
          </button>
        )}
      </div>

      {/* ===== Mobile Arrows ===== */}
      {images.length > 1 && (
        <div className="flex md:hidden justify-center gap-6">
          <button
            onClick={prev}
            className="h-12 w-12 rounded-xl flex items-center justify-center
                       bg-black/60 border border-yellow-400/40"
          >
            <ChevronLeft size={24} className="text-yellow-400" />
          </button>
          <button
            onClick={next}
            className="h-12 w-12 rounded-xl flex items-center justify-center
                       bg-black/60 border border-yellow-400/40"
          >
            <ChevronRight size={24} className="text-yellow-400" />
          </button>
        </div>
      )}

      {/* ===== Thumbnails ===== */}
      {images.length > 1 && (
        <div className="flex gap-4 justify-center overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                rounded-xl overflow-hidden transition-all
                border
                ${
                  i === index
                    ? "border-yellow-400 shadow-[0_0_24px_rgba(212,175,55,0.45)]"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }
              `}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="h-20 w-28 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
