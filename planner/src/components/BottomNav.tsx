import Icon, { type IconName } from "./Icon";

export type Tab = "overview" | "schedule" | "exercise" | "expense";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

const TABS: { key: Tab; icon: IconName; label: string }[] = [
  { key: "overview", icon: "home", label: "ภาพรวม" },
  { key: "schedule", icon: "calendar", label: "ตาราง" },
  { key: "exercise", icon: "activity", label: "ออกกำลัง" },
  { key: "expense", icon: "wallet", label: "รายจ่าย" },
];

export default function BottomNav({ tab, onChange }: Props) {
  return (
    <nav className="glass nav-safe z-30 flex shrink-0 items-stretch justify-around rounded-t-2xl px-2 pt-1.5">
      {TABS.map((t) => {
        const active = tab === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition active:scale-90 ${
              active ? "text-[#ff5a64]" : "text-[#8a8a92]"}`}>
            <Icon name={t.icon} size={23} strokeWidth={active ? 2.2 : 1.8} />
            <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
