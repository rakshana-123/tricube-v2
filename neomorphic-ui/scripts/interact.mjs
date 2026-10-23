/* Interaction verification — drives real clicks through the showcase. */
import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:4173";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--disable-gpu", "--no-first-run", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1600 });

await page.goto(`${BASE}/?theme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".showcaseHeader");
const results = [];
const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/* 1. Header theme toggle flips data-theme */
await page.evaluate(() => {
  const btns = [...document.querySelectorAll(".showcaseHeader button")];
  btns.find((b) => /Dark|Light/.test(b.textContent))?.click();
});
await settle();
results.push([
  "header theme toggle → dark",
  (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark",
]);

/* 2. Toggle switch flips aria-checked */
const before = await page.evaluate(
  () => document.querySelector('[role="switch"]')?.getAttribute("aria-checked"),
);
await page.evaluate(() => document.querySelector('[role="switch"]')?.click());
await settle();
results.push([
  "switch flips aria-checked",
  before !==
    (await page.evaluate(
      () => document.querySelector('[role="switch"]')?.getAttribute("aria-checked"),
    )),
]);

/* 3. Segmented control keyboard navigation (selection advances one slot
   from wherever it starts — the forms demo defaults to index 1) */
const segBefore = await page.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]');
  g.focus();
  return [...g.querySelectorAll('[role="radio"]')].findIndex(
    (r) => r.getAttribute("aria-checked") === "true",
  );
});
await page.keyboard.press("ArrowRight");
await settle();
results.push([
  "segmented arrow advances selection",
  (await page.evaluate((from) => {
    const radios = [...document.querySelector('[role="radiogroup"]').querySelectorAll('[role="radio"]')];
    const now = radios.findIndex((r) => r.getAttribute("aria-checked") === "true");
    return now === (from + 1) % radios.length;
  }, segBefore)) === true,
]);

/* 4. Dynamic Type select scales the type ladder */
await page.select('select[aria-label="Dynamic Type size"]', "xxl");
await settle(300);
const heroSize = await page.evaluate(() =>
  parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
);
results.push(["dynamic type 2XL grows hero (56 → ~78px)", heroSize > 70]);

/* 5. Slider: keyboard increments, then synthetic pointer drag commits a jump
   (CDP mouse events don't synthesize PointerEvents, so we dispatch them) */
const sliderBefore = await page.evaluate(() =>
  Number(document.querySelector('[role="slider"]')?.getAttribute("aria-valuenow")),
);
await page.evaluate(() => document.querySelector('[role="slider"]')?.focus());
await page.keyboard.press("ArrowRight");
await settle(300);
const sliderKeyed = await page.evaluate(() =>
  Number(document.querySelector('[role="slider"]')?.getAttribute("aria-valuenow")),
);
results.push(["slider arrow key increments value", sliderKeyed === sliderBefore + 1]);

await page.evaluate(() => {
  const el = document.querySelector('[role="slider"]');
  const r = el.getBoundingClientRect();
  const y = r.y + r.height / 2;
  el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.x + 20, clientY: y, pointerId: 1 }));
  el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: r.x + r.width * 0.8, clientY: y, pointerId: 1 }));
  el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: r.x + r.width * 0.8, clientY: y, pointerId: 1 }));
});
await settle(300);
const sliderDragged = await page.evaluate(() =>
  Number(document.querySelector('[role="slider"]')?.getAttribute("aria-valuenow")),
);
results.push(["slider pointer drag jumps value", sliderDragged > sliderKeyed]);

/* 6. Chip toggle adds pressed state */
await page.evaluate(() => {
  [...document.querySelectorAll('button[aria-pressed]')]
    .find((b) => b.textContent.includes("Graphite"))
    ?.click();
});
await settle(300);
const chipPressed = await page.evaluate(() =>
  [...document.querySelectorAll('button[aria-pressed]')]
    .find((b) => b.textContent.includes("Graphite"))
    ?.getAttribute("aria-pressed"),
);
results.push(["chip toggles aria-pressed", chipPressed === "true"]);

for (const [name, ok] of results) console.log(ok ? "PASS" : "FAIL", "-", name);
await browser.close();
if (results.some(([, ok]) => !ok)) process.exit(1);
console.log("All interaction checks passed.");
