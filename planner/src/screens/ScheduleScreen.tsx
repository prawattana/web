import { useMemo, useRef, useState } from "react";
import type FullCalendar from "@fullcalendar/react";
import Toolbar from "../components/Toolbar";
import Calendar from "../components/Calendar";
import CalendarHeader, { type StripDay } from "../components/CalendarHeader";
import EventModal from "../components/EventModal";
import DayModal from "../components/DayModal";
import QuickAdd from "../components/QuickAdd";
import { useSchedule } from "../hooks/useSchedule";
import type { PlannerEvent } from "../types";
import { genId, mondayOf, weekDates, ymd } from "../data/recurrence";

type View = "timeGridDay" | "timeGridWeek" | "listWeek";
const DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function ScheduleScreen() {
  const sched = useSchedule();
  const calRef = useRef<FullCalendar | null>(null);
  const api = () => calRef.current?.getApi();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [view, setView] = useState<View>(isMobile ? "timeGridDay" : "timeGridWeek");
  const [title, setTitle] = useState("");
  const [anchor, setAnchor] = useState(new Date());

  const [editing, setEditing] = useState<PlannerEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dayDate, setDayDate] = useState<string | null>(null);

  const eventDays = useMemo(() => {
    const s = new Set<string>();
    for (const e of sched.state.events) s.add(e.start.slice(0, 10));
    return s;
  }, [sched.state.events]);

  const strip: StripDay[] = useMemo(() => {
    const today = ymd(new Date());
    const active = ymd(anchor);
    return weekDates(mondayOf(anchor)).map((date) => {
      const d = new Date(`${date}T00:00:00`);
      return {
        date,
        dow: DOW[d.getDay()],
        day: d.getDate(),
        hasEvents: eventDays.has(date),
        isActive: view === "timeGridDay" && date === active,
        isToday: date === today,
        isOff: sched.state.overrides[date]?.isOff ?? false,
      };
    });
  }, [anchor, view, eventDays, sched.state.overrides]);

  const openExisting = (id: string) => {
    const e = sched.state.events.find((x) => x.id === id);
    if (e) { setEditing(e); setIsNew(false); }
  };

  const iso = (d: Date) => `${ymd(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`;

  const openNew = (start: Date) => {
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    setEditing({ id: genId(), title: "", type: "work", start: iso(start), end: iso(end) });
    setIsNew(true);
  };

  const openNewFab = () => {
    const d = new Date(anchor);
    const now = new Date();
    d.setHours(ymd(d) === ymd(now) ? now.getHours() + 1 : 9, 0, 0, 0);
    openNew(d);
  };

  const saveEvent = (e: PlannerEvent) => {
    if (isNew) sched.addEvent(e); else sched.updateEvent(e.id, e);
    setEditing(null);
  };

  const quickAdd = (p: { title: string; type: PlannerEvent["type"]; start: string; end: string }) => {
    const ev: PlannerEvent = { id: genId(), ...p };
    sched.addEvent(ev);
    api()?.gotoDate(p.start.slice(0, 10));
    return ev;
  };

  const changeView = (v: View) => { setView(v); api()?.changeView(v); };
  const pickDay = (date: string) => { setView("timeGridDay"); api()?.changeView("timeGridDay", date); };

  return (
    <div className="flex h-full flex-col">
      <Toolbar onReset={sched.resetToTemplate} />

      <CalendarHeader
        title={title}
        view={view}
        strip={strip}
        onPrev={() => api()?.prev()}
        onNext={() => api()?.next()}
        onToday={() => api()?.today()}
        onView={changeView}
        onPickDay={pickDay}
        onAdd={openNewFab}
      />

      <div className="px-2.5 pb-1 md:px-4 md:pb-2">
        <QuickAdd onAdd={quickAdd} onDelete={sched.deleteEvent} />
      </div>

      <main className="min-h-0 flex-1 px-2 pb-2">
        <Calendar
          calendarRef={calRef}
          initialView={view}
          events={sched.state.events}
          overrides={sched.state.overrides}
          onEventClick={openExisting}
          onEventChange={(id, start, end) => sched.updateEvent(id, { start, end })}
          onAddAt={openNew}
          onHeaderClick={setDayDate}
          onDatesSet={({ title, start, viewType }) => {
            setTitle(title);
            setAnchor(start);
            setView(viewType as View);
          }}
        />
      </main>

      <button onClick={openNewFab}
        className="btn-primary fab-above-nav fixed right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none shadow-xl md:hidden">
        +
      </button>

      <EventModal
        event={editing}
        isNew={isNew}
        onSave={saveEvent}
        onDelete={(id) => { sched.deleteEvent(id); setEditing(null); }}
        onClose={() => setEditing(null)}
      />

      <DayModal
        date={dayDate}
        override={dayDate ? sched.state.overrides[dayDate] : undefined}
        onToggleOff={sched.toggleOff}
        onSaveNote={sched.setDayNote}
        onClose={() => setDayDate(null)}
      />
    </div>
  );
}
