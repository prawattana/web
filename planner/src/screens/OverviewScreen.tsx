import { useState } from "react";
import type { Tab } from "../components/BottomNav";
import Icon from "../components/Icon";
import Pomodoro from "../components/Pomodoro";
import NotifySettingsCard from "../components/NotifySettings";
import { loadState } from "../data/store";
import { computeFire, loadWorkouts } from "../data/exercise";
import { loadCats, loadExpenses, fmtMoney, monthLabel } from "../data/expense";
import { loadTodos } from "../data/todo";
import type { Pomodoro as PomoState } from "../hooks/usePomodoro";
import { TYPE_STYLE } from "../types";

const TH_FULL_DOW = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const TH_MONTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export default function OverviewScreen({ onNavigate, pomo }: { onNavigate: (t: Tab) => void; pomo: PomoState }) {
  // อ่าน snapshot ครั้งเดียวตอนเข้า (remount เมื่อสลับแท็บ → ได้ข้อมูลล่าสุดเสมอ)
  const [snap] = useState(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const ym = today.slice(0, 7);

    const st = loadState();
    const todayEvents = st.events
      .filter((e) => e.start.slice(0, 10) === today)
      .sort((a, b) => a.start.localeCompare(b.start));
    const isOff = st.overrides[today]?.isOff ?? false;

    const fire = computeFire(loadWorkouts());

    const exps = loadExpenses().filter((e) => e.date.startsWith(ym));
    const monthTotal = exps.reduce((s, e) => s + e.amount, 0);
    const cats = loadCats();
    const catMap: Record<string, number> = {};
    for (const e of exps) catMap[e.categoryId] = (catMap[e.categoryId] ?? 0) + e.amount;
    const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 2)
      .map(([cid, amt]) => ({ cat: cats.find((c) => c.id === cid), amt }));

    const openTodos = loadTodos().filter((t) => !t.done);

    return { now, today, ym, todayEvents, isOff, fire, monthTotal, topCats, openTodos };
  });

  const d = snap.now;
  const dateLabel = `${TH_FULL_DOW[d.getDay()]} ${d.getDate()} ${TH_MONTH[d.getMonth()]} ${d.getFullYear() + 543}`;

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 pb-28 pt-safe md:mx-auto md:w-full md:max-w-5xl md:px-8 md:pb-10 md:pt-8">
      <div className="mb-4 mt-1 md:mb-6">
        <div className="text-sm text-[#a8a8b0]">{dateLabel}</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">ภาพรวมวันนี้</h1>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-4 md:items-start">
      {/* การ์ดตารางวันนี้ */}
      <button onClick={() => onNavigate("schedule")} className="glass mb-3 w-full rounded-3xl p-4 text-left transition active:scale-[0.98] md:mb-0 md:hover:-translate-y-0.5">
        <div className="mb-2 flex items-center gap-2 text-[#ff7a82]">
          <Icon name="calendar" size={18} /><span className="text-sm font-semibold">ตารางวันนี้</span>
          {snap.isOff && <span className="ml-auto rounded-full bg-[#c81f2c] px-2 py-0.5 text-[10px] text-white">วันหยุด</span>}
        </div>
        {snap.todayEvents.length === 0 ? (
          <div className="text-sm text-[#a8a8b0]">ไม่มีกิจกรรมวันนี้</div>
        ) : (
          <div className="space-y-1">
            {snap.todayEvents.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-sm">
                <span className="mono text-[#a8a8b0]">{e.start.slice(11, 16)}</span>
                <span className="h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[e.type].border === "transparent" ? TYPE_STYLE[e.type].bg : TYPE_STYLE[e.type].border }} />
                <span className="truncate text-white">{e.title}</span>
              </div>
            ))}
            {snap.todayEvents.length > 4 && <div className="text-xs text-[#a8a8b0]">+ อีก {snap.todayEvents.length - 4} รายการ</div>}
          </div>
        )}
      </button>

      {/* การ์ดออกกำลังกาย */}
      <button onClick={() => onNavigate("exercise")} className="glass mb-3 w-full rounded-3xl p-4 text-left transition active:scale-[0.98] md:mb-0 md:hover:-translate-y-0.5">
        <div className="mb-2 flex items-center gap-2 text-[#ff7a82]">
          <Icon name="activity" size={18} /><span className="text-sm font-semibold">ออกกำลังกาย</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-3xl" style={{ filter: snap.fire.fire > 0 ? "none" : "grayscale(1) opacity(0.4)" }}>🔥</div>
          <div>
            <div className="text-xl font-extrabold text-white">
              {snap.fire.fire > 0 ? `${snap.fire.fire} สัปดาห์ติด` : "ไฟยังไม่ติด"}
            </div>
            <div className="text-xs text-[#a8a8b0]">สัปดาห์นี้ {snap.fire.thisWeek}/{snap.fire.target} วัน</div>
          </div>
        </div>
      </button>

      {/* การ์ดรายจ่าย */}
      <button onClick={() => onNavigate("expense")} className="glass w-full rounded-3xl p-4 text-left transition active:scale-[0.98] md:hover:-translate-y-0.5">
        <div className="mb-2 flex items-center gap-2 text-[#ff7a82]">
          <Icon name="wallet" size={18} /><span className="text-sm font-semibold">รายจ่าย {monthLabel(snap.ym)}</span>
        </div>
        <div className="mono text-2xl font-extrabold text-white">{fmtMoney(snap.monthTotal)}</div>
        {snap.topCats.length > 0 && (
          <div className="mt-1 flex gap-3 text-xs text-[#a8a8b0]">
            {snap.topCats.map(({ cat, amt }) => cat && (
              <span key={cat.id}>{cat.icon} {cat.name} {fmtMoney(amt)}</span>
            ))}
          </div>
        )}
      </button>

      {/* การ์ดงานที่ต้องทำ */}
      <button onClick={() => onNavigate("todo")} className="glass mb-3 w-full rounded-3xl p-4 text-left transition active:scale-[0.98] md:mb-0 md:hover:-translate-y-0.5">
        <div className="mb-2 flex items-center gap-2 text-[#ff7a82]">
          <Icon name="checkSquare" size={18} /><span className="text-sm font-semibold">งานที่ต้องทำ</span>
          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">{snap.openTodos.length} ค้าง</span>
        </div>
        {snap.openTodos.length === 0 ? (
          <div className="text-sm text-[#a8a8b0]">ไม่มีงานค้าง 🎉</div>
        ) : (
          <div className="space-y-1">
            {snap.openTodos.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5a64]" />
                <span className="truncate text-white">{t.text}</span>
              </div>
            ))}
            {snap.openTodos.length > 4 && <div className="text-xs text-[#a8a8b0]">+ อีก {snap.openTodos.length - 4} งาน</div>}
          </div>
        )}
      </button>

      {/* Pomodoro */}
      <div className="mb-3 md:mb-0"><Pomodoro pomo={pomo} /></div>

      {/* ตั้งค่าแจ้งเตือน */}
      <div className="mb-3 md:mb-0"><NotifySettingsCard /></div>
      </div>
    </div>
  );
}
