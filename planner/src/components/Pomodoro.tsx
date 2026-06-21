import { useEffect, useState } from "react";
import Icon from "./Icon";
import { type Pomodoro as PomoState } from "../hooks/usePomodoro";
import { pingFocus } from "../data/focusBridge";

function fmt(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const LABEL: Record<string, string> = { idle: "พร้อมโฟกัส", focus: "กำลังโฟกัส", break: "พัก" };
const PRESETS = [25, 50, 90];

export default function Pomodoro({ pomo }: { pomo: PomoState }) {
  const { phase, running, remainingMs, focusMin, breakMin } = pomo;
  const display = phase === "idle" ? `${String(focusMin).padStart(2, "0")}:00` : fmt(remainingMs);

  const [linked, setLinked] = useState<boolean | null>(null);
  useEffect(() => { pingFocus().then(setLinked); }, [phase]);

  const [editing, setEditing] = useState(false);
  const [f, setF] = useState(String(focusMin));
  const [b, setB] = useState(String(breakMin));

  const openEdit = () => { setF(String(focusMin)); setB(String(breakMin)); setEditing(true); };
  const saveEdit = () => { pomo.setDurations(Number(f), Number(b)); setEditing(false); };

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-2 flex items-center gap-2 text-[#ff7a82]">
        <Icon name="clock" size={18} /><span className="text-sm font-semibold">โฟกัส (Pomodoro)</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
          phase === "focus" ? "bg-[#c81f2c] text-white" : phase === "break" ? "bg-white/15 text-white" : "text-[#a8a8b0]"}`}>
          {LABEL[phase]}
        </span>
      </div>

      <div className={`mono text-center text-4xl font-extrabold tracking-tight ${phase === "break" ? "text-[#a8a8b0]" : "text-white"}`}>
        {display}
      </div>

      {/* แก้ไขเวลาโฟกัส/พัก */}
      {editing ? (
        <div className="mt-3 rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] text-[#a8a8b0]">โฟกัส (นาที)</span>
              <input type="number" min={1} max={180} value={f} onChange={(e) => setF(e.target.value)}
                className="field rounded-lg px-2 py-1.5 text-sm" />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] text-[#a8a8b0]">พัก (นาที)</span>
              <input type="number" min={1} max={180} value={b} onChange={(e) => setB(e.target.value)}
                className="field rounded-lg px-2 py-1.5 text-sm" />
            </label>
          </div>
          <div className="mt-2 flex gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setF(String(p))}
                className="flex-1 rounded-lg bg-white/5 py-1 text-xs font-semibold text-[#a8a8b0] transition hover:text-white">
                {p} น.
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={saveEdit} className="btn-primary flex-1 rounded-lg py-1.5 text-sm font-semibold">บันทึก</button>
            <button onClick={() => setEditing(false)} className="btn-glass rounded-lg px-4 py-1.5 text-sm font-semibold">ยกเลิก</button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          {phase === "idle" && (
            <button onClick={pomo.startFocus} className="btn-primary flex-1 rounded-xl py-2 text-sm font-semibold">เริ่มโฟกัส {focusMin} นาที</button>
          )}
          {phase !== "idle" && running && (
            <button onClick={pomo.pause} className="btn-glass flex-1 rounded-xl py-2 text-sm font-semibold">หยุดชั่วคราว</button>
          )}
          {phase !== "idle" && !running && (
            <button onClick={pomo.resume} className="btn-primary flex-1 rounded-xl py-2 text-sm font-semibold">ไปต่อ</button>
          )}
          {phase === "idle" ? (
            <button onClick={openEdit} title="แก้ไขเวลา" className="btn-glass flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold">
              ⚙︎
            </button>
          ) : (
            <button onClick={pomo.reset} className="btn-glass rounded-xl px-4 py-2 text-sm font-semibold">รีเซ็ต</button>
          )}
        </div>
      )}

      {linked === false && (
        <div className="mt-2 text-[11px] text-[#8a8a92]">
          🖥️ เปิดโปรแกรม Focus (เริ่มโฟกัส.bat) เพื่อให้เลขลอยบนจอ
        </div>
      )}
    </div>
  );
}
