import { MapPin, Bed, Home, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";

/* Matching the homepage color palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_L = "#E8C875";
const GOLD_D = "#B8963A";
const LINE = "#1F2847";

export default function PropertyCard({ item }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article 
      className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      style={{ 
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
        border: `1px solid ${LINE}`,
        boxShadow: "0 20px 60px rgba(0,0,0,.4)"
      }}
    >
      {/* Property Type Badge */}
      <div 
        className="absolute left-5 top-5 z-10 px-4 py-2 text-xs font-bold rounded-full backdrop-blur-md"
        style={{ 
          background: `linear-gradient(135deg, ${GOLD}E6 0%, ${GOLD_D}E6 100%)`,
          color: BG,
          boxShadow: `0 4px 12px ${GOLD}40`
        }}
      >
        {item.property_type || "Premium"}
      </div>

      {/* Save Button */}
      <button 
        onClick={() => setIsSaved(!isSaved)}
        className="absolute right-5 top-5 z-10 p-2.5 rounded-full backdrop-blur-md hover:scale-110 transition-transform" 
        style={{ backgroundColor: `${BG}B3` }}
        aria-label="Save property"
      >
        <Heart 
          className="h-5 w-5" 
          color={GOLD} 
          fill={isSaved ? GOLD : "none"}
        />
      </button>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${BG}CC 100%)` }} 
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 
          className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-gold-light transition-colors"
          style={{ color: TEXT }}
        >
          {item.title}
        </h3>

        {/* Property Details */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm" style={{ color: MUTED }}>
          <div className="flex items-center gap-1.5">
            <MapPin size={16} style={{ color: GOLD }} />
            <span>{item.locality}</span>
          </div>
          {item.bedrooms && (
            <>
              <span style={{ color: LINE }}>•</span>
              <div className="flex items-center gap-1.5">
                <Bed size={16} style={{ color: GOLD }} />
                <span>{item.bedrooms} BHK</span>
              </div>
            </>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: LINE }}>
          <div>
            <div className="text-xs mb-1" style={{ color: MUTED }}>
              Starting from
            </div>
            <div 
              className="text-3xl font-black"
              style={{ 
                background: `linear-gradient(135deg, ${GOLD_L} 0%, ${GOLD} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹{item.priceLakh}L
            </div>
          </div>
          
          <button
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2 group/btn"
            style={{
              background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
              border: `1px solid ${GOLD}40`,
              color: GOLD
            }}
          >
            <span>View</span>
            <ArrowRight 
              size={16} 
              className="group-hover/btn:translate-x-1 transition-transform" 
            />
          </button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ 
          boxShadow: `inset 0 0 80px ${GOLD}10`,
        }}
      />
    </article>
  );
}