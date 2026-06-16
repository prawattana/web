import { useState } from "react";
import BottomNav, { type Tab } from "./components/BottomNav";
import ScheduleScreen from "./screens/ScheduleScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import ExpenseScreen from "./screens/ExpenseScreen";

export default function App() {
  const [tab, setTab] = useState<Tab>("schedule");

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "schedule" && <ScheduleScreen />}
        {tab === "exercise" && <ExerciseScreen />}
        {tab === "expense" && <ExpenseScreen />}
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
