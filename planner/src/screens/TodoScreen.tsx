import { useMemo, useState } from "react";
import Icon from "../components/Icon";
import { useTodos } from "../hooks/useTodos";

export default function TodoScreen() {
  const { todos, add, toggle, remove, clearDone } = useTodos();
  const [text, setText] = useState("");

  const { open, done } = useMemo(() => ({
    open: todos.filter((t) => !t.done),
    done: todos.filter((t) => t.done),
  }), [todos]);

  const submit = () => { add(text); setText(""); };

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 pb-28 pt-safe md:mx-auto md:w-full md:max-w-2xl md:px-8 md:pb-10 md:pt-8">
      <div className="mb-4 mt-1 md:mb-6">
        <div className="text-sm text-[#a8a8b0]">ค้าง {open.length} · เสร็จ {done.length}</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">งานที่ต้องทำ</h1>
      </div>

      {/* ช่องเพิ่มงาน */}
      <div className="mb-4 flex gap-2">
        <input
          className="field rounded-xl px-3 py-2.5 text-sm"
          placeholder="เพิ่มงาน… (กด Enter)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        />
        <button onClick={submit} className="btn-primary flex shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold">
          เพิ่ม
        </button>
      </div>

      {/* งานค้าง */}
      <div className="space-y-2">
        {open.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center text-sm text-[#a8a8b0]">ไม่มีงานค้าง 🎉</div>
        )}
        {open.map((t) => (
          <div key={t.id} className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5">
            <button onClick={() => toggle(t.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/25 text-transparent transition hover:border-[#ff5a64]">
              <Icon name="check" size={16} />
            </button>
            <span className="flex-1 text-sm text-white">{t.text}</span>
            <button onClick={() => remove(t.id)} className="shrink-0 text-[#8a8a92] hover:text-[#ff5a64]">
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* งานเสร็จแล้ว */}
      {done.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8a92]">เสร็จแล้ว</span>
            <button onClick={clearDone} className="text-xs text-[#a8a8b0] hover:text-[#ff5a64]">ล้างที่เสร็จ</button>
          </div>
          <div className="space-y-2">
            {done.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-2xl px-3 py-2 opacity-60">
                <button onClick={() => toggle(t.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#c81f2c] text-white">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                </button>
                <span className="flex-1 text-sm text-[#a8a8b0] line-through">{t.text}</span>
                <button onClick={() => remove(t.id)} className="shrink-0 text-[#8a8a92] hover:text-[#ff5a64]">
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
