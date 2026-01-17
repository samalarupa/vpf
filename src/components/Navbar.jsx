import { NavLink, Link } from "react-router-dom";
import { Home, Phone, Youtube,Instagram, Crown, Menu, X, } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";
/* Matching the homepage color palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_D = "#B8963A";
const LINE = "#1F2847";


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cls = ({ isActive }) =>
    `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
      isActive 
        ? `bg-gradient-to-r from-${GOLD} to-${GOLD_D} text-[${BG}] shadow-lg`
        : `text-[${TEXT}] hover:text-[${GOLD}] hover:bg-white/5`
    }`;

  const activeLinkStyle = ({ isActive }) => ({
    background: isActive 
      ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)` 
      : 'transparent',
    color: isActive ? BG : TEXT,
    boxShadow: isActive ? `0 4px 12px ${GOLD}40` : 'none',
  });
  const settings = useContext(SiteSettingsContext);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b"
      style={{
        backgroundColor: `${BG}F2`,
        borderColor: `${LINE}`,
        boxShadow: `0 4px 24px ${BG}80`
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div 
            className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              boxShadow: `0 8px 24px ${GOLD}30`
            }}
          >
            <Crown className="h-6 w-6 relative z-10" style={{ color: BG }} />
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
            />
          </div>
          <div className="leading-tight">
            <div 
              className="font-black text-xl transition-colors"
              style={{ color: TEXT }}
            >
              VPF PROPERTIES
            </div>
            <div 
              className="text-xs font-semibold tracking-widest"
              style={{ color: GOLD }}
            >
              HYDERABAD
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink 
            to="/" 
            style={activeLinkStyle}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5"
          >
            Home
          </NavLink>
          <NavLink 
            to="/properties" 
            style={activeLinkStyle}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5"
          >
            Properties
          </NavLink>
          <a
            href="https://youtube.com/@vpfpropertieshyd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
            style={{ color: TEXT }}
          >

            <Youtube className="h-4 w-4" style={{ color: GOLD }} />
            YouTube
          </a>
          <a
  href="https://www.instagram.com/vpfproperties?igsh=NW16aWh3ajZ5b2R3"
  target="_blank"
  rel="noopener noreferrer"
  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center gap-2"
  style={{ color: TEXT }}
>
  <Instagram className="h-4 w-4" style={{ color: GOLD }} />
  Instagram
</a>

          <a
            href={`tel:${settings.phone_number}`}
            className="ml-3 px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              color: BG,
              boxShadow: `0 8px 24px ${GOLD}30`
            }}
          >
            <Phone className="h-4 w-4" />
            Elite Consultation
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-3 rounded-xl hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" style={{ color: GOLD }} />
          ) : (
            <Menu className="h-6 w-6" style={{ color: TEXT }} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t backdrop-blur-xl"
          style={{
            backgroundColor: `${SURFACE}F5`,
            borderColor: LINE
          }}
        >
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
            <NavLink 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              style={activeLinkStyle}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center"
            >
              Home
            </NavLink>
            <NavLink 
              to="/properties" 
              onClick={() => setMobileMenuOpen(false)}
              style={activeLinkStyle}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center"
            >
              Properties
            </NavLink>
            <a
              href="https://youtube.com/@vpfpropertieshyd"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2"
              style={{ color: TEXT }}
            >
              <Youtube className="h-4 w-4" style={{ color: GOLD }} />
              YouTube
            </a>
            <a
  href="https://www.instagram.com/vpfproperties?igsh=NW16aWh3ajZ5b2R3"
  target="_blank"
  rel="noopener noreferrer"
  className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-2"
  style={{ color: TEXT }}
>
  <Instagram className="h-4 w-4" style={{ color: GOLD }} />
  Instagram
</a>

            <a
              href="tel:+919999999999"
              className="px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-2"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                color: BG,
                boxShadow: `0 8px 24px ${GOLD}30`
              }}
            >
              <Phone className="h-4 w-4" />
              Elite Consultation
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}