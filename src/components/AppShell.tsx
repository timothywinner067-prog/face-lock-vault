import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Lock, FileText, ShieldCheck, Settings, LogOut,
  Bell, Search, ScanFace, Menu, X,
} from "lucide-react";
import { vault } from "@/lib/vault";
import { DemoNotice } from "@/components/DemoNotice";

const navItems: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/vault", label: "Vault", icon: Lock },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/security", label: "Security", icon: ShieldCheck },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<ReturnType<typeof vault.getUser>>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!vault.isAuthed()) {
      nav({ to: "/login" });
      return;
    }
    setUser(vault.getUser());
  }, [nav]);

  const logout = () => {
    vault.signOut();
    vault.log("Signed out");
    nav({ to: "/login" });
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/15 blur-[150px]" />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/5 bg-sidebar/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-5">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl glass-strong"><ScanFace className="h-5 w-5 text-cyan" /></div>
            <span className="font-display text-lg font-bold">FaceVault</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-primary/20 text-foreground ring-1 ring-primary/40" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <n.icon className={`h-4 w-4 ${active ? "text-cyan" : ""}`} />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3">
            <DemoNotice />
            <div className="flex items-center gap-3 rounded-xl glass p-3">
              <img src={user.faceImage} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">Vault unlocked</div>
              </div>
              <button onClick={logout} title="Sign out" className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-background/60 px-6 py-3 backdrop-blur-xl">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search vault…" className="w-full rounded-xl bg-white/5 py-2 pl-10 pr-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary" />
          </div>
          <button className="relative rounded-lg p-2 hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan" />
          </button>
          <img src={user.faceImage} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan" />
        </header>

        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
