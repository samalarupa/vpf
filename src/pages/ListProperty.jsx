import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, ChevronRight, Upload, MapPin, IndianRupee,
  Phone, User, Building2, CheckCircle2, X, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

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

const PROPERTY_TYPES = [
  "Apartment", "Independent House", "Villa", "Plot / Land",
  "Builder Floor", "Penthouse", "Commercial Space", "Studio Apartment",
];

const BHK_OPTIONS = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];

/* Bigger, touch-friendly inputs */
const inputCls = `w-full px-5 py-4 rounded-2xl text-base font-medium focus:outline-none focus:ring-2 transition-all duration-200 placeholder:font-normal`;
const inputStyle = {
  backgroundColor: `${T.ACCENT}80`,
  border: `1.5px solid ${T.LINE}`,
  color: T.TEXT,
  caretColor: T.GOLD,
};

function Label({ children }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.MUTED }}>
      {children}
    </label>
  );
}

export default function ListProperty() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const [form, setForm] = useState({
    propertyType: "",
    title: "",
    description: "",
    bhk: "",
    locality: "",
    ownerName: "",
    ownerPhone: "",
    priceLakh: "",
    agreeTerms: false,
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.map(f => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      type: f.type.startsWith("video/") ? "video" : "image",
    }));
    setMediaFiles(prev => [...prev, ...newMedia].slice(0, 15));
  };

  const removeMedia = (idx) => setMediaFiles(prev => prev.filter((_, i) => i !== idx));

  const canSubmit = form.propertyType && form.title && form.locality &&
    form.ownerName && form.ownerPhone && form.agreeTerms;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "agreeTerms") fd.append(k, v);
      });
      mediaFiles.forEach((m, i) => fd.append(`media_${i}`, m.file));
      await fetch(`${API_BASE_URL}/listings/submit.php`, { method: "POST", body: fd });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ───────────────────────────────────────── */
  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-10"
        style={{
          backgroundColor: T.BG,
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(212,175,55,0.08), transparent 50%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full text-center space-y-6 p-8 rounded-3xl"
          style={{
            maxWidth: 480,
            background: `linear-gradient(135deg, ${T.ACCENT}90 0%, ${T.SURFACE}90 100%)`,
            border: `1.5px solid ${T.GOLD}30`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${T.GOLD}10`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)` }}
          >
            <CheckCircle2 size={40} color={T.BG} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-black mb-3" style={{ color: T.TEXT }}>Listing Submitted!</h2>
            <p className="text-base leading-relaxed" style={{ color: T.MUTED }}>
              Thank you, <span style={{ color: T.GOLD }}>{form.ownerName}</span>. Our team will review and reach out within 24 hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate("/properties")}
              className="w-full py-4 rounded-2xl font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`, color: T.BG }}
            >
              Browse Properties
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ propertyType: "", title: "", description: "", bhk: "", locality: "", ownerName: "", ownerPhone: "", priceLakh: "", agreeTerms: false });
                setMediaFiles([]);
              }}
              className="w-full py-4 rounded-2xl font-semibold text-base transition-all hover:bg-white/5 active:scale-95"
              style={{ border: `1.5px solid ${T.GOLD}40`, color: T.TEXT }}
            >
              List Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main form ────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: T.BG,
        color: T.TEXT,
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(212,175,55,0.07), transparent 50%),
          radial-gradient(circle at 85% 90%, rgba(212,175,55,0.05), transparent 45%)`,
      }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${T.GOLD}15 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${T.GOLD_L}10 0%, transparent 70%)` }} />
      </div>

      {/* Breadcrumb */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-3">
        <nav className="flex items-center gap-2 text-sm flex-wrap">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: T.MUTED }}>
            <Home size={15} /><span>Home</span>
          </Link>
          <ChevronRight size={14} style={{ color: T.GOLD, opacity: 0.6 }} />
          <span className="font-medium" style={{ color: T.GOLD }}>List Your Property</span>
        </nav>
      </div>

      {/* Page header */}
      <section className="relative pt-3 pb-8 px-4 sm:px-6 lg:px-8">
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
                color: T.GOLD,
              }}
            >
              <Sparkles size={13} /><span>Free Listing • No Hidden Fees</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Sell Your Property{" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.GOLD_L} 0%, ${T.GOLD} 50%, ${T.GOLD_D} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Faster
              </span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: T.MUTED }}>
              Reach thousands of verified buyers in Hyderabad. Fill in the details below and we'll do the rest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form card */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{
            border: `1.5px solid ${T.LINE}`,
            boxShadow: `0 40px 100px rgba(0,0,0,0.4), inset 0 0 0 1px ${T.GOLD}08`,
          }}
        >
          {/* Card header */}
          <div
            className="px-5 sm:px-8 lg:px-12 py-5 sm:py-6 flex items-center gap-4"
            style={{ backgroundColor: `${T.SURFACE}CC`, borderBottom: `1px solid ${T.LINE}` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${T.GOLD}25, ${T.GOLD}10)`, border: `1px solid ${T.GOLD}30` }}
            >
              <Building2 size={20} style={{ color: T.GOLD }} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold" style={{ color: T.TEXT }}>Property Details</h2>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: T.MUTED }}>Fill in the basic info to get listed</p>
            </div>
          </div>

          {/* Fields */}
          <div
            className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 space-y-8 sm:space-y-10"
            style={{ backgroundColor: `${T.BG}CC` }}
          >

            {/* Property Type */}
            <div>
              <Label>Property Type *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {PROPERTY_TYPES.map(pt => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => set("propertyType", pt)}
                    className="py-3 sm:py-4 px-3 rounded-2xl text-sm sm:text-base font-semibold text-center transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                      background: form.propertyType === pt
                        ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`
                        : `${T.ACCENT}80`,
                      border: `1.5px solid ${form.propertyType === pt ? T.GOLD : T.LINE}`,
                      color: form.propertyType === pt ? T.BG : T.TEXT,
                      boxShadow: form.propertyType === pt ? `0 0 20px ${T.GOLD}30` : "none",
                    }}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* BHK */}
            <div>
              <Label>BHK / Configuration</Label>
              <div className="flex flex-wrap gap-3">
                {BHK_OPTIONS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set("bhk", b)}
                    className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-semibold transition-all active:scale-95"
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
            </div>

            {/* Title */}
            <div>
              <Label>Property Title *</Label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="e.g. Spacious 3BHK Villa in Gachibowli with Pool"
                value={form.title}
                onChange={e => set("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea
                className={inputCls}
                style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                placeholder="Describe the property — layout, views, special features, why it's a great deal…"
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={4}
              />
            </div>

            {/* Locality + Price — stack on xs, side-by-side from sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <Label>Locality / Area *</Label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.GOLD }} />
                  <input
                    className={`${inputCls} pl-12`}
                    style={inputStyle}
                    placeholder="e.g. Gachibowli, Kondapur"
                    value={form.locality}
                    onChange={e => set("locality", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Expected Price (₹ Lakhs)</Label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.GOLD }} />
                  <input
                    className={`${inputCls} pl-12`}
                    style={inputStyle}
                    placeholder="e.g. 85"
                    type="number"
                    value={form.priceLakh}
                    onChange={e => set("priceLakh", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Name + Phone — stack on xs, side-by-side from sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <Label>Your Name *</Label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.GOLD }} />
                  <input
                    className={`${inputCls} pl-12`}
                    style={inputStyle}
                    placeholder="Full name"
                    value={form.ownerName}
                    onChange={e => set("ownerName", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.GOLD }} />
                  <input
                    className={`${inputCls} pl-12`}
                    style={inputStyle}
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={form.ownerPhone}
                    onChange={e => set("ownerPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Media upload */}
            <div>
              <Label>Photos & Videos (optional, up to 15)</Label>
              <label
                className="flex flex-col items-center justify-center gap-4 py-10 sm:py-12 px-6 rounded-2xl cursor-pointer transition-all hover:opacity-80 active:opacity-60"
                style={{ border: `2px dashed ${T.GOLD}40`, background: `${T.ACCENT}40` }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${T.GOLD}20 0%, ${T.GOLD_D}10 100%)` }}
                >
                  <Upload size={28} style={{ color: T.GOLD }} />
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-semibold" style={{ color: T.TEXT }}>
                    Tap to upload photos or videos
                  </p>
                  <p className="text-xs sm:text-sm mt-1.5" style={{ color: T.MUTED }}>
                    JPG, PNG, MP4, MOV — up to 10 MB each
                  </p>
                </div>
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
              </label>

              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-5">
                  {mediaFiles.map((m, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square group"
                      style={{ background: T.ACCENT }}
                    >
                      {m.type === "image" ? (
                        <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                          <span className="text-3xl">🎬</span>
                          <span className="text-[10px] text-center w-full truncate" style={{ color: T.MUTED }}>{m.name}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Always visible on touch / hover on desktop */}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center
                          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
                        style={{ backgroundColor: "#EF4444" }}
                      >
                        <X size={13} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${T.LINE}` }} />

            {/* Terms */}
            <button
              type="button"
              onClick={() => set("agreeTerms", !form.agreeTerms)}
              className="flex items-start gap-4 text-left w-full"
            >
              <div
                className="w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: form.agreeTerms ? T.GOLD : T.MUTED,
                  background: form.agreeTerms ? `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)` : "transparent",
                  minWidth: 24,
                }}
              >
                {form.agreeTerms && <CheckCircle2 size={14} color={T.BG} />}
              </div>
              <span className="text-sm sm:text-base leading-relaxed" style={{ color: T.MUTED }}>
                I agree that the information provided is accurate, and I consent to VPF Properties contacting me regarding this listing.
              </span>
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3
                transition-all hover:scale-[1.01] active:scale-[0.99]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: `linear-gradient(135deg, ${T.GOLD} 0%, ${T.GOLD_D} 100%)`,
                color: T.BG,
                boxShadow: canSubmit ? `0 10px 40px ${T.GOLD}35` : "none",
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2.5">
                  <motion.div
                    className="w-5 h-5 rounded-full border-2"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ borderColor: `${T.BG}40`, borderTopColor: T.BG }}
                  />
                  Submitting…
                </span>
              ) : (
                <><CheckCircle2 size={20} /> Submit Listing</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-10"
        >
          {[["🔒", "Secure & Private"], ["⚡", "Listed within 24hrs"], ["✅", "Verified Buyers Only"], ["💬", "Dedicated Support"]].map(([e, l]) => (
            <div key={l} className="flex items-center justify-center gap-2 text-sm sm:text-base" style={{ color: T.MUTED }}>
              <span>{e}</span><span>{l}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}