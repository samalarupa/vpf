import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Ruler,
  Heart,
  Share2,
  ShieldCheck,
  Phone,
  Send,
  Youtube,
  CheckCircle,
  Sparkles,
  Home,
  Bed,
  Calendar,
  Award,
  Crown,
  ChevronRight,
} from "lucide-react";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext";
import ReviewForm from "../components/ReviewForm";


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

const fmtLakh = (n) => `₹ ${Number(n).toLocaleString("en-IN")} L`;

// Convert any normal YouTube URL to an embeddable URL
function convertYoutubeUrl(url) {
  if (!url) return "";

  // https://www.youtube.com/watch?v=xxxxxx → embed
  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // https://youtu.be/xxxxxx → embed
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Already an embed link
  if (url.includes("/embed/")) return url;

  return "";
}

export default function PropertyDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [property, setProperty] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [idx, setIdx] = useState(0);
  const site = useContext(SiteSettingsContext);


  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`${API_BASE_URL}/properties/get.php?id=${id}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error || "Property not found.");
        } else {
          setProperty({
            ...data,
            priceLakh: Number(data.price_lakh),
            image: data.image_url,
            plotSize: data.plot_size,
            videoUrl: data.video_url,
            description: data.description,
            availability: data.availability,
            status: data.status,
            bedrooms: data.bedrooms,
          });
        }
      } catch (err) {
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  // loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: BG,
          color: TEXT,
        }}
      >
        <div className="text-center text-lg" style={{ color: MUTED }}>
          Loading property details...
        </div>
      </div>
    );
  }

  // error / not found state
  if (error || !property) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG }}
      >
        <div
          className="text-center px-6 py-12 rounded-3xl max-w-md"
          style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
            border: `1px solid ${LINE}`,
          }}
        >
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: TEXT }}>
            Property Not Found
          </h1>
          <p className="mb-6" style={{ color: MUTED }}>
            {error || "This property may have been removed or doesn't exist."}
          </p>
          <button
            onClick={() => nav(-1)}
            className="px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              color: BG,
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // now we are sure property exists
  const {
    title,
    priceLakh,
    locality,
    city,
    property_type,
    image,
    facing,
    rooms,
    bedrooms,
    plotSize,
    videoUrl,
  } = property;

  const images = property.images || (image ? [image] : []);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  const embedUrl = convertYoutubeUrl(videoUrl);

  const section = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReducedMotion ? 0.2 : 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: BG,
        color: TEXT,
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.08), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.06), transparent 45%),
          linear-gradient(180deg, ${BG} 0%, #0D1230 100%)
        `,
      }}
    >
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <Link
            to="/properties"
            className="hover:text-gold transition-colors flex items-center gap-1"
            style={{ color: MUTED }}
          >
            <ArrowLeft size={16} />
            Properties
          </Link>
          <ChevronRight size={16} style={{ color: LINE }} />
          <span style={{ color: GOLD }}>{title}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          {...section}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}E6 0%, ${GOLD_D}E6 100%)`,
                  color: BG,
                  boxShadow: `0 4px 12px ${GOLD}40`,
                }}
              >
                <Crown size={14} />
                {property_type || "Premium"}
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${GOLD}15`,
                  color: GOLD,
                  border: `1px solid ${GOLD}30`,
                }}
              >
                <ShieldCheck size={14} />
                Verified
              </div>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black tracking-tight mb-4"
              style={{ color: TEXT }}
            >
              {title}
            </h1>

            <div
              className="flex items-center gap-2 text-base"
              style={{ color: MUTED }}
            >
              <MapPin size={18} style={{ color: GOLD }} />
              <span className="font-medium">
                {locality}, {city || "Hyderabad"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="h-12 w-12 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <Heart
                size={20}
                color={GOLD}
                fill={isSaved ? GOLD : "none"}
              />
            </button>
            <button
              className="h-12 w-12 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <Share2 size={20} color={GOLD} />
            </button>
          </div>
        </motion.div>

        {/* Gallery */}
        {images.length > 0 && (
          <motion.div
            {...section}
            className="relative rounded-[32px] overflow-hidden mb-12 group"
            style={{
              boxShadow: `0 40px 100px rgba(0,0,0,.6)`,
              border: `2px solid ${GOLD}40`,
            }}
          >
            <img
              src={images[idx]}
              alt={title}
              className="w-full h-[500px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Image counter */}
            {images.length > 1 && (
              <div
                className="absolute bottom-6 right-6 px-4 py-2 rounded-xl backdrop-blur-xl text-sm font-semibold"
                style={{
                  backgroundColor: `${BG}E6`,
                  border: `1px solid ${GOLD}40`,
                }}
              >
                {idx + 1} / {images.length}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl flex items-center justify-center backdrop-blur-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  style={{
                    backgroundColor: `${BG}CC`,
                    border: `1px solid ${GOLD}60`,
                  }}
                >
                  <ArrowLeft size={24} color={GOLD} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl flex items-center justify-center backdrop-blur-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  style={{
                    backgroundColor: `${BG}CC`,
                    border: `1px solid ${GOLD}60`,
                  }}
                >
                  <ArrowRight size={24} color={GOLD} />
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <motion.div {...section} className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <div
              className="rounded-3xl p-8 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
                    border: `1px solid ${GOLD}30`,
                  }}
                >
                  <Sparkles size={24} color={GOLD} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: TEXT }}>
                  Key Features
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {bedrooms && (
                  <Feature
                    icon={Bed}
                    label="Bedrooms"
                    value={`${bedrooms} BHK`}
                  />
                )}
                {rooms && (
                  <Feature icon={Home} label="Total Rooms" value={rooms} />
                )}
                {facing && (
                  <Feature icon={MapPin} label="Facing" value={facing} />
                )}
                {plotSize && (
                  <Feature
                    icon={Ruler}
                    label="Plot Size"
                    value={plotSize}
                  />
                )}
                {property.availability && (
                  <Feature
                    icon={Calendar}
                    label="Availability"
                    value={property.availability}
                  />
                )}
                {property.status && (
                  <Feature
                    icon={Award}
                    label="Status"
                    value={property.status}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div
              className="rounded-3xl p-8 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: TEXT }}
              >
                About This Property
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: MUTED, whiteSpace: "pre-line" }}
              >
                {property.description ||
                  "No description added for this property yet."}
              </p>
              <section className="mt-8">
  <h3 className="text-xl font-bold" style={{ color: TEXT }}>Leave a Review</h3>
  <div className="mt-3">
    <ReviewForm propertyId={property?.id} onSubmitted={() => {
      // optional: refresh reviews list if you render them below
    }} />
  </div>
</section>

              {/* Highlights (still static list – change later if needed) */}
              <div
                className="mt-8 pt-6 border-t grid sm:grid-cols-2 gap-3"
                style={{ borderColor: LINE }}
              >
                {[
                  "Clear & Verified Title",
                  "Premium Location",
                  "Ready to Move",
                  "Modern Architecture",
                  "Prime Investment",
                  "Excellent Connectivity",
                ].map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <CheckCircle size={18} style={{ color: GOLD }} />
                    <span
                      className="text-sm font-medium"
                      style={{ color: TEXT }}
                    >
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Price & CTA */}
          <motion.aside {...section} className="space-y-6">
            {/* Price Card */}
            <div
              className="rounded-3xl p-8 backdrop-blur-sm sticky top-24"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
                boxShadow: `0 20px 60px ${BG}80`,
              }}
            >
              <div className="text-center mb-8">
                <div
                  className="text-sm font-semibold mb-3"
                  style={{ color: MUTED }}
                >
                  Starting From
                </div>
                <div
                  className="text-5xl font-black mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_L} 0%, ${GOLD} 50%, ${GOLD_D} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {fmtLakh(priceLakh)}
                </div>
                <div className="text-xs" style={{ color: MUTED }}>
                  *Price negotiable • EMI available
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${site.phone_number}`}

                  className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                    color: BG,
                    boxShadow: `0 8px 24px ${GOLD}30`,
                  }}
                >
                  <Phone size={20} />
                  Call for Viewing
                </a>

                <a
                  href={`https://wa.me/${site.whatsapp_number.replace("+","")}`}

                  className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-base backdrop-blur-sm hover:bg-white/10 transition-all"
                  style={{
                    border: `1.5px solid ${GOLD}60`,
                    color: TEXT,
                    backgroundColor: `${ACCENT}60`,
                  }}
                >
                  <Send size={20} style={{ color: GOLD }} />
                  WhatsApp Us
                </a>
              </div>

              <div
                className="mt-6 pt-6 border-t text-center"
                style={{ borderColor: LINE }}
              >
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ color: MUTED }}
                >
                  VERIFIED BY VPF PROPERTIES
                </div>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} style={{ color: GOLD }} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: MUTED }}
                    >
                      Clear Title
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} style={{ color: GOLD }} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: MUTED }}
                    >
                      Premium
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Video Section */}
        {embedUrl && (
          <motion.section {...section} className="mt-12">
            <h2
              className="text-3xl font-bold mb-6 flex items-center gap-3"
              style={{ color: TEXT }}
            >
              <Youtube size={32} style={{ color: GOLD }} />
              Property Video Tour
            </h2>
            <div
              className="rounded-[32px] overflow-hidden cursor-pointer relative group"
              style={{
                border: `2px solid ${GOLD}40`,
                boxShadow: "0 30px 80px rgba(0,0,0,.5)",
              }}
              onClick={() => setShowVideo(true)}
            >
              {!showVideo ? (
                <>
                  <img
                    src={image}
                    alt="video preview"
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-black/70 transition-all">
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                        boxShadow: `0 8px 32px ${GOLD}50`,
                      }}
                    >
                      <Youtube size={40} color={BG} />
                    </div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: TEXT }}
                    >
                      Watch Full Video Tour
                    </p>
                    <p
                      className="text-sm mt-2"
                      style={{ color: MUTED }}
                    >
                      Click to play
                    </p>
                  </div>
                </>
              ) : (
                <iframe
                  title="Property Video"
                  className="w-full aspect-video"
                  src={`${embedUrl}?autoplay=1&mute=0&loop=1&rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

/* ---------- Feature Component ---------- */
function Feature({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm"
      style={{
        backgroundColor: `${ACCENT}60`,
        border: `1px solid ${LINE}`,
      }}
    >
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
          border: `1px solid ${GOLD}30`,
        }}
      >
        <Icon size={22} style={{ color: GOLD }} />
      </div>
      <div>
        <div
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: MUTED }}
        >
          {label}
        </div>
        <div className="text-base font-bold" style={{ color: TEXT }}>
          {value}
        </div>
      </div>
    </div>
  );
}
