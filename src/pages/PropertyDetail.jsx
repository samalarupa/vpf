import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Ruler,
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
  X,
  Copy,
  QrCode,
  Mail,
  MessageCircle,
  Linkedin,
} from "lucide-react";

import { API_BASE_URL } from "../config";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";
import ReviewForm from "../components/ReviewForm";
import ImageCarousel from "../components/ImageCarousel";
import { Helmet } from "react-helmet-async";

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

function convertYoutubeUrl(url) {
  if (!url) return "";
  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
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
  const [idx, setIdx] = useState(0);
  const site = useContext(SiteSettingsContext);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = property?.title ? `Property: ${property.title}` : "Property";
  const shareText = property?.title
    ? `Check this property: ${property.title}`
    : "Check this property";

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const handleShare = async () => {
    setShareOpen(true);
  };

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
            nearby: data.nearby_locations,
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

  useEffect(() => {
    if (!shareOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shareOpen]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG, color: TEXT }}
      >
        <div className="text-center text-lg" style={{ color: MUTED }}>
          Loading property details...
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: BG }}
      >
        <div
          className="text-center px-6 py-12 rounded-3xl w-full max-w-md"
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

  const seoTitle = `${title} | ${locality}, ${city || "Hyderabad"} | VPF Properties`;

const seoDescription = `${
  property_type || "Property"
} for sale in ${locality}, ${
  city || "Hyderabad"
}. Price ₹${priceLakh} Lakhs. Explore verified property details, images, amenities and contact VPF Properties today.`;

const canonicalUrl = `https://vpfproperties.com/property/${id}`;

  let images = [];
  if (property.gallery_images) {
    if (Array.isArray(property.gallery_images)) {
      images = property.gallery_images;
    } else {
      try {
        images = JSON.parse(property.gallery_images);
      } catch {
        images = [];
      }
    }
  }
  if (images.length === 0) {
    if (property.image_url) images = [property.image_url];
    else if (property.image) images = [property.image];
  }
  images = images.filter(Boolean);

  const nearbyList = (property.nearby || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

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
    <>
    <Helmet>
      <title>{seoTitle}</title>

      <meta
        name="description"
        content={seoDescription}
      />

      <meta
        name="keywords"
        content="VPF Properties,
Properties in Hyderabad,
Flats for Sale Hyderabad,
Villas for Sale Hyderabad,
Apartments for Sale Hyderabad,
Property Listings Hyderabad,
Real Estate Hyderabad,
Property Dealers Hyderabad,
Property Consultants Hyderabad,
Buy Property Hyderabad,
Residential Properties Hyderabad,
Commercial Properties Hyderabad,
Premium Properties Hyderabad,
Luxury Villas Hyderabad,
Luxury Flats Hyderabad,
Verified Properties Hyderabad,
Property Broker Hyderabad,
Hyderabad Real Estate,
Homes for Sale Hyderabad,
Investment Properties Hyderabad,
Kukatpally Properties,
Miyapur Properties,
Bachupally Properties,
Nizampet Properties,
Hyderabad Property Listings"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta property="og:title" content={seoTitle} />

      <meta
        property="og:description"
        content={seoDescription}
      />

      <meta property="og:type" content="website" />

      <meta property="og:url" content={canonicalUrl} />

      {image && (
        <meta
          property="og:image"
          content={image}
        />
      )}
    </Helmet>
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: BG,
        color: TEXT,
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(212,175,55,0.08), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212,175,55,0.06), transparent 45%),
          linear-gradient(180deg, ${BG} 0%, #0D1230 100%)
        `,
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
        />
      </div>

      {/*
        RESPONSIVE CONTAINER
        - xs (default): px-3, pt-20, pb-10
        - sm (640px+):  px-4, pt-24, pb-12
        - md (768px+):  px-6, pt-26
        - lg (1024px+): px-8, pt-28, pb-20
        - xl (1280px+): max-w-7xl, centered
      */}
      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-26 lg:pt-28 pb-10 sm:pb-12 lg:pb-20">

        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs sm:text-sm mb-4 sm:mb-6 lg:mb-8 overflow-hidden"
        >
          <Link
            to="/properties"
            className="hover:text-gold transition-colors flex items-center gap-1 shrink-0"
            style={{ color: MUTED }}
          >
            <ArrowLeft size={15} />
            <span className="hidden xs:inline">Properties</span>
            <span className="xs:hidden">Back</span>
          </Link>
          <ChevronRight size={14} style={{ color: LINE }} className="shrink-0" />
          <span
            className="truncate font-medium"
            style={{ color: GOLD }}
            title={title}
          >
            {title}
          </span>
        </motion.div>

        {/* ── Header: title + share btn ──
            xs/sm: stacked (flex-col)
            lg+:   side by side (flex-row)
        */}
        <motion.div
          {...section}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6"
        >
          {/* Left: badges + title + location */}
          <div className="flex-1 min-w-0">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
              <div
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}E6 0%, ${GOLD_D}E6 100%)`,
                  color: BG,
                  boxShadow: `0 4px 12px ${GOLD}40`,
                }}
              >
                <Crown size={12} />
                {property_type || "Premium"}
              </div>
              <div
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${GOLD}15`,
                  color: GOLD,
                  border: `1px solid ${GOLD}30`,
                }}
              >
                <ShieldCheck size={12} />
                Verified
              </div>
            </div>

            {/* Title — scales from 22px on xs to 48px on xl */}
            <h1
              className="font-black tracking-tight leading-tight"
              style={{
                color: TEXT,
                fontSize: "clamp(1.35rem, 4vw, 3rem)",
              }}
            >
              {title}
            </h1>

            {/* Location */}
            <div
              className="flex items-center gap-1 mt-1 text-sm sm:text-base"
              style={{ color: MUTED }}
            >
              <MapPin size={16} style={{ color: GOLD }} className="shrink-0" />
              <span className="font-medium truncate">
                {locality}, {city || "Hyderabad"}
              </span>
            </div>
          </div>

          {/* Right: action buttons — on xs they sit below title */}
          <div className="flex items-center gap-3 lg:shrink-0 lg:pt-1">
            <button
              type="button"
              onClick={handleShare}
              className="h-11 w-11 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
              aria-label="Share property"
            >
              <Share2 size={19} color={GOLD} />
            </button>
          </div>
        </motion.div>

        {/* ── Video Section ── */}
        {embedUrl && (
          <motion.section {...section} className="mt-1 mb-6 sm:mb-8">
            <div
              className="rounded-2xl sm:rounded-[28px] lg:rounded-[32px] overflow-hidden cursor-pointer relative group"
              style={{
                border: `2px solid ${GOLD}40`,
                boxShadow: "0 20px 60px rgba(0,0,0,.5)",
              }}
              onClick={() => setShowVideo(true)}
            >
              {!showVideo ? (
                <>
                  <img
                    src={image}
                    alt="video preview"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      /* xs: 200px → sm: 300px → md: 420px → lg: 520px → xl: 600px */
                      height: "clamp(200px, 40vw, 600px)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-black/70 transition-all">
                    <div
                      className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                        boxShadow: `0 8px 32px ${GOLD}50`,
                      }}
                    >
                      <Youtube size={28} color={BG} className="sm:hidden" />
                      <Youtube size={36} color={BG} className="hidden sm:block md:hidden" />
                      <Youtube size={40} color={BG} className="hidden md:block" />
                    </div>
                    <p className="text-base sm:text-xl font-bold" style={{ color: TEXT }}>
                      Watch Full Video Tour
                    </p>
                    <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: MUTED }}>
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

        {/* ── Main Content Grid ──
            xs/sm/md: single column (details full width, price card below)
            lg+:      2/3 details + 1/3 sticky price card
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

          {/* ── Left Column: Details ── */}
          <motion.div {...section} className="lg:col-span-2 space-y-5 sm:space-y-6 lg:space-y-8">

            {/* Key Features card */}
            <div
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
                    border: `1px solid ${GOLD}30`,
                  }}
                >
                  <Sparkles size={20} color={GOLD} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: TEXT }}>
                  Key Features
                </h2>
              </div>

              {/*
                Feature grid:
                - xs: 1 column
                - sm: 2 columns
                - xl: 2 columns (or 3 if many features)
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {bedrooms && (
                  <Feature icon={Bed} label="Bedrooms" value={`${bedrooms} BHK`} />
                )}
                {rooms && (
                  <Feature icon={Home} label="Total Rooms" value={rooms} />
                )}
                {facing && (
                  <Feature icon={MapPin} label="Facing" value={facing} />
                )}
                {plotSize && (
                  <Feature icon={Ruler} label="Plot Size" value={plotSize} />
                )}
                {property.availability && (
                  <Feature icon={Calendar} label="Availability" value={property.availability} />
                )}
                {property.status && (
                  <Feature icon={Award} label="Status" value={property.status} />
                )}
              </div>
            </div>

            {/* Nearby Locations */}
            {nearbyList.length > 0 && (
              <div
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                  border: `1px solid ${LINE}`,
                }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: TEXT }}>
                  Nearby Locations
                </h2>

                {/*
                  Nearby grid:
                  - xs: 1 col
                  - sm: 2 cols
                  - md: 2 cols
                  - lg: 2 cols (inside 2/3 column)
                  - xl: 3 cols
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {nearbyList.map((place, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl"
                      style={{
                        backgroundColor: `${ACCENT}60`,
                        border: `1px solid ${LINE}`,
                      }}
                    >
                      <div
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
                          border: `1px solid ${GOLD}30`,
                        }}
                      >
                        <MapPin size={18} style={{ color: GOLD }} />
                      </div>
                      <div
                        className="text-sm sm:text-base font-semibold leading-tight"
                        style={{ color: TEXT }}
                      >
                        {place}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
              }}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: TEXT }}>
                About This Property
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: MUTED, whiteSpace: "pre-line" }}
              >
                {property.description || "No description added for this property yet."}
              </p>

              <section className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: TEXT }}>
                  Leave a Review
                </h3>
                <div className="mt-3">
                  <ReviewForm propertyId={property?.id} onSubmitted={() => {}} />
                </div>
              </section>

              {/* Highlights */}
              <div
                className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
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
                    <CheckCircle size={16} style={{ color: GOLD }} className="shrink-0" />
                    <span className="text-sm font-medium" style={{ color: TEXT }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Price & CTA ──
              On xs/sm/md: appears after details (natural flow, full width)
              On lg+: sticky sidebar
          */}
          <motion.aside {...section} className="lg:col-span-1">
            <div
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm lg:sticky lg:top-24"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                border: `1px solid ${LINE}`,
                boxShadow: `0 20px 60px ${BG}80`,
              }}
            >
              {/* Price */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: MUTED }}>
                  Starting From
                </div>
                <div
                  className="font-black mb-2"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 3rem)",
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

              {/* CTA buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${site.phone_number}`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                    color: BG,
                    boxShadow: `0 8px 24px ${GOLD}30`,
                  }}
                >
                  <Phone size={18} />
                  Call for Viewing
                </a>

                <a
                  href={`https://wa.me/${site.whatsapp_number.replace("+", "")}`}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base backdrop-blur-sm hover:bg-white/10 transition-all"
                  style={{
                    border: `1.5px solid ${GOLD}60`,
                    color: TEXT,
                    backgroundColor: `${ACCENT}60`,
                  }}
                >
                  <Send size={18} style={{ color: GOLD }} />
                  WhatsApp Us
                </a>
              </div>

              {/* Verified row */}
              <div
                className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t text-center"
                style={{ borderColor: LINE }}
              >
                <div className="text-xs font-semibold mb-3" style={{ color: MUTED }}>
                  VERIFIED BY VPF PROPERTIES
                </div>
                <div className="flex justify-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={15} style={{ color: GOLD }} />
                    <span className="text-xs font-medium" style={{ color: MUTED }}>
                      Clear Title
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award size={15} style={{ color: GOLD }} />
                    <span className="text-xs font-medium" style={{ color: MUTED }}>
                      Premium
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* ── Image Gallery ── */}
        {images.length > 0 && (
          <motion.section {...section} className="mt-8 sm:mt-10">
            <ImageCarousel images={images} />
          </motion.section>
        )}
      </div>

      {/* ── Share Modal ── */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={shareTitle}
        text={shareText}
        url={shareUrl}
        copied={copied}
        onCopy={copyLink}
      />
    </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Feature component
───────────────────────────────────────── */
function Feature({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm"
      style={{
        backgroundColor: `${ACCENT}60`,
        border: `1px solid ${LINE}`,
      }}
    >
      <div
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
          border: `1px solid ${GOLD}30`,
        }}
      >
        <Icon size={20} style={{ color: GOLD }} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
          style={{ color: MUTED }}
        >
          {label}
        </div>
        <div
          className="text-sm sm:text-base font-bold truncate"
          style={{ color: TEXT }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Share Modal
   - xs: bottom sheet (rounded top corners, slides up)
   - sm+: centered modal
───────────────────────────────────────── */
function ShareModal({ open, onClose, title, text, url, copied, onCopy }) {
  if (!open) return null;

  const msg = `${text}\n${url}`;

  const shareTargets = [
    {
      label: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(msg)}`,
    },
    {
      label: "Telegram",
      icon: TelegramIcon,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(msg)}`,
    },
    {
      label: "SMS",
      icon: MessageCircle,
      href: `sms:?&body=${encodeURIComponent(msg)}`,
    },
    {
      label: "LinkedIn",
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(10px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg sm:mx-4 overflow-hidden"
        style={{
          /* xs: bottom sheet with top rounded corners; sm+: card */
          borderRadius: "20px 20px 0 0",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          ...(typeof window !== "undefined" && window.innerWidth >= 640
            ? { borderRadius: 20 }
            : {}),
          border: `1px solid ${LINE}`,
          boxShadow: `0 40px 120px rgba(0,0,0,.75)`,
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
        }}
      >
        {/* Top bar */}
        <div
          className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          {/* Drag handle for xs (bottom sheet feel) */}
          <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full opacity-40" style={{ backgroundColor: MUTED }} />

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-black"
              style={{
                background: `linear-gradient(135deg, ${GOLD}E6 0%, ${GOLD_D}E6 100%)`,
                color: BG,
              }}
            >
              Share
            </div>
            <div className="text-xs" style={{ color: MUTED }}>
              Copy link or choose an app
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl grid place-items-center transition-all hover:scale-105"
            style={{
              backgroundColor: `${BG}A6`,
              border: `1px solid ${LINE}`,
            }}
            aria-label="Close"
          >
            <X size={17} color={TEXT} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          {/* Copy link row */}
          <div
            className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3"
            style={{
              backgroundColor: `${BG}66`,
              border: `1px solid ${LINE}`,
            }}
          >
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] sm:text-[11px] font-semibold mb-1 px-2"
                style={{ color: MUTED }}
              >
                Shareable link
              </div>
              <div
                className="rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm truncate"
                style={{
                  backgroundColor: `${BG}B3`,
                  border: `1px solid ${LINE}`,
                  color: TEXT,
                }}
                title={url}
              >
                {url}
              </div>
            </div>

            <button
              type="button"
              onClick={onCopy}
              className="h-8 px-3 sm:px-4 rounded-xl font-black flex items-center gap-1 mt-4 sm:mt-5 transition-all hover:scale-[1.02] shrink-0"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                color: BG,
                border: `1px solid ${GOLD}35`,
                boxShadow: `0 12px 26px ${GOLD}20`,
                whiteSpace: "nowrap",
                fontSize: 12,
              }}
            >
              <Copy size={10} />
              Copy
            </button>
          </div>

          {/* Copied toast */}
          <div
            className="mt-1.5 text-[11px] font-semibold"
            style={{
              color: GOLD,
              opacity: copied ? 1 : 0,
              transform: copied ? "translateY(0)" : "translateY(-4px)",
              transition: "all .18s ease",
              height: 14,
            }}
          >
            Copied ✓
          </div>

          {/* Share icons */}
          <div
            className="mt-3 rounded-xl sm:rounded-2xl p-3 sm:p-4"
            style={{
              backgroundColor: `${BG}66`,
              border: `1px solid ${LINE}`,
            }}
          >
            <div className="text-sm font-black mb-3" style={{ color: TEXT }}>
              Share via
            </div>

            {/*
              Icon grid:
              - xs: 6 icons in 2 rows of 3, evenly spaced
              - sm+: all 6 in a single centered row
            */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-8 md:gap-10">
              {shareTargets.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 sm:gap-0">
                  <ShareTile {...s} />
                  {/* Label visible on xs only (since tooltip not touch-friendly) */}
                  <span
                    className="text-[10px] font-medium sm:hidden"
                    style={{ color: MUTED }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Share Tile
───────────────────────────────────────── */
function ShareTile({ label, icon: Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative grid place-items-center rounded-xl sm:rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
      style={{
        height: 44,
        width: 44,
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
        border: `1px solid ${GOLD}55`,
        boxShadow: `0 14px 40px ${GOLD}14`,
      }}
      aria-label={label}
      title={label}
    >
      <Icon size={18} color={GOLD} />

      {/* Tooltip — desktop only (hidden on touch) */}
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        style={{
          backgroundColor: `${BG}E6`,
          border: `1px solid ${LINE}`,
          color: TEXT,
        }}
      >
        {label}
      </span>
    </a>
  );
}

/* ─────────────────────────────────────────
   Brand Icons
───────────────────────────────────────── */
const BrandIcon = ({ children }) => (
  <span className="inline-grid place-items-center">{children}</span>
);

const WhatsAppIcon = ({ size = 18, color = GOLD }) => (
  <BrandIcon>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.52 3.48A11.91 11.91 0 0 0 12.01 0C5.38 0 .01 5.37.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.6a11.93 11.93 0 0 0 5.81 1.48h.01c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.5-8.4ZM12.02 22a9.95 9.95 0 0 1-5.08-1.39l-.36-.21-3.68.95.98-3.58-.24-.37A9.95 9.95 0 1 1 12.02 22Zm5.78-7.44c-.31-.15-1.85-.91-2.14-1.02-.29-.11-.5-.15-.71.15-.21.31-.82 1.02-1 1.23-.19.21-.37.23-.68.08-.31-.15-1.31-.48-2.49-1.54-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.37.46-.55.15-.19.21-.31.31-.52.1-.21.05-.4-.03-.55-.08-.15-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.07-1.1 2.62 0 1.54 1.13 3.03 1.29 3.24.15.21 2.22 3.39 5.39 4.75.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.36Z"
        fill={color}
      />
    </svg>
  </BrandIcon>
);

const TelegramIcon = ({ size = 18, color = GOLD }) => (
  <BrandIcon>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M21.8 3.4c.3-.1.6.1.7.4.1.2.1.4 0 .6L16.9 21c-.1.3-.4.5-.7.5-.2 0-.4-.1-.6-.2l-4.3-3.2-2.1 2c-.2.2-.4.2-.6.2-.2 0-.3-.1-.4-.2-.1-.1-.2-.3-.2-.5v-3l9.4-8.6c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7-.1L5.2 13.1 1.9 12c-.3-.1-.5-.4-.5-.7 0-.3.2-.6.5-.7L21.8 3.4Z"
        fill={color}
      />
    </svg>
  </BrandIcon>
);

const LinkedInIcon = ({ size = 18, color = GOLD }) => (
  <BrandIcon>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.5h-4v16ZM8.5 7.5h3.8v2.2h.1c.5-1 1.9-2.2 3.9-2.2 4.2 0 5 2.7 5 6.3v9.7h-4v-8.6c0-2.1 0-4.8-2.9-4.8-2.9 0-3.4 2.3-3.4 4.7v8.7h-4V7.5Z"
        fill={color}
      />
    </svg>
  </BrandIcon>
);

const FacebookIcon = ({ size = 18, color = GOLD }) => (
  <BrandIcon>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Facebook">
      <path
        d="M24 12.07C24 5.405 18.627 0 12 0S0 5.405 0 12.07C0 18.092 4.388 23.073 10.125 24v-8.437H7.078v-3.493h3.047V9.41c0-3.035 1.792-4.714 4.533-4.714 1.313 0 2.686.236 2.686.236v2.98h-1.512c-1.49 0-1.953.93-1.953 1.886v2.272h3.328l-.532 3.493h-2.796V24C19.612 23.073 24 18.092 24 12.07Z"
        fill={color}
      />
    </svg>
  </BrandIcon>
);