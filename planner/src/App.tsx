import { useState } from "react";
import BottomNav, { type Tab } from "./components/BottomNav";
import OverviewScreen from "./screens/OverviewScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import ExpenseScreen from "./screens/ExpenseScreen";

export default function App() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "overview" && <OverviewScreen onNavigate={setTab} />}
        {tab === "schedule" && <ScheduleScreen />}
        {tab === "exercise" && <ExerciseScreen />}
        {tab === "expense" && <ExpenseScreen />}
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
