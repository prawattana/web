// รายจ่าย — ใช้ localStorage key เดิมของแอปเก่า (xp_cats2 / xp_data2) ข้อมูลเดิมไม่หาย
export interface Category { id: string; name: string; icon: string; color: string; }
export interface Expense { id: string; amount: number; note?: string; date: string; categoryId: string; }

export const DEFAULT_CATS: Category[] = [
  { id: "spaylater", name: "Spaylater", icon: "💳", color: "#ff9500" },
  { id: "scash", name: "Scash", icon: "💵", color: "#34c759" },
  { id: "electric", name: "ค่าไฟ", icon: "⚡", color: "#ffd60a" },
  { id: "ais", name: "AIS", icon: "📱", color: "#007aff" },
  { id: "nt", name: "NT", icon: "🌐", color: "#5856d6" },
  { id: "fuel", name: "ค่าน้ำมัน", icon: "⛽", color: "#ff3b30" },
  { id: "insurance", name: "ค่าประกัน", icon: "🛡️", color: "#30d158" },
  { id: "exam", name: "ค่าสอบกองทุน", icon: "📋", color: "#bf5af2" },
  { id: "other", name: "อื่นๆ", icon: "📦", color: "#8e8e93" },
];

const K_CATS = "xp_cats2";
const K_DATA = "xp_data2";

export function loadCats(): Category[] {
  try { const r = localStorage.getItem(K_CATS); return r ? JSON.parse(r) : [...DEFAULT_CATS]; }
  catch { return [...DEFAULT_CATS]; }
}
export function loadExpenses(): Expense[] {
  try { const r = localStorage.getItem(K_DATA); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
export function saveCats(c: Category[]) { localStorage.setItem(K_CATS, JSON.stringify(c)); }
export function saveExpenses(e: Expense[]) { localStorage.setItem(K_DATA, JSON.stringify(e)); }

export function fmtMoney(n: number): string {
  return "฿" + Number(n).toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const TH_MONTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return TH_MONTH[parseInt(m) - 1] + " " + (parseInt(y) + 543); // พ.ศ.
}
