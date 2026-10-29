import fs from "node:fs";
import path from "node:path";

const publicDir = path.resolve(process.cwd(), ".output", "public");
const assetsDir = path.join(publicDir, "assets");

if (!fs.existsSync(assetsDir)) {
  console.error(`Error: ${assetsDir} does not exist. Run "npm run build" first.`);
  process.exit(1);
}

const assetFiles = fs.readdirSync(assetsDir);

// Find main entry JS (client-<hash>.js or index-<hash>.js) and all CSS bundles
const entryJs =
  assetFiles.find((f) => /^client-[A-Za-z0-9_-]+\.js$/.test(f)) ||
  assetFiles.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
const cssFiles = assetFiles.filter((f) => f.endsWith(".css"));

if (!entryJs) {
  console.error("Error: Could not find index-*.js entry bundle in .output/public/assets");
  process.exit(1);
}

// 1. Rewrite root-relative static asset paths and Vite preload base inside JS/CSS bundles
const ASSET_PREFIX_RE =
  /(["'`])\/(assets|hero|images|learners|lms|materials|showcase|tricube-logo-)/g;

for (const file of assetFiles) {
  if (!file.endsWith(".js") && !file.endsWith(".css")) continue;
  const filePath = path.join(assetsDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content.replace(ASSET_PREFIX_RE, "$1./$2");

  if (file.endsWith(".js")) {
    // Fix Vite preload helper URL prefix when hosted on GitHub Pages (/tricube-v2/)
    updated = updated.replace(
      /function\(e\)\{return([`"'/]+)\+e\}/g,
      'function(e){return(typeof window!=="undefined"&&window.location.hostname.includes("github.io")?"/tricube-v2/":"/")+e}'
    );
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}

// Sort CSS so styles-*.css comes first
cssFiles.sort((a, b) => {
  if (a.startsWith("styles-")) return -1;
  if (b.startsWith("styles-")) return 1;
  return a.localeCompare(b);
});

const cssLinks = cssFiles
  .map((css) => `    <link rel="stylesheet" href="./assets/${css}" />`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TRI CUBE Digital Solutions — Premium IT Training & LMS</title>
    <meta name="description" content="Live cohort training, real internships, verified certificates. Learn Python, MERN, Data Science, AI and more at TRI CUBE." />
    <link rel="icon" href="./tricube-logo-32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="./tricube-logo-192.png" type="image/png" sizes="192x192" />
    <link rel="apple-touch-icon" href="./tricube-logo-192.png" sizes="192x192" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" />
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/${entryJs}"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(publicDir, "index.html"), html, "utf8");
fs.writeFileSync(path.join(publicDir, "404.html"), html, "utf8");
fs.writeFileSync(path.join(publicDir, ".nojekyll"), "", "utf8");

console.log(`Prepared GitHub Pages static bundle in ${publicDir}`);
console.log(`  Entry JS : ./assets/${entryJs}`);
console.log(`  CSS files: ${cssFiles.join(", ")}`);
