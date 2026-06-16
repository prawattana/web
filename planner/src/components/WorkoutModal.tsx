import { useEffect, useState } from "react";
import { type Workout, MOVE_PRESETS } from "../data/exercise";

interface Props {
  workout: Workout | null;   // null = ปิด
  isNew?: boolean;
  onSave: (w: Workout) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function WorkoutModal({ workout, isNew, onSave, onDelete, onClose }: Props) {
  const [date, setDate] = useState("");
  const [moves, setMoves] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!workout) return;
    setDate(workout.date);
    setMoves(workout.moves ?? []);
    setNote(workout.note ?? "");
    setCustom("");
  }, [workout]);

  if (!workout) return null;

  const toggle = (m: string) => setMoves((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));
  const addCustom = () => {
    const v = custom.trim();
    if (v && !moves.includes(v)) setMoves((s) => [...s, v]);
    setCustom("");
  };

  const save = () => onSave({ ...workout, date, moves, note: note.trim() || undefined });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="glass w-full max-w-md rounded-[26px] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-tight text-white">{isNew ? "บันทึกออกกำลังกาย 💪" : "แก้ไข"}</h2>
          <button onClick={onClose} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full text-[#a8a8b0]">✕</button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">วันที่</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="field mb-4 w-full rounded-2xl px-4 py-2.5 text-white" />

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">ท่า/ประเภท</label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {MOVE_PRESETS.map((m) => (
            <button key={m} onClick={() => toggle(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                moves.includes(m) ? "btn-primary" : "btn-glass text-[#a8a8b0]"}`}>
              {m}
            </button>
          ))}
        </div>
        {/* ท่าที่พิมพ์เอง */}
        {moves.filter((m) => !MOVE_PRESETS.includes(m)).map((m) => (
          <button key={m} onClick={() => toggle(m)} className="btn-primary mb-1 mr-1.5 rounded-full px-3 py-1.5 text-xs font-medium">{m} ✕</button>
        ))}
        <div className="mb-4 mt-1 flex gap-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
            placeholder="เพิ่มท่าเอง..." className="field flex-1 rounded-2xl px-4 py-2 text-sm text-white" />
          <button onClick={addCustom} className="btn-glass rounded-2xl px-4 text-sm">เพิ่ม</button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">โน้ต</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="(ไม่บังคับ)"
          className="field mb-5 w-full rounded-2xl px-4 py-2.5 text-white" />

        <div className="flex items-center justify-between gap-2">
          {!isNew ? (
            <button onClick={() => onDelete(workout.id)} className="btn-glass rounded-2xl px-4 py-2.5 text-sm font-medium text-[#ff5a64]">ลบ</button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-glass rounded-2xl px-5 py-2.5 text-sm font-medium text-[#a8a8b0]">ยกเลิก</button>
            <button onClick={save} className="btn-primary rounded-2xl px-6 py-2.5 text-sm font-semibold">บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  );
}
