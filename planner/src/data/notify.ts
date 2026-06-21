// แจ้งเตือนผ่านเบราว์เซอร์ (Web Notification + service worker)
export interface NotifySettings {
  enabled: boolean;
  lead: number;        // เตือนล่วงหน้ากี่นาที
}

const KEY = "wk_notify";
const DEFAULT: NotifySettings = { enabled: false, lead: 10 };

export function loadNotify(): NotifySettings {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULT, ...JSON.parse(r) } : { ...DEFAULT }; }
  catch { return { ...DEFAULT }; }
}
export function saveNotify(s: NotifySettings) { localStorage.setItem(KEY, JSON.stringify(s)); }

export function notifySupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function permission(): NotificationPermission {
  return notifySupported() ? Notification.permission : "denied";
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!notifySupported()) return "denied";
  try { return await Notification.requestPermission(); }
  catch { return "denied"; }
}

/** เด้งแจ้งเตือน — ใช้ service worker ถ้ามี (เสถียรกว่า) ไม่งั้น new Notification */
export async function showNotification(title: string, body: string) {
  if (!notifySupported() || Notification.permission !== "granted") return;
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) { await reg.showNotification(title, { body, icon: "/pwa-192.png", badge: "/pwa-192.png" }); return; }
    }
  } catch { /* fallback */ }
  try { new Notification(title, { body, icon: "/pwa-192.png" }); } catch { /* ignore */ }
}
