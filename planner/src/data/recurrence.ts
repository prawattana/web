import type { PlannerEvent } from "../types";
import { TEMPLATE } from "./template";

/** "YYYY-MM-DD" ของวัน (เวลาท้องถิ่น) */
export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** วันจันทร์ของสัปดาห์ที่ date นั้นอยู่ (เริ่มสัปดาห์ที่จันทร์) */
export function mondayOf(date: Date): Date {
  const r = new Date(date);
  const dow = r.getDay();                 // 0=อา..6=ส
  const diff = dow === 0 ? -6 : 1 - dow;  // เลื่อนไปจันทร์
  r.setDate(r.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** ISO แบบ local (ไม่มี timezone) เพื่อให้ FullCalendar ตีความเป็นเวลาท้องถิ่น */
function isoAt(day: Date, hm: string): string {
  const [h, m] = hm.split(":").map(Number);
  return `${ymd(day)}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** สร้าง event จริงของสัปดาห์ (จากจันทร์ที่ให้มา) ตามเทมเพลต */
export function seedWeek(monday: Date): PlannerEvent[] {
  const out: PlannerEvent[] = [];
  for (const block of TEMPLATE) {
    for (const dow of block.days) {
      const offset = dow === 0 ? 6 : dow - 1;   // จันทร์=0 ... อาทิตย์=6
      const day = new Date(monday);
      day.setDate(monday.getDate() + offset);
      out.push({
        id: genId(),
        title: block.title,
        type: block.type,
        start: isoAt(day, block.start),
        end: isoAt(day, block.end),
        recurring: true,
      });
    }
  }
  return out;
}

/** วันที่ทั้ง 7 ของสัปดาห์ (เริ่มจันทร์) เป็น "YYYY-MM-DD" */
export function weekDates(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return ymd(d);
  });
}
