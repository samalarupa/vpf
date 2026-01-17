import { Phone, Mail, MapPin, Youtube, Crown, Facebook, Instagram, Linkedin, Send } from "lucide-react";
import { useContext } from "react";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";
/* Match the homepage palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_D = "#B8963A";
const LINE = "#1F2847";


export default function Footer() {
  const settings = useContext(SiteSettingsContext);
  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: SURFACE, color: TEXT }}
    >
      {/* subtle gold halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px 300px at 50% 0%, rgba(212,175,55,0.08), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* top: brand + newsletter */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 mb-14">
          {/* brand */}
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                  boxShadow: `0 8px 24px ${GOLD}20`,
                }}
              >
                <Crown className="h-6 w-6" style={{ color: BG }} />
              </div>
              <div className="leading-tight">
                <div className="font-black text-xl">VPF PROPERTIES</div>
                <div className="text-xs font-semibold tracking-widest" style={{ color: GOLD }}>
                  HYDERABAD
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: MUTED }}>
              Premium, verified homes across Hyderabad. Clear titles, honest guidance, and a smooth buying experience.
            </p>

            {/* social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { id: "facebook", Icon: Facebook, href: "#" },
                { id: "instagram", Icon: Instagram, href: "#" },
                { id: "linkedin", Icon: Linkedin, href: "#" },
                { id: "youtube", Icon: Youtube, href: "https://youtube.com/@vpfpropertieshyd" },
              ].map(({ id, Icon, href }) => (
                <a
                  key={id} // 👈 now unique
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: `${ACCENT}80`,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  <Icon className="h-5 w-5" color={GOLD} />
                </a>
              ))}
            </div>
          </div>

          {/* newsletter (no backend; just UI) */}
          <div className="w-full lg:max-w-md">
            <div className="text-sm font-semibold mb-3" style={{ color: GOLD }}>
              STAY UPDATED
            </div>
            <h4 className="text-xl font-bold mb-3">Get new listings & price alerts</h4>
            <p className="text-sm mb-4" style={{ color: MUTED }}>
              Join our list to receive curated properties and market insights.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none bg-transparent"
                style={{
                  color: TEXT,
                  border: `1px solid ${LINE}`,
                }}
              />
              <button
                type="submit"
                className="px-5 rounded-xl font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                  color: BG,
                }}
              >
                Subscribe
              </button>
            </form>
            <div className="mt-2 text-xs" style={{ color: MUTED }}>
              We respect your privacy. Unsubscribe anytime.
            </div>
          </div>
        </div>

        {/* middle: link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t pt-10" style={{ borderColor: LINE }}>
          {/* Buy */}
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: GOLD }}>
              BUY
            </div>
            <ul className="space-y-2 text-sm" style={{ color: MUTED }}>
              <li><a className="hover:text-white transition" href="#">Apartments</a></li>
              <li><a className="hover:text-white transition" href="#">Villas</a></li>
              <li><a className="hover:text-white transition" href="#">Premium Plots</a></li>
              <li><a className="hover:text-white transition" href="#">Gated Communities</a></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: GOLD }}>
              LOCATIONS
            </div>
            <ul className="space-y-2 text-sm" style={{ color: MUTED }}>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" color={GOLD} />Banjara Hills</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" color={GOLD} />Jubilee Hills</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" color={GOLD} />Gachibowli</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" color={GOLD} />Kokapet</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: GOLD }}>
              COMPANY
            </div>
            <ul className="space-y-2 text-sm" style={{ color: MUTED }}>
              <li><a className="hover:text-white transition" href="#">About Us</a></li>
              <li><a className="hover:text-white transition" href="#">Our Process</a></li>
              <li><a className="hover:text-white transition" href="#">Reviews</a></li>
              <li><a className="hover:text-white transition" href="#">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: GOLD }}>
              CONTACT
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 hover:-translate-x-0.5 transition">
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Mail className="h-4 w-4" color={GOLD} />
                  </span>
                  <span style={{ color: MUTED }}>{settings.contact_email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${settings.phone_number}`} className="flex items-center gap-3 hover:-translate-x-0.5 transition">
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Phone className="h-4 w-4" color={GOLD} />
                  </span>
                  <span style={{ color: MUTED }}>{settings.phone_number}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${settings.whatsapp_number.replace("+","")}`} className="flex items-center gap-3 hover:-translate-x-0.5 transition">
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <Send size={20} style={{ color: GOLD }} />
                  </span>
                  <span style={{ color: MUTED }}>WhatsApp Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
             style={{ borderColor: LINE, color: MUTED }}>
          <div>© {new Date().getFullYear()} VPF Properties. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* gold accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
    </footer>
  );
}
