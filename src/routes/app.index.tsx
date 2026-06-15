import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, FileText, ShieldCheck, KeyRound, Activity, TrendingUp } from "lucide-react";
import { vault, type Activity as ActivityT } from "@/lib/vault";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ notes: 0, creds: 0, docs: 0, records: 0 });
  const [activity, setActivity] = useState<ActivityT[]>([]);
  const user = vault.getUser();
  const score = 92 + Math.floor(Math.random() * 7);
  const faceMatch = (97 + Math.random() * 2).toFixed(1);

  useEffect(() => {
    setStats({
      notes: vault.getNotes().length,
      creds: vault.getCreds().length,
      docs: vault.getDocs().length,
      records: vault.getRecords().length,
    });
    setActivity(vault.getActivity().slice(0, 6));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1>
        <p className="mt-1 text-muted-foreground">Your vault is secure and verified.</p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Notes", value: stats.notes, icon: FileText, color: "from-primary to-cyan" },
          { label: "Credentials", value: stats.creds, icon: KeyRound, color: "from-cyan to-accent" },
          { label: "Documents", value: stats.docs, icon: Lock, color: "from-accent to-primary" },
          { label: "Secure records", value: stats.records, icon: ShieldCheck, color: "from-primary to-accent" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl glass p-5">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-3xl font-bold">{c.value}</div>
            <div className="mt-0.5 text-sm text-muted-foreground">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Security panel */}
        <div className="rounded-3xl glass-strong p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan">Security</div>
              <h2 className="font-display text-xl font-bold">Vault status</h2>
            </div>
            <div className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/40">All systems normal</div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Gauge label="Security score" value={score} suffix="%" />
            <Gauge label="Face match" value={Number(faceMatch)} suffix="%" hue="cyan" />
          </div>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <Stat icon={ShieldCheck} label="Encryption" value="AES-256 (sim.)" />
            <Stat icon={TrendingUp} label="Security level" value="High" />
            <Stat icon={Activity} label="Last login" value="Just now" />
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-3xl glass p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan">Activity</div>
          <h2 className="font-display text-xl font-bold">Recent events</h2>
          <ul className="mt-4 space-y-3">
            {activity.length === 0 && <li className="text-sm text-muted-foreground">No recent activity yet.</li>}
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{a.action}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink to="/app/vault" title="Open vault" desc="Notes, credentials & records" />
        <QuickLink to="/app/documents" title="Upload document" desc="PDF, PNG or JPG" />
        <QuickLink to="/app/security" title="Security center" desc="Live encryption status" />
      </div>
    </div>
  );
}

function Gauge({ label, value, suffix, hue = "primary" }: { label: string; value: number; suffix?: string; hue?: "primary" | "cyan" }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-display text-2xl font-bold">{value}{suffix}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full ${hue === "cyan" ? "bg-gradient-to-r from-cyan to-accent" : "bg-gradient-to-r from-primary to-cyan"}`}
        />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/20"><Icon className="h-4 w-4 text-cyan" /></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded-2xl glass p-5 transition hover:bg-white/10">
      <div className="font-display text-base font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
      <div className="mt-3 text-xs font-semibold text-cyan opacity-0 transition group-hover:opacity-100">Open →</div>
    </Link>
  );
}
