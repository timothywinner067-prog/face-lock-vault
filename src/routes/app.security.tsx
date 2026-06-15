import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, ScanFace, Activity } from "lucide-react";
import { vault, type Activity as ActivityT } from "@/lib/vault";

export const Route = createFileRoute("/app/security")({
  component: SecurityPage,
});

function SecurityPage() {
  const [activity, setActivity] = useState<ActivityT[]>([]);
  const stats = {
    score: 92 + Math.floor(Math.random() * 7),
    faceMatch: 96 + Math.random() * 3,
    sessions: 1 + Math.floor(Math.random() * 4),
  };
  useEffect(() => setActivity(vault.getActivity()), []);

  // mock 7-day chart
  const days = Array.from({ length: 14 }, () => 40 + Math.floor(Math.random() * 55));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Security Center</h1>
        <p className="mt-1 text-muted-foreground">Live (simulated) view of your vault's protection layer.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Tile icon={ShieldCheck} title="Security score" value={`${stats.score}%`} sub="High" />
        <Tile icon={ScanFace} title="Face match" value={`${stats.faceMatch.toFixed(1)}%`} sub="Verified" />
        <Tile icon={Lock} title="Encryption" value="AES-256" sub="Simulated" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl glass-strong p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Auth events (14 days)</h2>
          <div className="mt-6 flex h-44 items-end gap-2">
            {days.map((v, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ duration: 0.6, delay: i * 0.03 }} className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-cyan" />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>14d ago</span><span>today</span>
          </div>
        </div>

        <div className="rounded-3xl glass p-6">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-cyan" /><h2 className="font-display text-lg font-bold">Session history</h2></div>
          <ul className="mt-4 space-y-3 text-sm">
            {activity.slice(0, 8).map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{a.action}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                </div>
              </li>
            ))}
            {activity.length === 0 && <li className="text-muted-foreground">No events yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, title, value, sub }: { icon: any; title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20"><Icon className="h-5 w-5 text-cyan" /></div>
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="font-display text-xl font-bold">{value}</div>
        </div>
      </div>
      <div className="mt-3 inline-flex rounded-full bg-success/20 px-2.5 py-0.5 text-xs text-success ring-1 ring-success/40">{sub}</div>
    </div>
  );
}
