// สร้างไอคอน PWA จาก icon-src.svg -> public/*.png
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });
const svg = readFileSync("icon-src.svg");

const targets = [
  { file: "public/pwa-192.png", size: 192 },
  { file: "public/pwa-512.png", size: 512 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/favicon.svg", size: null }, // ใช้ svg ตรงๆ
];

for (const t of targets) {
  if (t.size === null) continue;
  await sharp(svg, { density: 384 }).resize(t.size, t.size).png().toFile(t.file);
  console.log("✓", t.file);
}
console.log("เสร็จ");
