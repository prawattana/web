import { useCallback, useEffect, useState } from "react";
import { loadTodos, saveTodos, uid, type Todo } from "../data/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());

  useEffect(() => { saveTodos(todos); }, [todos]);

  const add = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [
      { id: uid(), text: t, done: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const toggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : undefined } : t,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done));
  }, []);

  return { todos, add, toggle, remove, clearDone };
}
