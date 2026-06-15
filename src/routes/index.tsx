import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ScanFace, ShieldCheck, Lock, FileText, KeyRound, Smartphone, Sparkles,
  ArrowRight, Play, CheckCircle2, Star,
} from "lucide-react";
import { Particles } from "@/components/Particles";
import { DemoNotice } from "@/components/DemoNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FaceVault — Store Your Data Using Your Face" },
      { name: "description", content: "Next-generation cloud vault secured by biometric identity and a 4-digit PIN. Built as a demo prototype." },
      { property: "og:title", content: "FaceVault — Your Identity. Your Vault. Your Control." },
      { property: "og:description", content: "A next-generation secure storage platform powered by biometric identity and PIN verification." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: ScanFace, title: "Facial Verification", desc: "Biometric identity check with simulated AI face scanning." },
  { icon: KeyRound, title: "PIN Protection", desc: "Four-digit personal vault key with shake-on-fail feedback." },
  { icon: Lock, title: "Encrypted Vault", desc: "Vault simulation with security level + face match scores." },
  { icon: FileText, title: "Secure Notes", desc: "Capture private notes, credentials and secure records." },
  { icon: ShieldCheck, title: "Document Storage", desc: "Upload PDFs, PNGs and JPGs into your private vault." },
  { icon: Smartphone, title: "Device Recognition", desc: "Sessions tracked per device with full activity history." },
];

const steps = [
  { n: "01", title: "Register Face", desc: "Open your camera and capture a reference face frame." },
  { n: "02", title: "Create PIN", desc: "Choose a memorable 4-digit personal vault key." },
  { n: "03", title: "Store Data", desc: "Add notes, credentials, records and documents." },
  { n: "04", title: "Access Securely", desc: "Face scan + PIN unlock — every session." },
];

const stats = [
  { v: "50,000+", l: "Verified users" },
  { v: "1M+", l: "Files protected" },
  { v: "99.9%", l: "Security score" },
  { v: "24/7", l: "Availability" },
];

const testimonials = [
  { name: "Amelia Chen", role: "Security Lead, Northwind", quote: "FaceVault changed how our team thinks about identity. The face-first flow is delightful." },
  { name: "Marcus Patel", role: "CTO, Helios Labs", quote: "Cleanest biometric-style onboarding I've seen. The scanner animation alone sells it." },
  { name: "Sofia García", role: "Founder, Lumen", quote: "It feels like Apple meets a SOC dashboard. Our investors loved the demo." },
];

const plans = [
  { name: "Starter", price: "$0", desc: "For personal vaults", features: ["1 device", "Up to 50 items", "Face + PIN unlock"] },
  { name: "Pro", price: "$12", desc: "For power users", features: ["5 devices", "Unlimited items", "Document storage", "Activity history"], featured: true },
  { name: "Enterprise", price: "Custom", desc: "For teams & orgs", features: ["SSO simulation", "Team vaults", "Audit logs", "Priority support"] },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-[600px] right-0 h-[400px] w-[600px] rounded-full bg-cyan/15 blur-[120px]" />

      {/* NAV */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl glass-strong">
              <ScanFace className="h-5 w-5 text-cyan" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">FaceVault</span>
          </Link>
          <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-block">Sign in</Link>
            <Link to="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/50">Get started</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <Particles count={50} />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-2 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <DemoNotice className="mb-5 w-fit" />
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Store your data <br /> using <span className="text-gradient">your face.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              A next-generation secure storage platform powered by biometric identity and PIN verification. Built for humans who hate passwords.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition hover:shadow-primary/60">
                Get Started <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 font-semibold hover:bg-white/10">
                <Play className="h-4 w-4" /> Watch Demo
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No password</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No backend</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> 100% local</div>
            </div>
          </motion.div>

          {/* 3D card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <motion.div
              animate={{ rotateY: [0, 8, -8, 0], rotateX: [0, -4, 4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[16/10] rounded-3xl glass-strong p-6 ring-glow"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan/40 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-primary/50 blur-3xl" />
              </div>
              <div className="relative flex h-full flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <ScanFace className="h-5 w-5 text-cyan" />
                    </div>
                    <div className="text-sm font-semibold tracking-wide">FACEVAULT ID</div>
                  </div>
                  <div className="text-xs text-white/60">v.2026</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold tracking-wider">•••• •••• •••• 4892</div>
                  <div className="mt-2 flex justify-between text-xs text-white/70">
                    <span>HOLDER<br /><span className="text-white">YOUR NAME</span></span>
                    <span>SECURITY<br /><span className="text-success">99.9%</span></span>
                  </div>
                </div>
              </div>
              {/* scan line */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent animate-scanline" />
              </div>
            </motion.div>
            {/* floating bubbles */}
            <div className="absolute -right-6 -top-6 h-16 w-16 animate-float rounded-2xl glass grid place-items-center">
              <Lock className="h-6 w-6 text-cyan" />
            </div>
            <div className="absolute -bottom-6 -left-6 h-16 w-16 animate-float rounded-2xl glass grid place-items-center" style={{ animationDelay: "1.5s" }}>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan">Features</div>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Everything you need to vault your life</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">A complete identity + storage layer — visualized as a premium SaaS prototype.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl glass p-6"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition group-hover:bg-primary/30" />
              <div className="relative">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-cyan/30 ring-1 ring-white/10">
                  <f.icon className="h-6 w-6 text-cyan" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan">How it works</div>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Four steps to your vault</h2>
        </div>
        <div className="relative grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-3xl glass p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/20 ring-2 ring-primary/40">
                <span className="font-display font-bold text-cyan">{s.n}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-3 rounded-3xl glass-strong p-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl font-extrabold text-gradient">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan">Loved by teams</div>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Trusted by security-first builders</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className="rounded-3xl glass p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${["from-primary to-cyan","from-cyan to-accent","from-accent to-primary"][i]}`}>
                  <span className="font-semibold">{t.name[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan">Pricing</div>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Simple, transparent plans</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-7 ${p.featured ? "glass-strong ring-1 ring-primary/50" : "glass"}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">Most popular</div>
              )}
              <div className="font-display text-lg font-semibold">{p.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold">{p.price}</span>
                {p.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((ft) => (
                  <li key={ft} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {ft}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition ${p.featured ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-primary/60" : "glass hover:bg-white/10"}`}>
                Choose {p.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 text-center ring-glow">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan/30 blur-3xl" />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold md:text-4xl">Your identity. Your vault. Your control.</h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Try the FaceVault prototype now — capture your face, set a PIN, and lock your data away.</p>
            <Link to="/signup" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-primary/40 hover:shadow-primary/60">
              Create your vault <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-muted-foreground">
        © 2026 FaceVault — Demo prototype. Not for production security use.
      </footer>
    </div>
  );
}
