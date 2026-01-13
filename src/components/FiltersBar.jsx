import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Sparkles } from "lucide-react";

/* Matching the homepage color palette */
const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_D = "#B8963A";
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

  // controls
  showPriceRange = true, // homepage: false
  showSearch = true,
  showApply = false, // homepage: true
  autoApply = true, // properties page: true, homepage: false
}) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locality, setLocality] = useState(initialLocality || "All");
  const [bedrooms, setBedrooms] = useState(initialBedrooms || "Any");
  const [type, setType] = useState(initialType || "Any");
  const [q, setQ] = useState(initialQ || "");
  const [nearby, setNearby] = useState(initialNearby || "Any");



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

    // If autoApply is OFF (homepage), still let parent know (optional)
    if (!autoApply) {
      onChange?.({
        minPrice: "",
        maxPrice: "",
        locality: "All",
        bedrooms: "Any",
        type: "Any",
        
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
    backgroundColor: `${ACCENT}80`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
  };

  const placeholderClass = "placeholder:text-[#6B7280]";

  // Grid columns:
  // - With price range: 7 columns (your original)
  // - Without price range: 5 columns (locality, bedrooms, type, search spans 2)
  const gridCols = showPriceRange ? "lg:grid-cols-7" : "lg:grid-cols-5";
  const handleApply = () => {
  if (typeof onApply !== "function") return;

  onApply({
    q,
    locality,
    bedrooms,
    type,
    nearby,
    // include any other filter states you already use in FiltersBar
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
        {/* <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} />
          <h3 className="font-bold text-lg" style={{ color: TEXT }}>
            Refine Your Search
          </h3>
        </div> */}

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
      className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${placeholderClass}`}
      style={inputStyle}
      inputMode="numeric"
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
      className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 ${placeholderClass}`}
      style={inputStyle}
      inputMode="numeric"
    />
  </div>
)}

{/* Locality */}
<div className="col-span-2">
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Locality
  </label>
  <select
    value={locality}
    onChange={(e) => setLocality(e.target.value)}
    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 appearance-none"
    style={{
      ...inputStyle,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      paddingRight: "3rem",
    }}
  >
    {localityOptions.map((l) => (
      <option key={l} value={l}>{l}</option>
    ))}
  </select>
</div>

{/* Nearby */}
<div className="col-span-2">
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Nearby
  </label>
  <select
    value={nearby}
    onChange={(e) => setNearby(e.target.value)}
    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 appearance-none"
    style={{
      ...inputStyle,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      paddingRight: "3rem",
    }}
  >
    {nearbyOptions.map((n) => (
      <option key={n} value={n}>{n}</option>
    ))}
  </select>
</div>

{/* Bedrooms */}
<div className={`${showPriceRange ? "col-span-1" : "col-span-2"}`}>
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Bedrooms
  </label>
  <select
    value={bedrooms}
    onChange={(e) => setBedrooms(e.target.value)}
    className={`w-full py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 appearance-none ${
      showPriceRange ? "px-3" : "px-4"
    }`}
    style={{
      ...inputStyle,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      paddingRight: "3rem",
    }}
  >
    {["Any", "1", "2", "3", "4"].map((b) => (
      <option key={b} value={b}>{b === "Any" ? "Any" : `${b} BHK`}</option>
    ))}
  </select>
</div>

{/* Type */}
<div className={`${showPriceRange ? "col-span-1" : "col-span-2"}`}>
  <label className="block text-xs font-semibold mb-2" style={{ color: MUTED }}>
    Type
  </label>
  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className={`w-full py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 appearance-none ${
      showPriceRange ? "px-3" : "px-4"
    }`}
    
    style={{
      ...inputStyle,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23D4AF37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      paddingRight: "3rem",
    }}
  >
    <option value="Any">Any</option>
    {(types?.length ? types : ["Flat", "Villa", "Plot"]).map((t) => (
      <option key={t} value={t}>{t}</option>
    ))}
  </select>
</div>

{/* Search */}
<div className={`${showPriceRange ? "col-span-4" : "col-span-4"}`}>
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
        className={`w-full pl-12 pr-4 py-3 rounded-l-xl rounded-r-none text-sm font-medium focus:outline-none focus:ring-2 ${placeholderClass}`}
        style={inputStyle}
      />
    </div>

    <button
      onClick={handleApply}
      className="px-2 py-3 rounded-r-xl font-semibold"
      style={{ background: GOLD, color: "black" }}
    >
      Search
    </button>
  </div>
</div>

</div>


      {/* Apply button (Homepage use-case) */}
      {showApply && (
        <div className="mt-4 flex items-center justify-between gap-3">
  <div className="min-w-0 flex-1">
    {leftOfApply}
  </div>

  {showApply && (
    <button
      type="button"
      onClick={handleApply}
      className="shrink-0 px-4 py-2 rounded-xl font-semibold"
      style={{
              background: `GOLD`,
              border: `1px solid ${GOLD}100`,
              color: "black",
            }}
    >
      Apply
    </button>
  )}
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
