/* Brand-theme verification: computed styles + auth flow against the dev server. */
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = "http://localhost:8081";
const OUT = "C:/Users/ASUS/Downloads/tricube-v2/shots-brand";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--disable-gpu", "--no-first-run", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1380, height: 1600 });
const settle = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") =>
  results.push([ok ? "PASS" : "FAIL", name, detail].filter(Boolean).join(" - "));

/* --- Studio light: white canvas, brand accents, navy shadows, logo --- */
await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();

let s = await page.evaluate(() => {
  const neo = document.querySelector(".neo-ui");
  const cs = getComputedStyle(neo);
  return {
    canvas: cs.backgroundColor,
    accent: cs.getPropertyValue("--accent-bg").trim(),
    accentOn: cs.getPropertyValue("--accent-on").trim(),
    logo: !!document.querySelector("header img"),
    logoSrc: document.querySelector("header img")?.getAttribute("src"),
    favicon: document.querySelector('link[rel="icon"]')?.getAttribute("href"),
  };
});
check("light canvas is pure white", s.canvas === "rgb(255, 255, 255)", s.canvas);
check("accent token is brand blue #265ca0", s.accent === "#265ca0", s.accent);
check("logo present in nav", s.logo && s.logoSrc === "/tricube-logo-square.jpg", s.logoSrc);
check("favicon is brand logo", (s.favicon ?? "").includes("tricube-logo"), s.favicon);

s = await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find((d) => {
    const bs = getComputedStyle(d).boxShadow;
    return bs.includes("rgba(14, 38, 58") && bs.includes("rgba(255, 255, 255") && !bs.startsWith("inset");
  });
  return { found: !!el, shadow: el ? getComputedStyle(el).boxShadow.slice(0, 100) : "" };
});
check("navy-tinted dual shadow on cards", s.found, s.shadow);

s = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Resume lesson"));
  if (!btn) return { found: false };
  const cs = getComputedStyle(btn);
  return { found: true, bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius };
});
check(
  "primary button brand blue + white text pill",
  s.found && s.bg === "rgb(38, 92, 160)" && s.color === "rgb(255, 255, 255)" && s.radius === "9999px",
  JSON.stringify(s),
);

await page.screenshot({ path: `${OUT}/brand-studio-light-home.png` });

/* --- Auth flow: sign out -> branded login -> sign back in --- */
await page.evaluate(() => {
  [...document.querySelectorAll("nav[aria-label=Primary] button")]
    .find((b) => b.textContent.includes("Profile"))
    ?.click();
});
await settle(400);
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Sign out"))?.click();
});
await settle(600);
s = await page.evaluate(() => ({
  banner: !!document.querySelector("img[src='/tricube-logo-wide.png']"),
  heading: document.querySelector("h1")?.textContent,
  inputs: document.querySelectorAll("input").length,
  signin: [...document.querySelectorAll("button")].some((b) => b.textContent.includes("Sign in to Studio")),
}));
check("login shows branded banner", s.banner);
check("login heading + form present", s.heading === "Welcome back." && s.inputs >= 2, JSON.stringify(s));
await page.screenshot({ path: `${OUT}/brand-login-light.png` });

await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Sign in to Studio"))?.click();
});
await settle(600);
s = await page.evaluate(() => !!document.querySelector("nav[aria-label=Primary]"));
check("sign-in returns to app shell", s);

/* --- Studio dark: navy canvas, sky accent --- */
await page.goto(`${BASE}/studio?neotheme=dark`, { waitUntil: "networkidle0" });
await settle();
s = await page.evaluate(() => {
  const neo = document.querySelector(".neo-ui");
  const cs = getComputedStyle(neo);
  return { canvas: cs.backgroundColor, accent: cs.getPropertyValue("--accent-bg").trim(), accentOn: cs.getPropertyValue("--accent-on").trim() };
});
check("dark canvas is brand navy", s.canvas === "rgb(14, 38, 58)", s.canvas);
check("dark accent is sky blue #26a4e6", s.accent === "#26a4e6", s.accent);
await page.screenshot({ path: `${OUT}/brand-studio-dark-home.png` });

/* --- Showcase: swatches updated, badges live --- */
await page.goto(`${BASE}/design-system?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();
s = await page.evaluate(() => ({
  logo: !!document.querySelector(".showcaseHeader img"),
  badges: document.querySelectorAll(".contrastBadge").length,
  whiteSwatch: [...document.querySelectorAll(".swatchCard")].some((c) =>
    c.textContent.includes("white primary"),
  ),
}));
check("showcase header shows logo", s.logo);
check("white-primary swatch present", s.whiteSwatch);
check("contrast badges render", s.badges >= 8, String(s.badges));
await page.screenshot({ path: `${OUT}/brand-showcase-light.png` });

/* --- Existing site untouched --- */
await page.goto(`${BASE}/faq`, { waitUntil: "networkidle0" });
await settle();
s = await page.evaluate(() => ({
  leak: !!document.querySelector(".neo-ui"),
  bodyBg: getComputedStyle(document.body).backgroundColor,
}));
check("faq: no .neo-ui leakage", !s.leak);
check("faq: oklch background intact", s.bodyBg.includes("oklch"), s.bodyBg);

for (const r of results) console.log(r);
await browser.close();
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
console.log("All brand-theme checks passed.");
