import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ScanFace, Loader2 } from "lucide-react";

type Props = {
  onCapture: (dataUrl: string) => void;
  label?: string;
  autoStart?: boolean;
};

export function WebcamCapture({ onCapture, label = "Capture Face", autoStart = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (!autoStart) return;
    let active = true;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e: any) {
        setError(e?.message ?? "Camera unavailable. You can still continue in demo mode.");
      }
    })();
    return () => {
      active = false;
      setStream((s) => {
        s?.getTracks().forEach((t) => t.stop());
        return null;
      });
    };
  }, [autoStart]);

  const snap = () => {
    setCapturing(true);
    const v = videoRef.current;
    let dataUrl = "";
    if (v && v.videoWidth) {
      const c = document.createElement("canvas");
      c.width = 320;
      c.height = 240;
      const ctx = c.getContext("2d")!;
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(v, 0, 0, c.width, c.height);
      dataUrl = c.toDataURL("image/jpeg", 0.7);
    } else {
      // fallback demo placeholder
      dataUrl = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect fill="#1e293b" width="320" height="240"/><text fill="#60a5fa" x="50%" y="50%" text-anchor="middle" font-family="sans-serif">Demo Face</text></svg>');
    }
    setTimeout(() => {
      setCapturing(false);
      onCapture(dataUrl);
    }, 1800);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass ring-glow">
        <video ref={videoRef} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
        {!stream && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Camera className="h-8 w-8" />
              <p className="text-xs">{error ?? "Starting camera…"}</p>
            </div>
          </div>
        )}
        {/* Scan overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-6 rounded-2xl border border-cyan/60" />
          <div className="absolute left-6 right-6 top-6 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
          {capturing && (
            <motion.div
              className="absolute inset-x-6 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_25px_rgba(34,211,238,0.9)]"
              initial={{ top: 24 }}
              animate={{ top: "calc(100% - 24px)" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          )}
          {/* Corners */}
          {["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 left-4 -rotate-90", "bottom-4 right-4 rotate-180"].map((p) => (
            <div key={p} className={`absolute h-5 w-5 ${p}`}>
              <div className="absolute left-0 top-0 h-px w-full bg-cyan" />
              <div className="absolute left-0 top-0 h-full w-px bg-cyan" />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={snap}
        disabled={capturing}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/50 disabled:opacity-60"
      >
        {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
        {capturing ? "Scanning…" : label}
      </button>
    </div>
  );
}
