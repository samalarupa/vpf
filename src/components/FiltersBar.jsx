import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Sparkles } from "lucide-react";

/* Matching the homepage color palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_L = "#E8C875";
const GOLD_D = "#B8963A";
const LINE = "#1F2847";

export default function FiltersBar({ data = [], onChange, types = [] }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locality, setLocality] = useState("All");
  const [bedrooms, setBedrooms] = useState("Any");
  const [type, setType] = useState("Any");
  const [q, setQ] = useState("");

  const debounceRef = useRef(null);

  const localityOptions = useMemo(() => {
    const set = new Set(data.map((d) => d.locality).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [data]);

  // emit immediately for non-text filters
  useEffect(() => {
    onChange({ minPrice, maxPrice, locality, bedrooms, type, q: q.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, locality, bedrooms, type]);

  // debounce text search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ minPrice, maxPrice, locality, bedrooms, type, q: q.trim() });
    }, 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onlyNum = (val) => (val === "" ? "" : String(val).replace(/[^\d]/g, ""));
  const clearAll = () => {
    setMinPrice(""); setMaxPrice(""); setLocality("All");
    setBedrooms("Any"); setType("Any"); setQ("");
  };

  const hasActiveFilters = minPrice || maxPrice || locality !== "All" || bedrooms !== "Any" || type !== "Any" || q;

  const inputStyle = {
    backgroundColor: `${ACCENT}80`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
  };

  const placeholderClass = "placeholder:text-[#6B7280]";

  return (
    <div 
      className="rounded-2xl p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}60 0%, ${SURFACE}40 100%)`,
        border: `1px solid ${LINE}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} />
          <h3 className="font-bold text-lg" style={{ color: TEXT }}>
            Refine Your Search
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
              border: `1px solid ${GOLD}40`,
              color: GOLD
            }}
            title="Reset all filters"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Min Price */}
        <div className="relative">
          <label 
            className="block text-xs font-semibold mb-2"
            style={{ color: MUTED }}
          >
            Min Price
          </label>
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(onlyNum(e.target.value))}
            placeholder="₹ Lakh"
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 ${placeholderClass}`}
            style={{
              ...inputStyle,
              focusRingColor: GOLD
            }}
            inputMode="numeric"
          />
        </div>

        {/* Max Price */}
        <div className="relative">
          <label 
            className="block text-xs font-semibold mb-2"
            style={{ color: MUTED }}
          >
            Max Price
          </label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(onlyNum(e.target.value))}
            placeholder="₹ Lakh"
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 ${placeholderClass}`}
            style={inputStyle}
            inputMode="numeric"
          />
        </div>

        {/* Locality */}
        <div className="relative">
          <label 
            className="block text-xs font-semibold mb-2"
            style={{ color: MUTED }}
          >
            Locality
          </label>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 cursor-pointer appearance-none"
            style={{
              ...inputStyle,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "3rem"
            }}
          >
            {localityOptions.map((l) => (
              <option key={l} value={l} style={{ backgroundColor: SURFACE, color: TEXT }}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <label 
            className="block text-xs font-semibold mb-2"
            style={{ color: MUTED }}
          >
            Bedrooms
          </label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 cursor-pointer appearance-none"
            style={{
              ...inputStyle,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "3rem"
            }}
          >
            {["Any", "1", "2", "3", "4"].map((b) => (
              <option key={b} value={b} style={{ backgroundColor: SURFACE, color: TEXT }}>
                {b === "Any" ? "Any" : `${b} BHK`}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type (dynamic from backend) */}
<div className="relative">
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Type
  </label>
  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 cursor-pointer appearance-none"
    style={{
      ...inputStyle,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      paddingRight: "3rem"
    }}
  >
    <option value="Any" style={{ backgroundColor: SURFACE, color: TEXT }}>
      Any
    </option>

    {Array.isArray(types) && types.length > 0 ? (
      types.map((t) => (
        <option key={t} value={t} style={{ backgroundColor: SURFACE, color: TEXT }}>
          {t}
        </option>
      ))
    ) : (
      // fallback to old hardcoded list if types list is missing
      ["Flat", "Villa", "Plot"].map((t) => (
        <option key={t} value={t} style={{ backgroundColor: SURFACE, color: TEXT }}>
          {t}
        </option>
      ))
    )}
  </select>
</div>


        {/* Search */}
        <div className="relative md:col-span-2">
          <label 
            className="block text-xs font-semibold mb-2"
            style={{ color: MUTED }}
          >
            Search
          </label>
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: GOLD }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or locality..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 ${placeholderClass}`}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
            <span className="font-medium">Filters active</span>
          </div>
        </div>
      )}
    </div>
  );
}