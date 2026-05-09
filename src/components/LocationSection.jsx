import { MapPin, ExternalLink } from "lucide-react";

const GOLD   = "#D4AF37";
const GOLD_D = "#B8963A";
const LINE   = "#1F2847";
const MUTED  = "#B8BDD0";
const TEXT   = "#F8F9FB";
const ACCENT = "#1A2347";

export default function LocationSection() {
  return (
    <section className="mt-12 sm:mt-16 mb-12 sm:mb-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
            style={{
              background: `linear-gradient(135deg, ${GOLD}22, ${GOLD_D}11)`,
              border: `1px solid ${GOLD}35`,
              color: GOLD,
            }}
          >
            <MapPin size={12} />
            FIND US
          </div>

          <h2
            className="font-black leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              color: TEXT,
            }}
          >
            Our Location
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: MUTED }}>
            Visit our office for property consultations and site visits.
          </p>
        </div>

        {/* ── Card wrapping address bar + map ── */}
        <div
          className="rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${LINE}`,
            background: "#020617",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          {/* Address bar
              xs: stacked (address above, button below)
              sm+: side by side
          */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4"
            style={{ borderBottom: `1px solid ${LINE}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}22, ${GOLD_D}11)`,
                  border: `1px solid ${GOLD}35`,
                }}
              >
                <MapPin size={15} style={{ color: GOLD }} />
              </div>
              <p className="text-sm sm:text-base font-medium" style={{ color: MUTED }}>
                VPF Properties, Kukatpally, Hyderabad
              </p>
            </div>

            <a
              href="https://www.google.com/maps/place/VPF+Properties/@17.4947163,78.4048628"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 hover:shadow-lg w-full sm:w-auto shrink-0"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
                color: "#0A0E27",
                boxShadow: `0 4px 16px ${GOLD}30`,
              }}
            >
              <ExternalLink size={14} />
              Open in Maps
            </a>
          </div>

          {/* Map iframe
              Height:
              xs  : 240px  — enough to be useful, doesn't dominate the screen
              sm  : 320px
              md+ : 420px
          */}
          <iframe
            src="https://www.google.com/maps?q=17.4947163,78.4048628&z=15&output=embed"
            width="100%"
            loading="lazy"
            className="w-full border-0 block"
            style={{ height: "clamp(240px, 45vw, 420px)" }}
            referrerPolicy="no-referrer-when-downgrade"
            title="VPF Properties location map"
          />
        </div>

      </div>
    </section>
  );
}