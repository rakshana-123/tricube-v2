/* WCAG AA verification for the TRI CUBE white-primary brand theme.
   Every interactive/text pairing is asserted; decorative accents documented. */

function lum(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16,
  );
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)];
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const CHECKS = [
  // [name, fg, bg, minimum, mode]
  ["LIGHT ink on white canvas", "#1d1d1f", "#ffffff", 4.5],
  ["LIGHT secondary #333 on white", "#333333", "#ffffff", 4.5],
  ["LIGHT tertiary #6b6b70 on white", "#6b6b70", "#ffffff", 4.5],
  ["LIGHT brand blue text/icons on white", "#265ca0", "#ffffff", 4.5],
  ["LIGHT white text on brand-blue button", "#ffffff", "#265ca0", 4.5],
  ["LIGHT white on hover #1c4680", "#ffffff", "#1c4680", 4.5],
  ["LIGHT focus ring vs white (UI 3:1)", "#265ca0", "#ffffff", 3.0],
  ["LIGHT white on navy inverse tile", "#f5f7fa", "#0e263a", 4.5],
  ["LIGHT error #d70015 on white well", "#d70015", "#ffffff", 4.5],
  ["LIGHT gold chip fg #8a6420 on gold tint/white", "#8a6420", "#f6f1e5", 4.5],
  ["DARK text-primary on navy canvas", "#f5f7fa", "#0e263a", 4.5],
  ["DARK secondary on navy canvas", "#c8d4e2", "#0e263a", 4.5],
  ["DARK tertiary on navy canvas", "#93a7c0", "#0e263a", 4.5],
  ["DARK sky-blue accent on navy canvas", "#26a4e6", "#0e263a", 4.5],
  ["DARK navy text on sky-blue button", "#0e263a", "#26a4e6", 4.5],
  ["DARK text on raised #142e52", "#f5f7fa", "#142e52", 4.5],
  ["DARK accent on raised surface", "#26a4e6", "#142e52", 3.0],
  ["DARK error on raised surface", "#ff6f66", "#142e52", 4.5],
  ["DARK teal badge on navy (decorative 3:1)", "#3fc0bb", "#0e263a", 3.0],
  ["DARK gold fg #e8c07a on navy", "#e8c07a", "#0e263a", 4.5],
];

let fail = 0;
for (const [name, fg, bg, min] of CHECKS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1 (min ${min})  ${name}`,
  );
}
console.log(
  "\nDecorative (no AA requirement): teal #2EA5A1 on white = " +
    ratio("#2ea5a1", "#ffffff").toFixed(2) +
    ":1 · gold #C9962E on white = " +
    ratio("#c9962e", "#ffffff").toFixed(2) +
    ":1 — used only for dots/borders, never text.",
);
process.exit(fail ? 1 : 0);
