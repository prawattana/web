import { useCallback, useEffect, useState } from "react";
import BottomNav, { type Tab } from "./components/BottomNav";
import OverviewScreen from "./screens/OverviewScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import ExpenseScreen from "./screens/ExpenseScreen";
import TodoScreen from "./screens/TodoScreen";
import { useReminders } from "./hooks/useReminders";
import { usePomodoro } from "./hooks/usePomodoro";
import { pushFocus } from "./data/focusBridge";

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");
  const [navCollapsed, setNavCollapsed] = useState(() => localStorage.getItem("nav_collapsed") === "1");

  // ผูกแท็บเข้ากับประวัติเบราว์เซอร์ → ปุ่มย้อนกลับพากลับแท็บก่อนหน้า
  useEffect(() => {
    history.replaceState({ tab: "overview" }, "");
    const onPop = (e: PopStateEvent) => setTab(((e.state as { tab?: Tab } | null)?.tab) ?? "overview");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((t: Tab) => {
    setTab((cur) => {
      if (t !== cur) history.pushState({ tab: t }, "");
      return t;
    });
  }, []);

  // ตัวเตือน + Pomodoro อยู่ระดับแอป → ทำงานต่อเนื่องทุกแท็บ
  useReminders();
  const pomo = usePomodoro();

  // ส่งสถานะให้เลขโฟกัสบนเดสก์ท็อป (เริ่ม/หยุด/พัก/สลับเฟส)
  useEffect(() => {
    pushFocus(pomo.phase, pomo.running, pomo.remainingMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomo.phase, pomo.running]);

  const toggleNav = () =>
    setNavCollapsed((c) => {
      const next = !c;
      localStorage.setItem("nav_collapsed", next ? "1" : "0");
      return next;
    });

  return (
    <div className="flex h-full flex-col md:flex-row">
      <BottomNav tab={tab} onChange={go} collapsed={navCollapsed} onToggleCollapse={toggleNav} />
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "overview" && <OverviewScreen onNavigate={go} pomo={pomo} />}
        {tab === "schedule" && <ScheduleScreen />}
        {tab === "todo" && <TodoScreen />}
        {tab === "exercise" && <ExerciseScreen />}
        {tab === "expense" && <ExpenseScreen />}
      </div>
    </div>
  );
}
