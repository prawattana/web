import { useCallback, useEffect, useRef, useState } from "react";
import { showNotification } from "../data/notify";

export const DEFAULT_FOCUS = 50;
export const DEFAULT_BREAK = 10;
type Phase = "idle" | "focus" | "break";

interface Stored {
  phase: Phase;
  endTime: number | null;   // เวลาจบ (ms) ตอนกำลังเดิน
  remaining: number | null; // เวลาที่เหลือ (ms) ตอนพัก (paused)
}
const KEY = "wk_pomo";
const CFG_KEY = "wk_pomo_cfg";
const DEFAULT: Stored = { phase: "idle", endTime: null, remaining: null };

function load(): Stored {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULT, ...JSON.parse(r) } : { ...DEFAULT }; }
  catch { return { ...DEFAULT }; }
}

interface Cfg { focus: number; break: number }
const clampMin = (n: number) => Math.min(180, Math.max(1, Math.round(n) || DEFAULT_FOCUS));
function loadCfg(): Cfg {
  try {
    const r = localStorage.getItem(CFG_KEY);
    if (r) { const c = JSON.parse(r); return { focus: clampMin(c.focus ?? DEFAULT_FOCUS), break: clampMin(c.break ?? DEFAULT_BREAK) }; }
  } catch { /* ignore */ }
  return { focus: DEFAULT_FOCUS, break: DEFAULT_BREAK };
}

export function usePomodoro() {
  const [st, setSt] = useState<Stored>(() => load());
  const [cfg, setCfg] = useState<Cfg>(() => loadCfg());
  const [, force] = useState(0);            // บังคับ re-render ทุกวินาที
  const stRef = useRef(st);  stRef.current = st;
  const cfgRef = useRef(cfg); cfgRef.current = cfg;

  const update = useCallback((next: Stored) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setSt(next);
  }, []);

  const setDurations = useCallback((focus: number, brk: number) => {
    const c: Cfg = { focus: clampMin(focus), break: clampMin(brk) };
    localStorage.setItem(CFG_KEY, JSON.stringify(c));
    setCfg(c);
  }, []);

  // เดินนาฬิกาทุกวินาที + สลับเฟสเมื่อหมดเวลา
  useEffect(() => {
    const iv = setInterval(() => {
      const cur = stRef.current;
      if (cur.endTime != null && Date.now() >= cur.endTime) {
        if (cur.phase === "focus") {
          showNotification("หมดช่วงโฟกัส 🎯", `พัก ${cfgRef.current.break} นาที ลุกยืน/ยืดเส้น`);
          update({ phase: "break", endTime: Date.now() + cfgRef.current.break * 60_000, remaining: null });
        } else {
          showNotification("พักครบแล้ว ☕", "พร้อมโฟกัสรอบต่อไป");
          update({ phase: "idle", endTime: null, remaining: null });
        }
      }
      force((n) => n + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [update]);

  const running = st.endTime != null;
  const remainingMs = running ? Math.max(0, (st.endTime ?? 0) - Date.now()) : (st.remaining ?? 0);

  const startFocus = () => update({ phase: "focus", endTime: Date.now() + cfg.focus * 60_000, remaining: null });
  const startBreak = () => update({ phase: "break", endTime: Date.now() + cfg.break * 60_000, remaining: null });
  const pause = () => { if (st.endTime != null) update({ phase: st.phase, endTime: null, remaining: Math.max(0, st.endTime - Date.now()) }); };
  const resume = () => { if (st.remaining != null) update({ phase: st.phase, endTime: Date.now() + st.remaining, remaining: null }); };
  const reset = () => update({ ...DEFAULT });

  return { phase: st.phase, running, remainingMs, focusMin: cfg.focus, breakMin: cfg.break, setDurations, startFocus, startBreak, pause, resume, reset };
}

export type Pomodoro = ReturnType<typeof usePomodoro>;
