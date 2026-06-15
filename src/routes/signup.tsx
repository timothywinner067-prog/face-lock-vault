import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { WebcamCapture } from "@/components/WebcamCapture";
import { vault } from "@/lib/vault";
import { DemoNotice } from "@/components/DemoNotice";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your vault — FaceVault" }, { name: "description", content: "Register your face and a 4-digit PIN to access your FaceVault." }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [face, setFace] = useState<string | null>(null);

  const next = () => setStep((s) => s + 1);

  const finish = (img: string) => {
    setFace(img);
    vault.setUser({ name, email, pin, faceImage: img, createdAt: Date.now() });
    vault.log("Account created");
    vault.signIn();
    vault.log("Signed in");
    setStep(3);
    setTimeout(() => nav({ to: "/app" }), 1600);
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="relative w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl glass-strong"><ScanFace className="h-5 w-5 text-cyan" /></div>
          <span className="font-display text-xl font-bold">FaceVault</span>
        </div>
        <DemoNotice className="mx-auto mb-5 w-fit" />

        {/* Stepper */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[0,1,2].map((i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition ${step >= i ? "bg-primary" : "bg-white/15"}`} />
          ))}
        </div>

        <div className="rounded-3xl glass p-7">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h1 className="font-display text-2xl font-bold">Tell us about you</h1>
                <p className="mt-1 text-sm text-muted-foreground">Your account stays on this device.</p>
                <div className="mt-6 space-y-4">
                  <Field label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
                  <Field label="Email" value={email} onChange={setEmail} placeholder="jane@example.com" type="email" />
                </div>
                <button
                  disabled={!name || !email}
                  onClick={next}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/50 disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h1 className="font-display text-2xl font-bold">Create your 4-digit PIN</h1>
                <p className="mt-1 text-sm text-muted-foreground">You'll enter this after each face scan.</p>
                <div className="mt-8 flex justify-center gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`h-4 w-4 rounded-full border-2 ${pin.length > i ? "border-cyan bg-cyan shadow-[0_0_14px_var(--cyan)]" : "border-white/30"}`} />
                  ))}
                </div>
                <input
                  autoFocus
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="mt-4 w-full rounded-xl bg-input/40 px-4 py-3 text-center text-2xl tracking-[1em] outline-none ring-1 ring-white/10 focus:ring-primary"
                  placeholder="••••"
                />
                <button
                  disabled={pin.length !== 4}
                  onClick={next}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h1 className="font-display text-2xl font-bold">Capture your face</h1>
                <p className="mt-1 text-sm text-muted-foreground">We'll use this reference to verify you next time.</p>
                <div className="mt-6">
                  <WebcamCapture onCapture={finish} label="Capture & Create Vault" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/20 ring-2 ring-success">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </motion.div>
                <h2 className="mt-5 font-display text-2xl font-bold">Vault Created</h2>
                <p className="mt-1 text-sm text-muted-foreground">Taking you to your dashboard…</p>
                {face && <img src={face} alt="" className="mx-auto mt-4 h-16 w-16 rounded-full object-cover ring-2 ring-cyan" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Already have a vault?{" "}
          <Link to="/login" className="text-cyan hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl bg-input/40 px-4 py-3 outline-none ring-1 ring-white/10 transition focus:ring-primary"
      />
    </label>
  );
}
