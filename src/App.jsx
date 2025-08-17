import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Droplets,
  Package,
  ShieldCheck,
  Truck,
  Factory,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  PlayCircle,
} from "lucide-react";

/**
 * Organic Honey & Royal Jelly — Single-Page Product Presentation
 * ------------------------------------------------------------------
 * ✅ Fully responsive (mobile → desktop)
 * ✅ Full-bleed hero with autoplay slideshow
 * ✅ Smooth section reveal with Framer Motion
 * ✅ Product cards (Organic Honey & Royal Jelly)
 * ✅ "Farm → Market" timeline with Oman QA/standardization & packaging
 * ✅ GCC focus section (target markets)
 * ✅ Gallery (swipeable on mobile)
 * ✅ Contact form + social links
 * ✅ Embedded map (replace coordinates/address as needed)
 * ✅ Clean SEO tags & JSON-LD (if used in Next.js/Head, comment included)
 *
 * Notes:
 * - Fix for SyntaxError at (134:47): wrong CSS selector quotes in smooth-scroll (now 'a[href^="#"]').
 * - Removed TypeScript-only syntax so the file parses in plain JS/JSX.
 * - Kept prior self-tests and added a few more safety checks.
 */

// ------------------------ CONFIG ------------------------
const CONFIG = {
  company: "Al-Khaleej Naturals",
  tagline: "From our apiaries to the world — certified, pure & organic.",
  email: "sales@alkhaleejnaturals.com",
  phone: "+968 9000 0000",
  address: "Muscat, Oman",
  map: {
    // Muscat (placeholder). Replace with your exact coordinates.
    lat: 23.588,
    lng: 58.3829,
    zoom: 11,
  },
  markets: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
};

// ---------- ASSET + DATA + PER-IMAGE FALLBACK (robust) ----------

// BASE-aware برای GitHub Pages (base=/honey-site/)
const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

// اسلایدها: فقط نسبت به public/ بنویس (یعنی images/... نه public/images/...)
const SLIDES = [
  {
    local: "images/slides/slide-1-hero.jpg",
    remote:
      "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1600&auto=format&fit=crop",
    headline: "Bee to Bottle — Pure & Organic",
    sub: "Golden hues, floral notes, enzyme-rich goodness.",
  },
  {
    local: "images/slides/slide-2-apiary.jpg",
    remote:
      "https://images.unsplash.com/photo-1519160558534-5790a5e4a3b1?q=80&w=1600&auto=format&fit=crop",
    headline: "Craft & Care at the Apiary",
    sub: "Sustainably managed hives and gentle extraction.",
  },
  {
    local: "images/slides/slide-3-oman-packaging.jpg",
    remote:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
    headline: "Certified & Packaged in Oman",
    sub: "Tested, standardized and prepared for GCC export.",
  },
];

const GALLERY = [
  {
    local: "images/gallery/apiary-closeup.jpg",
    remote:
      "https://images.unsplash.com/photo-1519160558534-5790a5e4a3b1?q=80&w=1400&auto=format&fit=crop",
  },
  {
    local: "images/gallery/oman-lab-testing.jpg",
    remote:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1400&auto=format&fit=crop",
  },
  {
    local: "images/gallery/honeycomb-macro.jpg",
    remote:
      "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1400&auto=format&fit=crop",
  },
  {
    local: "images/gallery/jars-shelf.jpg",
    remote:
      "https://images.unsplash.com/photo-1472586662442-3eec04b9dbda?q=80&w=1400&auto=format&fit=crop",
  },
  {
    local: "images/gallery/packaging-line.jpg",
    remote:
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1400&auto=format&fit=crop",
  },
  {
    local: "images/gallery/apiary-landscape.jpg",
    remote:
      "https://images.unsplash.com/photo-1519092528346-59a5bb6ec191?q=80&w=1400&auto=format&fit=crop",
  },
];

// کمک کوچک برای پس‌زمینه‌ی اسلاید با fallback خودکار
function ImageBg({ local, remote, active }) {
  const [src, setSrc] = React.useState(asset(local));

  // هر بار اسلاید عوض شد/مسیر عوض شد، دوباره تلاش کن از لوکال شروع کنی
  React.useEffect(() => {
    setSrc(asset(local));
  }, [local]);

  return (
    <img
      src={src}
      onError={() => setSrc(remote)} // اگر لوکال نبود → ریموت
      alt=""
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      // نکته: چون img است، هم در Dev و هم در Pages درست عمل می‌کند
    />
  );
}

// Small springy reveal helper (سر جایش بماند)
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};


// ------------------------ MAIN PAGE ------------------------
export default function OrganicHoneyLandingPage() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef(null);

  // --- Lightweight runtime sanity checks ("tests") ---
  useEffect(() => {
    // Existing tests (kept)
    console.assert(Array.isArray(SLIDES) && SLIDES.length >= 3, "SLIDES should have at least 3 items");
    console.assert(Array.isArray(GALLERY) && GALLERY.length >= 6, "GALLERY should have at least 6 items");
    console.assert(typeof CONFIG.map.lat === "number" && CONFIG.map.lat >= -90 && CONFIG.map.lat <= 90, "Map latitude invalid");
    console.assert(typeof CONFIG.map.lng === "number" && CONFIG.map.lng >= -180 && CONFIG.map.lng <= 180, "Map longitude invalid");
    console.assert(typeof CONFIG.company === "string" && CONFIG.company.length > 0, "Company name required");

    // Additional tests
    const urlRegex = /^https?:\/\//i;
    console.assert(SLIDES.every(s => typeof s.src === "string" && urlRegex.test(s.src)), "Each SLIDE must have a valid src URL");
    console.assert(SLIDES.every(s => typeof s.headline === "string" && s.headline.length > 0), "Each SLIDE must have a headline");
    console.assert(GALLERY.every(u => typeof u === "string" && urlRegex.test(u)), "GALLERY items must be URLs");
    setTimeout(() => {
      const bar = document.getElementById("progressBar");
      console.assert(!!bar, "#progressBar element should exist in DOM");
    }, 0);
  }, []);

  // Hero slideshow autoplay
  useEffect(() => {
    if (!autoplay) return;
    intervalRef.current = window.setInterval(() => {
      setActive(i => (i + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [autoplay]);

  // Progress for the active slide (simple CSS animation trigger)
  useEffect(() => {
    const bar = document.querySelector("#progressBar");
    if (bar && bar.classList) {
      bar.classList.remove("animate-progress");
      // Force reflow to restart the animation
      if (bar instanceof HTMLElement) void bar.offsetWidth;
      bar.classList.add("animate-progress");
    }
  }, [active]);

  // Smooth scrolling for internal anchors
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      if (target && target.matches && target.matches('a[href^="#"]')) {
        e.preventDefault();
        const id = target.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const slide = SLIDES[active];

  // Local assets fallback logic
  const [useFallback, setUseFallback] = useState(false);
  useEffect(() => {
    const locals = [
      ...SLIDES.map((s) => asset(s.local)),
      asset("images/products/organic-honey-jar.jpg"),
      asset("images/products/royal-jelly-spoon.jpg"),
      ...GALLERY.map((g) => asset(g.local)),
    ];
    let switched = false;
    locals.forEach((u) => {
      const img = new Image();
      img.onerror = () => {
        if (!switched) setUseFallback(true);
        switched = true;
      };
      img.src = u;
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-amber-50/30 text-stone-900">
      {/* Sticky Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-amber-50/70 border-b border-amber-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-6 w-6" />
            <span>{CONFIG.company}</span>
          </a>
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
        </div>
      </header>

      {/* Bee stripes accent */}
      <div className="h-1.5 bg-[repeating-linear-gradient(45deg,#000000_0_12px,#f59e0b_12px_24px)]" />

      {/* HERO */}
      <section id="home" className="relative h-[92vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {/* Background slides */}
          {SLIDES.map((s, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${useFallback ? s.remote : asset(s.local)})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-amber-900/20 to-amber-800/10" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {slide.headline}
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {slide.sub}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-5 py-3 text-stone-900 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" /> Explore Products
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700"
            >
              <PlayCircle className="h-4 w-4" /> Our Story
            </a>
          </motion.div>

          {/* controls */}
          <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-3">
            <button
              onClick={() => setAutoplay(v => !v)}
              className="text-white/90 text-xs border border-white/30 rounded-full px-3 py-1 hover:bg-white/10"
            >
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
                  className={`h-2 w-2 rounded-full ${
                    i === active ? "bg-white" : "bg-white/40 hover:bg-amber-50/70"
                  }`}
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
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            From Farm to Global Markets
          </motion.h2>
          <motion.p
            className="mt-3 text-stone-600 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            We present our organic honey from its origin at the apiaries to premium
            retail shelves worldwide — with quality verified and packaging completed
            in Oman to meet national standards before export across the GCC and beyond.
          </motion.p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Leaf className="h-6 w-6" />,
                title: "Apiaries & Floral Sources",
                desc: "Single-origin and seasonal blends, managed with strict organic practices.",
              },
              {
                icon: <Droplets className="h-6 w-6" />,
                title: "Gentle Harvesting & Filtration",
                desc: "Cold extraction preserves enzymes, aroma and natural goodness.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Quality Testing in Oman",
                desc: "Each batch is tested and standardized in Oman according to national quality requirements prior to packaging.",
              },
              {
                icon: <Factory className="h-6 w-6" />,
                title: "Packaging in Oman",
                desc: "State‑of‑the‑art facility for retail and HoReCa formats with full traceability.",
              },
              {
                icon: <Package className="h-6 w-6" />,
                title: "Retail‑Ready Presentation",
                desc: "Premium jars, squeezers and gift boxes designed for international markets.",
              },
              {
                icon: <Truck className="h-6 w-6" />,
                title: "Export & Distribution",
                desc: "Logistics optimized for the GCC — {UAE, KSA, Qatar, Kuwait, Bahrain, Oman} and wider global lanes.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-amber-100/80 bg-white p-6 shadow-sm hover:shadow-md transition"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  {s.icon}
                </div>
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
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Our Products
          </motion.h2>
          <motion.p
            className="mt-3 text-stone-600 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            We specialize in two premium lines: certified organic honey and fresh royal jelly.
            Both are tested in Oman, standardized to meet national requirements, and packaged
            for GCC retail and hospitality channels.
          </motion.p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Organic Honey */}
            <motion.div
              className="rounded-3xl overflow-hidden border border-amber-100/80 bg-white shadow-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${useFallback ? "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1600&auto=format&fit=crop" : asset("images/products/organic-honey-jar.jpg")})`,
                }}
                role="img"
                aria-label="Jar of organic honey"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">Organic Honey</h3>
                <p className="mt-2 text-sm text-stone-600">
                  Raw, unblended, and traceable. Available in monofloral and seasonal blends
                  with clean, elegant packaging for international shelves.
                </p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {[
                    "Lab-tested for purity and origin",
                    "Cold-filtered to preserve enzymes and aroma",
                    "Retail (250g/400g/1kg) & HoReCa formats",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Royal Jelly */}
            <motion.div
              className="rounded-3xl overflow-hidden border border-amber-100/80 bg-white shadow-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${useFallback ? "https://images.unsplash.com/photo-1580931880627-268c0c7561c6?q=80&w=1600&auto=format&fit=crop" : asset("images/products/royal-jelly-spoon.jpg")})`,
                }}
                role="img"
                aria-label="Fresh royal jelly in a spoon"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">Royal Jelly</h3>
                <p className="mt-2 text-sm text-stone-600">
                  Fresh royal jelly handled with strict cold-chain. Packed in insulated
                  units ideal for pharmacies, specialty retail and wellness formats.
                </p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {[
                    "Chilled distribution and storage",
                    "Batch testing in Oman before release",
                    "Custom private-label available",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUALITY & CERTS */}
      <section id="quality" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Quality, Standards & Traceability
          </motion.h2>
          <motion.p
            className="mt-3 text-stone-600 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Our honey and royal jelly undergo laboratory testing in Oman and are
            standardized to comply with national requirements prior to final packaging.
            Each batch receives a traceable ID that links back to apiary, season and
            lab reports.
          </motion.p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Laboratory Tested",
                desc: "Purity, authenticity and safety checks performed for every batch.",
              },
              {
                title: "Standardized in Oman",
                desc: "Quality verified according to Oman’s national standards before packaging.",
              },
              {
                title: "Traceable by Batch",
                desc: "Full visibility from apiary to retail with digital batch IDs.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
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
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Built for GCC Markets
          </motion.h2>
          <motion.p
            className="mt-3 text-white/80 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Our initial focus is the Gulf Cooperation Council. We tailor formats, labeling
            and logistics to the requirements of retailers and distributors across the region.
          </motion.p>

          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {CONFIG.markets.map((m) => (
              <div
                key={m}
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center"
              >
                <span className="text-sm font-medium">{m}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold">Distribution & Private Label</h3>
            <p className="mt-2 text-white/80 text-sm">
              We welcome partnerships with regional distributors and modern trade. Private
              label and bespoke blends are available on request.
            </p>
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-stone-900 hover:bg-amber-400"
            >
              Start a Conversation <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Visuals & Packaging
          </motion.h2>
          <motion.p
            className="mt-3 text-stone-600 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            A selection of imagery from our apiaries, lab, packaging and shelf‑ready formats.
          </motion.p>

          <div className="mt-8 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max">
              {GALLERY.map((img, i) => (
                <motion.img
                  key={i}
                  src={useFallback ? img.remote : asset(img.local)}
                  alt="Honey and packaging gallery"
                  className="h-56 w-96 object-cover rounded-2xl border border-amber-100 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT + MAP */}
      <section id="contact" className="relative py-20 sm:py-28 bg-gradient-to-b from-white to-amber-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            Contact Us
          </motion.h2>
          <motion.p
            className="mt-3 text-stone-600 max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
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
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                >
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
              <p className="mt-2 text-sm text-stone-600 max-w-lg">
                {CONFIG.tagline}
              </p>
            </div>
            <div className="text-sm text-stone-500">
              © {new Date().getFullYear()} {CONFIG.company}. All rights reserved.
            </div>
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

      {/* OPTIONAL SEO (uncomment if you use a <Head> in Next.js) */}
      {false && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: CONFIG.company,
              url: "https://example.com",
              contactPoint: [{
                "@type": "ContactPoint",
                email: CONFIG.email,
                telephone: CONFIG.phone,
                contactType: "sales",
                areaServed: CONFIG.markets,
              }],
            }),
          }}
        />
      )}
    </div>
  );
}
