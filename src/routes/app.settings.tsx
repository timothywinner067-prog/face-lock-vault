import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScanFace, KeyRound, User as UserIcon, Trash2, Check } from "lucide-react";
import { vault } from "@/lib/vault";
import { WebcamCapture } from "@/components/WebcamCapture";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => vault.getUser());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [saved, setSaved] = useState("");
  const [recapture, setRecapture] = useState(false);

  useEffect(() => {
    const u = vault.getUser();
    setUser(u);
    if (u) { setName(u.name); setEmail(u.email); }
  }, []);

  if (!user) return null;

  const flash = (s: string) => { setSaved(s); setTimeout(() => setSaved(""), 1800); };

  const saveProfile = () => {
    vault.setUser({ ...user, name, email });
    vault.log("Updated profile");
    setUser({ ...user, name, email });
    flash("Profile updated");
  };

  const savePin = () => {
    if (pin.length !== 4) return;
    vault.setUser({ ...user, pin });
    vault.log("Changed PIN");
    setUser({ ...user, pin });
    setPin("");
    flash("PIN updated");
  };

  const onRecaptured = (img: string) => {
    vault.setUser({ ...user, faceImage: img });
    vault.log("Recaptured face");
    setUser({ ...user, faceImage: img });
    setRecapture(false);
    flash("Face updated");
  };

  const wipe = () => {
    if (!confirm("This permanently clears your vault on this device. Continue?")) return;
    vault.clearAll();
    nav({ to: "/" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your vault credentials and identity.</p>
        </div>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1 text-xs text-success ring-1 ring-success/40">
            <Check className="h-3.5 w-3.5" /> {saved}
          </motion.div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile */}
        <Section icon={UserIcon} title="Profile">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <button onClick={saveProfile} className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Save changes</button>
        </Section>

        {/* PIN */}
        <Section icon={KeyRound} title="Change PIN">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">New 4-digit PIN</span>
            <input
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="mt-1.5 w-full rounded-xl bg-input/40 px-4 py-3 text-center text-2xl tracking-[1em] outline-none ring-1 ring-white/10 focus:ring-primary"
              placeholder="••••"
            />
          </label>
          <button disabled={pin.length !== 4} onClick={savePin} className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Update PIN</button>
        </Section>

        {/* Face */}
        <Section icon={ScanFace} title="Face reference">
          {!recapture ? (
            <div className="flex items-center gap-4">
              <img src={user.faceImage} alt="" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-cyan" />
              <button onClick={() => setRecapture(true)} className="rounded-xl glass px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Recapture face</button>
            </div>
          ) : (
            <WebcamCapture onCapture={onRecaptured} label="Save new face" />
          )}
        </Section>

        {/* Danger */}
        <Section icon={Trash2} title="Danger zone" danger>
          <p className="text-sm text-muted-foreground">This wipes your account, vault, documents and history from this device. Cannot be undone.</p>
          <button onClick={wipe} className="mt-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground">Clear vault</button>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, danger }: { icon: any; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`rounded-3xl glass p-6 ${danger ? "ring-1 ring-destructive/30" : ""}`}>
      <div className="mb-4 flex items-center gap-2">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${danger ? "bg-destructive/20" : "bg-primary/20"}`}><Icon className={`h-4 w-4 ${danger ? "text-destructive" : "text-cyan"}`} /></div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl bg-input/40 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-primary" />
    </label>
  );
}
