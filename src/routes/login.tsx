import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, ArrowLeft, CheckCircle2 } from "lucide-react";
import { WebcamCapture } from "@/components/WebcamCapture";
import { PinPad } from "@/components/PinPad";
import { vault } from "@/lib/vault";
import { DemoNotice } from "@/components/DemoNotice";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FaceVault" }, { name: "description", content: "Verify your face and PIN to unlock your FaceVault." }] }),
  component: LoginPage,
});

type Stage = "face" | "verified" | "pin" | "unlocking" | "error";

function LoginPage() {
  const nav = useNavigate();
  const [stage, setStage] = useState<Stage>("face");
  const [error, setError] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof vault.getUser>>(null);

  useEffect(() => { setUser(vault.getUser()); }, []);

  if (user === null && typeof window !== "undefined" && !vault.getUser()) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="rounded-3xl glass p-8 text-center">
          <h2 className="font-display text-xl font-bold">No vault on this device</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create one in under a minute.</p>
          <Link to="/signup" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Create vault</Link>
        </div>
      </div>
    );
  }

  const onFaceCaptured = () => {
    // Simulate face match
    setStage("verified");
    setTimeout(() => setStage("pin"), 1300);
  };

  const onPin = (entered: string) => {
    const u = vault.getUser();
    if (!u) return;
    if (entered === u.pin) {
      setError(false);
      setStage("unlocking");
      vault.signIn();
      vault.log("Signed in");
      setTimeout(() => nav({ to: "/app" }), 1400);
    } else {
      setError(true);
      vault.log("Failed PIN attempt");
      setTimeout(() => setError(false), 600);
    }
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

        <div className="rounded-3xl glass p-7">
          <AnimatePresence mode="wait">
            {stage === "face" && (
              <motion.div key="face" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-center font-display text-2xl font-bold">Verify your face</h1>
                <p className="mt-1 text-center text-sm text-muted-foreground">Look at the camera and press scan.</p>
                <div className="mt-6">
                  <WebcamCapture onCapture={onFaceCaptured} label="Scan Face" />
                </div>
              </motion.div>
            )}

            {stage === "verified" && (
              <motion.div key="ver" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/20 ring-2 ring-success">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </motion.div>
                <h2 className="mt-5 font-display text-2xl font-bold">Identity Verified</h2>
                <p className="mt-1 text-sm text-muted-foreground">Face match score: 98.7%</p>
              </motion.div>
            )}

            {stage === "pin" && (
              <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PinPad onComplete={onPin} error={error} />
              </motion.div>
            )}

            {stage === "unlocking" && (
              <motion.div key="un" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} className="mx-auto h-20 w-20 rounded-full border-2 border-cyan border-t-transparent" />
                <h2 className="mt-5 font-display text-2xl font-bold">Unlocking vault…</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
