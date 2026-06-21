import { useState } from "react";
import Icon from "./Icon";
import { loadNotify, saveNotify, requestPermission, permission, notifySupported, type NotifySettings } from "../data/notify";

const LEADS = [5, 10, 15, 30];

export default function NotifySettingsCard() {
  const [cfg, setCfg] = useState<NotifySettings>(() => loadNotify());
  const [perm, setPerm] = useState(permission());

  const apply = (next: NotifySettings) => { saveNotify(next); setCfg(next); };

  const toggle = async () => {
    if (!cfg.enabled) {
      const p = await requestPermission();
      setPerm(p);
      if (p !== "granted") { apply({ ...cfg, enabled: false }); return; }
      apply({ ...cfg, enabled: true });
    } else {
      apply({ ...cfg, enabled: false });
    }
  };

  if (!notifySupported()) return null;

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center gap-2 text-[#ff7a82]">
        <Icon name="bell" size={18} /><span className="text-sm font-semibold">แจ้งเตือนกิจกรรม</span>
        <button onClick={toggle}
          className={`ml-auto relative h-6 w-11 rounded-full transition ${cfg.enabled ? "bg-[#c81f2c]" : "bg-white/15"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${cfg.enabled ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>

      {cfg.enabled ? (
        <div>
          <div className="mb-1.5 text-xs text-[#a8a8b0]">เตือนล่วงหน้า</div>
          <div className="flex gap-1.5">
            {LEADS.map((l) => (
              <button key={l} onClick={() => apply({ ...cfg, lead: l })}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  cfg.lead === l ? "btn-primary" : "bg-white/5 text-[#a8a8b0]"}`}>
                {l} นาที
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-[#a8a8b0]">
          {perm === "denied" ? "เบราว์เซอร์บล็อกการแจ้งเตือน — เปิดสิทธิ์ในตั้งค่าเว็บไซต์ก่อน" : "เปิดเพื่อเด้งเตือนก่อนถึงกิจกรรม (เทรด/ออกกำลัง/งาน)"}
        </div>
      )}
    </div>
  );
}
