interface Props {
  onReset: () => void;
}

export default function Toolbar({ onReset }: Props) {
  return (
    <header className="glass pt-safe sticky top-0 z-10 flex items-center justify-between rounded-b-xl px-3 pb-1.5">
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-gradient-to-b from-[#ff4d57] to-[#c81f2c] shadow-[0_0_8px_rgba(255,59,70,0.6)]" />
        <h1 className="text-[13px] font-bold tracking-tight text-white">ตารางสัปดาห์</h1>
      </div>
      <button
        onClick={() => {
          if (confirm("รีเซ็ตกลับเป็นตารางมาตรฐาน? โน้ตและการแก้ไขทั้งหมดจะหายไป")) onReset();
        }}
        className="btn-glass rounded-full px-3 py-1 text-[11px] font-medium text-[#a8a8b0]"
      >
        รีเซ็ต
      </button>
    </header>
  );
}
