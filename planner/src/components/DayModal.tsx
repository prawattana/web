import { useEffect, useState } from "react";
import type { DayOverride } from "../types";

interface Props {
  date: string | null;             // "YYYY-MM-DD" หรือ null = ปิด
  override?: DayOverride;
  onToggleOff: (date: string) => void;
  onSaveNote: (date: string, note: string) => void;
  onClose: () => void;
}

const DOW = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

export default function DayModal({ date, override, onToggleOff, onSaveNote, onClose }: Props) {
  const [note, setNote] = useState("");
  useEffect(() => { setNote(override?.dayNote ?? ""); }, [date, override?.dayNote]);

  if (!date) return null;
  const d = new Date(`${date}T00:00:00`);
  const label = `${DOW[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  const isOff = override?.isOff ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}>
      <div className="glass w-full max-w-md rounded-[26px] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-tight text-white">{label}</h2>
          <button onClick={onClose} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full text-[#a8a8b0]">✕</button>
        </div>

        <button onClick={() => onToggleOff(date)}
          className={`mb-5 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-95 ${
            isOff ? "btn-primary" : "btn-glass text-[#f2f2f5]"}`}>
          {isOff ? "● วันหยุด/ไม่ว่าง (แตะเพื่อยกเลิก)" : "○ มาร์กเป็นวันหยุด/ไม่ว่าง"}
        </button>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">โน้ตรวมของวันนี้</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
          placeholder="แผนรวมของวัน / เป้าหมาย / สิ่งที่ต้องเตรียม..."
          className="field mb-5 w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-white" />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-glass rounded-2xl px-5 py-2.5 text-sm font-medium text-[#a8a8b0]">ปิด</button>
          <button onClick={() => { onSaveNote(date, note.trim()); onClose(); }}
            className="btn-primary rounded-2xl px-6 py-2.5 text-sm font-semibold">บันทึกโน้ต</button>
        </div>
      </div>
    </div>
  );
}
