import { useEffect, useState } from "react";
import type { EventType, PlannerEvent } from "../types";
import { TYPE_STYLE } from "../types";

interface Props {
  event: PlannerEvent | null;   // null = ปิด
  isNew?: boolean;
  onSave: (e: PlannerEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const TYPES: EventType[] = ["work", "exercise", "trade", "break", "note"];

function split(iso: string) {
  const [d, t] = iso.split("T");
  return { date: d, time: (t ?? "00:00").slice(0, 5) };
}

/** สร้าง ISO local จาก date+time; ถ้า end <= start ให้ end เป็นวันถัดไป (ข้ามเที่ยงคืน) */
function compose(date: string, startT: string, endT: string) {
  const start = `${date}T${startT}:00`;
  let endDate = date;
  if (endT <= startT) {
    const d = new Date(`${date}T00:00:00`);
    d.setDate(d.getDate() + 1);
    endDate = d.toISOString().slice(0, 10);
  }
  return { start, end: `${endDate}T${endT}:00` };
}

export default function EventModal({ event, isNew, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("work");
  const [date, setDate] = useState("");
  const [startT, setStartT] = useState("09:00");
  const [endT, setEndT] = useState("10:00");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!event) return;
    const s = split(event.start);
    const e = split(event.end);
    setTitle(event.title);
    setType(event.type);
    setDate(s.date);
    setStartT(s.time);
    setEndT(e.time);
    setNote(event.note ?? "");
  }, [event]);

  if (!event) return null;

  const save = () => {
    const { start, end } = compose(date, startT, endT);
    onSave({ ...event, title: title.trim() || TYPE_STYLE[type].label, type, start, end, note: note.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}>
      <div className="glass w-full max-w-md rounded-[26px] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-tight text-white">{isNew ? "เพิ่มกิจกรรม" : "แก้ไขกิจกรรม"}</h2>
          <button onClick={onClose} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full text-[#a8a8b0]">✕</button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">ชื่อ</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="field mb-4 w-full rounded-2xl px-4 py-2.5 text-white" />

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">ประเภท</label>
        <div className="mb-4 grid grid-cols-5 gap-1.5">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-2xl px-1 py-2.5 text-xs font-medium transition active:scale-95 ${
                type === t ? "btn-primary" : "btn-glass text-[#a8a8b0]"}`}>
              {TYPE_STYLE[t].label}
            </button>
          ))}
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">วันที่</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="field mb-4 w-full rounded-2xl px-4 py-2.5 text-white" />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">เริ่ม</label>
            <input type="time" value={startT} onChange={(e) => setStartT(e.target.value)}
              className="field mono rounded-2xl px-3 py-2.5 text-white" />
          </div>
          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">จบ</label>
            <input type="time" value={endT} onChange={(e) => setEndT(e.target.value)}
              className="field mono rounded-2xl px-3 py-2.5 text-white" />
          </div>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">โน้ตวางแผน</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
          placeholder="เช่น โฟกัสงานไหน / แผนเทรดวันนี้..."
          className="field mb-5 w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-white" />

        <div className="flex items-center justify-between gap-2">
          {!isNew ? (
            <button onClick={() => onDelete(event.id)} className="btn-glass rounded-2xl px-4 py-2.5 text-sm font-medium text-[#ff5a64]">ลบ</button>
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
