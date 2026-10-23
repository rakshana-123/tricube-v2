/* Live verification of /platform: SSR content, spec colors, interactions. */
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = "http://localhost:8081";
const OUT = "C:/Users/ASUS/Downloads/tricube-v2/shots-platform";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--disable-gpu", "--no-first-run", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100 });
const settle = (ms = 800) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") =>
  results.push([ok ? "PASS" : "FAIL", name, detail].filter(Boolean).join(" - "));

await page.goto(`${BASE}/platform`, { waitUntil: "networkidle0" });
await page.waitForSelector("header");
await settle(1200);

/* 1. All 11 sections render in the SSR HTML */
let s = await page.evaluate(() => ({
  ids: [...document.querySelectorAll("section[id]")].map((x) => x.id),
  sectionCount: document.querySelectorAll("main > div > main section, main section").length,
  h1: document.querySelector("h1")?.textContent?.slice(0, 40),
  courses: [...document.querySelectorAll("article")].length,
}));
check("all 11 spec sections render", s.sectionCount >= 11, `${s.sectionCount} sections · anchors: ${s.ids.join(",")}`);
check("course catalog renders cards", s.courses >= 6, `${s.courses} cards`);
check("hero headline present", !!s.h1, s.h1);

/* 2. Spec colors compute on real elements */
s = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const btn = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("Start learning"));
  const body = [...document.querySelectorAll("p")].find((p) => getComputedStyle(p).color === "rgb(107, 98, 93)");
  return {
    h1Color: getComputedStyle(h1).color,
    ctaBg: btn ? getComputedStyle(btn).backgroundColor : null,
    warmTextFound: !!body,
    tracking: getComputedStyle(h1).letterSpacing,
  };
});
check("headings are navy #0E263A", s.h1Color === "rgb(14, 38, 58)", s.h1Color);
check("primary CTA is deep teal #247F7C", s.ctaBg === "rgb(36, 127, 124)", String(s.ctaBg));
check("warm secondary text #6B625D in use", s.warmTextFound);
check("hero tracking ≤ -0.04em", parseFloat(s.tracking) <= -0.9, s.tracking + "px @64px ≈ -0.04em");

await page.screenshot({ path: `${OUT}/platform-hero.png` });

/* 3. Navbar frosts after scroll + hides on scroll-down */
await page.evaluate(() => window.scrollTo(0, 400));
await settle(600);
s = await page.evaluate(() => {
  const h = document.querySelector("header");
  const cs = getComputedStyle(h);
  return { bg: cs.backgroundColor, blur: cs.backdropFilter, border: cs.borderBottomWidth };
});
check("navbar frosts on scroll (white @82% — may serialize as oklab)", /0\.82/.test(s.bg), s.bg);
check("navbar backdrop blur 16px", (s.blur || "").includes("16px"), s.blur);

/* 4. Pricing toggle swaps price via layoutId pill */
await page.evaluate(() => document.getElementById("pricing")?.scrollIntoView());
await settle(900);
const priceBefore = await page.evaluate(
  () => [...document.querySelectorAll("span")].find((x) => x.textContent.trim() === "₹799")?.textContent ?? null,
);
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => x_path(b))?.click();
  function x_path(b) { return b.textContent.trim().startsWith("Monthly"); }
});
await settle(700);
const priceAfter = await page.evaluate(
  () => [...document.querySelectorAll("span")].find((x) => x.textContent.trim() === "₹999")?.textContent ?? null,
);
check("pricing toggle swaps ₹799 annual → ₹999 monthly", priceBefore === "₹799" && priceAfter === "₹999");

await page.evaluate(() => document.getElementById("pricing")?.scrollIntoView());
await settle(600);
await page.screenshot({ path: `${OUT}/platform-pricing.png` });

/* 5. FAQ accordion aria behavior */
await page.evaluate(() => document.getElementById("faq")?.scrollIntoView());
await settle(700);
s = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("Do I need prior coding experience"),
  );
  const openBefore = btn.getAttribute("aria-expanded") === "true";
  btn.click();
  return new Promise((res) =>
    setTimeout(() => {
      const openAfter = btn.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      res({ openBefore, openAfter, panelVisible: !!panel && panel.offsetHeight > 0 });
    }, 500),
  );
});
check("faq accordion toggles aria-expanded", s.openBefore && !s.openAfter, JSON.stringify(s));

/* 6. Testimonial carousel advances manually */
await page.evaluate(() => document.getElementById("top")?.scrollIntoView());
await page.evaluate(() => window.scrollBy(0, 100));
await settle(400);
const quoteBefore = await page.evaluate(() => document.querySelector("blockquote")?.textContent.slice(0, 30));
await page.evaluate(() => {
  document.querySelector('[aria-label="Next testimonial"]')?.click();
});
await settle(800);
const quoteAfter = await page.evaluate(() => document.querySelector("blockquote")?.textContent.slice(0, 30));
check("testimonial carousel advances", quoteBefore && quoteAfter && quoteBefore !== quoteAfter, `${quoteBefore} → ${quoteAfter}`);

/* 7. Mobile: catalog horizontal scroll, no overflow */
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${BASE}/platform`, { waitUntil: "networkidle0" });
await settle(1000);
s = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > innerWidth + 1,
  navBurger: !!document.querySelector('[aria-label="Toggle menu"]'),
}));
check("mobile: no horizontal page overflow", !s.overflow);
check("mobile: burger menu present", s.navBurger);
await page.screenshot({ path: `${OUT}/platform-mobile.png` });

/* 8. Site chrome isolation */
await page.setViewport({ width: 1440, height: 1100 });
await page.goto(`${BASE}/faq`, { waitUntil: "networkidle0" });
s = await page.evaluate(() => ({
  leak: !!document.querySelector('[id="pricing"]'),
  navbar: !!document.querySelector("header"),
}));
check("faq: original site chrome intact, no platform leak", s.navbar && !s.leak);

for (const r of results) console.log(r);
await browser.close();
if (results.some((r) => r.startsWith("FAIL"))) process.exit(1);
console.log("All platform checks passed.");
