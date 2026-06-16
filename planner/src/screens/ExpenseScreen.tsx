import { useMemo, useState } from "react";
import { useExpense } from "../hooks/useExpense";
import { type Expense, fmtMoney, monthLabel, uid } from "../data/expense";
import ExpenseModal from "../components/ExpenseModal";

function curYm() { return new Date().toISOString().slice(0, 7); }
function shiftYm(ym: string, d: number) {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(y, m - 1 + d, 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}
const TH_DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function ExpenseScreen() {
  const ex = useExpense();
  const [ym, setYm] = useState(curYm());
  const [editing, setEditing] = useState<Expense | null>(null);
  const [isNew, setIsNew] = useState(false);

  const monthExp = useMemo(
    () => ex.expenses.filter((e) => e.date.startsWith(ym)).sort((a, b) => b.date.localeCompare(a.date)),
    [ex.expenses, ym]
  );
  const total = monthExp.reduce((s, e) => s + e.amount, 0);

  const catBars = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExp) map[e.categoryId] = (map[e.categoryId] ?? 0) + e.amount;
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([cid, amt]) => ({ cat: ex.getCat(cid), amt }));
  }, [monthExp, ex]);

  // group by date
  const byDate = useMemo(() => {
    const m: Record<string, Expense[]> = {};
    for (const e of monthExp) (m[e.date] ??= []).push(e);
    return Object.entries(m).sort((a, b) => b[0].localeCompare(a[0]));
  }, [monthExp]);

  const openNew = () => {
    const today = new Date().toISOString().slice(0, 10);
    const date = today.startsWith(ym) ? today : `${ym}-01`;
    setEditing({ id: uid(), amount: 0, date, categoryId: ex.cats[0]?.id ?? "other" });
    setIsNew(true);
  };

  const save = (e: Expense) => {
    if (isNew) ex.addExpense(e); else ex.updateExpense(e.id, e);
    setEditing(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-safe pb-2">
        <h1 className="mb-3 text-lg font-bold tracking-tight text-white">รายจ่าย</h1>
        {/* เลือกเดือน + ยอดรวม */}
        <div className="glass rounded-2xl p-4">
          <div className="mb-1 flex items-center justify-between">
            <button onClick={() => setYm(shiftYm(ym, -1))} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full">‹</button>
            <span className="text-sm font-semibold text-[#e9e9ee]">{monthLabel(ym)}</span>
            <button onClick={() => setYm(shiftYm(ym, 1))} className="btn-glass flex h-8 w-8 items-center justify-center rounded-full">›</button>
          </div>
          <div className="mono text-center text-3xl font-bold text-white">{fmtMoney(total)}</div>
          <div className="text-center text-xs text-[#a8a8b0]">{monthExp.length} รายการ</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        {/* สรุปหมวด */}
        {catBars.length > 0 && (
          <div className="glass mb-3 rounded-2xl p-3">
            <div className="mb-2 text-xs font-semibold text-[#a8a8b0]">แยกตามหมวด</div>
            {catBars.map(({ cat, amt }) => (
              <div key={cat.id} className="mb-2 last:mb-0">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[#e9e9ee]">{cat.icon} {cat.name}</span>
                  <span className="mono text-[#e9e9ee]">{fmtMoney(amt)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full" style={{ width: `${(amt / total) * 100}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* รายการ */}
        {byDate.length === 0 && <div className="mt-10 text-center text-sm text-[#a8a8b0]">เดือนนี้ยังไม่มีรายจ่าย</div>}
        {byDate.map(([date, items]) => {
          const d = new Date(`${date}T00:00:00`);
          const dayTotal = items.reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} className="mb-3">
              <div className="mb-1.5 flex items-center justify-between px-1 text-xs text-[#a8a8b0]">
                <span>{TH_DOW[d.getDay()]} {d.getDate()}/{d.getMonth() + 1}</span>
                <span className="mono">{fmtMoney(dayTotal)}</span>
              </div>
              <div className="glass overflow-hidden rounded-2xl">
                {items.map((e) => {
                  const cat = ex.getCat(e.categoryId);
                  return (
                    <button key={e.id} onClick={() => { setEditing(e); setIsNew(false); }}
                      className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2.5 text-left last:border-0 active:bg-white/5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-base" style={{ background: cat.color + "26" }}>{cat.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-white">{e.note || cat.name}</span>
                        <span className="block text-xs text-[#a8a8b0]">{cat.name}</span>
                      </span>
                      <span className="mono text-sm font-semibold text-white">{fmtMoney(e.amount)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={openNew}
        className="btn-primary fab-above-nav fixed right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none shadow-xl">
        +
      </button>

      <ExpenseModal
        expense={editing}
        isNew={isNew}
        cats={ex.cats}
        onSave={save}
        onDelete={(id) => { ex.deleteExpense(id); setEditing(null); }}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
