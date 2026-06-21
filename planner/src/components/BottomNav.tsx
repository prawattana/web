import Icon, { type IconName } from "./Icon";

export type Tab = "overview" | "schedule" | "todo" | "exercise" | "expense";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const TABS: { key: Tab; icon: IconName; label: string }[] = [
  { key: "overview", icon: "home", label: "ภาพรวม" },
  { key: "schedule", icon: "calendar", label: "ตาราง" },
  { key: "todo", icon: "checkSquare", label: "งาน" },
  { key: "exercise", icon: "activity", label: "ออกกำลัง" },
  { key: "expense", icon: "wallet", label: "รายจ่าย" },
];

/* แถบล่างบนมือถือ / แถบข้างซ้ายบนคอม (responsive + ย่อเก็บได้บนคอม) */
export default function BottomNav({ tab, onChange, collapsed, onToggleCollapse }: Props) {
  return (
    <nav
      className={`glass z-30 order-last flex shrink-0 items-stretch justify-around rounded-t-2xl px-2 pt-1.5 nav-safe
                  md:order-first md:flex-col md:items-stretch md:justify-start md:gap-1 md:rounded-none md:rounded-r-3xl md:py-5 md:pb-5
                  md:transition-[width] ${collapsed ? "md:w-16 md:px-2" : "md:w-56 md:px-3"}`}
    >
      {/* หัวแอป + ปุ่มย่อ/ขยาย (เฉพาะคอม) */}
      <div className={`hidden md:mb-4 md:flex md:items-center ${collapsed ? "md:justify-center" : "md:justify-between md:px-2"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-[#ff4d57] to-[#c81f2c] shadow-[0_0_10px_rgba(255,59,70,0.6)]" />
            <span className="text-base font-extrabold tracking-tight text-white">My Day</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "ขยายแถบเมนู" : "ย่อแถบเมนู"}
          className="btn-glass flex h-8 w-8 items-center justify-center rounded-lg text-base text-[#a8a8b0]"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {TABS.map((t) => {
        const active = tab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            title={collapsed ? t.label : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition active:scale-90
                        md:flex-none md:flex-row md:gap-3 md:py-2.5 md:active:scale-100 md:hover:bg-white/5
                        ${collapsed ? "md:justify-center md:px-0" : "md:justify-start md:px-3"} ${
              active
                ? "text-[#ff5a64] md:bg-white/10 md:text-white"
                : "text-[#8a8a92] md:text-[#a8a8b0]"
            }`}
          >
            <Icon name={t.icon} size={23} strokeWidth={active ? 2.2 : 1.8} />
            <span className={`text-[10px] md:text-sm ${collapsed ? "md:hidden" : ""} ${active ? "font-bold" : "font-medium"}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
