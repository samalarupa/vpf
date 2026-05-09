import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FiltersBar from "../components/FiltersBar"; // adjust path
import { Link } from "react-router-dom";
import {
  Phone,
  ArrowRight,
  Youtube,
  Instagram,
  Star,
  ChevronDown,
  Layers,
  MapPin,
  ShieldCheck,
  Home as HomeIcon,
  Landmark,
  Wallet,
  Clock4,
  Sparkles,
  Award,
  ArrowUp,
  Moon,
  Search,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";
import LocationSection from "../components/LocationSection";


/* -----------------------------
   PALETTE / TOKENS (Deep Navy + Champagne Gold + Marble White)
------------------------------ */
const DARK_THEME = {
  BG: "#0A0E27",
  SURFACE: "#141B3A",
  ACCENT: "#1A2347",
  TEXT: "#F8F9FB",
  MUTED: "#B8BDD0",
  GOLD: "#D4AF37",
  GOLD_L: "#E8C875",
  GOLD_D: "#B8963A",
  LINE: "#1F2847",
};

const LIGHT_THEME = {
  BG: "#FFFFFF",
  SURFACE: "#F8F9FA",
  ACCENT: "#EDEFF2",
  TEXT: "#1A1F36",
  MUTED: "#6B7280",
  GOLD: "#D4AF37",
  GOLD_L: "#E8C875",
  GOLD_D: "#B8963A",
  LINE: "#E5E7EB",
};

const fmtLakh = (n) => `₹ ${Number(n).toLocaleString("en-IN")} L`;


/* -----------------------------
   MOCK DATA
------------------------------ */
const FEATURED = [
  { id: 1, title: "Modern Villa in Banjara Hills", priceLakh: 185, locality: "Banjara Hills", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80", tag: "Exclusive" },
  { id: 2, title: "3BHK Apartment • Gachibowli", priceLakh: 95, locality: "Gachibowli", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80", tag: "Premium" },
  { id: 3, title: "Premium Plot in Kokapet", priceLakh: 125, locality: "Kokapet", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80", tag: "New" },
];

const TESTIMONIALS = [
  ["Rajesh K. • Miyapur", 5, "Found a neat 2BHK within budget. Transparent process, no hidden costs."],
  ["Suma R. • Bachupally", 5, "Clear titles and quick site visits. Professional and friendly team."],
  ["Naveen M. • LB Nagar", 5, "Great options for families, smooth guidance from shortlist to registration."],
];

const HYDERABAD_LOCALITIES = [
  "Gachibowli", "Banjara Hills", "Jubilee Hills", "Kondapur", "Madhapur",
  "HITEC City", "Financial District", "Kokapet", "Nanakramguda", "Manikonda",
  "Miyapur", "Kukatpally", "Ameerpet", "Secunderabad", "Begumpet"
];



/* -----------------------------
   UTIL - extract YouTube ID from many possible formats
------------------------------ */
function extractYouTubeId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.has("v")) return u.searchParams.get("v");
      const p = u.pathname.split("/");
      return p.pop() || null;
    }
    if (u.hostname === "youtu.be") {
      const p = u.pathname.split("/");
      return p.pop() || null;
    }
  } catch (e) {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    return m ? m[1] : null;
  }
  return null;
}

/* -----------------------------
   PAGE
------------------------------ */
export default function Home() {
  const site = useContext(SiteSettingsContext);
  const popularLocalities = Array.isArray(site?.popular_localities)
    ? site.popular_localities
    : [];

  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const isDarkMode = true; // forced
  const theme = DARK_THEME;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [featured, setFeatured] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [propertiesData, setPropertiesData] = useState([]);
  const [typesData, setTypesData] = useState([]);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [propsRes, typesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/properties/list.php`),
          fetch(`${API_BASE_URL}/property_types/list.php`),
        ]);

        const propsJson = propsRes.ok ? await propsRes.json() : [];
        const typesJson = typesRes.ok ? await typesRes.json() : [];

        setPropertiesData(Array.isArray(propsJson) ? propsJson : []);
        setTypesData(
          Array.isArray(typesJson)
            ? typesJson.map((t) => (t.name || "").trim()).filter(Boolean)
            : []
        );
      } catch (e) {
        console.error("Failed to load filter data:", e);
        setPropertiesData([]);
        setTypesData([]);
      }
    }

    loadFilterData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");

    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        // FEATURED
        const fRes = await fetch(`${API_BASE_URL}/featured/list.php`);
        const fJson = await fRes.json();
        const fNorm = (Array.isArray(fJson) ? fJson : []).map((f) => ({
          id: f.property_id ?? f.id,
          _fid: f.id,
          title: f.title ?? "",
          priceLakh: f.price_lakh ? Number(f.price_lakh) : 0,
          locality: f.locality ?? "",
          image: f.image_url ?? f.thumbnail_url ?? null,
          tag: f.note || "Featured",
        }));
        setFeatured(fNorm);

        // VIDEOS
        const vRes = await fetch(`${API_BASE_URL}/videos/list.php`);
        const vJson = await vRes.json();
        const vNorm = (Array.isArray(vJson) ? vJson : []).map((v) => {
          const id = extractYouTubeId(v.video_url) || null;
          return {
            id: v.id,
            title: v.title,
            description: v.description,
            videoUrl: v.video_url,
            ytId: id,
            thumbnail: v.thumbnail_url || (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null),
            position: v.position ?? 0,
          };
        });
        setVideos(vNorm);
        if (vNorm.length > 0 && !activeVideoId) {
          setActiveVideoId(vNorm[0].ytId || vNorm[0].videoUrl);
        }

        // REVIEWS (only approved)
        const rRes = await fetch(`${API_BASE_URL}/reviews/list.php?approved_only=1`);
        const rJson = await rRes.json();
        const rNorm = (Array.isArray(rJson) ? rJson : []).map((r) => ({
          id: r.id,
          author: r.author_name || "Anonymous",
          rating: Number(r.rating) || 5,
          text: r.text || "",
        }));
        setReviews(rNorm);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function goToPropertiesWithLocality(locality) {
    if (!locality) {
      navigate("/properties");
      return;
    }
    const q = new URLSearchParams({ q: locality.trim() }).toString();
    navigate(`/properties?${q}`);
  }

  const onSearchClick = () => {
    if (!searchQuery || !searchQuery.trim()) {
      navigate("/properties");
      return;
    }
    goToPropertiesWithLocality(searchQuery);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchClick();
    }
  };

  const section = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: prefersReducedMotion ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16, scale: prefersReducedMotion ? 1 : 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{
        backgroundColor: theme.BG,
        color: theme.TEXT,
        backgroundImage: isDarkMode
          ? `radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.08), transparent 50%),
             radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.06), transparent 45%),
             linear-gradient(180deg, ${theme.BG} 0%, #0D1230 100%)`
          : `radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.05), transparent 50%),
             radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.03), transparent 45%),
             linear-gradient(180deg, ${theme.BG} 0%, #F0F2F5 100%)`,
      }}
    >

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full backdrop-blur-md border shadow-lg"
        style={{
          backgroundColor: `${theme.ACCENT}E6`,
          border: `1.5px solid ${theme.GOLD}40`,
          color: theme.GOLD,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        whileHover={{ scale: 1.1 }}
      >
        <ArrowUp size={18} />
      </motion.button>

      {/* Ambient glows */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${theme.GOLD} 0%, transparent 70%)` }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${theme.GOLD_L} 0%, transparent 70%)` }} />
        </div>
      )}

      {/* ================= HERO FILTER SECTION ================= */}
      <motion.section
        className="relative pt-16 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 min-h-[80vh] flex mt-8 sm:mt-12 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {HYDERABAD_LOCALITIES.map((locality, index) => (
            <motion.div
              key={locality + index}
              className="absolute text-xl sm:text-2xl font-bold whitespace-nowrap"
              style={{
                color: `${theme.GOLD}30`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, -1000],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear",
              }}
            >
              {locality}
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10 py-5">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium mb-3 sm:mb-4"
              style={{
                background: `${theme.ACCENT}80`,
                border: `1px solid ${theme.GOLD}25`,
                backdropFilter: "blur(12px)",
                color: theme.GOLD,
              }}
            >
              <Sparkles size={13} />
              <span>Premium Properties • Hyderabad</span>
            </motion.div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight tracking-tight">
              <span
                style={{
                  background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 50%, ${theme.GOLD_D} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Find a Home That Truly Fits You
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light mb-4 sm:mb-6 px-4 sm:px-0" style={{ color: theme.MUTED }}>
              Curated luxury homes in Hyderabad's most prestigious neighborhoods
            </p>
          </motion.div>

          {/* Filter Bar */}
          <FiltersBar
            data={propertiesData}
            types={typesData}
            showPriceRange={false}
            showApply={true}
            autoApply={false}
            showSearchButton={true}
            leftOfApply={
              <div className="flex flex-col gap-2 pt-1">
                <span
                  className="text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: theme.MUTED }}
                >
                  Popular areas
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-3">
                  {popularLocalities.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/properties?${new URLSearchParams({ q: loc }).toString()}`
                        )
                      }
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all
                     hover:scale-105 hover:shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                        border: `1px solid ${theme.GOLD}30`,
                        color: theme.TEXT,
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            }
            onApply={({ q, locality, bedrooms, type, nearby, minPrice, maxPrice }) => {
              const params = new URLSearchParams();

              const q2 = (q || "").trim();
              const loc2 = (locality || "").trim();
              const beds2 = (bedrooms || "").trim();
              const type2 = (type || "").trim();
              const near2 = (nearby || "").trim();
              const min2 = (minPrice || "").trim();
              const max2 = (maxPrice || "").trim();

              if (q2) params.set("q", q2);
              if (loc2 && loc2 !== "All") params.set("locality", loc2);
              if (beds2 && beds2 !== "Any") params.set("bedrooms", beds2);
              if (type2 && type2 !== "Any") params.set("type", type2);
              if (near2 && near2 !== "Any") params.set("nearby", near2);
              if (min2) params.set("minPrice", min2);
              if (max2) params.set("maxPrice", max2);

              navigate(`/properties?${params.toString()}`);
            }}
          />

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8"
          >
            {[
              ["100% Verified", "Properties"],
              ["500+", "Happy Families"],
              ["40+", "Localities"],
              ["24/7", "Support"]
            ].map(([number, text]) => (
              <div key={text} className="text-center py-3 sm:py-5">
                <div className="text-base sm:text-lg font-bold" style={{ color: theme.GOLD }}>
                  {number}
                </div>
                <div className="text-xs font-medium" style={{ color: theme.MUTED }}>
                  {text}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ================= HERO ================= */}
      <motion.section className="relative overflow-hidden py-10 sm:py-16 lg:py-20" {...section}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

          {/* 
            KEY LAYOUT:
            - xs/sm: stacked (content top, image bottom), each full width
            - lg+: side by side, equal halves, same height (items-stretch)
          */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 lg:items-stretch">

            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="z-10 flex flex-col justify-center gap-5 sm:gap-6"
            >
              {/* Content */}
              <div className="space-y-4 sm:space-y-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                    border: `1px solid ${theme.GOLD}33`,
                    boxShadow: `0 0 20px ${theme.GOLD}15`,
                    color: theme.GOLD,
                  }}
                >
                  <Sparkles size={14} />
                  <span>Hyderabad's Property Consultants</span>
                </motion.div>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight">
                  Turning Dreams
                  <br />
                  Into{" "}
                  <span className="relative inline-block">
                    <span
                      className="relative z-10"
                      style={{
                        background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 50%, ${theme.GOLD_D} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Addresses
                    </span>
                    <motion.span
                      className="absolute left-0 right-0 -bottom-2 h-2 rounded-full blur-sm"
                      style={{
                        background: `linear-gradient(90deg, ${theme.GOLD} 0%, ${theme.GOLD_L} 100%)`,
                        opacity: 0.5,
                      }}
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </span>
                </h1>

                <p className="text-base sm:text-lg leading-relaxed max-w-lg font-light" style={{ color: theme.MUTED }}>
                  Beautiful, verified homes across Hyderabad — honest guidance, zero stress.
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    [ShieldCheck, "Verified Titles"],
                    [Award, "Premium Selection"],
                    [Sparkles, "Concierge Service"],
                  ].map(([Icon, label]) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium"
                      style={{
                        backgroundColor: `${theme.ACCENT}80`,
                        border: `1px solid ${theme.LINE}`,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Icon size={14} color={theme.GOLD} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <Link
                    to="/properties"
                    className="group px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 sm:gap-3 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)`,
                      color: theme.BG,
                    }}
                  >
                    <span className="relative z-10">Explore Properties</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  </Link>
                  <Link
                    to="/list-property"
                    className="group px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      border: `1.5px solid ${theme.GOLD}60`,
                      color: theme.GOLD,
                      backgroundColor: `${theme.ACCENT}40`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" color={theme.GOLD} />
                    List Your Property
                  </Link>
                  <a
                    href="https://youtube.com/@vpfpropertieshyd"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
                    style={{
                      border: `1.5px solid ${theme.GOLD}60`,
                      color: theme.TEXT,
                      backgroundColor: `${theme.ACCENT}40`,
                    }}
                  >
                    <Youtube className="h-4 w-4 sm:h-5 sm:w-5" color={theme.GOLD} />
                  </a>
                </div>
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  ["120+", "Happy Families", "Satisfied Clients"],
                  ["30+", "Prime Localities", "Across Hyderabad"],
                ].map(([n, l, sub]) => (
                  <motion.div
                    key={l}
                    variants={item}
                    className="rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${theme.ACCENT}80 0%, ${theme.SURFACE}60 100%)`,
                      border: `1px solid ${theme.LINE}`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${theme.GOLD}10, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div
                        className="text-xl sm:text-2xl font-black mb-1"
                        style={{
                          background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {n}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold">{l}</div>
                      <div className="text-xs mt-0.5" style={{ color: theme.MUTED }}>{sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right image — on mobile: fixed aspect ratio; on lg+: stretches to match left */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full"
              style={{
                /* xs/sm/md: fixed height so it looks good stacked */
                /* lg+: min-height matches typical left column, flexes to fill */
              }}
            >
              {/* Aspect box for xs–md: locks a nice 4:3 ratio */}
              <div className="relative w-full lg:hidden" style={{ paddingBottom: "66.666%" }}>
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden border"
                  style={{
                    borderColor: `${theme.GOLD}35`,
                    backgroundColor: theme.SURFACE,
                  }}
                >
                  {site?.hero_image && (
                    <img
                      src={`${API_BASE_URL}${site.hero_image}`}
                      alt="Premium Hyderabad residence"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <motion.div
                    className="absolute bottom-3 left-3 px-3 py-2.5 rounded-2xl backdrop-blur-xl"
                    style={{
                      background: `linear-gradient(135deg, ${theme.ACCENT}F0 0%, ${theme.SURFACE}F0 100%)`,
                      border: `1px solid ${theme.GOLD}40`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)` }}
                      >
                        <ShieldCheck size={16} color={theme.BG} />
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: theme.GOLD }}>100% Verified</div>
                        <div className="text-xs" style={{ color: theme.MUTED }}>Clear Titles Guaranteed</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* lg+ version: fills the grid cell height exactly */}
              <div
                className="hidden lg:block rounded-3xl overflow-hidden border w-full h-full absolute inset-0"
                style={{
                  borderColor: `${theme.GOLD}35`,
                  backgroundColor: theme.SURFACE,
                  minHeight: "520px",
                }}
              >
                {site?.hero_image && (
                  <img
                    src={`${API_BASE_URL}${site.hero_image}`}
                    alt="Premium Hyderabad residence"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <motion.div
                  className="absolute bottom-4 left-4 px-4 py-3 rounded-2xl backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.ACCENT}F0 0%, ${theme.SURFACE}F0 100%)`,
                    border: `1px solid ${theme.GOLD}40`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)` }}
                    >
                      <ShieldCheck size={18} color={theme.BG} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: theme.GOLD }}>100% Verified</div>
                      <div className="text-xs" style={{ color: theme.MUTED }}>Clear Titles Guaranteed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* ================= FEATURED LISTINGS ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-3 sm:mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            SIGNATURE COLLECTION
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Featured Properties</h2>
          <p className="text-sm sm:text-base" style={{ color: theme.MUTED }}>
            Handpicked residences for the discerning buyer
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {featured.map((p) => (
            <motion.article
              key={`${p.id}-${p._fid || ""}`}
              variants={item}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                border: `1px solid ${theme.LINE}`,
                boxShadow: "0 16px 48px rgba(0,0,0,.3)",
              }}
              onClick={() => window.location.href = `/property/${p.id}`}
            >
              <div
                className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${theme.GOLD}E6 0%, ${theme.GOLD_D}E6 100%)`,
                  color: theme.BG,
                  boxShadow: `0 4px 12px ${theme.GOLD}40`,
                }}
              >
                {p.tag}
              </div>
              <div className="relative overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-48 sm:h-56 md:h-60 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(180deg, transparent 0%, ${theme.BG}CC 100%)` }}
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">{p.title}</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <div
                      className="text-xl sm:text-2xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {fmtLakh(p.priceLakh)}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.MUTED }}>
                      <MapPin size={12} className="inline mr-1" />
                      {p.locality}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" color={theme.GOLD} />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold transition-transform hover:scale-105 text-sm sm:text-base"
            style={{ border: `2px solid ${theme.GOLD}60`, color: theme.GOLD, backgroundColor: `${theme.ACCENT}80` }}
          >
            View Properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.section>

      {/* ================= HIGHLIGHTS ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-3 sm:mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            WHY CHOOSE VPF PROPERTIES
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Excellence in Every Detail</h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {[
            [HomeIcon, "Premium Selection", "Hand-picked luxury homes and villas in Hyderabad's most coveted locations."],
            [Landmark, "Legal Assurance", "Comprehensive verification with clear titles and vetted documentation."],
            [Wallet, "Fair Valuation", "Transparent pricing with expert market insights for informed decisions."],
            [Clock4, "Priority Service", "Expedited site visits with dedicated relationship managers."],
          ].map(([Icon, h, p], i) => (
            <motion.div
              key={i}
              variants={item}
              className="group rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden hover:-translate-y-1 transition-all duration-500 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                border: `1px solid ${theme.LINE}`,
                boxShadow: "0 8px 32px rgba(0,0,0,.2)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${theme.GOLD}10, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: `linear-gradient(135deg, ${theme.GOLD}20 0%, ${theme.GOLD}10 100%)`, border: `1px solid ${theme.GOLD}30` }}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" color={theme.GOLD} />
                </div>
                <div className="font-bold text-sm sm:text-base mb-1.5 sm:mb-2">{h}</div>
                <div className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                  {p}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= PROCESS ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-3 sm:mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            OUR PROCESS
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Your Journey to Home Ownership</h2>
          <p className="text-sm sm:text-base" style={{ color: theme.MUTED }}>Easy, high-quality help every step of the way</p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
        >
          {[
            [Layers, "01", "Discovery", "Share your vision and budget with our consultants."],
            [MapPin, "02", "Curated Tours", "Experience premium properties with guided visits."],
            [ShieldCheck, "03", "Verification", "Complete legal due diligence and documentation."],
            [Wallet, "04", "Acquisition", "Transparent closing with expert guidance."],
          ].map(([Icon, num, h, p], i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative rounded-2xl p-5 sm:p-6 backdrop-blur-sm group hover:-translate-y-1 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
            >
              <div className="absolute top-3 right-3 text-3xl sm:text-4xl font-black opacity-5" style={{ color: theme.GOLD }}>
                {num}
              </div>
              <div className="relative z-10">
                <div
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: `linear-gradient(135deg, ${theme.GOLD}20 0%, ${theme.GOLD}10 100%)`, border: `1px solid ${theme.GOLD}30` }}
                >
                  <Icon size={18} color={theme.GOLD} />
                </div>
                <div className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">{h}</div>
                <div className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                  {p}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= VIDEO GALLERY ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div className="mb-6 sm:mb-8 flex items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="text-center md:text-left">
            <div
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-2 sm:mb-3"
              style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
            >
              PROPERTY VIDEO TOURS
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black">Experience the Lifestyle</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm" style={{ color: theme.MUTED }}>
              Explore our projects through immersive video walkthroughs
            </p>
          </div>
          <a
            href="https://www.youtube.com/@vpfpropertieshyd/featured"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-sm"
            style={{ border: `1px solid ${theme.GOLD}55`, color: theme.TEXT, backgroundColor: `${theme.ACCENT}60` }}
          >
            <Youtube size={15} color={theme.GOLD} />
            Open Channel
          </a>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden border shadow-xl"
          style={{ borderColor: `${theme.GOLD}33`, background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)` }}
        >
          <iframe
            key={activeVideoId || "empty"}
            className="w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]"
            src={activeVideoId && activeVideoId.length === 11 ? `https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1` : activeVideoId}
            title="VPF Properties Video"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 sm:mt-5 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVideoId(v.ytId || v.videoUrl)}
              className="flex-shrink-0 w-48 sm:w-60 rounded-xl overflow-hidden border transition-transform hover:scale-[1.02]"
              style={{
                border: `1px solid ${v.ytId === activeVideoId ? theme.GOLD : theme.LINE}`,
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
              }}
            >
              <div className="relative">
                <img
                  src={v.thumbnail || "/fallback-video.jpg"}
                  alt={v.title}
                  className="w-full h-28 sm:h-32 object-cover"
                />
                <div className="absolute inset-0 grid place-items-center opacity-0 hover:opacity-100 transition-opacity">
                  <div
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full grid place-items-center"
                    style={{ backgroundColor: `${theme.BG}CC`, border: `1px solid ${theme.GOLD}66` }}
                  >
                    <Youtube size={14} color={theme.GOLD} />
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 text-left">
                <div className="font-semibold text-xs sm:text-sm">{v.title}</div>
                <div className="text-xs mt-1" style={{ color: theme.MUTED }}>
                  {v.description ? v.description.slice(0, 70) + (v.description.length > 70 ? "…" : "") : ""}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* ================= LIST YOUR PROPERTY CTA ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 md:p-14"
          style={{
            background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
            border: `1px solid ${theme.GOLD}25`,
            boxShadow: `0 32px 80px rgba(0,0,0,.4), inset 0 0 0 1px ${theme.GOLD}10`,
          }}
        >
          {/* Glow */}
          <div
            className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${theme.GOLD}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">

            {/* Left */}
            <div className="max-w-xl text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 sm:mb-4"
                style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
              >
                <HomeIcon size={12} />
                FOR PROPERTY OWNERS
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 leading-tight">
                Own a Property?{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 50%, ${theme.GOLD_D} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  List It With Us.
                </span>
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                Reach thousands of verified buyers across Hyderabad. Zero upfront costs,
                dedicated support, and a seamless end-to-end experience.
              </p>
            </div>

            {/* Right: CTAs + quick stats */}
            <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-5 flex-shrink-0 w-full lg:w-auto">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-end">
                <Link
                  to="/list-property"
                  className="group px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)`,
                    color: theme.BG,
                  }}
                >
                  <HomeIcon size={15} />
                  <span className="relative z-10">List Your Property</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </Link>
                <a
                  href="tel:+919999999999"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.03] flex items-center gap-2"
                  style={{
                    border: `1.5px solid ${theme.GOLD}50`,
                    color: theme.GOLD,
                    backgroundColor: `${theme.ACCENT}60`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Phone size={14} />
                  Talk to Us
                </a>
              </div>

              {/* 3 micro-stats */}
              <div className="flex gap-4 sm:gap-6">
                {[
                  ["500+", "Properties Sold"],
                  ["18 Days", "Avg. to Sell"],
                  ["₹0", "Listing Cost"],
                ].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div
                      className="text-base sm:text-lg font-black"
                      style={{
                        background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {n}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium mt-0.5" style={{ color: theme.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ================= REVIEWS ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-3 sm:mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            CLIENT TESTIMONIALS
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Trusted by Families</h2>
          <p className="text-sm sm:text-base" style={{ color: theme.MUTED }}>Real experiences from satisfied homeowners</p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {reviews.length === 0 ? (
            <div className="text-center text-sm text-white/60 col-span-full">No reviews yet</div>
          ) : reviews.map((r) => (
            <motion.article
              key={r.id}
              variants={item}
              className="rounded-2xl p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
            >
              <div className="absolute top-0 right-0 text-5xl sm:text-6xl font-black opacity-5" style={{ color: theme.GOLD }}>
                "
              </div>
              <div className="relative z-10">
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4" color={theme.GOLD} fill={theme.GOLD} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{r.text}</p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)`, color: theme.BG }}
                  >
                    {r.author?.[0] || "A"}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold" style={{ color: theme.MUTED }}>
                    {r.author}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= FAQ ================= */}
      <motion.section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16" {...section}>
        <div
          className="rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm"
          style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-5 sm:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2.5 sm:space-y-3">
            {[
              ["How do I schedule a property viewing?", "Contact us through our website or call directly. Our concierge team will arrange personalized tours at your convenience, typically within 24–48 hours."],
              ["Are all properties legally verified?", "Absolutely. Every listing undergoes comprehensive legal due diligence. We ensure clear titles, proper documentation, and full regulatory compliance."],
              ["Which areas do you cover in Hyderabad?", "We specialize in premium localities including Banjara Hills, Jubilee Hills, Gachibowli, Kokapet, Miyapur, and other prime residential areas across the city."],
              ["What makes VPF Properties different?", "Our commitment to transparency, personalized service, and rigorous verification sets us apart. We provide end-to-end support from discovery to ownership."],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-xl p-3.5 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/5"
                style={{ border: `1px solid ${theme.LINE}` }}
              >
                <summary className="flex cursor-pointer items-center justify-between list-none">
                  <span className="font-semibold text-sm sm:text-base pr-2">{q}</span>
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-open:rotate-180 flex-shrink-0" color={theme.GOLD} />
                </summary>
                <p className="pt-2.5 sm:pt-3 text-xs sm:text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 pt-2 sm:pt-4" {...section}>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-12"
          style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 50%, ${theme.GOLD} 100%)`, boxShadow: `0 32px 80px ${theme.GOLD}40` }}
        >
          {!prefersReducedMotion && (
            <>
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.BG} 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </>
          )}

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="flex items-center gap-2 mb-2 sm:mb-3 justify-center lg:justify-start">
                <Sparkles size={18} color={theme.BG} />
                <span className="text-xs sm:text-sm font-bold tracking-wider" style={{ color: theme.BG }}>
                  READY TO BEGIN?
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3" style={{ color: theme.BG }}>
                Discover Your Dream Residence
              </h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: `${theme.BG}E6` }}>
                Connect with our property consultants today. Experience personalized service and find the perfect home for your family's legacy.
              </p>
            </div>

            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 flex-shrink-0 w-full lg:w-auto">
              <Link
                to="/properties"
                className="group px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-transform hover:scale-105 shadow-2xl flex items-center gap-2 sm:gap-3 justify-center"
                style={{ backgroundColor: theme.BG, color: theme.GOLD }}
              >
                <span>View Properties</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+919999999999"
                className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-transform hover:scale-105 flex items-center gap-2 sm:gap-3 justify-center backdrop-blur-sm"
                style={{ border: `2px solid ${theme.BG}60`, backgroundColor: "rgba(255,255,255,0.15)", color: theme.BG }}
              >
                <Phone className="h-4 w-4" />
                <span>Schedule Call</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <LocationSection />

      <div className="h-px max-w-7xl mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${theme.GOLD}40, transparent)` }} />
    </div>
  );
}