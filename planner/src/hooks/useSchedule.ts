import { useCallback, useEffect, useState } from "react";
import type { DayOverride, PlannerEvent, ScheduleState } from "../types";
import { loadState, saveState } from "../data/store";
import { mondayOf, seedWeek, weekDates, ymd } from "../data/recurrence";
import { AUTO_OFF_DAYS } from "../data/template";

const SEED_WEEKS = 104; // seed ตารางล่วงหน้า 2 ปี

function seedInto(state: ScheduleState, monday: Date): ScheduleState {
  const key = ymd(monday);
  if (state.seededWeeks.includes(key)) return state;
  const events = [...state.events, ...seedWeek(monday)];
  const overrides = { ...state.overrides };
  const dates = weekDates(monday);
  // auto-off (อาทิตย์) — ตั้งให้ครั้งแรกเท่านั้น ผู้ใช้ปรับทีหลังได้
  for (const dow of AUTO_OFF_DAYS) {
    const d = dates[dow === 0 ? 6 : dow - 1];
    if (!overrides[d]) overrides[d] = { date: d, isOff: true };
  }
  return { ...state, events, overrides, seededWeeks: [...state.seededWeeks, key] };
}

/** seed หลายสัปดาห์ติดกันจากจันทร์ที่ให้มา (ข้ามสัปดาห์ที่ seed แล้ว) */
function seedRange(state: ScheduleState, startMonday: Date, weeks: number): ScheduleState {
  let s = state;
  for (let i = 0; i < weeks; i++) {
    const m = new Date(startMonday);
    m.setDate(startMonday.getDate() + i * 7);
    s = seedInto(s, m);
  }
  return s;
}

export function useSchedule() {
  const [state, setState] = useState<ScheduleState>(() => {
    // โหลด + seed ตาราง 2 ปีข้างหน้า (ครั้งแรกเท่านั้น ครั้งต่อไปข้ามเพราะ seededWeeks มีแล้ว)
    return seedRange(loadState(), mondayOf(new Date()), SEED_WEEKS);
  });

  // บันทึกอัตโนมัติทุกครั้งที่ state เปลี่ยน
  useEffect(() => { saveState(state); }, [state]);

  /** seed สัปดาห์ที่ผู้ใช้เลื่อนไป ถ้ายังไม่เคย */
  const ensureWeek = useCallback((date: Date) => {
    setState((s) => seedInto(s, mondayOf(date)));
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<PlannerEvent>) => {
    setState((s) => ({ ...s, events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  }, []);

  const addEvent = useCallback((e: PlannerEvent) => {
    setState((s) => ({ ...s, events: [...s.events, e] }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
  }, []);

  const toggleOff = useCallback((date: string) => {
    setState((s) => {
      const cur = s.overrides[date];
      const next: DayOverride = { date, isOff: !(cur?.isOff), dayNote: cur?.dayNote };
      return { ...s, overrides: { ...s.overrides, [date]: next } };
    });
  }, []);

  const setDayNote = useCallback((date: string, dayNote: string) => {
    setState((s) => {
      const cur = s.overrides[date];
      const next: DayOverride = { date, isOff: cur?.isOff ?? false, dayNote };
      return { ...s, overrides: { ...s.overrides, [date]: next } };
    });
  }, []);

  /** ล้าง override + event recurring แล้ว seed สัปดาห์ปัจจุบันใหม่ */
  const resetToTemplate = useCallback(() => {
    setState(() => {
      const fresh: ScheduleState = { events: [], overrides: {}, seededWeeks: [] };
      return seedRange(fresh, mondayOf(new Date()), SEED_WEEKS);
    });
  }, []);

  return { state, ensureWeek, updateEvent, addEvent, deleteEvent, toggleOff, setDayNote, resetToTemplate };
}
