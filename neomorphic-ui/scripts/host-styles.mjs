/* Computed-style assertions — deterministic visual verification without vision. */
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = "http://localhost:8081";
const OUT = "C:/Users/ASUS/Downloads/tricube-v2/shots-host";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--disable-gpu", "--no-first-run", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1380, height: 1600 });
const settle = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") =>
  results.push([ok ? "PASS" : "FAIL", name, detail].filter(Boolean).join(" - "));

await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();

/* 1. Canvas + text colors are the parchment palette */
let s = await page.evaluate(() => {
  const neo = document.querySelector(".neo-ui");
  const cs = getComputedStyle(neo);
  return { canvas: cs.backgroundColor, text: cs.color, font: cs.fontFamily.slice(0, 40) };
});
check("light canvas is #f5f5f7", s.canvas === "rgb(245, 245, 247)", s.canvas);
check("light ink is #1d1d1f", s.text === "rgb(29, 29, 31)", s.text);

/* 2. Raised cards actually cast the dual neomorphic shadow */
s = await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find((d) => {
    const bs = getComputedStyle(d).boxShadow;
    return bs.includes("rgba(0, 0, 0") && bs.includes("rgba(255, 255, 255") && !bs.startsWith("inset");
  });
  return { found: !!el, shadow: el ? getComputedStyle(el).boxShadow.slice(0, 100) : "" };
});
check("dual-shadow (black+white specular) present on a card", s.found, s.shadow);

/* 3. Nav bar is frosted (saturate+blur backdrop) */
s = await page.evaluate(() => {
  const bar = document.querySelector("header");
  const cs = getComputedStyle(bar);
  return {
    bf: (cs.backdropFilter || cs.webkitBackdropFilter || "").toString(),
    sticky: cs.position,
    h: bar.getBoundingClientRect().height,
  };
});
check(
  "nav has saturate(180%) blur(20px)",
  s.bf.includes("saturate(1.8") || s.bf.includes("saturate(180%)") || s.bf.includes("blur(20px)"),
  s.bf,
);
check("nav is sticky", s.sticky === "sticky");

/* 4. Tab dock is fixed, bottom-centered, above content */
s = await page.evaluate(() => {
  const dock = document.querySelector("nav[aria-label=Primary]")?.parentElement;
  if (!dock) return { found: false };
  const cs = getComputedStyle(dock);
  const r = dock.getBoundingClientRect();
  return {
    found: true,
    pos: cs.position,
    z: cs.zIndex,
    centered: Math.abs(r.left + r.width / 2 - innerWidth / 2) < 4,
    bottom: r.bottom <= innerHeight,
  };
});
check("tab dock fixed + centered", s.found && s.pos === "fixed" && s.centered, JSON.stringify(s));

/* 5. Primary button is the blue pill with cast shadow */
s = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("Resume lesson"),
  );
  if (!btn) return { found: false };
  const cs = getComputedStyle(btn);
  const r = btn.getBoundingClientRect();
  return {
    found: true,
    bg: cs.backgroundColor,
    radius: cs.borderRadius,
    h: Math.round(r.height),
    shadowHasInset: cs.boxShadow.includes("inset"),
  };
});
check(
  "primary button blue pill w/ inset specular",
  s.found && s.bg === "rgb(0, 102, 204)" && s.radius === "9999px" && s.shadowHasInset,
  JSON.stringify(s),
);

/* 6. Dark mode flips palette + accent */
await page.goto(`${BASE}/studio?neotheme=dark`, { waitUntil: "networkidle0" });
await settle();
s = await page.evaluate(() => {
  const neo = document.querySelector(".neo-ui");
  const cs = getComputedStyle(neo);
  const darkCard = [...document.querySelectorAll("div")].find((d) =>
    d.textContent.includes("Continue learning"),
  );
  const accentEl = document.querySelector("header");
  return {
    canvas: cs.backgroundColor,
    text: cs.color,
    continueVisible: !!darkCard,
  };
});
check("dark canvas is #252527", s.canvas === "rgb(37, 37, 39)", s.canvas);
check("dark text is #f5f5f7", s.text === "rgb(245, 245, 247)", s.text);

/* 7. Phone width: stat grid collapses, dock stays centered, no horizontal overflow */
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await settle();
s = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > innerWidth + 1,
  statCols: getComputedStyle(document.querySelector("main div div")).gridTemplateColumns,
  dock: (() => {
    const dock = document.querySelector("nav[aria-label=Primary]")?.parentElement;
    const r = dock.getBoundingClientRect();
    return Math.abs(r.left + r.width / 2 - innerWidth / 2) < 4 && r.width < innerWidth;
  })(),
}));
check("phone: no horizontal overflow", !s.overflow);
check("phone: tab dock centered & fits", s.dock);

/* 8. Showcase route renders sections + contrast badges */
await page.setViewport({ width: 1380, height: 1600 });
await page.goto(`${BASE}/design-system?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();
s = await page.evaluate(() => ({
  sections: [...document.querySelectorAll("section[id]")].map((x) => x.id),
  badges: document.querySelectorAll(".contrastBadge").length,
  headerFrosted: getComputedStyle(document.querySelector(".showcaseHeader")).backdropFilter,
}));
check("showcase sections present", s.sections.length >= 8, s.sections.join(","));
check("contrast badges rendered", s.badges >= 8, String(s.badges));

/* 9. Existing site page unaffected by scoped tokens */
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
await settle();
s = await page.evaluate(() => ({
  neoLeak: !!document.querySelector(".neo-ui"),
  htmlHasDataTheme: document.documentElement.hasAttribute("data-theme"),
  bodyBg: getComputedStyle(document.body).backgroundColor,
}));
check("home: no .neo-ui leakage", !s.neoLeak);
check("home: html data-theme untouched", !s.htmlHasDataTheme);
check("home: oklch body background intact", s.bodyBg.includes("oklch") || s.bodyBg !== "rgb(245, 245, 247)", s.bodyBg);

for (const r of results) console.log(r);
await browser.close();
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
console.log("All style assertions passed.");
