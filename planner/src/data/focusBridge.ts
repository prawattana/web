// สะพานคุยกับ widget เลขโฟกัสบนเดสก์ท็อป (focus-timer/focus-widget.ps1) ผ่าน HTTP localhost
// ใช้ได้เมื่อเปิดเว็บผ่าน http://localhost (dev/preview) — บนเว็บ HTTPS เบราว์เซอร์บล็อก mixed content
const BASE = "http://localhost:48120";

type Phase = "idle" | "focus" | "break";

/** ส่งสถานะ Pomodoro ไปให้ widget (idle = ซ่อนเลข) — ยิงแล้วลืม ถ้าโปรแกรมไม่เปิดก็เงียบ */
export function pushFocus(phase: Phase, running: boolean, remainingMs: number) {
  const sec = Math.max(0, Math.round(remainingMs / 1000));
  const url = phase === "idle"
    ? `${BASE}/stop`
    : `${BASE}/set?state=${running ? "running" : "paused"}&phase=${phase}&sec=${sec}`;
  fetch(url).catch(() => { /* ไม่ได้เปิดโปรแกรม widget */ });
}

/** เช็กว่าโปรแกรม widget เปิดอยู่ไหม */
export async function pingFocus(): Promise<boolean> {
  try { const r = await fetch(`${BASE}/state`); return r.ok; }
  catch { return false; }
}
