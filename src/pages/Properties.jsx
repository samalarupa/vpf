import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FiltersBar from "../components/FiltersBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { Sparkles, SlidersHorizontal, ChevronRight, Home } from "lucide-react";
import { API_BASE_URL } from "../config";
import { Helmet } from "react-helmet-async";

const parseBedrooms = (value) => {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;
  if (/studio/i.test(str)) return 1;
  const match = str.match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

function parsePriceFromQuery(q) {
  const match = q.match(/(\d+(?:\.\d+)?)\s*(l|lakh|lakhs|cr|crore|crores)?/i);
  if (!match) return null;
  let value = parseFloat(match[1]);
  let unit = match[2]?.toLowerCase();
  if (!unit || unit.startsWith("l")) return value;
  if (unit.startsWith("cr")) return value * 100;
  return null;
}

const BG      = "#0A0E27";
const SURFACE = "#141B3A";
const ACCENT  = "#1A2347";
const TEXT    = "#F8F9FB";
const MUTED   = "#B8BDD0";
const GOLD    = "#D4AF37";
const GOLD_L  = "#E8C875";
const GOLD_D  = "#B8963A";
const LINE    = "#1F2847";

export default function Properties() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy]   = useState("priceAsc");
  const navigate  = useNavigate();
  const location  = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading]        = useState(true);
  const [error, setError]            = useState("");
  const [types, setTypes]            = useState([]);

  useEffect(() => {
    async function fetchProps() {
      try {
        const [propsRes, typesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/properties/list.php`),
          fetch(`${API_BASE_URL}/property_types/list.php`),
        ]);
        if (!propsRes.ok) throw new Error("Failed to fetch properties");

        const data      = await propsRes.json();
        const typesData = typesRes.ok ? await typesRes.json() : null;

        const normalized = data.map((p) => {
          const rawRooms =
            p.bedrooms ?? p.rooms ?? p.rooms_text ?? p.rooms_count ??
            p.bhk ?? p.BHK ?? p.bedroom_count ?? p.bedroom ?? p.room ?? "";
          const rawNearby =
            p.nearby_locations ?? p.nearby ?? p.nearby_places ?? p.nearby_place ?? "";
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
        setTypes(Array.isArray(typesData) ? typesData.map((t) => (t.name || "").trim()) : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    }
    fetchProps();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      q:        params.get("q")?.trim()        || "",
      locality: params.get("locality")?.trim() || "All",
      bedrooms: params.get("bedrooms")?.trim() || "Any",
      type:     params.get("type")?.trim()     || "Any",
      nearby:   params.get("nearby")?.trim()   || "Any",
      minPrice: params.get("minPrice")?.trim() || "",
      maxPrice: params.get("maxPrice")?.trim() || "",
    }));
  }, [location.search]);

  const filtered = useMemo(() => {
    let list = [...properties];
    const { minPrice, maxPrice, locality, bedrooms, type, nearby, q } = filters;

    if (minPrice) list = list.filter((p) => p.priceLakh >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.priceLakh <= Number(maxPrice));

    if (locality && locality !== "All") {
      const loc = String(locality).trim().toLowerCase();
      list = list.filter((p) => String(p.locality || "").trim().toLowerCase() === loc);
    }

    if (bedrooms && bedrooms !== "Any") {
      const bedNum = Number(bedrooms);
      list = list.filter((p) => {
        if (typeof p.bedrooms === "number" && !Number.isNaN(p.bedrooms)) return p.bedrooms === bedNum;
        const raw = String(p.rooms_raw ?? "").toLowerCase();
        if (raw.includes(String(bedNum))) return true;
        if (bedNum === 1 && /studio/.test(raw)) return true;
        return false;
      });
    }

    if (type && type !== "Any") {
      const t = String(type).trim().toLowerCase();
      list = list.filter((p) => String(p.property_type || "").trim().toLowerCase() === t);
    }

    if (nearby && nearby !== "Any") {
      const selected = nearby.toLowerCase().replace(/[^a-z0-9]/g, "");
      list = list.filter((p) => {
        if (!p.nearby_locations) return false;
        const values = p.nearby_locations.split(",").map((x) => x.toLowerCase().replace(/[^a-z0-9]/g, ""));
        return values.some((v) => v.includes(selected) || selected.includes(v));
      });
    }

    if (q) {
      const query = q.toLowerCase();
      const priceFromSearch = parsePriceFromQuery(query);
      if (priceFromSearch !== null) {
        list = list.filter((p) => p.priceLakh <= priceFromSearch);
      } else {
        list = list.filter(
          (p) =>
            (p.title || "").toLowerCase().includes(query) ||
            (p.locality || "").toLowerCase().includes(query) ||
            (p.nearby_locations || "").toLowerCase().includes(query)
        );
      }
    }

    if (sortBy === "priceAsc")  list.sort((a, b) => (a.priceLakh || 0) - (b.priceLakh || 0));
    if (sortBy === "priceDesc") list.sort((a, b) => (b.priceLakh || 0) - (a.priceLakh || 0));
    return list;
  }, [filters, sortBy, properties]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG, color: TEXT }}>
      Loading properties…
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-300" style={{ backgroundColor: BG }}>
      {error}
    </div>
  );

  return (
    <>
    <Helmet>
      <title>
        Properties for Sale in Hyderabad | VPF Properties
      </title>

      <meta
        name="description"
        content="Browse verified flats, villas, apartments and premium properties for sale in Hyderabad. Find your ideal home with VPF Properties."
      />

      <meta
        name="keywords"
        content="VPF Properties,
Properties in Hyderabad,
Flats for Sale Hyderabad,
Villas for Sale Hyderabad,
Apartments for Sale Hyderabad,
Property Listings Hyderabad,
Real Estate Hyderabad,
Property Dealers Hyderabad,
Property Consultants Hyderabad,
Buy Property Hyderabad,
Residential Properties Hyderabad,
Commercial Properties Hyderabad,
Premium Properties Hyderabad,
Luxury Villas Hyderabad,
Luxury Flats Hyderabad,
Verified Properties Hyderabad,
Property Broker Hyderabad,
Hyderabad Real Estate,
Homes for Sale Hyderabad,
Investment Properties Hyderabad,
Kukatpally Properties,
Miyapur Properties,
Bachupally Properties,
Nizampet Properties,
Hyderabad Property Listings,Properties for Sale Hyderabad,
  Flats for Sale Hyderabad,
  Apartments for Sale Hyderabad,
  Villas for Sale Hyderabad,
  Homes for Sale Hyderabad,
  Ready to Move Flats Hyderabad,
  Luxury Villas Hyderabad,
  Independent Houses Hyderabad,
  Open Plots Hyderabad,
  Premium Apartments Hyderabad,
  Investment Properties Hyderabad,
  Property Listings Hyderabad,
  Residential Properties Hyderabad,
  Commercial Properties Hyderabad,
  Flats for Sale Kukatpally,
  Properties for Sale Miyapur,
  Villas for Sale Bachupally,
  Apartments in KPHB,
  Properties in Nizampet,
  Hyderabad Property Listings"
      />

      <link
        rel="canonical"
        href="https://vpfproperties.com/properties"
      />
    </Helmet>

    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: BG,
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(212,175,55,0.05), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212,175,55,0.03), transparent 45%),
          linear-gradient(180deg, ${BG} 0%, #0D1230 100%)`,
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
        />
      </div>

      {/* ── Breadcrumb ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-2 sm:pb-4">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Link
            to="/"
            className="flex items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-opacity"
            style={{ color: MUTED }}
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} style={{ color: GOLD, opacity: 0.6 }} />
          <span className="font-medium" style={{ color: GOLD }}>Properties</span>
        </nav>
      </div>

      {/* ── Header ── */}
      <section className="relative border-b pt-2 sm:pt-4 pb-8 sm:pb-12" style={{ borderColor: LINE }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Title + Sort: stacked on xs, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">

            {/* Left: badge, heading, subtext */}
            <div className="space-y-3 sm:space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs font-medium"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 0 20px ${GOLD}15`,
                  color: GOLD,
                }}
              >
                <Sparkles size={12} />
                <span>Curated Collection</span>
              </div>

              {/* Fluid heading: 2xl → 3xl → 4xl → 5xl */}
              <h1
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black leading-tight"
                style={{ color: TEXT }}
              >
                Discover Your{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${GOLD_L} 0%, ${GOLD} 50%, ${GOLD_D} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Perfect Home
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg" style={{ color: MUTED }}>
                Browse our verified homes and premium properties across Hyderabad.
              </p>
            </div>

            {/* Sort — stretches full width on xs for easy tapping */}
            <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto w-full sm:w-auto">
              <SlidersHorizontal size={15} className="shrink-0" style={{ color: GOLD }} />
              <span className="text-xs sm:text-sm font-medium shrink-0" style={{ color: MUTED }}>
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                style={{ backgroundColor: SURFACE, color: TEXT, border: `1px solid ${LINE}` }}
              >
                <option value="priceAsc"  style={{ color: TEXT }}>Price: Low → High</option>
                <option value="priceDesc" style={{ color: TEXT }}>Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Filters bar */}
          <div className="mt-5 sm:mt-8 lg:mt-10">
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

          {/* Result count pill */}
          <div
            className="mt-4 sm:mt-6 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm"
            style={{ backgroundColor: `${ACCENT}60`, border: `1px solid ${LINE}`, color: MUTED }}
          >
            Showing{" "}
            <span className="font-bold" style={{ color: GOLD }}>{filtered.length}</span>{" "}
            {filtered.length !== 1 ? "properties" : "property"}
          </div>
        </div>
      </section>

      {/* ── Property Cards ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {filtered.length === 0 ? (
          <div
            className="text-center py-12 sm:py-20 rounded-2xl sm:rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${SURFACE} 100%)`,
              border: `1px solid ${LINE}`,
            }}
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4" style={{ opacity: 0.3 }}>🏘️</div>
            <div className="text-lg sm:text-xl font-bold mb-2" style={{ color: TEXT }}>
              No Properties Found
            </div>
            <p className="text-sm sm:text-base" style={{ color: MUTED }}>
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          /* 1 col xs, 2 col sm, 3 col lg */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer"
                onClick={() => navigate(`/property/${p.id}`)}
              >
                <PropertyCard item={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}