import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  ArrowRight,
  Heart,
  Youtube,
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
  Sun,
  Moon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/* -----------------------------
   PALETTE / TOKENS (Deep Navy + Champagne Gold + Marble White)
------------------------------ */
const DARK_THEME = {
  BG: "#0A0E27", // page background
  SURFACE: "#141B3A", // block/card background
  ACCENT: "#1A2347", // glass/accent
  TEXT: "#F8F9FB", // primary text
  MUTED: "#B8BDD0", // secondary text
  GOLD: "#D4AF37", // champagne gold
  GOLD_L: "#E8C875", // lighter gold
  GOLD_D: "#B8963A", // deeper gold
  LINE: "#1F2847", // subtle stroke
};

const LIGHT_THEME = {
  BG: "#FFFFFF", // page background
  SURFACE: "#F8F9FA", // block/card background
  ACCENT: "#EDEFF2", // glass/accent
  TEXT: "#1A1F36", // primary text
  MUTED: "#6B7280", // secondary text
  GOLD: "#D4AF37", // champagne gold
  GOLD_L: "#E8C875", // lighter gold
  GOLD_D: "#B8963A", // deeper gold
  LINE: "#E5E7EB", // subtle stroke
};

const fmtLakh = (n) => `₹ ${Number(n).toLocaleString("en-IN")} L`;

/* -----------------------------
   MOCK DATA
------------------------------ */
const FEATURED = [
  { id: 1, title: "Modern Villa in Banjara Hills", priceLakh: 185, locality: "Banjara Hills", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80", tag: "Exclusive" },
  { id: 2, title: "3BHK Apartment • Gachibowli",   priceLakh: 95,  locality: "Gachibowli",    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80", tag: "Premium" },
  { id: 3, title: "Premium Plot in Kokapet",        priceLakh: 125, locality: "Kokapet",       image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80", tag: "New" },
];

const TESTIMONIALS = [
  ["Rajesh K. • Miyapur", 5, "Found a neat 2BHK within budget. Transparent process, no hidden costs."],
  ["Suma R. • Bachupally", 5, "Clear titles and quick site visits. Professional and friendly team."],
  ["Naveen M. • LB Nagar", 5, "Great options for families, smooth guidance from shortlist to registration."],
];

/* -----------------------------
   PAGE
------------------------------ */
export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
    show:   { opacity: 1, y: 0, scale: 1, transition: { duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  // YouTube Video Gallery config
  const VIDEO_IDS = [
    "ntWlE3StjWo",
    "m_jfMBYbKFs",
    "hVxY2w59Uss",
    "cV2gBU6hKfY",
  ];
  const [activeId, setActiveId] = React.useState(VIDEO_IDS[0]);

  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{
        backgroundColor: theme.BG,
        color: theme.TEXT,
        backgroundImage: isDarkMode 
          ? `
            radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.08), transparent 50%),
            radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.06), transparent 45%),
            linear-gradient(180deg, ${theme.BG} 0%, #0D1230 100%)
          `
          : `
            radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.05), transparent 50%),
            radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.03), transparent 45%),
            linear-gradient(180deg, ${theme.BG} 0%, #F0F2F5 100%)
          `,
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 shadow-lg"
        style={{
          backgroundColor: isDarkMode ? `${theme.ACCENT}E6` : `${theme.ACCENT}E6`,
          border: `1.5px solid ${theme.GOLD}40`,
          color: theme.GOLD,
        }}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg"
        style={{
          backgroundColor: isDarkMode ? `${theme.ACCENT}E6` : `${theme.ACCENT}E6`,
          border: `1.5px solid ${theme.GOLD}40`,
          color: theme.GOLD,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </motion.button>

      {/* Ambient glows */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${theme.GOLD} 0%, transparent 70%)` }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${theme.GOLD_L} 0%, transparent 70%)` }}
          />
        </div>
      )}

      {/* ================= HERO ================= */}
      <motion.section className="relative overflow-hidden" {...section}>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium"
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

              <h1 className="text-[48px] md:text-[76px] leading-[0.95] font-black tracking-tight">
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
                    className="absolute left-0 right-0 -bottom-3 h-[12px] rounded-full blur-sm"
                    style={{
                      background: `linear-gradient(90deg, ${theme.GOLD} 0%, ${theme.GOLD_L} 100%)`,
                      opacity: 0.5,
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
              </h1>

              <p
                className="text-[19px] leading-relaxed max-w-xl font-light"
                style={{ color: theme.MUTED }}
              >
                We help families find beautiful, trusted homes across Hyderabad — with
                clear details, honest guidance, and a smooth, worry-free buying
                experience.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  [ShieldCheck, "Verified Titles"],
                  [Award, "Premium Selection"],
                  [Sparkles, "Concierge Service"],
                ].map(([Icon, label]) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      backgroundColor: `${theme.ACCENT}80`,
                      border: `1px solid ${theme.LINE}`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Icon size={16} color={theme.GOLD} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/properties"
                  className="group px-8 py-5 rounded-2xl font-semibold text-base shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)`,
                    color: theme.BG,
                  }}
                >
                  <span className="relative z-10">Explore Portfolio</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </Link>
                <a
                  href="https://youtube.com/@vpfpropertieshyd"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-5 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
                  style={{
                    border: `1.5px solid ${theme.GOLD}60`,
                    color: theme.TEXT,
                    backgroundColor: `${theme.ACCENT}40`,
                  }}
                >
                  <Youtube className="h-5 w-5" color={theme.GOLD} />
                  Video Tours
                </a>
              </div>
            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative">
                {/* Glow behind image */}
                {isDarkMode && (
                  <div
                    className="absolute inset-0 rounded-[32px] blur-3xl opacity-30"
                    style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)` }}
                  />
                )}
                <div
                  className="relative rounded-[32px] overflow-hidden border-2"
                  style={{
                    borderColor: `${theme.GOLD}40`,
                    boxShadow: `0 40px 100px rgba(0,0,0,.6), inset 0 0 0 1px ${theme.GOLD}20`,
                    backgroundColor: theme.SURFACE,
                  }}
                >
                  <img
                    src="https://i.pinimg.com/736x/f7/7e/ac/f77eacc3c207119451c82cbdc01be703.jpg"
                    alt="Premium Hyderabad residence"
                    className="w-full h-[580px] object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black/60' : 'from-black/40'} via-transparent to-transparent`} />
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-8 -left-8 px-6 py-4 rounded-2xl backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.ACCENT}E6 0%, ${theme.SURFACE}E6 100%)`,
                    border: `1px solid ${theme.GOLD}40`,
                    boxShadow: `0 20px 50px ${theme.BG}99`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)` }}
                    >
                      <ShieldCheck size={24} color={theme.BG} />
                    </div>
                    <div>
                      <div className="text-base font-bold" style={{ color: theme.GOLD }}>
                        100% Verified
                      </div>
                      <div className="text-xs font-medium" style={{ color: theme.MUTED }}>
                        Clear Titles Guaranteed
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Premium Stats */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-3 gap-6 max-w-3xl mt-20">
            {[
              ["250+", "Site Visits", "Curated Tours"],
              ["120+", "Happy Families", "Satisfied Clients"],
              ["30+", "Prime Localities", "Across Hyderabad"],
            ].map(([n, l, sub]) => (
              <motion.div
                key={l}
                variants={item}
                className="rounded-2xl text-center px-6 py-5 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
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
                    className="text-3xl font-black mb-1"
                    style={{
                      background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {n}
                  </div>
                  <div className="text-sm font-semibold">{l}</div>
                  <div className="text-xs mt-1" style={{ color: theme.MUTED }}>
                    {sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ================= HIGHLIGHTS ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 py-20" {...section}>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            WHY CHOOSE VPF PROPERTIES
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black">Excellence in Every Detail</h2>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            [HomeIcon, "Premium Selection", "Hand-picked luxury homes and villas in Hyderabad's most coveted locations."],
            [Landmark, "Legal Assurance", "Comprehensive verification with clear titles and vetted documentation."],
            [Wallet, "Fair Valuation", "Transparent pricing with expert market insights for informed decisions."],
            [Clock4, "Priority Service", "Expedited site visits with dedicated relationship managers."],
          ].map(([Icon, h, p], i) => (
            <motion.div
              key={i}
              variants={item}
              className="group rounded-3xl p-7 backdrop-blur-sm relative overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                border: `1px solid ${theme.LINE}`,
                boxShadow: "0 10px 40px rgba(0,0,0,.3)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${theme.GOLD}10, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${theme.GOLD}20 0%, ${theme.GOLD}10 100%)`, border: `1px solid ${theme.GOLD}30` }}
                >
                  <Icon className="h-7 w-7" color={theme.GOLD} />
                </div>
                <div className="font-bold text-lg mb-2">{h}</div>
                <div className="text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                  {p}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= FEATURED LISTINGS ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 py-20" {...section}>
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            SIGNATURE COLLECTION
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Featured Properties</h2>
          <p className="text-lg" style={{ color: theme.MUTED }}>
            Handpicked residences for the discerning buyer
          </p>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED.map((p) => (
            <motion.article
              key={p.id}
              variants={item}
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
                border: `1px solid ${theme.LINE}`,
                boxShadow: "0 20px 60px rgba(0,0,0,.4)",
              }}
            >
              <div
                className="absolute left-5 top-5 z-10 px-4 py-2 text-xs font-bold rounded-full backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${theme.GOLD}E6 0%, ${theme.GOLD_D}E6 100%)`,
                  color: theme.BG,
                  boxShadow: `0 4px 12px ${theme.GOLD}40`,
                }}
              >
                {p.tag}
              </div>
              <button
                className="absolute right-5 top-5 z-10 p-2.5 rounded-full backdrop-blur-md hover:scale-110 transition-transform"
                style={{ backgroundColor: `${theme.BG}B3` }}
                aria-label="Save"
              >
                <Heart className="h-5 w-5" color={theme.GOLD} />
              </button>
              <div className="relative overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(180deg, transparent 0%, ${theme.BG}CC 100%)` }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <div
                      className="text-3xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${theme.GOLD_L} 0%, ${theme.GOLD} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {fmtLakh(p.priceLakh)}
                    </div>
                    <div className="text-sm mt-1" style={{ color: theme.MUTED }}>
                      <MapPin size={14} className="inline mr-1" />
                      {p.locality}
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" color={theme.GOLD} />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-transform hover:scale-105"
            style={{ border: `2px solid ${theme.GOLD}60`, color: theme.GOLD, backgroundColor: `${theme.ACCENT}80` }}
          >
            View Properties
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.section>

      {/* ================= NEW: VIDEO GALLERY (YouTube) ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 py-20" {...section}>
        <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-center md:text-left">
            <div
              className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-3"
              style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
            >
              PROPERTY VIDEO TOURS
            </div>
            <h2 className="text-3xl md:text-4xl font-black">Experience the Lifestyle</h2>
            <p className="mt-2 text-sm md:text-base" style={{ color: theme.MUTED }}>
              Explore our projects through immersive video walkthroughs
            </p>
          </div>
          <a
            href="https://www.youtube.com/@vpfpropertieshyd/featured"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
            style={{ border: `1px solid ${theme.GOLD}55`, color: theme.TEXT, backgroundColor: `${theme.ACCENT}60` }}
          >
            <Youtube size={18} color={theme.GOLD} />
            Open Channel
          </a>
        </div>

        {/* Player */}
        <div
          className="relative rounded-3xl overflow-hidden border shadow-2xl"
          style={{ borderColor: `${theme.GOLD}33`, background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)` }}
        >
          <iframe
            key={activeId}
            className="w-full h-[420px] md:h-[520px]"
            src={`https://www.youtube.com/embed/${activeId}?rel=0&modestbranding=1`}
            title="VPF Properties Video"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Thumbnails row */}
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {VIDEO_IDS.map((vid) => (
            <button
              key={vid}
              onClick={() => setActiveId(vid)}
              className="flex-shrink-0 w-72 rounded-2xl overflow-hidden border transition-transform hover:scale-[1.02]"
              style={{
                border: `1px solid ${vid === activeId ? theme.GOLD : theme.LINE}`,
                background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`,
              }}
            >
              <div className="relative">
                <img
                  src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
                  alt="Thumbnail"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 grid place-items-center opacity-0 hover:opacity-100 transition-opacity">
                  <div
                    className="h-10 w-10 rounded-full grid place-items-center"
                    style={{ backgroundColor: `${theme.BG}CC`, border: `1px solid ${theme.GOLD}66` }}
                  >
                    <Youtube size={20} color={theme.GOLD} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* ================= PROCESS ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 py-20" {...section}>
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            OUR PROCESS
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Your Journey to Home Ownership</h2>
          <p className="text-lg" style={{ color: theme.MUTED }}>Easy, high-quality help every step of the way</p>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-4 gap-6">
          {[
            [Layers, "01", "Discovery", "Share your vision and budget with our consultants."],
            [MapPin, "02", "Curated Tours", "Experience premium properties with guided visits."],
            [ShieldCheck, "03", "Verification", "Complete legal due diligence and documentation."],
            [Wallet, "04", "Acquisition", "Transparent closing with expert guidance."],
          ].map(([Icon, num, h, p], i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative rounded-3xl p-7 backdrop-blur-sm group hover:-translate-y-2 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
            >
              <div className="absolute top-4 right-4 text-6xl font-black opacity-5" style={{ color: theme.GOLD }}>
                {num}
              </div>
              <div className="relative z-10">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `linear-gradient(135deg, ${theme.GOLD}20 0%, ${theme.GOLD}10 100%)`, border: `1px solid ${theme.GOLD}30` }}
                >
                  <Icon size={24} color={theme.GOLD} />
                </div>
                <div className="font-bold text-xl mb-2">{h}</div>
                <div className="text-sm leading-relaxed" style={{ color: theme.MUTED }}>
                  {p}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= REVIEWS ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 py-20" {...section}>
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: `${theme.GOLD}15`, color: theme.GOLD, border: `1px solid ${theme.GOLD}30` }}
          >
            CLIENT TESTIMONIALS
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Trusted by Families</h2>
          <p className="text-lg" style={{ color: theme.MUTED }}>Real experiences from satisfied homeowners</p>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(([name, stars, text]) => (
            <motion.article
              key={name}
              variants={item}
              className="rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
            >
              <div className="absolute top-0 right-0 text-9xl font-black opacity-5" style={{ color: theme.GOLD }}>
                "
              </div>
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5" color={theme.GOLD} fill={theme.GOLD} />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-6">{text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 100%)`, color: theme.BG }}
                  >
                    {name[0]}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: theme.MUTED }}>
                    {name}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= FAQ ================= */}
      <motion.section className="max-w-5xl mx-auto px-6 py-20" {...section}>
        <div
          className="rounded-3xl p-8 md:p-12 backdrop-blur-sm"
          style={{ background: `linear-gradient(135deg, ${theme.ACCENT} 0%, ${theme.SURFACE} 100%)`, border: `1px solid ${theme.LINE}` }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              ["How do I schedule a property viewing?", "Contact us through our website or call directly. Our concierge team will arrange personalized tours at your convenience, typically within 24–48 hours."],
              ["Are all properties legally verified?", "Absolutely. Every listing undergoes comprehensive legal due diligence. We ensure clear titles, proper documentation, and full regulatory compliance."],
              ["Which areas do you cover in Hyderabad?", "We specialize in premium localities including Banjara Hills, Jubilee Hills, Gachibowli, Kokapet, Miyapur, and other prime residential areas across the city."],
              ["What makes VPF Properties different?", "Our commitment to transparency, personalized service, and rigorous verification sets us apart. We provide end-to-end support from discovery to ownership."],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl p-5 backdrop-blur-sm transition-all hover:bg-white/5"
                style={{ border: `1px solid ${theme.LINE}` }}
              >
                <summary className="flex cursor-pointer items-center justify-between list-none">
                  <span className="font-semibold text-lg">{q}</span>
                  <ChevronDown className="h-6 w-6 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" color={theme.GOLD} />
                </summary>
                <p className="pt-4 text-base leading-relaxed" style={{ color: theme.MUTED }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section className="max-w-7xl mx-auto px-6 pb-24 pt-4" {...section}>
        <div
          className="relative overflow-hidden rounded-[32px] p-12 md:p-16"
          style={{ background: `linear-gradient(135deg, ${theme.GOLD} 0%, ${theme.GOLD_D} 50%, ${theme.GOLD} 100%)`, boxShadow: `0 40px 100px ${theme.GOLD}40` }}
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

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                <Sparkles size={24} color={theme.BG} />
                <span className="text-sm font-bold tracking-wider" style={{ color: theme.BG }}>
                  READY TO BEGIN?
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-4" style={{ color: theme.BG }}>
                Discover Your Dream Residence
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: `${theme.BG}E6` }}>
                Connect with our property consultants today. Experience personalized service and find the perfect home for your family's legacy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                to="/properties"
                className="group px-9 py-5 rounded-2xl font-bold text-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-3 justify-center"
                style={{ backgroundColor: theme.BG, color: theme.GOLD }}
              >
                <span>View Portfolio</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+919999999999"
                className="px-9 py-5 rounded-2xl font-bold text-lg transition-transform hover:scale-105 flex items-center gap-3 justify-center backdrop-blur-sm"
                style={{ border: `2px solid ${theme.BG}60`, backgroundColor: "rgba(255,255,255,0.15)", color: theme.BG }}
              >
                <Phone className="h-5 w-5" />
                <span>Schedule Call</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer accent line */}
      <div className="h-px max-w-7xl mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${theme.GOLD}40, transparent)` }} />
    </div>
  );
}