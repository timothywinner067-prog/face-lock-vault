import { motion } from "framer-motion";
import { useState } from "react";
import { Delete } from "lucide-react";

type Props = {
  length?: number;
  onComplete: (pin: string) => void;
  error?: boolean;
  title?: string;
  subtitle?: string;
};

export function PinPad({ length = 4, onComplete, error = false, title = "Enter your PIN", subtitle = "Demo only — do not use a real PIN." }: Props) {
  const [pin, setPin] = useState("");

  const press = (d: string) => {
    if (pin.length >= length) return;
    const next = pin + d;
    setPin(next);
    if (next.length === length) {
      setTimeout(() => {
        onComplete(next);
        setPin("");
      }, 150);
    }
  };
  const back = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center">
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <motion.div
        key={error ? "err" : "ok"}
        animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="my-6 flex justify-center gap-3"
      >
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border-2 transition-all ${
              pin.length > i ? (error ? "border-destructive bg-destructive" : "border-cyan bg-cyan shadow-[0_0_14px_var(--cyan)]") : "border-white/30"
            }`}
          />
        ))}
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {["1","2","3","4","5","6","7","8","9"].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="h-14 rounded-2xl glass text-xl font-semibold transition active:scale-95 hover:bg-white/10"
          >
            {d}
          </button>
        ))}
        <div />
        <button onClick={() => press("0")} className="h-14 rounded-2xl glass text-xl font-semibold transition active:scale-95 hover:bg-white/10">0</button>
        <button onClick={back} className="h-14 rounded-2xl glass grid place-items-center transition active:scale-95 hover:bg-white/10">
          <Delete className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
