/* Visual verification driver — runs the production preview through Edge,
   reports live theme/DOM state, and captures section screenshots. */
import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:4173";
const OUT = "C:\\Users\\ASUS\\Downloads\\tricube-v2\\shots";

const shots = [
  { name: "light-top", url: `${BASE}/?theme=light`, w: 1440, h: 1700 },
  { name: "light-buttons", url: `${BASE}/?theme=light#buttons`, w: 1440, h: 1500 },
  { name: "light-forms", url: `${BASE}/?theme=light#forms`, w: 1440, h: 1500 },
  { name: "light-layout", url: `${BASE}/?theme=light#layout`, w: 1440, h: 1600 },
  { name: "dark-top", url: `${BASE}/?theme=dark`, w: 1440, h: 1700 },
  { name: "dark-buttons", url: `${BASE}/?theme=dark#buttons`, w: 1440, h: 1500 },
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--disable-gpu", "--no-first-run", "--hide-scrollbars", "--window-size=1440,1700"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1700, deviceScaleFactor: 1 });

for (const s of shots) {
  await page.goto(s.url, { waitUntil: "networkidle0" });
  await page.waitForSelector(".showcaseHeader", { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 600)); // settle fonts/transitions
  const state = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    canvas: getComputedStyle(document.body).backgroundColor,
    dt: document.documentElement.style.getPropertyValue("--dt-scale"),
    headerText: document.querySelector(".brand span")?.textContent ?? null,
  }));
  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  console.log(s.name, JSON.stringify(state));
}

await browser.close();
