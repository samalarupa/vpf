import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const LINE = "#1F2847";

/* ─── Custom Select ─── */
function CustomSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition focus:outline-none"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
          border: `1px solid ${open ? GOLD + "55" : LINE}`,
          color: TEXT,
          backdropFilter: "blur(10px)",
          boxShadow: open ? `0 0 0 3px ${GOLD}25` : "none",
        }}
      >
        <span>{value}</span>
        <ChevronDown
          size={15}
          style={{
            color: GOLD,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl overflow-hidden"
          style={{
            background: SURFACE,
            border: `1px solid ${GOLD}30`,
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px ${LINE}`,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                color: value === opt ? BG : TEXT,
                background: value === opt
                  ? `linear-gradient(135deg, ${GOLD} 0%, #B8963A 100%)`
                  : "transparent",
                fontWeight: value === opt ? 700 : 500,
              }}
              onMouseEnter={(e) => {
                if (value !== opt) {
                  e.currentTarget.style.background = `${GOLD}18`;
                  e.currentTarget.style.color = GOLD;
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = TEXT;
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── FiltersBar ─── */
export default function FiltersBar({
  data = [],
  onChange,
  leftOfApply,
  onApply,
  types = [],
  initialQ = "",
  initialLocality = "",
  initialBedrooms = "Any",
  initialType = "Any",
  initialNearby = "Any",
  initialMinPrice = "",
  initialMaxPrice = "",
  showPriceRange = false,
  showSearch = true,
  showApply = false,
  autoApply = true,
}) {
  const [locality, setLocality] = useState(initialLocality || "All");
  const [bedrooms, setBedrooms] = useState(initialBedrooms || "Any");
  const [type, setType] = useState(initialType || "Any");
  const [q, setQ] = useState(initialQ || "");
  const [nearby, setNearby] = useState(initialNearby || "Any");
  const [minPrice, setMinPrice] = useState(initialMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "");

  const debounceRef = useRef(null);

  const localityOptions = useMemo(() => {
    const set = new Set((data || []).map((d) => d?.locality).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [data]);

  const nearbyOptions = useMemo(() => {
    const set = new Set();
    (data || []).forEach((p) => {
      (p.nearby_locations || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => set.add(x));
    });
    return ["Any", ...Array.from(set)];
  }, [data]);

  const onlyNum = (val) => (val === "" ? "" : String(val).replace(/[^\d]/g, ""));

  const getPayload = () => ({
    minPrice: showPriceRange ? minPrice : "",
    maxPrice: showPriceRange ? maxPrice : "",
    locality,
    bedrooms,
    type,
    nearby,
    q: q.trim(),
  });

  const clearAll = () => {
    setMinPrice(""); setMaxPrice(""); setLocality("All");
    setBedrooms("Any"); setType("Any"); setQ(""); setNearby("Any");
    if (!autoApply) onChange?.({ minPrice: "", maxPrice: "", locality: "All", bedrooms: "Any", type: "Any", nearby: "Any", q: "" });
  };

  const hasActiveFilters =
    (showPriceRange && (minPrice || maxPrice)) ||
    locality !== "All" || bedrooms !== "Any" || type !== "Any" || nearby !== "Any" || q;

  useEffect(() => {
    if (!autoApply) return;
    onChange?.(getPayload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, locality, bedrooms, type, nearby, showPriceRange, autoApply]);

  useEffect(() => {
    if (!autoApply) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { onChange?.(getPayload()); }, 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showPriceRange, autoApply]);

  const inputStyle = {
    background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
  };

  const focusRing = { boxShadow: `0 0 0 3px ${GOLD}25`, borderColor: `${GOLD}55` };
  const placeholderClass = "placeholder:text-[#6B7280]";

  const handleApply = () => {
    if (typeof onApply !== "function") return;
    onApply({ q, locality, bedrooms, type, nearby, minPrice: showPriceRange ? minPrice : "", maxPrice: showPriceRange ? maxPrice : "" });
  };

  const bedroomOptions = ["Any", "1 BHK", "2 BHK", "3 BHK", "4 BHK"];
  const typeOptions = ["Any", ...(types?.length ? types : ["Flat", "Villa", "Plot"])];

  return (
    <div
      className="rounded-2xl px-4 sm:px-8 py-2 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}60 0%, ${SURFACE}40 100%)`,
        border: `1px solid ${LINE}`,
      }}
    >
      {/* Clear all */}
      <div className="flex items-center justify-between mb-3">
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`, border: `1px solid ${GOLD}40`, color: GOLD }}
            type="button"
          >
            <X size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-3 mb-4 items-end">

        {/* Min Price */}
        {showPriceRange && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>Min Price</label>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}
            />
          </div>
        )}

        {/* Max Price */}
        {showPriceRange && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>Max Price</label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}
            />
          </div>
        )}

        {/* Locality */}
        <div className="col-span-2">
          <CustomSelect label="Locality" value={locality} onChange={setLocality} options={localityOptions} />
        </div>

        {/* Nearby */}
        <div className="col-span-2">
          <CustomSelect label="Nearby" value={nearby} onChange={setNearby} options={nearbyOptions} />
        </div>

        {/* Type */}
        <div className="col-span-2">
          <CustomSelect label="Type" value={type} onChange={setType} options={typeOptions} />
        </div>

        {/* Bedrooms */}
        <div className="col-span-2">
          <CustomSelect
            label="Bedrooms"
            value={bedrooms === "Any" ? "Any" : bedrooms.includes("BHK") ? bedrooms : `${bedrooms} BHK`}
            onChange={(v) => setBedrooms(v === "Any" ? "Any" : v.replace(" BHK", ""))}
            options={bedroomOptions}
          />
        </div>

        {/* Search */}
        {showSearch && (
          <div className="col-span-4">
            <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>Search</label>
            <div className="flex w-full">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Search by locality or price"
                  className={`w-full pl-9 pr-4 py-3 rounded-l-xl rounded-r-none text-sm font-medium focus:outline-none transition ${placeholderClass}`}
                  style={inputStyle}
                />
              </div>
              <button
                onClick={handleApply}
                className="px-4 py-2.5 rounded-r-xl font-bold text-sm transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #B8963A 100%)`, color: BG }}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Apply */}
      {showApply && (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{leftOfApply}</div>
          <button
            type="button"
            onClick={handleApply}
            className="shrink-0 px-5 py-3 rounded-xl font-bold transition hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #B8963A 100%)`,
              border: `1px solid ${GOLD}70`,
              color: BG,
              boxShadow: `0 10px 30px ${GOLD}15`,
            }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
            <span className="font-medium">Filters active</span>
          </div>
        </div>
      )}
    </div>
  );
}