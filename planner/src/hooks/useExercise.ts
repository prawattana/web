import { useCallback, useEffect, useMemo, useState } from "react";
import { type Workout, computeFire, loadWorkouts, saveWorkouts } from "../data/exercise";

export function useExercise() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => loadWorkouts());
  useEffect(() => { saveWorkouts(workouts); }, [workouts]);

  const addWorkout = useCallback((w: Workout) => setWorkouts((s) => [...s, w]), []);
  const updateWorkout = useCallback((id: string, patch: Partial<Workout>) =>
    setWorkouts((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))), []);
  const deleteWorkout = useCallback((id: string) =>
    setWorkouts((s) => s.filter((x) => x.id !== id)), []);

  const fire = useMemo(() => computeFire(workouts), [workouts]);

  return { workouts, addWorkout, updateWorkout, deleteWorkout, fire };
}
