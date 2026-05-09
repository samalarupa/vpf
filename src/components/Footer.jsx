import { Phone, Mail, MapPin, Youtube, Crown, Instagram, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT  = "#1A2347";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

const SocialBtn = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="h-9 w-9 rounded-xl flex items-center justify-center transition-transform hover:-translate-y-0.5"
    style={{ backgroundColor: `${ACCENT}80`, border: `1px solid ${LINE}` }}
  >
    {children}
  </a>
);

export default function Footer() {
  const settings = useContext(SiteSettingsContext);

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: SURFACE, color: TEXT }}
    >
      {/* Subtle gold halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 200px at 50% 0%, rgba(212,175,55,0.07), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">

        {/*
          Main grid:
          - xs/sm : 1 column (brand → links → contact stacked)
          - md    : 2 columns (brand | links+contact)
          - lg    : 3 columns (brand | nav links | contact)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">

          {/* ── Brand column ── */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                  boxShadow: `0 8px 24px ${GOLD}20`,
                }}
              >
                <Crown className="h-5 w-5" style={{ color: BG }} />
              </div>
              <div className="leading-tight">
                <div className="font-black text-base sm:text-lg">VPF PROPERTIES</div>
                <div className="text-[10px] font-semibold tracking-widest" style={{ color: GOLD }}>
                  HYDERABAD
                </div>
              </div>
            </div>

            {/* Tagline — shorter than before */}
            <p className="text-sm leading-relaxed" style={{ color: MUTED, maxWidth: "28ch" }}>
              Premium, verified homes across Hyderabad with clear titles and honest guidance.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-5">
              <SocialBtn href="https://www.instagram.com/vpfproperties?igsh=NW16aWh3ajZ5b2R3">
                <Instagram className="h-4 w-4" color={GOLD} />
              </SocialBtn>
              <SocialBtn href="https://youtube.com/@vpfpropertieshyd">
                <Youtube className="h-4 w-4" color={GOLD} />
              </SocialBtn>
              <SocialBtn href={`https://wa.me/${settings.whatsapp_number?.replace("+", "")}`}>
                <Send className="h-4 w-4" color={GOLD} />
              </SocialBtn>
            </div>
          </div>

          {/* ── Quick links ──
              On xs/sm: sits below brand, 2 micro-columns inside this cell
              On lg:    its own column
          */}
          <div>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>
              EXPLORE
            </div>
            {/*
              Two sub-columns so the list doesn't get too tall on mobile
            */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm" style={{ color: MUTED }}>
              <Link to="/properties" className="hover:text-white transition truncate">All Properties</Link>
              <a href="#" className="hover:text-white transition truncate">Apartments</a>
              <a href="#" className="hover:text-white transition truncate">Villas</a>
              <a href="#" className="hover:text-white transition truncate">Premium Plots</a>
              <a href="#" className="hover:text-white transition truncate">Banjara Hills</a>
              <a href="#" className="hover:text-white transition truncate">Gachibowli</a>
              <a href="#" className="hover:text-white transition truncate">Jubilee Hills</a>
              <a href="#" className="hover:text-white transition truncate">Kokapet</a>
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>
              CONTACT
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Mail className="h-4 w-4" color={GOLD} />
                  </span>
                  <span
                    className="truncate group-hover:text-white transition"
                    style={{ color: MUTED }}
                  >
                    {settings.contact_email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone_number}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Phone className="h-4 w-4" color={GOLD} />
                  </span>
                  <span
                    className="group-hover:text-white transition"
                    style={{ color: MUTED }}
                  >
                    {settings.phone_number}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp_number?.replace("+", "")}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Send className="h-4 w-4" color={GOLD} />
                  </span>
                  <span
                    className="group-hover:text-white transition"
                    style={{ color: MUTED }}
                  >
                    WhatsApp Us
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──
            xs: stacked center-aligned
            sm+: side by side
        */}
        <div
          className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: LINE, color: MUTED }}
        >
          <div>© {new Date().getFullYear()} VPF Properties. All rights reserved.</div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
    </footer>
  );
}