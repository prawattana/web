// แปลงข้อความภาษาพูดเป็น event เช่น "พรุ่งนี้ 14:00 ประชุมทีม", "ศุกร์ บ่าย 2 เทรด"
import type { EventType } from "../types";
import { ymd } from "./recurrence";

export interface ParsedEvent {
  title: string;
  type: EventType;
  start: string;   // local ISO "YYYY-MM-DDTHH:MM:00"
  end: string;
}

const DOW: { re: RegExp; dow: number }[] = [
  { re: /(วัน)?อาทิตย์/, dow: 0 },
  { re: /(วัน)?จันทร์/, dow: 1 },
  { re: /(วัน)?อังคาร/, dow: 2 },
  { re: /(วัน)?พุธ/, dow: 3 },
  { re: /(วัน)?(พฤหัส(บดี)?|พฤ)/, dow: 4 },
  { re: /(วัน)?ศุกร์/, dow: 5 },
  { re: /(วัน)?เสาร์/, dow: 6 },
];

const TYPE_KW: { re: RegExp; type: EventType }[] = [
  { re: /เทรด|trade|ออเดอร์|ออร์เดอร์|order/i, type: "trade" },
  { re: /ออกกำลัง|วิ่ง|ยิม|gym|เวท|โยคะ|ว่ายน้ำ|ปั่น|ฟิตเนส|เดินเร็ว/i, type: "exercise" },
  { re: /พัก|กินข้าว|ทานข้าว|พักเที่ยง|เบรก/i, type: "break" },
  { re: /ประชุม|meeting|call|โทร|ลูกค้า|ส่งงาน|เดดไลน์|deadline|งาน|นัด/i, type: "work" },
];

function iso(day: Date, h: number, m: number): string {
  return `${ymd(day)}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/** คืน null ถ้าไม่มีข้อความเหลือพอเป็นชื่อ */
export function parseQuickAdd(input: string): ParsedEvent | null {
  let text = ` ${input.trim()} `;
  if (!text.trim()) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(today);

  // ---- วัน ----
  if (/พรุ่งนี้/.test(text)) { day.setDate(day.getDate() + 1); text = text.replace(/พรุ่งนี้/g, " "); }
  else if (/มะรืน(นี้)?/.test(text)) { day.setDate(day.getDate() + 2); text = text.replace(/มะรืน(นี้)?/g, " "); }
  else if (/วันนี้/.test(text)) { text = text.replace(/วันนี้/g, " "); }
  else {
    for (const d of DOW) {
      const m = text.match(d.re);
      if (m) {
        const cur = today.getDay();
        const diff = (d.dow - cur + 7) % 7;     // วันนี้=0, ที่เหลือคือถัดไป
        day.setDate(day.getDate() + diff);
        text = text.replace(d.re, " ");
        break;
      }
    }
  }

  // ---- เวลา ----
  let h = 9, min = 0;
  let m: RegExpMatchArray | null;
  if ((m = text.match(/(\d{1,2})[:.](\d{2})/))) {
    h = +m[1]; min = +m[2]; text = text.replace(m[0], " ");
  } else if (/เที่ยงคืน/.test(text)) {
    h = 0; text = text.replace(/เที่ยงคืน/g, " ");
  } else if (/เที่ยง/.test(text)) {
    h = 12; text = text.replace(/เที่ยง/g, " ");
  } else if (/บ่ายโมง/.test(text)) {
    h = 13; text = text.replace(/บ่ายโมง/g, " ");
  } else if ((m = text.match(/บ่าย\s*(\d{1,2})\s*(โมง)?/))) {
    h = 12 + (+m[1] % 12); text = text.replace(m[0], " ");
  } else if ((m = text.match(/(\d{1,2})\s*ทุ่ม/))) {
    h = 18 + (+m[1]); text = text.replace(m[0], " ");
  } else if ((m = text.match(/(\d{1,2})\s*โมง\s*(เช้า|เย็น)?/))) {
    h = +m[1]; if (m[2] === "เย็น" && h < 12) h += 12; text = text.replace(m[0], " ");
  } else if ((m = text.match(/(\d{1,2})\s*น\.?/))) {
    h = +m[1]; text = text.replace(m[0], " ");
  }
  if (h > 23) h = 23;

  // ---- ชนิด ----
  let type: EventType = "note";
  for (const t of TYPE_KW) if (t.re.test(text)) { type = t.type; break; }

  // ---- ชื่อ (ตัดคำเชื่อมที่เหลือ) ----
  const title = text
    .replace(/\b(ตอน|เวลา|ที่|วัน|น\.)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!title) return null;

  const start = iso(day, h, min);
  const endH = h + 1;
  const end = iso(day, endH > 23 ? 23 : endH, endH > 23 ? 59 : min);

  return { title, type, start, end };
}
