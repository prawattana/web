// รวมผลลัพธ์: แอปรายจ่าย (root, static) + week-planner (planner/dist) -> dist/
import { cpSync, mkdirSync, rmSync, readdirSync } from "node:fs";

const OUT = "dist";
const SKIP = new Set([
  "planner", "node_modules", "dist", ".git", ".gitignore",
  "package.json", "package-lock.json", "vercel.json", "assemble.mjs",
  ".vercel", "README.md",
]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1) ไฟล์ static ของแอปรายจ่าย (root) -> dist/
for (const entry of readdirSync(".")) {
  if (SKIP.has(entry)) continue;
  cpSync(entry, `${OUT}/${entry}`, { recursive: true });
}

// 2) week-planner ที่ build แล้ว -> dist/planner/
cpSync("planner/dist", `${OUT}/planner`, { recursive: true });

console.log("✓ assembled", OUT);
