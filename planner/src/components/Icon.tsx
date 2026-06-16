import type { ReactNode } from "react";

export type IconName = "home" | "calendar" | "activity" | "wallet" | "plus" | "flame";

const PATHS: Record<IconName, ReactNode> = {
  home: (<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.8V21h14V9.8" /></>),
  calendar: (<><rect x="3" y="4.5" width="18" height="17" rx="3.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>),
  activity: (<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  wallet: (<><rect x="3" y="6" width="18" height="14" rx="3.5" /><path d="M3 9.5h13.5a1.5 1.5 0 0 1 1.5 1.5" /><circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" /></>),
  plus: (<path d="M12 5v14M5 12h14" />),
  flame: (<path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.4.6-2.4 1.3-3.2C9.8 9 10 7.5 12 3Z" />),
};

export default function Icon({ name, size = 24, className, strokeWidth = 1.8 }: {
  name: IconName; size?: number; className?: string; strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {PATHS[name]}
    </svg>
  );
}
