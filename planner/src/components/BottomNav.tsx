export type Tab = "schedule" | "exercise" | "expense";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: "schedule", icon: "📅", label: "ตาราง" },
  { key: "exercise", icon: "💪", label: "ออกกำลัง" },
  { key: "expense", icon: "💰", label: "รายจ่าย" },
];

export default function BottomNav({ tab, onChange }: Props) {
  return (
    <nav className="glass nav-safe z-30 flex shrink-0 items-stretch justify-around rounded-t-2xl px-2 pt-1.5">
      {TABS.map((t) => {
        const active = tab === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 transition active:scale-95 ${
              active ? "text-white" : "text-[#8a8a92]"}`}>
            <span className={`text-xl leading-none transition ${active ? "" : "grayscale opacity-70"}`}>{t.icon}</span>
            <span className={`text-[10px] font-semibold ${active ? "text-[#ff5a64]" : ""}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
