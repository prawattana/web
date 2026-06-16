import { useEffect, useState } from "react";
import type { Category, Expense } from "../data/expense";

interface Props {
  expense: Expense | null;   // null = ปิด
  isNew?: boolean;
  cats: Category[];
  onSave: (e: Expense) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function ExpenseModal({ expense, isNew, cats, onSave, onDelete, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(cats[0]?.id ?? "other");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!expense) return;
    setAmount(expense.amount ? String(expense.amount) : "");
    setCategoryId(expense.categoryId);
    setDate(expense.date);
    setNote(expense.note ?? "");
  }, [expense]);

  if (!expense) return null;

  const save = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    onSave({ ...expense, amount: amt, categoryId, date, note: note.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="glass w-full max-w-md rounded-[26px] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold tracking-tight text-white">{isNew ? "เพิ่มรายจ่าย" : "แก้ไขรายจ่าย"}</h2>
          <button onClick={onClose} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full text-[#a8a8b0]">✕</button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">จำนวนเงิน (฿)</label>
        <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="0" autoFocus={isNew}
          className="field mono mb-4 w-full rounded-2xl px-4 py-3 text-2xl font-bold text-white" />

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">หมวดหมู่</label>
        <div className="mb-4 grid grid-cols-3 gap-1.5">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setCategoryId(c.id)}
              className={`flex items-center gap-1.5 rounded-2xl border px-2 py-2 text-xs transition active:scale-95 ${
                categoryId === c.id ? "border-[#d81e2c] text-white" : "border-white/10 text-[#a8a8b0]"}`}
              style={categoryId === c.id ? { background: c.color + "26" } : undefined}>
              <span>{c.icon}</span><span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">วันที่</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="field mb-4 w-full rounded-2xl px-4 py-2.5 text-white" />

        <label className="mb-1.5 block text-xs font-medium text-[#a8a8b0]">โน้ต</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="(ไม่บังคับ)"
          className="field mb-5 w-full rounded-2xl px-4 py-2.5 text-white" />

        <div className="flex items-center justify-between gap-2">
          {!isNew ? (
            <button onClick={() => onDelete(expense.id)} className="btn-glass rounded-2xl px-4 py-2.5 text-sm font-medium text-[#ff5a64]">ลบ</button>
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
