export interface StripDay {
  date: string;       // YYYY-MM-DD
  dow: string;        // อา จ อ ...
  day: number;        // เลขวันที่
  hasEvents: boolean;
  isActive: boolean;
  isToday: boolean;
  isOff: boolean;
}

type View = "timeGridDay" | "timeGridWeek" | "listWeek";

interface Props {
  title: string;
  view: View;
  strip: StripDay[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onView: (v: View) => void;
  onPickDay: (date: string) => void;
  onAdd: () => void;
}

const VIEWS: { key: View; label: string }[] = [
  { key: "timeGridDay", label: "วัน" },
  { key: "timeGridWeek", label: "สัปดาห์" },
  { key: "listWeek", label: "รายการ" },
];

export default function CalendarHeader({ title, view, strip, onPrev, onNext, onToday, onView, onPickDay, onAdd }: Props) {
  return (
    <div className="px-2.5 pt-1.5 md:px-4 md:pt-3">
      {/* แถวบน: นำทาง + ชื่อ + วันนี้  (บนคอมรวม segmented + ปุ่มเพิ่มในแถวเดียว) */}
      <div className="mb-1.5 flex items-center gap-1.5 md:mb-3 md:gap-3">
        <button onClick={onPrev} className="btn-glass flex h-7 w-7 items-center justify-center rounded-full text-base md:h-9 md:w-9 md:text-xl">‹</button>
        <button onClick={onNext} className="btn-glass flex h-7 w-7 items-center justify-center rounded-full text-base md:h-9 md:w-9 md:text-xl">›</button>
        <button onClick={onToday} className="btn-glass rounded-full px-2.5 py-1 text-[11px] font-semibold md:px-4 md:py-1.5 md:text-sm">วันนี้</button>
        <h2 className="flex-1 truncate text-center text-[13px] font-bold tracking-tight text-white md:text-left md:text-xl">{title}</h2>

        {/* เฉพาะคอม: segmented + ปุ่มเพิ่ม */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <div className="flex gap-0.5 rounded-xl bg-white/5 p-0.5">
            {VIEWS.map((v) => (
              <button key={v.key} onClick={() => onView(v.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition hover:text-white ${
                  view === v.key ? "btn-primary" : "text-[#a8a8b0]"}`}>
                {v.label}
              </button>
            ))}
          </div>
          <button onClick={onAdd} className="btn-primary rounded-xl px-4 py-1.5 text-sm font-semibold">+ เพิ่ม</button>
        </div>
      </div>

      {/* segmented control (เฉพาะมือถือ) */}
      <div className="mb-1.5 flex gap-0.5 rounded-xl bg-white/5 p-0.5 md:hidden">
        {VIEWS.map((v) => (
          <button key={v.key} onClick={() => onView(v.key)}
            className={`flex-1 rounded-lg py-1 text-[11px] font-semibold transition active:scale-95 ${
              view === v.key ? "btn-primary" : "text-[#a8a8b0]"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* แถบวันแบบ iOS (เฉพาะมือถือ) */}
      {view !== "listWeek" && (
        <div className="mb-1 flex gap-1 overflow-x-auto pb-0.5 md:hidden">
          {strip.map((d) => (
            <button key={d.date} onClick={() => onPickDay(d.date)}
              className={`flex min-w-[34px] flex-1 flex-col items-center rounded-xl py-1 transition active:scale-95 ${
                d.isActive ? "btn-primary" : "bg-white/5 text-[#a8a8b0]"} ${d.isOff ? "opacity-50" : ""}`}>
              <span className="text-[9px] leading-none">{d.dow}</span>
              <span className={`mono text-[13px] font-bold leading-tight ${d.isActive ? "text-white" : "text-[#f2f2f5]"}`}>{d.day}</span>
              <span className={`h-[3px] w-[3px] rounded-full ${d.hasEvents ? (d.isActive ? "bg-white" : "bg-[#ff5a64]") : "bg-transparent"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
