// Fails if any frontend source file hardcodes a production API host outside
// src/config/api.js. Run with: npm run check:api-hosts
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const srcRoot = join(clientRoot, "src");
const allowed = new Set(["src/config/api.js"]);
const pattern = /https?:\/\/(?:www\.)?lecharlotlimo(?:-aucd)?\.onrender\.com/gi;

const toPosix = (value) => value.split("\\").join("/");

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : walk(full);
    return /\.(js|jsx)$/.test(entry.name) ? [full] : [];
  });

const violations = [];
for (const file of walk(srcRoot)) {
  const rel = toPosix(relative(clientRoot, file));
  if (allowed.has(rel)) continue;

  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, index) => {
      pattern.lastIndex = 0;
      if (pattern.test(line)) violations.push(`${rel}:${index + 1}  ${line.trim()}`);
    });
}

if (violations.length) {
  console.error("Hardcoded production API host found. Use API_ORIGIN from src/config/api.js.\n");
  violations.forEach((v) => console.error("  " + v));
  process.exit(1);
}

console.log("OK: no hardcoded production API hosts outside src/config/api.js");
