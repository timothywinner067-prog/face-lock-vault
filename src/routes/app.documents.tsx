import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, FileText, ImageIcon, LayoutGrid, List } from "lucide-react";
import { vault, uid, type DocumentItem } from "@/lib/vault";

export const Route = createFileRoute("/app/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDocs(vault.getDocs()), []);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const next = [...vault.getDocs()];
    let pending = files.length;
    Array.from(files).forEach((f) => {
      if (!["application/pdf", "image/png", "image/jpeg"].includes(f.type)) {
        pending--;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        next.unshift({
          id: uid(),
          name: f.name,
          type: f.type,
          size: f.size,
          dataUrl: String(reader.result),
          uploadedAt: Date.now(),
        });
        vault.log(`Uploaded ${f.name}`);
        pending--;
        if (pending === 0) {
          vault.setDocs(next);
          setDocs(next);
        }
      };
      reader.readAsDataURL(f);
    });
  };

  const remove = (id: string) => {
    const next = docs.filter((d) => d.id !== id);
    vault.setDocs(next);
    setDocs(next);
    vault.log("Deleted document");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Documents</h1>
          <p className="mt-1 text-muted-foreground">PDF, PNG and JPG files saved to your vault.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl glass p-1">
            <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${view === "grid" ? "bg-primary/30" : "text-muted-foreground"}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-primary/30" : "text-muted-foreground"}`}><List className="h-4 w-4" /></button>
          </div>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50">
            <Upload className="h-4 w-4" /> Upload
          </button>
          <input ref={fileRef} type="file" multiple accept="application/pdf,image/png,image/jpeg" hidden onChange={(e) => onFiles(e.target.files)} />
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-sm text-muted-foreground"
      >
        Drag & drop files here, or click upload above.
      </div>

      {docs.length === 0 ? (
        <div className="grid place-items-center rounded-3xl glass p-12 text-sm text-muted-foreground">No documents yet.</div>
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {docs.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="group relative overflow-hidden rounded-2xl glass">
              <div className="aspect-[4/3] grid place-items-center bg-black/30">
                {d.type.startsWith("image/") ? (
                  <img src={d.dataUrl} alt={d.name} className="h-full w-full object-cover" />
                ) : (
                  <FileText className="h-12 w-12 text-cyan" />
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-semibold">{d.name}</div>
                <div className="text-xs text-muted-foreground">{(d.size / 1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => remove(d.id)} className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-destructive opacity-0 transition hover:bg-destructive/30 group-hover:opacity-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Uploaded</th><th /></tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t border-white/5">
                  <td className="flex items-center gap-2 px-4 py-3">
                    {d.type.startsWith("image/") ? <ImageIcon className="h-4 w-4 text-cyan" /> : <FileText className="h-4 w-4 text-cyan" />}
                    <span className="truncate">{d.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(d.size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(d.uploadedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(d.id)} className="rounded-lg p-1.5 hover:bg-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
