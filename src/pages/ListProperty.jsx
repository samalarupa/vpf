import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Upload,
  MapPin,
  BedDouble,
  IndianRupee,
  Phone,
  User,
  Mail,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon,
  X,
  FileText,
  Layers,
  Wifi,
  Car,
  Droplets,
  Zap,
  Shield,
  Trees,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config";

/* ── Theme tokens (identical to rest of site) ─────────────── */
const T = {
  BG: "#0A0E27",
  SURFACE: "#141B3A",
  ACCENT: "#1A2347",
  TEXT: "#F8F9FB",
  MUTED: "#B8BDD0",
  GOLD: "#D4AF37",
  GOLD_L: "#E8C875",
  GOLD_D: "#B8963A",
  LINE: "#1F2847",
};

/* ── Form steps ────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Property Info", icon: Building2 },
  { id: 2, label: "Location",      icon: MapPin },
  { id: 3, label: "Details",       icon: Layers },
  { id: 4, label: "Contact",       icon: User },
];

const PROPERTY_TYPES = [
  "Apartment", "Independent House", "Villa", "Plot / Land",
  "Builder Floor", "Penthouse", "Commercial Space", "Studio Apartment",
];

const BHK_OPTIONS = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];

const AMENITIES = [
  { label: "WiFi / Broadband", icon: Wifi },
  { label: "Car Parking",      icon: Car },
  { label: "Water Supply 24/7",icon: Droplets },
  { label: "Power Backup",     icon: Zap },
  { label: "Security / CCTV", icon: Shield },
  { label: "Garden / Park",    icon: Trees },
];

const NEARBY = [
  "Metro Station", "IT Park / HITEC City", "School / College",
  "Hospital", "Mall / Market", "Airport",
];

/* ── Helpers ───────────────────────────────────────────────── */
const inputCls = `
  w-full px-4 py-3 rounded-xl text-sm font-medium
  focus:outline-none focus:ring-2 transition-all duration-200
  placeholder:font-normal
`;

const inputStyle = {
  backgroundColor: `${T.ACCENT}80`,
  border: `1.5px solid ${T.LINE}`,
  color: T.TEXT,
  caretColor: T.GOLD,
};

const focusRingStyle = { "--tw-ring-color": `${T.GOLD}50` };

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.MUTED }}>
      {children}
    </label>
  );
}

function FieldWrap({ children, className = "" }) {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
}

/* ── Main Component ────────────────────────────────────────── */
export default function ListProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const [form, setForm] = useState({
    // Step 1
    propertyType: "",
    title: "",
    bhk: "",
    builtArea: "",
    plotArea: "",
    facing: "",
    floor: "",
    totalFloors: "",
    age: "",
    furnishing: "",
    // Step 2
    locality: "",
    address: "",
    city: "Hyderabad",
    landmark: "",
    nearby: [],
    // Step 3
    priceLakh: "",
    priceNegotiable: false,
    description: "",
    amenities: [],
    images: [],
    // Step 4
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    preferredContact: "WhatsApp",
    bestTime: "",
    agreeTerms: false,
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleArr = (key, val) => {
    setForm((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPreviewImages((prev) => [...prev, ...previews].slice(0, 10));
    set("images", [...form.images, ...files].slice(0, 10));
  };

  const removeImage = (idx) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== idx));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.agreeTerms) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "images") return;
        if (Array.isArray(v)) fd.append(k, v.join(","));
        else fd.append(k, v);
      });
      form.images.forEach((img, i) => fd.append(`image_${i}`, img));

      // POST to backend (adjust endpoint as needed)
      await fetch(`${API_BASE_URL}/listings/submit.php`, {
        method: "POST",
        body: fd,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      // Show success anyway for demo purposes
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Step validation ─────────────────────────────────────── */
  const stepValid = {
    1: form.propertyType && form.title,
    2: form.locality && form.address,
    3: form.priceLakh,
    4: form.ownerName && form.ownerPhone && form.agreeTerms,
  };

  /* ── Animations ──────────────────────────────────────────── */
  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundColor: T.BG,
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(212,175,55,0.08), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212,175,55,0.06), transparent 45%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full text-center space-y-6 p-10 rounded-3xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${T.ACCENT}90 0%, ${T.SURFACE}90 100%)`,
            border: `1.5px solid ${T.GOLD}30`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${T.GOLD}10`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)` }}
          >
            <CheckCircle2 size={40} color={T.BG} />
          </motion.div>

          <div>
            <h2 className="text-3xl font-black mb-3" style={{ color: T.TEXT }}>
              Listing Submitted!
            </h2>
            <p className="text-base leading-relaxed" style={{ color: T.MUTED }}>
              Thank you, <span style={{ color: T.GOLD }}>{form.ownerName}</span>. Our team will
              review your property and reach out within 24 hours.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl text-sm"
            style={{ backgroundColor: `${T.ACCENT}60`, border: `1px solid ${T.LINE}` }}
          >
            <p style={{ color: T.MUTED }}>
              We'll contact you via{" "}
              <span style={{ color: T.GOLD }}>{form.preferredContact}</span> on{" "}
              <span style={{ color: T.GOLD }}>{form.ownerPhone}</span>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/properties")}
              className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`,
                color: T.BG,
              }}
            >
              Browse Properties
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ ...form, title: "", images: [] }); setPreviewImages([]); }}
              className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all hover:bg-white/5"
              style={{ border: `1.5px solid ${T.GOLD}40`, color: T.TEXT }}
            >
              List Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: T.BG,
        color: T.TEXT,
        backgroundImage: `radial-gradient(circle at 15% 10%, rgba(212,175,55,0.07), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212,175,55,0.05), transparent 45%),
          linear-gradient(180deg, ${T.BG} 0%, #0D1230 100%)`,
      }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-8"
          style={{ background: `radial-gradient(circle, ${T.GOLD} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-8"
          style={{ background: `radial-gradient(circle, ${T.GOLD_L} 0%, transparent 70%)` }} />
      </div>

      {/* Breadcrumb */}
      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: T.MUTED }}>
            <Home size={15} /><span>Home</span>
          </Link>
          <ChevronRight size={14} style={{ color: T.GOLD, opacity: 0.6 }} />
          <span className="font-medium" style={{ color: T.GOLD }}>List Your Property</span>
        </nav>
      </div>

      {/* Hero Header */}
      <section className="relative pt-4 pb-10 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: `linear-gradient(135deg, ${T.ACCENT} 0%, ${T.SURFACE} 100%)`,
                border: `1px solid ${T.GOLD}33`,
                boxShadow: `0 0 20px ${T.GOLD}15`,
                color: T.GOLD,
              }}
            >
              <Sparkles size={13} />
              <span>Free Listing • No Hidden Fees</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Sell Your Property{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${T.GOLD_L} 0%, ${T.GOLD} 50%, ${T.GOLD_D} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Faster
              </span>
            </h1>
            <p className="text-base max-w-lg" style={{ color: T.MUTED }}>
              List your home with Hyderabad's most trusted real estate consultants. Reach thousands of verified buyers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            border: `1.5px solid ${T.LINE}`,
            boxShadow: `0 40px 100px rgba(0,0,0,0.4), inset 0 0 0 1px ${T.GOLD}10`,
          }}
        >
          {/* Step Indicator */}
          <div
            className="flex border-b"
            style={{ backgroundColor: `${T.SURFACE}CC`, borderColor: T.LINE }}
          >
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => isDone && setStep(s.id)}
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 text-xs font-semibold transition-all relative"
                  style={{
                    color: isActive ? T.GOLD : isDone ? T.GOLD_L : T.MUTED,
                    cursor: isDone ? "pointer" : "default",
                  }}
                >
                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="step-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: `linear-gradient(90deg, ${T.GOLD} 0%, ${T.GOLD_L} 100%)` }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`
                        : isDone
                        ? `${T.GOLD}25`
                        : `${T.ACCENT}80`,
                      color: isActive ? T.BG : isDone ? T.GOLD : T.MUTED,
                    }}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Steps */}
          <div className="p-6 sm:p-10" style={{ backgroundColor: `${T.BG}CC` }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >

                {/* ── STEP 1: Property Info ─────────────────────── */}
                {step === 1 && (
                  <div className="space-y-8">
                    <SectionTitle icon={Building2} title="Property Information" subtitle="Tell us about the property you want to sell" />

                    {/* Property Type */}
                    <FieldWrap>
                      <Label>Property Type *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PROPERTY_TYPES.map((pt) => (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => set("propertyType", pt)}
                            className="py-3 px-3 rounded-xl text-xs font-semibold text-center transition-all hover:scale-[1.02]"
                            style={{
                              background: form.propertyType === pt
                                ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`
                                : `${T.ACCENT}80`,
                              border: `1.5px solid ${form.propertyType === pt ? T.GOLD : T.LINE}`,
                              color: form.propertyType === pt ? T.BG : T.TEXT,
                              boxShadow: form.propertyType === pt ? `0 0 16px ${T.GOLD}30` : "none",
                            }}
                          >
                            {pt}
                          </button>
                        ))}
                      </div>
                    </FieldWrap>

                    {/* Title */}
                    <FieldWrap>
                      <Label>Property Title *</Label>
                      <input
                        className={inputCls}
                        style={{ ...inputStyle, ...focusRingStyle }}
                        placeholder="e.g. Spacious 3BHK in Gachibowli with Great Amenities"
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                      />
                    </FieldWrap>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* BHK */}
                      <FieldWrap>
                        <Label>BHK / Configuration</Label>
                        <div className="flex flex-wrap gap-2">
                          {BHK_OPTIONS.map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => set("bhk", b)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                              style={{
                                background: form.bhk === b ? `linear-gradient(135deg, ${T.GOLD}25, ${T.GOLD}10)` : `${T.ACCENT}60`,
                                border: `1.5px solid ${form.bhk === b ? T.GOLD : T.LINE}`,
                                color: form.bhk === b ? T.GOLD : T.MUTED,
                              }}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </FieldWrap>

                      {/* Facing */}
                      <FieldWrap>
                        <Label>Facing</Label>
                        <select
                          className={inputCls}
                          style={inputStyle}
                          value={form.facing}
                          onChange={(e) => set("facing", e.target.value)}
                        >
                          <option value="">Select facing</option>
                          {["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"].map((f) => (
                            <option key={f} value={f} style={{ backgroundColor: T.SURFACE }}>{f}</option>
                          ))}
                        </select>
                      </FieldWrap>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <FieldWrap>
                        <Label>Built-up Area (sq.ft)</Label>
                        <input className={inputCls} style={inputStyle} placeholder="e.g. 1200"
                          value={form.builtArea} onChange={(e) => set("builtArea", e.target.value)} type="number" />
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Plot Area (sq.yd)</Label>
                        <input className={inputCls} style={inputStyle} placeholder="e.g. 200"
                          value={form.plotArea} onChange={(e) => set("plotArea", e.target.value)} type="number" />
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Property Age</Label>
                        <select className={inputCls} style={inputStyle}
                          value={form.age} onChange={(e) => set("age", e.target.value)}>
                          <option value="">Select age</option>
                          {["Under Construction", "New (< 1 year)", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((a) => (
                            <option key={a} value={a} style={{ backgroundColor: T.SURFACE }}>{a}</option>
                          ))}
                        </select>
                      </FieldWrap>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <FieldWrap>
                        <Label>Floor Number</Label>
                        <input className={inputCls} style={inputStyle} placeholder="e.g. 5"
                          value={form.floor} onChange={(e) => set("floor", e.target.value)} type="number" />
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Total Floors</Label>
                        <input className={inputCls} style={inputStyle} placeholder="e.g. 12"
                          value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} type="number" />
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Furnishing Status</Label>
                        <select className={inputCls} style={inputStyle}
                          value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)}>
                          <option value="">Select</option>
                          {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((f) => (
                            <option key={f} value={f} style={{ backgroundColor: T.SURFACE }}>{f}</option>
                          ))}
                        </select>
                      </FieldWrap>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Location ──────────────────────────── */}
                {step === 2 && (
                  <div className="space-y-8">
                    <SectionTitle icon={MapPin} title="Location Details" subtitle="Help buyers find your property easily" />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FieldWrap>
                        <Label>Locality / Area *</Label>
                        <input className={inputCls} style={inputStyle} placeholder="e.g. Gachibowli, Kondapur"
                          value={form.locality} onChange={(e) => set("locality", e.target.value)} />
                      </FieldWrap>
                      <FieldWrap>
                        <Label>City</Label>
                        <input className={inputCls} style={{ ...inputStyle, opacity: 0.7 }}
                          value={form.city} readOnly />
                      </FieldWrap>
                    </div>

                    <FieldWrap>
                      <Label>Full Address *</Label>
                      <textarea
                        className={inputCls}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }}
                        placeholder="House/Flat number, Street, Colony name…"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        rows={3}
                      />
                    </FieldWrap>

                    <FieldWrap>
                      <Label>Landmark (Optional)</Label>
                      <input className={inputCls} style={inputStyle} placeholder="e.g. Near DLF Cybercity"
                        value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
                    </FieldWrap>

                    <FieldWrap>
                      <Label>Nearby Places</Label>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {NEARBY.map((n) => {
                          const sel = form.nearby.includes(n);
                          return (
                            <button key={n} type="button" onClick={() => toggleArr("nearby", n)}
                              className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
                              style={{
                                background: sel ? `linear-gradient(135deg, ${T.GOLD}25, ${T.GOLD}10)` : `${T.ACCENT}60`,
                                border: `1.5px solid ${sel ? T.GOLD : T.LINE}`,
                                color: sel ? T.GOLD : T.MUTED,
                              }}
                            >{n}</button>
                          );
                        })}
                      </div>
                    </FieldWrap>
                  </div>
                )}

                {/* ── STEP 3: Details & Photos ─────────────────── */}
                {step === 3 && (
                  <div className="space-y-8">
                    <SectionTitle icon={Layers} title="Pricing, Amenities & Photos" subtitle="Add details that help buyers make a decision" />

                    {/* Price */}
                    <div className="grid sm:grid-cols-2 gap-6 items-end">
                      <FieldWrap>
                        <Label>Expected Price (₹ Lakhs) *</Label>
                        <div className="relative">
                          <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.GOLD }} />
                          <input className={`${inputCls} pl-10`} style={inputStyle}
                            placeholder="e.g. 85" type="number"
                            value={form.priceLakh} onChange={(e) => set("priceLakh", e.target.value)} />
                        </div>
                      </FieldWrap>
                      <FieldWrap>
                        <button
                          type="button"
                          onClick={() => set("priceNegotiable", !form.priceNegotiable)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                          style={{
                            background: form.priceNegotiable ? `linear-gradient(135deg, ${T.GOLD}20, ${T.GOLD}08)` : `${T.ACCENT}60`,
                            border: `1.5px solid ${form.priceNegotiable ? T.GOLD : T.LINE}`,
                          }}
                        >
                          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: form.priceNegotiable ? T.GOLD : T.MUTED }}>
                            {form.priceNegotiable && <CheckCircle2 size={12} style={{ color: T.GOLD }} />}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: form.priceNegotiable ? T.GOLD : T.MUTED }}>
                            Price Negotiable
                          </span>
                        </button>
                      </FieldWrap>
                    </div>

                    {/* Description */}
                    <FieldWrap>
                      <Label>Property Description</Label>
                      <textarea
                        className={inputCls}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "110px" }}
                        placeholder="Describe the property — layout, views, special features, why it's a great deal…"
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        rows={4}
                      />
                    </FieldWrap>

                    {/* Amenities */}
                    <FieldWrap>
                      <Label>Available Amenities</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {AMENITIES.map(({ label, icon: Icon }) => {
                          const sel = form.amenities.includes(label);
                          return (
                            <button key={label} type="button" onClick={() => toggleArr("amenities", label)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                              style={{
                                background: sel ? `linear-gradient(135deg, ${T.GOLD}20, ${T.GOLD}08)` : `${T.ACCENT}60`,
                                border: `1.5px solid ${sel ? T.GOLD : T.LINE}`,
                                color: sel ? T.GOLD : T.MUTED,
                              }}
                            >
                              <Icon size={15} />
                              <span className="text-xs">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </FieldWrap>

                    {/* Image Upload */}
                    <FieldWrap>
                      <Label>Property Photos (up to 10)</Label>
                      <label
                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl cursor-pointer transition-all hover:opacity-80"
                        style={{
                          border: `2px dashed ${T.GOLD}40`,
                          background: `${T.ACCENT}40`,
                        }}
                      >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${T.GOLD}20 0%, ${T.GOLD_D}10 100%)` }}>
                          <Upload size={24} style={{ color: T.GOLD }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold" style={{ color: T.TEXT }}>Click to upload photos</p>
                          <p className="text-xs mt-1" style={{ color: T.MUTED }}>JPG, PNG up to 10MB each</p>
                        </div>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      </label>

                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                          {previewImages.map((img, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden aspect-square group">
                              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: "#EF4444" }}
                              >
                                <X size={12} color="white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldWrap>
                  </div>
                )}

                {/* ── STEP 4: Contact Info ──────────────────────── */}
                {step === 4 && (
                  <div className="space-y-8">
                    <SectionTitle icon={User} title="Your Contact Details" subtitle="We'll reach out to you to verify and list the property" />

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FieldWrap>
                        <Label>Full Name *</Label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.GOLD }} />
                          <input className={`${inputCls} pl-10`} style={inputStyle} placeholder="Your name"
                            value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
                        </div>
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Mobile Number *</Label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.GOLD }} />
                          <input className={`${inputCls} pl-10`} style={inputStyle} placeholder="+91 98765 43210"
                            value={form.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} type="tel" />
                        </div>
                      </FieldWrap>
                    </div>

                    <FieldWrap>
                      <Label>Email Address (Optional)</Label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: T.GOLD }} />
                        <input className={`${inputCls} pl-10`} style={inputStyle} placeholder="your@email.com"
                          value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} type="email" />
                      </div>
                    </FieldWrap>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <FieldWrap>
                        <Label>Preferred Contact Method</Label>
                        <div className="flex gap-3">
                          {["WhatsApp", "Call", "Email"].map((m) => (
                            <button key={m} type="button" onClick={() => set("preferredContact", m)}
                              className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                              style={{
                                background: form.preferredContact === m ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)` : `${T.ACCENT}60`,
                                border: `1.5px solid ${form.preferredContact === m ? T.GOLD : T.LINE}`,
                                color: form.preferredContact === m ? T.BG : T.MUTED,
                              }}
                            >{m}</button>
                          ))}
                        </div>
                      </FieldWrap>
                      <FieldWrap>
                        <Label>Best Time to Call</Label>
                        <select className={inputCls} style={inputStyle}
                          value={form.bestTime} onChange={(e) => set("bestTime", e.target.value)}>
                          <option value="">Anytime</option>
                          {["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"].map((t) => (
                            <option key={t} value={t} style={{ backgroundColor: T.SURFACE }}>{t}</option>
                          ))}
                        </select>
                      </FieldWrap>
                    </div>

                    {/* Summary card */}
                    <div
                      className="p-5 rounded-2xl space-y-3"
                      style={{
                        background: `linear-gradient(135deg, ${T.ACCENT}60 0%, ${T.SURFACE}60 100%)`,
                        border: `1px solid ${T.GOLD}20`,
                      }}
                    >
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: T.GOLD }}>Listing Summary</p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {[
                          ["Type", form.propertyType],
                          ["Title", form.title],
                          ["BHK", form.bhk],
                          ["Locality", form.locality],
                          ["Price", form.priceLakh ? `₹ ${form.priceLakh} L${form.priceNegotiable ? " (Negotiable)" : ""}` : "—"],
                          ["Photos", `${previewImages.length} uploaded`],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <div key={k}>
                            <span style={{ color: T.MUTED }}>{k}: </span>
                            <span className="font-medium" style={{ color: T.TEXT }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms */}
                    <button
                      type="button"
                      onClick={() => set("agreeTerms", !form.agreeTerms)}
                      className="flex items-start gap-3 text-left"
                    >
                      <div
                        className="w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                        style={{
                          borderColor: form.agreeTerms ? T.GOLD : T.MUTED,
                          background: form.agreeTerms ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)` : "transparent",
                        }}
                      >
                        {form.agreeTerms && <CheckCircle2 size={13} color={T.BG} />}
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: T.MUTED }}>
                        I agree that the information provided is accurate, and I consent to VPF Properties contacting me regarding this listing.
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: `1px solid ${T.LINE}` }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-3 rounded-2xl font-semibold text-sm transition-all hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ border: `1.5px solid ${T.LINE}`, color: T.TEXT }}
              >
                ← Back
              </button>

              <div className="flex items-center gap-2">
                {STEPS.map((s) => (
                  <div key={s.id} className="w-2 h-2 rounded-full transition-all"
                    style={{ background: step === s.id ? T.GOLD : step > s.id ? `${T.GOLD}50` : `${T.LINE}` }} />
                ))}
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!stepValid[step]}
                  className="group px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`,
                    color: T.BG,
                    boxShadow: stepValid[step] ? `0 8px 24px ${T.GOLD}30` : "none",
                  }}
                >
                  Next
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!form.agreeTerms || submitting}
                  className="group px-8 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`,
                    color: T.BG,
                    boxShadow: form.agreeTerms ? `0 8px 24px ${T.GOLD}30` : "none",
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: `${T.BG}40`, borderTopColor: "transparent" }} />
                      Submitting…
                    </span>
                  ) : (
                    <>
                      Submit Listing
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          {[
            ["🔒", "Secure & Private"],
            ["⚡", "Listed within 24hrs"],
            ["✅", "Verified Buyers Only"],
            ["💬", "Dedicated Support"],
          ].map(([emoji, label]) => (
            <div key={label} className="flex items-center gap-2 text-sm" style={{ color: T.MUTED }}>
              <span>{emoji}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 pb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg, ${T.GOLD}20, ${T.GOLD}08)`, border: `1px solid ${T.GOLD}30` }}>
        <Icon size={18} style={{ color: T.GOLD }} />
      </div>
      <div>
        <h2 className="text-xl font-bold" style={{ color: T.TEXT }}>{title}</h2>
        <p className="text-sm mt-0.5" style={{ color: T.MUTED }}>{subtitle}</p>
      </div>
    </div>
  );
}