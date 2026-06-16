// ออกกำลังกาย — บันทึก workout + ระบบไฟ streak รายสัปดาห์
import { mondayOf, ymd } from "./recurrence";

export interface Workout {
  id: string;
  date: string;        // YYYY-MM-DD
  moves: string[];     // ท่า/ประเภทที่ทำ
  note?: string;
}

export const WEEK_TARGET = 3;   // ต้องออก ≥3 วัน/สัปดาห์ ไฟถึงติด
export const MOVE_PRESETS = ["วิ่ง", "เวท", "บอดี้เวท", "โยคะ", "ว่ายน้ำ", "ปั่นจักรยาน", "เดินเร็ว", "ยืดเหยียด"];

const KEY = "wk_workouts";

export function loadWorkouts(): Workout[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
export function saveWorkouts(w: Workout[]) { localStorage.setItem(KEY, JSON.stringify(w)); }

export function uid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

/** จำนวนวัน (distinct) ที่ออกในสัปดาห์ของ monday ที่ให้ */
function daysInWeek(workouts: Workout[], monday: Date): number {
  const start = ymd(monday);
  const end = ymd(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6));
  const set = new Set<string>();
  for (const w of workouts) if (w.date >= start && w.date <= end) set.add(w.date);
  return set.size;
}

export interface FireState {
  fire: number;          // จำนวนสัปดาห์ติดต่อกันที่ออกครบ (ระดับไฟ)
  thisWeek: number;      // จำนวนวันที่ออกในสัปดาห์นี้
  target: number;
  weekDays: string[];    // วันที่ (YYYY-MM-DD) ที่ออกในสัปดาห์นี้
}

/** คำนวณไฟ: นับสัปดาห์ที่ออกครบ ≥3 วันต่อเนื่องกัน
 *  - สัปดาห์ปัจจุบันยังไม่จบ: ถ้ายังไม่ครบ ไม่ทำให้ไฟดับ (รอได้) แต่ถ้าครบแล้วนับเพิ่ม
 *  - สัปดาห์ที่ผ่านไปแล้วและไม่ครบ → ไฟดับ (หยุดนับ) */
export function computeFire(workouts: Workout[]): FireState {
  const today = new Date();
  const curMon = mondayOf(today);
  const curStart = ymd(curMon);

  const weekDays = workouts
    .filter((w) => {
      const end = ymd(new Date(curMon.getFullYear(), curMon.getMonth(), curMon.getDate() + 6));
      return w.date >= curStart && w.date <= end;
    })
    .map((w) => w.date);
  const thisWeek = new Set(weekDays).size;

  const earliest = workouts.reduce((min, w) => (w.date < min ? w.date : min), "9999");

  let fire = 0;
  let wk = new Date(curMon);
  while (true) {
    const isCurrent = ymd(wk) === curStart;
    const days = daysInWeek(workouts, wk);
    if (days >= WEEK_TARGET) fire++;
    else if (!isCurrent) break;          // สัปดาห์ที่ผ่านไปแล้วไม่ครบ → ไฟดับ
    // (สัปดาห์ปัจจุบันยังไม่ครบ = รอได้ ไม่ดับ)
    wk = new Date(wk.getFullYear(), wk.getMonth(), wk.getDate() - 7);
    if (ymd(wk) < earliest) break;       // ไม่มีข้อมูลเก่ากว่านี้แล้ว
  }

  return { fire, thisWeek, target: WEEK_TARGET, weekDays: [...new Set(weekDays)] };
}
