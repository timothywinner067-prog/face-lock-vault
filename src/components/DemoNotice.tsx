import { ShieldAlert } from "lucide-react";

export function DemoNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] text-amber-200 ${className}`}>
      <ShieldAlert className="h-3.5 w-3.5" />
      <span>Demo: facial verification & security are simulated, not real.</span>
    </div>
  );
}
