import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, FileText, KeyRound, ShieldCheck, X } from "lucide-react";
import { vault, uid, type Note, type Credential, type SecureRecord } from "@/lib/vault";

export const Route = createFileRoute("/app/vault")({
  component: VaultPage,
});

type Tab = "notes" | "creds" | "records";

function VaultPage() {
  const [tab, setTab] = useState<Tab>("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [creds, setCreds] = useState<Credential[]>([]);
  const [records, setRecords] = useState<SecureRecord[]>([]);
  const [modal, setModal] = useState<null | Tab>(null);

  useEffect(() => {
    setNotes(vault.getNotes());
    setCreds(vault.getCreds());
    setRecords(vault.getRecords());
  }, []);

  const refresh = () => {
    setNotes(vault.getNotes());
    setCreds(vault.getCreds());
    setRecords(vault.getRecords());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Vault</h1>
          <p className="mt-1 text-muted-foreground">Notes, credentials and secure records — encrypted (demo).</p>
        </div>
        <button onClick={() => setModal(tab)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50">
          <Plus className="h-4 w-4" /> Add new
        </button>
      </div>

      <div className="flex gap-2 rounded-2xl glass p-1.5">
        {[
          { id: "notes", label: "Notes", icon: FileText },
          { id: "creds", label: "Credentials", icon: KeyRound },
          { id: "records", label: "Secure records", icon: ShieldCheck },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              tab === t.id ? "bg-primary/30 ring-1 ring-primary/50" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === "notes" && <NotesGrid items={notes} onChange={refresh} />}
          {tab === "creds" && <CredsGrid items={creds} onChange={refresh} />}
          {tab === "records" && <RecordsGrid items={records} onChange={refresh} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {modal === "notes" && <NoteModal close={() => { setModal(null); refresh(); }} />}
        {modal === "creds" && <CredModal close={() => { setModal(null); refresh(); }} />}
        {modal === "records" && <RecordModal close={() => { setModal(null); refresh(); }} />}
      </AnimatePresence>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="grid place-items-center rounded-3xl glass p-12 text-sm text-muted-foreground">No {label} yet.</div>;
}

function Card({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="group relative rounded-2xl glass p-5">
      <button onClick={onDelete} className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100">
        <Trash2 className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

function NotesGrid({ items, onChange }: { items: Note[]; onChange: () => void }) {
  if (items.length === 0) return <Empty label="notes" />;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((n) => (
        <Card key={n.id} onDelete={() => { vault.setNotes(items.filter((x) => x.id !== n.id)); vault.log(`Deleted note: ${n.title}`); onChange(); }}>
          <div className="font-display text-base font-semibold">{n.title}</div>
          <p className="mt-2 line-clamp-5 text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p>
          <div className="mt-3 text-[11px] text-muted-foreground">{new Date(n.updatedAt).toLocaleString()}</div>
        </Card>
      ))}
    </div>
  );
}

function CredsGrid({ items, onChange }: { items: Credential[]; onChange: () => void }) {
  const [shown, setShown] = useState<Record<string, boolean>>({});
  if (items.length === 0) return <Empty label="credentials" />;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <Card key={c.id} onDelete={() => { vault.setCreds(items.filter((x) => x.id !== c.id)); vault.log(`Deleted credential: ${c.website}`); onChange(); }}>
          <div className="flex items-center gap-2 font-display text-base font-semibold"><KeyRound className="h-4 w-4 text-cyan" /> {c.website}</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Username" value={c.username} />
            <Row
              label="Password"
              value={shown[c.id] ? c.password : "••••••••••"}
              actionIcon={shown[c.id] ? EyeOff : Eye}
              onAction={() => setShown((s) => ({ ...s, [c.id]: !s[c.id] }))}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

function RecordsGrid({ items, onChange }: { items: SecureRecord[]; onChange: () => void }) {
  if (items.length === 0) return <Empty label="secure records" />;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <Card key={r.id} onDelete={() => { vault.setRecords(items.filter((x) => x.id !== r.id)); vault.log(`Deleted record: ${r.name}`); onChange(); }}>
          <div className="font-display text-base font-semibold">{r.name}</div>
          <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
          <pre className="mt-3 max-h-32 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-cyan whitespace-pre-wrap">{r.data}</pre>
        </Card>
      ))}
    </div>
  );
}

function Row({ label, value, actionIcon: Icon, onAction }: { label: string; value: string; actionIcon?: any; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate">{value}</div>
      </div>
      {Icon && (
        <button onClick={onAction} className="rounded p-1.5 hover:bg-white/10"><Icon className="h-4 w-4" /></button>
      )}
    </div>
  );
}

// ---- Modals ----
function Modal({ title, close, children, onSave, canSave }: { title: string; close: () => void; children: React.ReactNode; onSave: () => void; canSave: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={close}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl glass-strong p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button onClick={close} className="rounded-lg p-2 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 space-y-3">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={close} className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
          <button disabled={!canSave} onClick={onSave} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Input({ label, value, onChange, type = "text", textarea = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className="mt-1.5 w-full rounded-xl bg-input/40 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-primary" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl bg-input/40 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-primary" />
      )}
    </label>
  );
}

function NoteModal({ close }: { close: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <Modal title="New note" close={close} canSave={!!title} onSave={() => {
      vault.setNotes([{ id: uid(), title, content, updatedAt: Date.now() }, ...vault.getNotes()]);
      vault.log(`Added note: ${title}`);
      close();
    }}>
      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Content" value={content} onChange={setContent} textarea />
    </Modal>
  );
}

function CredModal({ close }: { close: () => void }) {
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Modal title="New credential" close={close} canSave={!!website && !!username} onSave={() => {
      vault.setCreds([{ id: uid(), website, username, password, updatedAt: Date.now() }, ...vault.getCreds()]);
      vault.log(`Added credential: ${website}`);
      close();
    }}>
      <Input label="Website" value={website} onChange={setWebsite} />
      <Input label="Username" value={username} onChange={setUsername} />
      <Input label="Password" value={password} onChange={setPassword} type="password" />
    </Modal>
  );
}

function RecordModal({ close }: { close: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState("");
  return (
    <Modal title="New secure record" close={close} canSave={!!name} onSave={() => {
      vault.setRecords([{ id: uid(), name, description, data, updatedAt: Date.now() }, ...vault.getRecords()]);
      vault.log(`Added record: ${name}`);
      close();
    }}>
      <Input label="Name" value={name} onChange={setName} />
      <Input label="Description" value={description} onChange={setDescription} />
      <Input label="Data" value={data} onChange={setData} textarea />
    </Modal>
  );
}
