import { useEffect } from "react";
import { loadState } from "../data/store";
import { loadNotify, showNotification } from "../data/notify";

const CHECK_MS = 30_000;       // ตรวจทุก 30 วิ
const NOTIFIED_KEY = "wk_notified";

function loadNotified(): Record<string, number> {
  try { const r = localStorage.getItem(NOTIFIED_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveNotified(m: Record<string, number>) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(m));
}

/** เด้งเตือนกิจกรรมที่กำลังจะเริ่มภายใน lead นาที (ทำงานทุกแท็บ ตราบใดที่แอปเปิดอยู่) */
export function useReminders() {
  useEffect(() => {
    const tick = () => {
      const cfg = loadNotify();
      if (!cfg.enabled) return;

      const now = Date.now();
      const leadMs = cfg.lead * 60_000;
      const notified = loadNotified();
      let changed = false;

      for (const e of loadState().events) {
        if (e.type === "break") continue;            // ข้ามช่วงพัก ไม่ต้องเตือน
        const t = new Date(e.start).getTime();
        if (Number.isNaN(t)) continue;
        // อยู่ในช่วง [now, now+lead] และยังไม่เคยเตือน
        if (t > now && t <= now + leadMs && !notified[e.id]) {
          const mins = Math.max(1, Math.round((t - now) / 60_000));
          showNotification(`อีก ${mins} นาที: ${e.title || "กิจกรรม"}`, `เริ่ม ${e.start.slice(11, 16)} น.`);
          notified[e.id] = now;
          changed = true;
        }
      }

      // ล้างรายการที่เตือนไปนานเกิน 1 วัน กันไฟล์โต
      for (const id in notified) if (now - notified[id] > 86_400_000) { delete notified[id]; changed = true; }
      if (changed) saveNotified(notified);
    };

    tick();
    const iv = setInterval(tick, CHECK_MS);
    return () => clearInterval(iv);
  }, []);
}
