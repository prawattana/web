import type { EventType } from "../types";

export interface TemplateBlock {
  days: number[];      // วันในสัปดาห์ (0=อา, 1=จ, ... 6=ส) ตาม Date.getDay()
  start: string;       // "HH:MM"
  end: string;         // "HH:MM"
  type: EventType;
  title: string;
}

const MON_SAT = [1, 2, 3, 4, 5, 6];
const MON_WED_FRI = [1, 3, 5];
const MON_FRI = [1, 2, 3, 4, 5];

/** ตารางประจำสัปดาห์ (seed ซ้ำทุกสัปดาห์) */
export const TEMPLATE: TemplateBlock[] = [
  { days: MON_SAT, start: "09:00", end: "12:00", type: "work", title: "ทำงาน" },
  { days: MON_SAT, start: "12:00", end: "13:00", type: "break", title: "พักกลางวัน" },
  { days: MON_SAT, start: "13:00", end: "18:00", type: "work", title: "ทำงาน" },
  { days: MON_WED_FRI, start: "18:00", end: "19:30", type: "exercise", title: "ออกกำลังกาย" },
  { days: MON_FRI, start: "20:00", end: "23:00", type: "trade", title: "เทรด" },
];

/** วันที่หยุดทั้งวันโดยอัตโนมัติ (อาทิตย์) */
export const AUTO_OFF_DAYS = [0]; // 0 = อาทิตย์
