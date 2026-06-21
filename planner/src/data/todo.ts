// To-do รายวัน — งานที่ไม่ผูกเวลา ติ๊กเสร็จได้ (งานที่ยังไม่เสร็จยกยอดข้ามวันได้)
export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;   // ISO
  doneAt?: string;     // ISO ตอนติ๊กเสร็จ
}

const KEY = "wk_todos";

export function loadTodos(): Todo[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
export function saveTodos(t: Todo[]) { localStorage.setItem(KEY, JSON.stringify(t)); }

export function uid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
