import { type RefObject } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventInput } from "@fullcalendar/core";
import type { DayOverride, PlannerEvent } from "../types";
import { ymd } from "../data/recurrence";

interface Props {
  calendarRef: RefObject<FullCalendar | null>;
  initialView: string;
  events: PlannerEvent[];
  overrides: Record<string, DayOverride>;
  onEventClick: (id: string) => void;
  onEventChange: (id: string, start: string, end: string) => void;
  onAddAt: (start: Date) => void;
  onHeaderClick: (date: string) => void;
  onDatesSet: (info: { title: string; start: Date; viewType: string }) => void;
}

function toLocalIso(d: Date) {
  return `${ymd(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`;
}

export default function Calendar(p: Props) {
  const fcEvents: EventInput[] = p.events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    classNames: [`ev-${e.type}`],
    extendedProps: { note: e.note, type: e.type },
  }));

  return (
    <FullCalendar
      ref={p.calendarRef}
      plugins={[timeGridPlugin, interactionPlugin, listPlugin]}
      initialView={p.initialView}
      firstDay={1}
      headerToolbar={false}
      slotMinTime="07:00:00"
      slotMaxTime="24:00:00"
      scrollTime="08:00:00"
      allDaySlot={false}
      nowIndicator
      height="100%"
      stickyHeaderDates
      locale="th"
      noEventsContent="ไม่มีกิจกรรม"
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      events={fcEvents}
      editable
      longPressDelay={250}
      eventDurationEditable
      selectable={false}
      eventClick={(arg) => p.onEventClick(arg.event.id)}
      eventDrop={(arg) => {
        if (arg.event.start && arg.event.end)
          p.onEventChange(arg.event.id, toLocalIso(arg.event.start), toLocalIso(arg.event.end));
      }}
      eventResize={(arg) => {
        if (arg.event.start && arg.event.end)
          p.onEventChange(arg.event.id, toLocalIso(arg.event.start), toLocalIso(arg.event.end));
      }}
      dateClick={(arg) => p.onAddAt(arg.date)}
      datesSet={(arg) => p.onDatesSet({ title: arg.view.title, start: arg.start, viewType: arg.view.type })}
      dayCellClassNames={(arg) => (p.overrides[ymd(arg.date)]?.isOff ? ["fc-day-off"] : [])}
      dayHeaderContent={(arg) => {
        const key = ymd(arg.date);
        const ov = p.overrides[key];
        return (
          <button
            onClick={(e) => { e.stopPropagation(); p.onHeaderClick(key); }}
            className="flex w-full flex-col items-center py-1 leading-tight"
          >
            <span className="text-[11px] text-[#a8a8b0]">{arg.text}</span>
            <span className="flex items-center gap-1 text-xs">
              {ov?.isOff && <span className="rounded bg-[#c81f2c] px-1 text-[10px] text-white">หยุด</span>}
              {ov?.dayNote && <span title="มีโน้ต">📝</span>}
            </span>
          </button>
        );
      }}
      eventContent={(arg) => (
        <div className="overflow-hidden px-1">
          <div className="truncate">
            <span className="mono opacity-80">{arg.timeText}</span> {arg.event.title}
            {arg.event.extendedProps.note ? " 📝" : ""}
          </div>
        </div>
      )}
    />
  );
}
