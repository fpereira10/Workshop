export function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);
}

/** Reduz uma lista de alturas para n barras, normalizada 0–1 */
export function resample(xs: number[], n: number): number[] {
  if (!xs.length) return Array(n).fill(0.3);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.floor((i / n) * xs.length);
    const b = Math.max(a + 1, Math.floor(((i + 1) / n) * xs.length));
    out.push(Math.max(...xs.slice(a, b)));
  }
  const max = Math.max(...out, 0.0001);
  return out.map((x) => Math.max(0.18, x / max));
}
