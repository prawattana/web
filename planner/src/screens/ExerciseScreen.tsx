import { useState } from "react";
import { useExercise } from "../hooks/useExercise";
import { type Workout, uid } from "../data/exercise";
import { mondayOf, weekDates, ymd } from "../data/recurrence";
import WorkoutModal from "../components/WorkoutModal";

const WEEK_DOW = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
const TH_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function ExerciseScreen() {
  const ex = useExercise();
  const [editing, setEditing] = useState<Workout | null>(null);
  const [isNew, setIsNew] = useState(false);

  const f = ex.fire;
  const weekSet = new Set(f.weekDays);
  const week = weekDates(mondayOf(new Date()));
  const today = ymd(new Date());

  const logToday = () => {
    setEditing({ id: uid(), date: today, moves: [] });
    setIsNew(true);
  };
  const save = (w: Workout) => {
    if (!w.moves.length && !w.note) w.moves = ["ออกกำลังกาย"];
    if (isNew) ex.addWorkout(w); else ex.updateWorkout(w.id, w);
    setEditing(null);
  };

  const recent = [...ex.workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-safe pb-2">
        <h1 className="mb-3 text-lg font-bold tracking-tight text-white">ออกกำลังกาย</h1>

        {/* การ์ดไฟ */}
        <div className="glass rounded-3xl p-5 text-center">
          <div className="text-6xl" style={{ filter: f.fire > 0 ? "none" : "grayscale(1) opacity(0.4)" }}>🔥</div>
          {f.fire > 0 ? (
            <>
              <div className="mono text-4xl font-extrabold text-white">{f.fire}</div>
              <div className="text-sm text-[#ffb3b8]">สัปดาห์ติดต่อกัน</div>
            </>
          ) : (
            <div className="mt-1 text-sm text-[#a8a8b0]">ไฟยังไม่ติด — ออกครบ {f.target} วัน/สัปดาห์ ไฟจะติด</div>
          )}

          {/* ความคืบหน้าสัปดาห์นี้ */}
          <div className="mt-4 flex justify-center gap-1.5">
            {week.map((d, i) => {
              const done = weekSet.has(d);
              const isToday = d === today;
              return (
                <div key={d} className={`flex h-9 w-9 flex-col items-center justify-center rounded-full text-[11px] ${
                  done ? "btn-primary" : "bg-white/6 text-[#a8a8b0]"} ${isToday && !done ? "ring-1 ring-[#ff5a64]" : ""}`}>
                  <span>{WEEK_DOW[i]}</span>
                  <span className="text-[10px]">{done ? "✓" : ""}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-[#a8a8b0]">สัปดาห์นี้ {f.thisWeek}/{f.target} วัน
            {f.thisWeek >= f.target ? " — ครบแล้ว 🎉" : ` (อีก ${f.target - f.thisWeek} วันไฟติด)`}</div>
        </div>

        <button onClick={logToday} className="btn-primary mt-3 w-full rounded-2xl py-3 text-sm font-semibold">
          + บันทึกว่าวันนี้ออกแล้ว
        </button>
      </div>

      {/* ประวัติ */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        <div className="mb-2 mt-1 text-xs font-semibold text-[#a8a8b0]">ประวัติ</div>
        {recent.length === 0 && <div className="mt-8 text-center text-sm text-[#a8a8b0]">ยังไม่มีบันทึก</div>}
        <div className="glass overflow-hidden rounded-2xl">
          {recent.map((w) => {
            const d = new Date(`${w.date}T00:00:00`);
            return (
              <button key={w.id} onClick={() => { setEditing(w); setIsNew(false); }}
                className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2.5 text-left last:border-0 active:bg-white/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff5a64]/15 text-base">💪</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white">{TH_DOW[d.getDay()]} {d.getDate()}/{d.getMonth() + 1}</span>
                  <span className="block truncate text-xs text-[#a8a8b0]">{w.moves.join(" · ") || "ออกกำลังกาย"}{w.note ? ` — ${w.note}` : ""}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <WorkoutModal
        workout={editing}
        isNew={isNew}
        onSave={save}
        onDelete={(id) => { ex.deleteWorkout(id); setEditing(null); }}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
