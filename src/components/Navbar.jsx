import { NavLink, Link } from "react-router-dom";
import { Phone, Youtube, Instagram, Crown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useContext(SiteSettingsContext);

  /* Close mobile menu on resize to md+ */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Lock body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const activeLinkStyle = ({ isActive }) => ({
    background: isActive
      ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`
      : "transparent",
    color: isActive ? BG : TEXT,
    boxShadow: isActive ? `0 4px 12px ${GOLD}40` : "none",
  });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b"
      style={{
        backgroundColor: `${BG}F2`,
        borderColor: LINE,
        boxShadow: `0 4px 24px ${BG}80`,
      }}
    >
      {/*
        Height:
        - xs (default) : h-16  (64px) — compact on small phones
        - sm (640px+)  : h-18  (72px)
        - md (768px+)  : h-20  (80px) — full desktop height
      */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 h-16 sm:h-18 md:h-20 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          {/* Icon — slightly smaller on xs */}
          <div
            className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{
              background: `transparent`,
              // boxShadow: `0 8px 24px ${GOLD}30`,
            }}
          >
            {/* <Crown
              className="relative z-10"
              style={{ color: BG, width: "clamp(16px,3vw,24px)", height: "clamp(16px,3vw,24px)" }}
            /> */}
            <img src="../public/favicon.png" alt="" />
            {/* <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)" }}
            /> */}
          </div>

          {/* Brand text */}
          <div className="leading-tight">
            <div
              className="font-black transition-colors"
              style={{
                color: TEXT,
                /* xs: 15px → sm: 17px → md: 20px */
                fontSize: "clamp(0.9rem, 3vw, 1.25rem)",
              }}
            >
              VPF PROPERTIES
            </div>
            <div
              className="font-semibold tracking-widest hidden xs:block"
              style={{
                color: GOLD,
                fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)",
              }}
            >
              HYDERABAD
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav (md+) ── */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink
            to="/"
            style={activeLinkStyle}
            className="px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5"
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            style={activeLinkStyle}
            className="px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5"
          >
            Properties
          </NavLink>
          <a
            href="https://youtube.com/@vpfpropertieshyd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
            style={{ color: TEXT }}
          >
            <Youtube className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
            {/* Hide label on md, show on lg to avoid crowding */}
            <span className="hidden lg:inline">YouTube</span>
          </a>
          <a
            href="https://www.instagram.com/vpfproperties?igsh=NW16aWh3ajZ5b2R3"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
            style={{ color: TEXT }}
          >
            <Instagram className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
            <span className="hidden lg:inline">Instagram</span>
          </a>

          <a
            href={`tel:${settings.phone_number}`}
            className="ml-2 lg:ml-3 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              color: BG,
              boxShadow: `0 8px 24px ${GOLD}30`,
            }}
          >
            <Phone className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            {/* Shorter label on md so it fits without wrapping */}
            <span className="hidden lg:inline">Elite Consultation</span>
            <span className="lg:hidden">Call Us</span>
          </a>
        </nav>

        {/* ── Mobile: phone shortcut + hamburger ── */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick-dial icon — saves a tap on mobile */}
          <a
            href={`tel:${settings.phone_number}`}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              boxShadow: `0 4px 12px ${GOLD}30`,
            }}
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" style={{ color: BG }} />
          </a>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" style={{ color: GOLD }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: TEXT }} />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ──
          AnimatePresence gives a smooth slide-down / fade-out
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t overflow-hidden"
            style={{ backgroundColor: `${SURFACE}F8`, borderColor: LINE }}
          >
            {/*
              Padding:
              - xs: px-3 py-4
              - sm: px-5 py-5
            */}
            <nav className="max-w-7xl mx-auto px-3 sm:px-5 py-4 sm:py-5 flex flex-col gap-2">

              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={activeLinkStyle}
                className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center"
              >
                Home
              </NavLink>

              <NavLink
                to="/properties"
                onClick={() => setMobileMenuOpen(false)}
                style={activeLinkStyle}
                className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center"
              >
                Properties
              </NavLink>

              {/* Divider */}
              <div className="h-px my-1" style={{ backgroundColor: LINE }} />

              {/* Social links — side by side on sm, stacked on xs */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                <a
                  href="https://youtube.com/@vpfpropertieshyd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2"
                  style={{ color: TEXT, border: `1px solid ${LINE}` }}
                >
                  <Youtube className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/vpfproperties?igsh=NW16aWh3ajZ5b2R3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2"
                  style={{ color: TEXT, border: `1px solid ${LINE}` }}
                >
                  <Instagram className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
                  Instagram
                </a>
              </div>

              {/* CTA — full-width */}
              <a
                href={`tel:${settings.phone_number}`}
                className="px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-1"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                  color: BG,
                  boxShadow: `0 8px 24px ${GOLD}30`,
                }}
              >
                <Phone className="h-4 w-4" />
                Elite Consultation
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}