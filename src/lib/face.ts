// Lightweight perceptual face hashing for the demo.
// Not a real biometric system — uses a 16x16 average-hash of the captured frame
// so the same person in similar framing/lighting reliably matches.

const SIZE = 16; // 16x16 = 256 bits

export async function computeFaceHash(dataUrl: string): Promise<string> {
  if (typeof window === "undefined") return "";
  const img = await loadImage(dataUrl);
  const c = document.createElement("canvas");
  c.width = SIZE;
  c.height = SIZE;
  const ctx = c.getContext("2d")!;
  // Center-crop to a square focusing the middle of the frame (face area)
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const grays: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    grays.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  const avg = grays.reduce((a, b) => a + b, 0) / grays.length;
  return grays.map((g) => (g >= avg ? "1" : "0")).join("");
}

export function hammingDistance(a: string, b: string): number {
  if (!a || !b || a.length !== b.length) return Number.POSITIVE_INFINITY;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

export function similarityScore(a: string, b: string): number {
  const d = hammingDistance(a, b);
  if (!Number.isFinite(d)) return 0;
  return Math.max(0, 1 - d / a.length);
}

// Threshold tuned for the 256-bit aHash above.
// ~80% similarity = same person in similar lighting/framing.
export const MATCH_THRESHOLD = 0.78;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
