import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FiltersBar from "../components/FiltersBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { Sparkles, SlidersHorizontal, ChevronRight, Home } from "lucide-react";
import { API_BASE_URL } from "../config";
import { SiteSettingsContext } from "../context/SiteSettingsContext.jsx";

// Normalize whatever backend sends into a simple number (1, 2, 3, …)
const parseBedrooms = (value) => {
  if (value === null || value === undefined) return null;

  const str = String(value).trim(); // e.g. "3 BHK", "2bhk", "3", "Studio", 3

  if (!str) return null;

  // treat "studio" or similar as 1 (optional — change if you prefer studio => 0)
  if (/studio/i.test(str)) return 1;

  const match = str.match(/(\d+)/); // first digits
  return match ? Number(match[1]) : null; // -> 3
};


const BG = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT = "#1A2347";
const TEXT = "#F8F9FB";
const MUTED = "#B8BDD0";
const GOLD = "#D4AF37";
const GOLD_L = "#E8C875";
const GOLD_D = "#B8963A";
const LINE = "#1F2847";

export default function Properties() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("priceAsc");

  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------
  // 1) Load data from backend
  // -----------------------
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchProps() {
      try {
        // parallel fetch properties and property types
        const [propsRes, typesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/properties/list.php`),
          fetch(`${API_BASE_URL}/property_types/list.php`),
        ]);

        if (!propsRes.ok) throw new Error("Failed to fetch properties");
        if (!typesRes.ok) {
          // property types are optional — fall back silently
          console.warn("Failed to fetch property types, using defaults");
        }

        const data = await propsRes.json();
        const typesData = typesRes.ok ? await typesRes.json() : null;

        const normalized = data.map((p) => {
          const rawRooms =
            p.bedrooms ??
            p.rooms ??
            p.rooms_text ??
            p.rooms_count ??
            p.bhk ??
            p.BHK ??
            p.bedroom_count ??
            p.bedroom ??
            p.room ??
            "";
        
          const rawNearby =
            p.nearby_locations ??
            p.nearby ??
            p.nearby_places ??
            p.nearby_place ??
            "";
        
          return {
            ...p,
            priceLakh: Number(p.price_lakh || 0),
            nearby_locations: String(rawNearby),
            image: p.image_url || null,
            property_type: (p.property_type || "").trim(),
            bedrooms: parseBedrooms(rawRooms),
            rooms_raw: rawRooms,
          };
        });
        
        

        setProperties(normalized);

        // typesData likely array of { id, name, slug, position }
        if (Array.isArray(typesData)) {
          // use the 'name' field as the display / filter value
          setTypes(typesData.map((t) => (t.name || "").trim()));
        } else {
          setTypes([]); // fallback
        }
      } catch (err) {
        console.error("Failed to load properties or types:", err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    }
    fetchProps();
  }, []);

  // read initial filters from URL (?locality=...&q=...)
 useEffect(() => {
  const params = new URLSearchParams(location.search);

  const newFilters = {
    q: params.get("q")?.trim() || "",
    locality: params.get("locality")?.trim() || "All",
    bedrooms: params.get("bedrooms")?.trim() || "Any",
    type: params.get("type")?.trim() || "Any",
    nearby: params.get("nearby")?.trim() || "Any",
     minPrice: params.get("minPrice")?.trim() || "",
    maxPrice: params.get("maxPrice")?.trim() || "",
  };

  setFilters((prev) => ({ ...prev, ...newFilters }));
}, [location.search]);


  // ------------------------------------------------------
  // 2) Filtering & Sorting (uses normalized DB data)
  // ------------------------------------------------------
  const filtered = useMemo(() => {
    let list = [...properties];

    const { minPrice, maxPrice, locality, bedrooms, type, nearby, q } = filters;

    if (minPrice) {
      list = list.filter((p) => p.priceLakh >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => p.priceLakh <= Number(maxPrice));
    }
   if (locality && locality !== "All") {
  const loc = String(locality).trim().toLowerCase();
  list = list.filter(
    (p) => String(p.locality || "").trim().toLowerCase() === loc
  );
}


    // BHK filter (robust against "3", "3 BHK", "3BHK", etc.)
    if (bedrooms && bedrooms !== "Any") {
      const bedNum = Number(bedrooms);

      list = list.filter((p) => {
        // prefer normalized numeric if present
        if (
          typeof p.bedrooms === "number" &&
          !Number.isNaN(p.bedrooms)
        ) {
          return p.bedrooms === bedNum;
        }

        // fallback to raw backend text fields
        const rawSource =
        p.rooms_raw ??
        p.rooms ??
        p.bedrooms ??
        p.bhk ??
        p.BHK ??
        p.bedroom_count ??
        p.bedroom ??
        p.room ??
        "";

        const raw = String(rawSource).toLowerCase();
        const needle = String(bedNum).toLowerCase();

        // contains number (e.g., "2 bhk", "3BHK") — ok
    if (raw.includes(needle)) return true;

    // special case: if bedNum === 1, allow "studio" to match (if you used that convention)
    if (bedNum === 1 && /studio/.test(raw)) return true;

    return false;
      });
    }

   if (type && type !== "Any") {
  const t = String(type).trim().toLowerCase();
  list = list.filter(
    (p) => String(p.property_type || "").trim().toLowerCase() === t
  );
}

if (nearby && nearby !== "Any") {
  const selected = nearby.toLowerCase().replace(/[^a-z0-9]/g, "");

  list = list.filter((p) => {
    if (!p.nearby_locations) return false;

    const values = p.nearby_locations
      .split(",")
      .map(x =>
        x
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      );

    return values.some(v => v.includes(selected) || selected.includes(v));
  });
}



    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(query) ||
          (p.locality || "").toLowerCase().includes(query) ||
          (p.nearby_locations || "").toLowerCase().includes(query)
      );
    }

    if (sortBy === "priceAsc") {
      list.sort((a, b) => (a.priceLakh || 0) - (b.priceLakh || 0));
    }
    if (sortBy === "priceDesc") {
      list.sort((a, b) => (b.priceLakh || 0) - (a.priceLakh || 0));
    }

    return list;
  }, [filters, sortBy, properties]);

  // -------------------
  // 3) Loading / Error
  // -------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-300">
        {error}
      </div>
    );
  }

  // -------------------
  // UI Part
  // -------------------
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: BG,
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.05), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212, 175, 55, 0.03), transparent 45%),
          linear-gradient(180deg, ${BG} 0%, #0D1230 100%)
        `,
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            style={{ color: MUTED }}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <ChevronRight
            size={16}
            style={{ color: GOLD, opacity: 0.6 }}
          />
          <span className="font-medium" style={{ color: GOLD }}>
            Properties
          </span>
        </nav>
      </div>

      {/* Header */}
      <section
        className="relative border-b pt-4 pb-12"
        style={{ borderColor: LINE }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 0 20px ${GOLD}15`,
                  color: GOLD,
                }}
              >
                <Sparkles size={14} />
                <span>Curated Collection</span>
              </div>

              <h1
                className="text-4xl md:text-5xl font-black"
                style={{ color: TEXT }}
              >
                Discover Your{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_L} 0%, ${GOLD} 50%, ${GOLD_D} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Perfect Home
                </span>
              </h1>

              <p className="text-lg" style={{ color: MUTED }}>
                Browse our verified homes and premium properties across
                Hyderabad.
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 ml-auto">
              <SlidersHorizontal size={18} style={{ color: GOLD }} />
              <label
                className="text-sm font-medium"
                style={{ color: MUTED }}
              >
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                style={{
                  backgroundColor: SURFACE,
                  color: TEXT,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <option value="priceAsc" style={{ color: TEXT }}>
                  Price: Low → High
                </option>
                <option value="priceDesc" style={{ color: TEXT }}>
                  Price: High → Low
                </option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-10">
          <FiltersBar
  data={properties}
  onChange={setFilters}
  types={types}
  initialQ={filters.q}
  initialLocality={filters.locality}
  initialBedrooms={filters.bedrooms}
  initialType={filters.type}
  initialNearby={filters.nearby}
    initialMinPrice={filters.minPrice}
  initialMaxPrice={filters.maxPrice}
/>

          </div>

          {/* Count */}
          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{
              backgroundColor: `${ACCENT}60`,
              border: `1px solid ${LINE}`,
              color: MUTED,
            }}
          >
            Showing{" "}
            <span className="font-bold" style={{ color: GOLD }}>
              {filtered.length}
            </span>{" "}
            {filtered.length !== 1 ? "properties" : "property"}
          </div>
        </div>
      </section>

      {/* Property Cards */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 rounded-3xl backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
              border: `1px solid ${LINE}`,
            }}
          >
            <div
              className="text-6xl mb-4"
              style={{ color: GOLD, opacity: 0.3 }}
            >
              🏘️
            </div>
            <div
              className="text-xl font-bold mb-2"
              style={{ color: TEXT }}
            >
              No Properties Found
            </div>
            <p style={{ color: MUTED }}>
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/property/${p.id}`)}
              >
                <PropertyCard item={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
