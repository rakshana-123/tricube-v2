/* Host-app verification: screenshots + state checks for /studio and /design-system. */
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
const settle = (ms = 700) => new Promise((r) => setTimeout(r, ms));

/* --- Studio: light home, then tab through browse/profile via the dock --- */
await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui", { timeout: 10000 });
await settle();
console.log(
  "studio-light theme:",
  await page.evaluate(() => document.querySelector(".neo-ui")?.getAttribute("data-theme")),
);
await page.screenshot({ path: `${OUT}/studio-light-home.png` });

await page.evaluate(() => {
  [...document.querySelectorAll("nav[aria-label=Primary] button")]
    .find((b) => b.textContent.includes("Browse"))
    ?.click();
});
await settle();
await page.screenshot({ path: `${OUT}/studio-light-browse.png` });

await page.evaluate(() => {
  [...document.querySelectorAll("nav[aria-label=Primary] button")]
    .find((b) => b.textContent.includes("Profile"))
    ?.click();
});
await settle();
await page.screenshot({ path: `${OUT}/studio-light-profile.png` });

/* --- Studio dark home --- */
await page.goto(`${BASE}/studio?neotheme=dark`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();
console.log(
  "studio-dark theme:",
  await page.evaluate(() => document.querySelector(".neo-ui")?.getAttribute("data-theme")),
);
await page.screenshot({ path: `${OUT}/studio-dark-home.png` });

/* --- Studio at phone width (floating dock + responsive grid) --- */
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await settle();
await page.screenshot({ path: `${OUT}/studio-light-phone.png` });

/* --- Course View button routes to the real site page --- */
await page.setViewport({ width: 1380, height: 1600 });
await page.goto(`${BASE}/studio?neotheme=light`, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  [...document.querySelectorAll("nav[aria-label=Primary] button")]
    .find((b) => b.textContent.includes("Browse"))
    ?.click();
});
await settle(400);
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "View")?.click();
});
await settle(1200);
console.log("course-view url:", page.url());

/* --- Design system showcase, light + dark --- */
await page.goto(`${BASE}/design-system?neotheme=light`, { waitUntil: "networkidle0" });
await page.waitForSelector(".neo-ui");
await settle();
console.log(
  "showcase theme:",
  await page.evaluate(() => document.querySelector(".neo-ui")?.getAttribute("data-theme")),
);
await page.screenshot({ path: `${OUT}/showcase-light.png` });

await page.goto(`${BASE}/design-system?neotheme=dark`, { waitUntil: "networkidle0" });
await settle();
await page.screenshot({ path: `${OUT}/showcase-dark.png` });

/* --- Sanity: existing site pages still render with their own chrome --- */
await page.goto(`${BASE}/faq`, { waitUntil: "networkidle0" });
await settle();
const chrome = await page.evaluate(() => ({
  navbar: !!document.querySelector("header"),
  neoLeak: !!document.querySelector(".neo-ui"),
  bodyBg: getComputedStyle(document.body).backgroundColor,
}));
console.log("faq chrome:", JSON.stringify(chrome));

await browser.close();
console.log("done");
