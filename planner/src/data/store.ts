import type { ScheduleState } from "../types";

/**
 * Data layer — abstraction ชั้นเดียวสำหรับอ่าน/เขียน state
 * ตอนนี้ใช้ localStorage (local-first). ถ้าจะย้ายไป Supabase ภายหลัง
 * แก้แค่ 2 ฟังก์ชันนี้ให้เป็น async + เรียก API ส่วนอื่นของแอปไม่ต้องเปลี่ยน
 */

const KEY = "week-planner:v1";

export const emptyState: ScheduleState = {
  events: [],
  overrides: {},
  seededWeeks: [],
};

export function loadState(): ScheduleState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(emptyState);
    const parsed = JSON.parse(raw) as Partial<ScheduleState>;
    return {
      events: parsed.events ?? [],
      overrides: parsed.overrides ?? {},
      seededWeeks: parsed.seededWeeks ?? [],
    };
  } catch {
    return structuredClone(emptyState);
  }
}

export function saveState(state: ScheduleState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error("save ล้มเหลว:", e);
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
