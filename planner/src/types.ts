export type EventType = "work" | "exercise" | "trade" | "break" | "note";

export interface PlannerEvent {
  id: string;
  title: string;
  type: EventType;
  start: string;        // ISO datetime
  end: string;          // ISO datetime
  note?: string;        // โน้ตวางแผนต่อ event
  recurring?: boolean;  // มาจากเทมเพลตประจำสัปดาห์ไหม
}

export interface DayOverride {
  date: string;         // "YYYY-MM-DD"
  isOff: boolean;       // มาร์กวันหยุด/ไม่ว่าง
  dayNote?: string;     // โน้ตรวมของทั้งวัน
}

export interface ScheduleState {
  events: PlannerEvent[];
  overrides: Record<string, DayOverride>;   // key = "YYYY-MM-DD"
  seededWeeks: string[];                     // week-start ที่ seed เทมเพลตแล้ว (กัน seed ซ้ำ)
}

/* สี/ลุคต่อ type (ThinkPad ดำ-แดง) */
export const TYPE_STYLE: Record<EventType, { label: string; bg: string; border: string; text: string }> = {
  work:     { label: "ทำงาน",       bg: "#3a3a3a", border: "#3a3a3a", text: "#e9e9e9" },
  exercise: { label: "ออกกำลังกาย", bg: "transparent", border: "#d81e2c", text: "#ffb3b8" },
  trade:    { label: "เทรด",         bg: "#c81f2c", border: "#d81e2c", text: "#ffffff" },
  break:    { label: "พัก",          bg: "#262626", border: "#3a3a3a", text: "#9a9a9a" },
  note:     { label: "โน้ต",         bg: "#262626", border: "#3a3a3a", text: "#cfcfcf" },
};
