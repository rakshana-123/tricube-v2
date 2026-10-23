/* Analyze logo images: corner/background colors via canvas in headless Edge. */
import puppeteer from "puppeteer-core";

const FILES = [
  "C:/Users/ASUS/Downloads/tricube-v2/tricube-v2/public/tricube-logo-square.jpg",
  "C:/Users/ASUS/Downloads/tricube-v2/tricube-v2/public/tricube-logo-wide.png",
  "C:/Users/ASUS/.zcode/cli/image-cache/sess_0c3ecae7-5faa-4c2a-ac0f-00f2cd134790/image-0d99d73e759f5c2595477f43ec811638.png",
  "C:/Users/ASUS/.zcode/cli/image-cache/sess_0c3ecae7-5faa-4c2a-ac0f-00f2cd134790/image-cf88a52215f574a9be51779c69f2e5e5.png",
];

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
  args: ["--disable-gpu", "--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.goto("about:blank");

for (const f of FILES) {
  await page.goto("file:///" + f, { waitUntil: "load" });
  const out = await page.evaluate(() => {
    const img = document.querySelector("img") ?? document.images[0];
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const px = (x, y) => {
      const d = ctx.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2], d[3]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    };
    const w = c.width, h = c.height;
    return {
      size: `${w}x${h}`,
      TL: px(1, 1), TR: px(w - 2, 1), BL: px(1, h - 2), BR: px(w - 2, h - 2),
      C: px(Math.floor(w / 2), Math.floor(h / 2)),
    };
  });
  console.log(f.split("/").pop().padEnd(28), JSON.stringify(out));
}

await browser.close();
