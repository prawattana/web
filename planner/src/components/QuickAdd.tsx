import { useEffect, useMemo, useState } from "react";
import { parseQuickAdd } from "../data/quickadd";
import { ymd } from "../data/recurrence";
import { TYPE_STYLE, type EventType, type PlannerEvent } from "../types";

const pad = (n: number) => String(n).padStart(2, "0");
const TH_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function defaultDateTime() {
  const d = new Date();
  return { date: ymd(d), time: `${pad(Math.min(23, d.getHours() + 1))}:00` };
}

interface AddInput { title: string; type: EventType; start: string; end: string }

export default function QuickAdd({ onAdd, onDelete }: { onAdd: (p: AddInput) => PlannerEvent; onDelete: (id: string) => void }) {
  const init = defaultDateTime();
  const [text, setText] = useState("");
  const [date, setDate] = useState(init.date);
  const [time, setTime] = useState(init.time);
  const [touched, setTouched] = useState(false);   // ผู้ใช้แก้วัน/เวลาเองหรือยัง
  const [recent, setRecent] = useState<PlannerEvent[]>([]);

  const parsed = useMemo(() => parseQuickAdd(text), [text]);

  // พิมพ์ภาษาคน → เติมวัน/เวลาให้ (ถ้ายังไม่ได้แก้เอง)
  useEffect(() => {
    if (parsed && !touched) { setDate(parsed.start.slice(0, 10)); setTime(parsed.start.slice(11, 16)); }
  }, [parsed, touched]);

  const submit = () => {
    const title = (parsed?.title ?? text).trim();
    if (!title) return;
    const [hh, mm] = time.split(":").map(Number);
    const endH = hh + 1 > 23 ? 23 : hh + 1;
    const ev = onAdd({
      title,
      type: parsed?.type ?? "note",
      start: `${date}T${time}:00`,
      end: `${date}T${pad(endH)}:${pad(mm)}:00`,
    });
    setRecent((r) => [ev, ...r].slice(0, 6));
    setText(""); setTouched(false);
    const d = defaultDateTime(); setDate(d.date); setTime(d.time);
  };

  const removeRecent = (id: string) => { onDelete(id); setRecent((r) => r.filter((e) => e.id !== id)); };

  const evLabel = (e: PlannerEvent) => {
    const d = new Date(`${e.start.slice(0, 10)}T00:00:00`);
    return `${TH_DOW[d.getDay()]} ${d.getDate()} · ${e.start.slice(11, 16)}`;
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="field min-w-0 flex-1 rounded-xl px-3 py-2 text-sm"
          placeholder='พิมพ์เร็ว เช่น "พรุ่งนี้ 14:00 ประชุมทีม"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        />
        <button onClick={submit} disabled={!(parsed?.title ?? text).trim()}
          className="btn-primary shrink-0 rounded-xl px-4 text-sm font-semibold disabled:opacity-40">
          เพิ่ม
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        <input type="date" value={date}
          onChange={(e) => { setDate(e.target.value); setTouched(true); }}
          className="field min-w-0 flex-1 rounded-xl px-2 py-2 text-sm" />
        <input type="time" value={time}
          onChange={(e) => { setTime(e.target.value); setTouched(true); }}
          className="field min-w-0 flex-1 rounded-xl px-2 py-2 text-sm" />
      </div>

      {parsed && text.trim() && (
        <div className="mt-1 px-1 text-[11px] text-[#a8a8b0]">
          → <span className="text-white">{parsed.title}</span> · {TYPE_STYLE[parsed.type].label}
        </div>
      )}

      {recent.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {recent.map((e) => (
            <span key={e.id} className="flex items-center gap-1.5 rounded-lg bg-white/5 py-1 pl-2 pr-1 text-[11px] text-[#d4d4dc]">
              <span className="mono text-[#a8a8b0]">{evLabel(e)}</span>
              <span className="max-w-[120px] truncate">{e.title}</span>
              <button onClick={() => removeRecent(e.id)} title="ลบรายการนี้"
                className="flex h-4 w-4 items-center justify-center rounded text-[#8a8a92] hover:bg-white/10 hover:text-[#ff5a64]">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
