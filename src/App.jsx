import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import {
  Leaf, Droplets, Package, ShieldCheck, Truck, Factory, MapPin, Phone, Mail,
  CheckCircle2, ChevronRight, Instagram, Facebook, Linkedin, MessageCircle, PlayCircle,
  Menu, X
} from "lucide-react";

/**
 * Organic Honey & Royal Jelly — Single-Page Product Presentation
 * ------------------------------------------------------------------
 * ✅ Fully responsive (mobile → desktop)
 * ✅ Full-bleed hero with autoplay slideshow
 * ✅ Smooth section reveal with Framer Motion
 * ✅ Product cards (Organic Honey & Royal Jelly)
 * ✅ "Farm → Market" timeline با QA/استاندارد و بسته‌بندی عمان
 * ✅ Gallery: marquee حرفه‌ای + lightbox (بدون پرش، hover/drag/pause)
 * ✅ Contact form + social links
 * ✅ Embedded Map
 */

// ------------------------ CONFIG ------------------------
const CONFIG = {
  company: "Melora",
  tagline: "From our apiaries to the world — certified, pure & organic.",
  email: "sales@meloraco.com",
  phone: "+968 9000 0000",
  address: "Muscat, Oman",
  map: { lat: 23.588, lng: 58.3829, zoom: 11 },
  markets: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
};

// ---------- LOCAL-ONLY ASSETS (no remote) ----------
const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const SLIDES = [
  { local: "images/slides/slide-1-hero.jpg", headline: "Bee to Bottle — Pure & Organic", sub: "Golden hues, floral notes, enzyme-rich goodness." },
  { local: "images/slides/slide-2-apiary.jpg", headline: "Craft & Care at the Apiary", sub: "Sustainably managed hives and gentle extraction." },
  { local: "images/slides/slide-3-oman-packaging.jpg", headline: "Certified & Packaged in Oman", sub: "Tested, standardized and prepared for GCC export." },
];

const GALLERY = [
  { local: "images/gallery/apiary-closeup.jpg" },
  { local: "images/gallery/oman-lab-testing.jpg" },
  { local: "images/gallery/honeycomb-macro.jpg" },
  { local: "images/gallery/jars-shelf.jpg" },
  { local: "images/gallery/packaging-line.jpg" },
  { local: "images/gallery/apiary-landscape.jpg" },
];

// پس‌زمینه‌ی اسلاید با فالبک شفاف (بدون ریموت)
function ImageBg({ local, active }) {
  const src = useMemo(() => asset(local), [local]);
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return (
    <img
      src={imgSrc}
      onError={() => setImgSrc(TRANSPARENT_PNG)}
      alt=""
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
    />
  );
}

// <img> عمومی برای محصولات/گالری (لوکال-only)
function ImgLocal({ src, alt, className }) {
  const resolved = useMemo(() => asset(src), [src]);
  const [s, setS] = useState(resolved);
  useEffect(() => setS(resolved), [resolved]);
  return (
    <img
      src={s}
      onError={() => setS(TRANSPARENT_PNG)}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

// Lightbox ساده با ناوبری
function Lightbox({ open, items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  const current = items[index];

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          onClick={onPrev}
          aria-label="Previous"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          onClick={onNext}
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="rounded-xl overflow-hidden bg-black/10">
          <ImgLocal
            src={current.local}
            alt="Gallery preview"
            className="w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

// Marquee حرفه‌ای بدون پرش + توقف روی Hover/Drag
function GalleryMarquee({ items, onCardClick, duration = 28 }) {
  const doubled = useMemo(() => [...items, ...items], [items]);
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  const start = useCallback(() => {
    if (prefersReducedMotion) return;
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration, ease: "linear", repeat: Infinity },
    });
  }, [controls, duration, prefersReducedMotion]);

  const stop = useCallback(() => controls.stop(), [controls]);

  useEffect(() => { start(); }, [start]);

  return (
    <div
      className="relative mt-8 overflow-hidden"
      // Edge fade
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,0), #000 6%, #000 94%, rgba(0,0,0,0))",
        maskImage:
          "linear-gradient(to right, rgba(0,0,0,0), #000 6%, #000 94%, rgba(0,0,0,0))",
      }}
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        animate={controls}
        drag="x"
        dragMomentum={false}
        onDragStart={stop}
        onDragEnd={start}
      >
        {doubled.map((img, i) => (
          <motion.button
            type="button"
            key={`${img.local}-${i}`}
            onClick={() => onCardClick?.(i % items.length)}
            whileHover={{ scale: 1.03 }}
            className="relative mr-4 shrink-0 rounded-2xl overflow-hidden border border-amber-100 shadow-sm bg-white/40 group"
          >
            <ImgLocal
              src={img.local}
              alt="Honey & packaging"
              className="h-[160px] w-[260px] sm:h-[224px] sm:w-[384px] object-cover"
            />
            {/* overlay لطیف هنگام hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// Small springy reveal helper
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ------------------------ MAIN PAGE ------------------------
export default function OrganicHoneyLandingPage() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const intervalRef = useRef(null);

  // sanity checks (سبک)
  useEffect(() => {
    console.assert(Array.isArray(SLIDES) && SLIDES.length >= 3, "SLIDES length");
    console.assert(Array.isArray(GALLERY) && GALLERY.length >= 6, "GALLERY length");
    console.assert(typeof CONFIG.company === "string" && CONFIG.company, "Company name");
  }, []);

  // Hero slideshow autoplay
  useEffect(() => {
    if (!autoplay) return;
    intervalRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => intervalRef.current && window.clearInterval(intervalRef.current);
  }, [autoplay]);

  // Progress bar restart on active change
  useEffect(() => {
    const bar = document.querySelector("#progressBar");
    if (bar && bar.classList) {
      bar.classList.remove("animate-progress");
      if (bar instanceof HTMLElement) void bar.offsetWidth;
      bar.classList.add("animate-progress");
    }
  }, [active]);

  // Smooth scroll for internal anchors + بستن منوی موبایل
  useEffect(() => {
    const handler = (e) => {
      const t = e.target;
      if (t && t.matches && t.matches('a[href^="#"]')) {
        e.preventDefault();
        const id = t.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Lightbox state
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const openLb = (i) => { setLbIndex(i); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);
  const prevLb = () => setLbIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  const nextLb = () => setLbIndex((i) => (i + 1) % GALLERY.length);

  return (
    <div className="min-h-screen w-full bg-amber-50/30 text-stone-900">
      {/* Sticky Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-amber-50/70 border-b border-amber-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-6 w-6" />
            <span>{CONFIG.company}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {[
              ["Story", "story"],
              ["Products", "products"],
              ["Quality", "quality"],
              ["Markets", "markets"],
              ["Gallery", "gallery"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:text-amber-700">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to Sales
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-amber-200 hover:bg-amber-100/60"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel - CSS transition */}
        <div
          className={`md:hidden overflow-hidden border-t border-amber-100 bg-amber-50/95 backdrop-blur transition-[max-height,opacity] duration-300 ${
            mobileOpen ? "opacity-100 max-h-[70vh]" : "opacity-0 max-h-0"
          }`}
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            {[
              ["Story", "story"],
              ["Products", "products"],
              ["Quality", "quality"],
              ["Markets", "markets"],
              ["Gallery", "gallery"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="py-2 rounded-xl px-3 hover:bg-amber-100/70"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
              onClick={() => setMobileOpen(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Talk to Sales
            </a>
          </div>
        </div>
      </header>

      {/* Bee stripes accent */}
      <div className="h-1.5 bg-[repeating-linear-gradient(45deg,#000000_0_12px,#f59e0b_12px_24px)]" />

      {/* HERO */}
      <section id="home" className="relative h-[92vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {SLIDES.map((s, i) => (
            <ImageBg key={i} local={s.local} active={i === active} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-amber-900/20 to-amber-800/10" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow" variants={fadeUp} initial="hidden" animate="show">
            {SLIDES[active].headline}
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg" variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
            {SLIDES[active].sub}
          </motion.p>
          <motion.div className="mt-8 flex flex-col sm:flex-row gap-3" variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
            <a href="#products" className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-5 py-3 text-stone-900 hover:bg-white">
              <ChevronRight className="h-4 w-4" /> Explore Products
            </a>
            <a href="#story" className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700">
              <PlayCircle className="h-4 w-4" /> Our Story
            </a>
          </motion.div>

          {/* controls */}
          <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-3">
            <button onClick={() => setAutoplay((v) => !v)} className="text-white/90 text-xs border border-white/30 rounded-full px-3 py-1 hover:bg-white/10">
              {autoplay ? "Pause" : "Play"}
            </button>
            <div className="w-40 h-1 bg-white/30 rounded overflow-hidden">
              <div id="progressBar" className="h-full bg-white/90 animate-progress" />
            </div>
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 w-2 rounded-full ${i === active ? "bg-white" : "bg-white/40 hover:bg-amber-50/70"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section id="story" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            From Farm to Global Markets
          </motion.h2>
          <motion.p className="mt-3 text-stone-600 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            We present our organic honey from its origin at the apiaries to premium retail shelves worldwide — with quality verified and packaging completed
            in Oman to meet national standards before export across the GCC and beyond.
          </motion.p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Leaf className="h-6 w-6" />, title: "Apiaries & Floral Sources", desc: "Single-origin and seasonal blends, managed with strict organic practices." },
              { icon: <Droplets className="h-6 w-6" />, title: "Gentle Harvesting & Filtration", desc: "Cold extraction preserves enzymes, aroma and natural goodness." },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Quality Testing in Oman", desc: "Each batch is tested and standardized in Oman according to national quality requirements prior to packaging." },
              { icon: <Factory className="h-6 w-6" />, title: "Packaging in Oman", desc: "State-of-the-art facility for retail and HoReCa formats with full traceability." },
              { icon: <Package className="h-6 w-6" />, title: "Retail-Ready Presentation", desc: "Premium jars, squeezers and gift boxes designed for international markets." },
              { icon: <Truck className="h-6 w-6" />, title: "Export & Distribution", desc: "Logistics optimized for the GCC — {UAE, KSA, Qatar, Kuwait, Bahrain, Oman} and wider global lanes." },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-amber-100/80 bg-white p-6 shadow-sm hover:shadow-md transition"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">{s.icon}</div>
                <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="relative py-20 sm:py-28 bg-gradient-to-b from-amber-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Our Products
          </motion.h2>
          <motion.p className="mt-3 text-stone-600 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            We specialize in two premium lines: certified organic honey and fresh royal jelly. Both are tested in Oman, standardized to meet national requirements,
            and packaged for GCC retail and hospitality channels.
          </motion.p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Organic Honey */}
            <motion.article className="rounded-3xl overflow-hidden border border-amber-100/80 bg-white shadow-sm" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
              <figure className="relative aspect-[16/9] overflow-hidden">
                <ImgLocal src="images/products/organic-honey-jar.jpg" alt="Organic honey jar" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              </figure>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Organic Honey</h3>
                <p className="mt-2 text-sm text-stone-600">Raw, unblended, and traceable. Available in monofloral and seasonal blends with clean, elegant packaging for international shelves.</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {["Lab-tested for purity and origin", "Cold-filtered to preserve enzymes and aroma", "Retail (250g/400g/1kg) & HoReCa formats"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>

            {/* Royal Jelly */}
            <motion.article className="rounded-3xl overflow-hidden border border-amber-100/80 bg-white shadow-sm" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
              <figure className="relative aspect-[16/9] overflow-hidden">
                <ImgLocal src="images/products/royal-jelly-spoon.jpg" alt="Fresh royal jelly on a spoon" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              </figure>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Royal Jelly</h3>
                <p className="mt-2 text-sm text-stone-600">Fresh royal jelly handled with strict cold-chain. Packed in insulated units ideal for pharmacies, specialty retail and wellness formats.</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {["Chilled distribution and storage", "Batch testing in Oman before release", "Custom private-label available"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* QUALITY & CERTS */}
      <section id="quality" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Quality, Standards & Traceability
          </motion.h2>
          <motion.p className="mt-3 text-stone-600 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Our honey and royal jelly undergo laboratory testing in Oman and are standardized to comply with national requirements prior to final packaging.
            Each batch receives a traceable ID that links back to apiary, season and lab reports.
          </motion.p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "Laboratory Tested", desc: "Purity, authenticity and safety checks performed for every batch." },
              { title: "Standardized in Oman", desc: "Quality verified according to Oman’s national standards before packaging." },
              { title: "Traceable by Batch", desc: "Full visibility from apiary to retail with digital batch IDs." },
            ].map((card, i) => (
              <motion.div key={i} className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
                <h3 className="font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS (GCC) */}
      <section id="markets" className="relative py-20 sm:py-28 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Built for GCC Markets
          </motion.h2>
          <motion.p className="mt-3 text-white/80 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Our initial focus is the Gulf Cooperation Council. We tailor formats, labeling and logistics to the requirements of retailers and distributors across the region.
          </motion.p>

          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {CONFIG.markets.map((m) => (
              <div key={m} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
                <span className="text-sm font-medium">{m}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold">Distribution & Private Label</h3>
            <p className="mt-2 text-white/80 text-sm">We welcome partnerships with regional distributors and modern trade. Private label and bespoke blends are available on request.</p>
            <a href="#contact" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-stone-900 hover:bg-amber-400">
              Start a Conversation <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* GALLERY — Marquee + Lightbox */}
      <section id="gallery" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Visuals & Packaging
          </motion.h2>
          <motion.p className="mt-3 text-stone-600 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            A selection of imagery from our apiaries, lab, packaging and shelf-ready formats.
          </motion.p>

          <GalleryMarquee items={GALLERY} onCardClick={openLb} duration={28} />
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lbOpen}
          items={GALLERY}
          index={lbIndex}
          onClose={closeLb}
          onPrev={prevLb}
          onNext={nextLb}
        />
      </section>

      {/* CONTACT + MAP */}
      <section id="contact" className="relative py-20 sm:py-28 bg-gradient-to-b from-white to-amber-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-3xl sm:text-4xl font-bold" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Contact Us
          </motion.h2>
          <motion.p className="mt-3 text-stone-600 max-w-3xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
            Tell us about your needs — distribution, private label, or bulk supply.
          </motion.p>

          <div className="mt-10 grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2 space-y-4">
              <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" /> {CONFIG.email}</div>
                <div className="mt-2 flex items-center gap-2 text-sm"><Phone className="h-4 w-4" /> {CONFIG.phone}</div>
                <div className="mt-2 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> {CONFIG.address}</div>
                <div className="mt-4 flex items-center gap-3">
                  <a aria-label="Instagram" href="#" className="p-2 rounded-xl border border-amber-100 hover:bg-amber-50"><Instagram className="h-4 w-4" /></a>
                  <a aria-label="Facebook" href="#" className="p-2 rounded-xl border border-amber-100 hover:bg-amber-50"><Facebook className="h-4 w-4" /></a>
                  <a aria-label="LinkedIn" href="#" className="p-2 rounded-xl border border-amber-100 hover:bg-amber-50"><Linkedin className="h-4 w-4" /></a>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! We'll get back to you shortly.");
                }}
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm space-y-3"
              >
                <div>
                  <label className="text-sm">Name</label>
                  <input required className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input type="email" required className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-sm">Message</label>
                  <textarea rows={4} className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700">
                  Send Message
                </button>
                <p className="text-xs text-stone-500">
                  Or email us directly at <a className="underline" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
                </p>
              </form>
            </div>

            {/* Map */}
            <div className="md:col-span-3 rounded-2xl overflow-hidden border border-amber-100 shadow-sm min-h-[360px] bg-white">
              <iframe
                title="Company Location"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${CONFIG.map.lat},${CONFIG.map.lng}&z=${CONFIG.map.zoom}&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-semibold"><Leaf className="h-5 w-5" /> {CONFIG.company}</div>
              <p className="mt-2 text-sm text-stone-600 max-w-lg">{CONFIG.tagline}</p>
            </div>
            <div className="text-sm text-stone-500">© {new Date().getFullYear()} {CONFIG.company}. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Tailwind helpers */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-progress { animation: progress 5s linear forwards; }
        @keyframes progress { from { width: 0% } to { width: 100% } }
        .honey-ring { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15); }
      `}</style>
    </div>
  );
}
