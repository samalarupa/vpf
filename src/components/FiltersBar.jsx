import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/* Matching the homepage color palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const LINE = "#1F2847";

export default function FiltersBar({
  data = [],
  onChange,
  leftOfApply,
  onApply, // optional: used when showApply=true
  types = [],
  initialQ = "",
  initialLocality = "",
  initialBedrooms = "Any",
  initialType = "Any",
  initialNearby = "Any",
  initialMinPrice = "",
initialMaxPrice = "",

  // controls
  showPriceRange = true, // homepage: false
  showSearch = true,
  showApply = false, // homepage: true
  autoApply = true, // properties page: true, homepage: false
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
    setMinPrice("");
    setMaxPrice("");
    setLocality("All");
    setBedrooms("Any");
    setType("Any");
    setQ("");
    setNearby("Any");

    if (!autoApply) {
      onChange?.({
        minPrice: "",
        maxPrice: "",
        locality: "All",
        bedrooms: "Any",
        type: "Any",
        nearby: "Any",
        q: "",
      });
    }
  };

  const hasActiveFilters =
    (showPriceRange && (minPrice || maxPrice)) ||
    locality !== "All" ||
    bedrooms !== "Any" ||
    type !== "Any" ||
    nearby !== "Any" ||
    q;

  // Auto-emit immediately for non-text filters
  useEffect(() => {
    if (!autoApply) return;
    onChange?.(getPayload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, locality, bedrooms, type, nearby, showPriceRange, autoApply]);

  // Auto-emit debounced for text search
  useEffect(() => {
    if (!autoApply) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange?.(getPayload());
    }, 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showPriceRange, autoApply]);

  const inputStyle = {
    background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
  };

  const focusRing = {
    boxShadow: `0 0 0 3px ${GOLD}25`,
    borderColor: `${GOLD}55`,
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    paddingRight: "2.75rem",
    cursor: "pointer",
  };

  const caretStyle = {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: GOLD,
    opacity: 0.9,
    fontSize: "14px",
    lineHeight: "14px",
  };

  const placeholderClass = "placeholder:text-[#6B7280]";

  const handleApply = () => {
    if (typeof onApply !== "function") return;
    onApply({
      q,
      locality,
      bedrooms,
      type,
      nearby,
      minPrice: showPriceRange ? minPrice : "",
      maxPrice: showPriceRange ? maxPrice : "",
    });
  };

  return (
    <div
      className="rounded-2xl px-8 py-2 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}60 0%, ${SURFACE}40 100%)`,
        border: `1px solid ${LINE}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
              border: `1px solid ${GOLD}40`,
              color: GOLD,
            }}
            title="Reset all filters"
            type="button"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-12 gap-3 mb-4 items-end">
        {/* Min Price */}
        {showPriceRange && (
          <div className="col-span-1">
            <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
              Min Price
            </label>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            />
          </div>
        )}

        {/* Max Price */}
        {showPriceRange && (
          <div className="col-span-1">
            <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
              Max Price
            </label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            />
          </div>
        )}

        {/* Locality */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
            Locality
          </label>
          <div className="relative">
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none transition"
              style={selectStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            >
              {localityOptions.map((l) => (
                <option key={l} value={l} style={{ backgroundColor: BG, color: TEXT }}>
                  {l}
                </option>
              ))}
            </select>
            <span style={caretStyle}>▾</span>
          </div>
        </div>

        {/* Nearby */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
            Nearby
          </label>
          <div className="relative">
            <select
              value={nearby}
              onChange={(e) => setNearby(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none transition"
              style={selectStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            >
              {nearbyOptions.map((n) => (
                <option key={n} value={n} style={{ backgroundColor: BG, color: TEXT }}>
                  {n}
                </option>
              ))}
            </select>
            <span style={caretStyle}>▾</span>
          </div>
        </div>

        {/* Type */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
            Type
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none transition"
              style={selectStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            >
              <option value="Any" style={{ backgroundColor: BG, color: TEXT }}>
                Any
              </option>
              {(types?.length ? types : ["Flat", "Villa", "Plot"]).map((t) => (
                <option key={t} value={t} style={{ backgroundColor: BG, color: TEXT }}>
                  {t}
                </option>
              ))}
            </select>
            <span style={caretStyle}>▾</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="col-span-1">
          <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
            Bedrooms
          </label>
          <div className="relative">
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none transition"
              style={selectStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = LINE;
              }}
            >
              {["Any", "1", "2", "3", "4"].map((b) => (
                <option key={b} value={b} style={{ backgroundColor: BG, color: TEXT }}>
                  {b === "Any" ? "Any" : `${b} BHK`}
                </option>
              ))}
            </select>
            <span style={caretStyle}>▾</span>
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className= "col-span-3">
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Search
  </label>

  <div className="flex w-full">
    <div className="relative flex-1">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: GOLD }}
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or locality..."
        className={`w-full pl-9 pr-4 py-3 outline-gray-800 outline-1 outline-r-none rounded-l-xl rounded-r-none text-sm font-medium  focus:ring-2 ${placeholderClass}`}
        style={inputStyle}
      />
    </div>

    <button
      onClick={handleApply}
      className="px-2 py-2.5 rounded-r-xl font-semibold"
      style={{ background: GOLD, color: "black" }}
    >
      Search
    </button>
  </div>
</div>
        )}
      </div>

      {/* Apply button (Homepage use-case) */}
      {showApply && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{leftOfApply}</div>

          <button
            type="button"
            onClick={handleApply}
            className="shrink-0 px-5 py-3 rounded-xl font-bold transition hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD} 55%, ${GOLD} 100%)`,
              border: `1px solid ${GOLD}70`,
              color: BG,
              boxShadow: `0 10px 30px ${GOLD}15`,
            }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Active Filters Indicator */}
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
