import { useCallback, useEffect, useState } from "react";
import {
  type Category, type Expense,
  loadCats, loadExpenses, saveCats, saveExpenses,
} from "../data/expense";

export function useExpense() {
  const [cats, setCats] = useState<Category[]>(() => loadCats());
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());

  useEffect(() => { saveCats(cats); }, [cats]);
  useEffect(() => { saveExpenses(expenses); }, [expenses]);

  const addExpense = useCallback((e: Expense) => setExpenses((s) => [...s, e]), []);
  const updateExpense = useCallback((id: string, patch: Partial<Expense>) =>
    setExpenses((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))), []);
  const deleteExpense = useCallback((id: string) =>
    setExpenses((s) => s.filter((x) => x.id !== id)), []);

  const getCat = useCallback((id: string): Category =>
    cats.find((c) => c.id === id) ?? { id: "?", name: "ไม่ระบุ", icon: "❓", color: "#8e8e93" }, [cats]);

  return { cats, expenses, addExpense, updateExpense, deleteExpense, getCat, setCats };
}
