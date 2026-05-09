import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT  = "#1A2347";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

/* ─────────────────────────────────────────
   CustomSelect
   - Dropdown flips to "top" when near bottom of viewport
   - Max-height + scroll so it never overflows on small screens
───────────────────────────────────────── */
function CustomSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef(null);
  const listRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Flip dropdown above button if too close to viewport bottom */
  const [dropUp, setDropUp] = useState(false);
  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 220);
    }
    setOpen((o) => !o);
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition focus:outline-none"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
          border: `1px solid ${open ? GOLD + "55" : LINE}`,
          color: TEXT,
          backdropFilter: "blur(10px)",
          boxShadow: open ? `0 0 0 3px ${GOLD}25` : "none",
        }}
      >
        {/* Truncate long option names gracefully */}
        <span className="truncate pr-2 text-xs sm:text-sm">{value}</span>
        <ChevronDown
          size={14}
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
          ref={listRef}
          className="absolute z-50 w-full rounded-xl overflow-hidden overflow-y-auto"
          style={{
            /* Flip above or below */
            ...(dropUp ? { bottom: "calc(100% + 6px)" } : { top: "calc(100% + 6px)" }),
            background: SURFACE,
            border: `1px solid ${GOLD}30`,
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px ${LINE}`,
            /* Never taller than 40vh so it fits on short/small screens */
            maxHeight: "40vh",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all"
              style={{
                color: value === opt ? BG : TEXT,
                background: value === opt
                  ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`
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

/* ─────────────────────────────────────────
   FiltersBar
───────────────────────────────────────── */
export default function FiltersBar({
  data = [],
  onChange,
  leftOfApply,
  onApply,
  types = [],
  initialQ          = "",
  initialLocality   = "",
  initialBedrooms   = "Any",
  initialType       = "Any",
  initialNearby     = "Any",
  initialMinPrice   = "",
  initialMaxPrice   = "",
  showPriceRange    = false,
  showSearch        = true,
  showApply         = false,
  autoApply         = true,
}) {
  const [locality, setLocality] = useState(initialLocality || "All");
  const [bedrooms, setBedrooms] = useState(initialBedrooms || "Any");
  const [type,     setType]     = useState(initialType     || "Any");
  const [q,        setQ]        = useState(initialQ        || "");
  const [nearby,   setNearby]   = useState(initialNearby   || "Any");
  const [minPrice, setMinPrice] = useState(initialMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "");

  /* On xs/sm, hide the selects behind a toggle */
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debounceRef = useRef(null);

  const localityOptions = useMemo(() => {
    const set = new Set((data || []).map((d) => d?.locality).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [data]);

  const nearbyOptions = useMemo(() => {
    const set = new Set();
    (data || []).forEach((p) => {
      (p.nearby_locations || "")
        .split(",").map((x) => x.trim()).filter(Boolean)
        .forEach((x) => set.add(x));
    });
    return ["Any", ...Array.from(set)];
  }, [data]);

  const onlyNum = (val) => (val === "" ? "" : String(val).replace(/[^\d]/g, ""));

  const getPayload = () => ({
    minPrice: showPriceRange ? minPrice : "",
    maxPrice: showPriceRange ? maxPrice : "",
    locality, bedrooms, type, nearby,
    q: q.trim(),
  });

  const clearAll = () => {
    setMinPrice(""); setMaxPrice(""); setLocality("All");
    setBedrooms("Any"); setType("Any"); setQ(""); setNearby("Any");
    if (!autoApply) onChange?.({ minPrice:"", maxPrice:"", locality:"All", bedrooms:"Any", type:"Any", nearby:"Any", q:"" });
  };

  const hasActiveFilters =
    (showPriceRange && (minPrice || maxPrice)) ||
    locality !== "All" || bedrooms !== "Any" || type !== "Any" || nearby !== "Any" || q;

  /* Count active (non-search) filters for the mobile badge */
  const activeFilterCount = [
    showPriceRange && (minPrice || maxPrice),
    locality !== "All",
    bedrooms !== "Any",
    type !== "Any",
    nearby !== "Any",
  ].filter(Boolean).length;

  useEffect(() => {
    if (!autoApply) return;
    onChange?.(getPayload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, locality, bedrooms, type, nearby, showPriceRange, autoApply]);

  useEffect(() => {
    if (!autoApply) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange?.(getPayload()), 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, showPriceRange, autoApply]);

  const handleApply = () => {
    if (typeof onApply !== "function") return;
    onApply({ q, locality, bedrooms, type, nearby,
      minPrice: showPriceRange ? minPrice : "",
      maxPrice: showPriceRange ? maxPrice : "",
    });
  };

  const inputStyle = {
    background: `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
    border: `1px solid ${LINE}`,
    color: TEXT,
    backdropFilter: "blur(10px)",
  };
  const focusRing = { boxShadow: `0 0 0 3px ${GOLD}25`, borderColor: `${GOLD}55` };
  const placeholderClass = "placeholder:text-[#6B7280]";

  const bedroomOptions = ["Any", "1 BHK", "2 BHK", "3 BHK", "4 BHK"];
  const typeOptions    = ["Any", ...(types?.length ? types : ["Flat", "Villa", "Plot"])];

  /* ── Select filters panel (shown differently per breakpoint) ── */
  const SelectFilters = () => (
    <>
      {/* Price range — full row on xs when shown */}
      {showPriceRange && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Min Price
            </label>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Max Price
            </label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(onlyNum(e.target.value))}
              placeholder="₹ Lakh"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium focus:outline-none transition ${placeholderClass}`}
              style={inputStyle}
              inputMode="numeric"
              onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
              onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}
            />
          </div>
        </div>
      )}

      {/*
        Select grid:
        - xs:  2 columns  (2×2 = 4 selects)
        - sm:  2 columns
        - md:  4 columns  (all 4 in one row)
        - lg:  4 columns
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CustomSelect label="Locality" value={locality}  onChange={setLocality}  options={localityOptions} />
        <CustomSelect label="Nearby"   value={nearby}    onChange={setNearby}    options={nearbyOptions}  />
        <CustomSelect label="Type"     value={type}      onChange={setType}      options={typeOptions}    />
        <CustomSelect
          label="Bedrooms"
          value={bedrooms === "Any" ? "Any" : bedrooms.includes("BHK") ? bedrooms : `${bedrooms} BHK`}
          onChange={(v) => setBedrooms(v === "Any" ? "Any" : v.replace(" BHK", ""))}
          options={bedroomOptions}
        />
      </div>
    </>
  );

  return (
    <div
      className="rounded-2xl px-3 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}60 0%, ${SURFACE}40 100%)`,
        border: `1px solid ${LINE}`,
      }}
    >
      {/* ── Top row: search + filter toggle (xs/sm) | search only (md+) ── */}
      <div className="flex items-end gap-2 sm:gap-3">

        {/* Search — always visible, takes remaining width */}
        {showSearch && (
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
              Search
            </label>
            <div className="flex w-full">
              <div className="relative flex-1 min-w-0">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: GOLD }}
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Search by locality or price…"
                  className={`w-full pl-8 sm:pl-9 pr-3 py-2.5 sm:py-3 rounded-l-xl rounded-r-none text-xs sm:text-sm font-medium focus:outline-none transition ${placeholderClass}`}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
                  onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}
                />
              </div>
              <button
                onClick={handleApply}
                className="px-3 sm:px-5 py-2.5 sm:py-3 rounded-r-xl font-bold text-xs sm:text-sm transition hover:opacity-90 shrink-0 whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`, color: BG }}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Filter toggle button — xs/sm only */}
        <div className="md:hidden shrink-0">
          {!showSearch && (
            <label className="block text-xs font-semibold mb-1.5 invisible" style={{ color: MUTED }}>
              &nbsp;
            </label>
          )}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="relative h-[42px] sm:h-[46px] px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
            style={{
              background: filtersOpen
                ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`
                : `linear-gradient(135deg, ${ACCENT}90 0%, ${SURFACE}60 100%)`,
              border: `1px solid ${filtersOpen ? GOLD : LINE}`,
              color: filtersOpen ? BG : TEXT,
            }}
            aria-expanded={filtersOpen}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {/* Active filter count badge */}
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: GOLD, color: BG }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Clear all — top-right, only when filters active */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${GOLD}20 0%, ${GOLD}10 100%)`,
              border: `1px solid ${GOLD}40`,
              color: GOLD,
            }}
            type="button"
          >
            <X size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* ── Select filters ──
          md+: always visible below search
          xs/sm: collapsible panel
      */}

      {/* Desktop: always shown */}
      <div className="hidden md:flex flex-col gap-3 mt-3">
        <SelectFilters />
      </div>

      {/* Mobile: collapsible */}
      {filtersOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
          <SelectFilters />
        </div>
      )}

      {/* ── Apply button row ── */}
      {showApply && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{leftOfApply}</div>
          <button
            type="button"
            onClick={handleApply}
            className="sm:shrink-0 px-5 py-3 rounded-xl font-bold transition hover:opacity-95 text-sm"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_D} 100%)`,
              border: `1px solid ${GOLD}70`,
              color: BG,
              boxShadow: `0 10px 30px ${GOLD}15`,
            }}
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* ── Active filter indicator ── */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: GOLD }} />
            <span className="font-medium">
              {activeFilterCount > 0
                ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active${q ? " · search active" : ""}`
                : "Search active"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}