/**
 * NeoIcon — SF-Symbols-inspired line iconography.
 * 24×24 grid · 1.75px stroke · round caps/joins · currentColor.
 */
import type { SVGProps } from "react";

export type IconName =
  | "house"
  | "search"
  | "heart"
  | "gear"
  | "person"
  | "bell"
  | "sun"
  | "moon"
  | "chevron-right"
  | "chevron-left"
  | "check"
  | "close"
  | "plus"
  | "sliders"
  | "sparkle"
  | "grid"
  | "wifi"
  | "battery"
  | "play"
  | "pause";

const PATHS: Record<IconName, React.ReactNode> = {
  house: (
    <>
      <path d="M4 11.2 12 4.5l8 6.7" />
      <path d="M6 10.4V19a1 1 0 0 0 1 1h3.4v-4.6h3.2V20H17a1 1 0 0 0 1-1v-8.6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m15.6 15.6 4.2 4.2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.4-4.6-9-9.1C1.7 7 3.6 4 6.7 4c2 0 3.5 1 4.3 2.5h2c.8-1.5 2.3-2.5 4.3-2.5 3.1 0 5 3 3.7 6.9-1.6 4.5-9 9.1-9 9.1Z" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.8 13.9 5h2.8l.9 2.7 2.5 1.3-.5 2.8 1.6 2.4-1.9 2.1-.2 2.9-2.8.7-1.8 2.2-2.7-1-2.7 1-1.8-2.2-2.8-.7-.2-2.9-1.9-2.1 1.6-2.4-.5-2.8L5.7 7.7 6.6 5h2.8L11.3 2.8Z" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.8 20c.7-3.7 3.6-5.7 7.2-5.7s6.5 2 7.2 5.7" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2.2H4.4L6 16.5Z" />
      <path d="M9.8 21.2a2.4 2.4 0 0 0 4.4 0" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.1M12 18.9V21M3 12h2.1M18.9 12H21M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  "chevron-right": <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  "chevron-left": <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  check: <path d="m5 12.5 4.6 4.6L19 7.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  sliders: (
    <>
      <path d="M5 7.5h8M17 7.5h2M5 16.5h2M11 16.5h8" />
      <circle cx="15" cy="7.5" r="2.1" />
      <circle cx="9" cy="16.5" r="2.1" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6L4.5 10.8 10.2 9 12 3.5ZM18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  ),
  grid: (
    <>
      <rect x="4.5" y="4.5" width="6.2" height="6.2" rx="1.4" />
      <rect x="13.3" y="4.5" width="6.2" height="6.2" rx="1.4" />
      <rect x="4.5" y="13.3" width="6.2" height="6.2" rx="1.4" />
      <rect x="13.3" y="13.3" width="6.2" height="6.2" rx="1.4" />
    </>
  ),
  wifi: (
    <path d="M3.5 9.5a13 13 0 0 1 17 0M6.5 13a8.6 8.6 0 0 1 11 0M9.6 16.4a4.2 4.2 0 0 1 4.8 0M12 19.6h.01" />
  ),
  battery: (
    <>
      <rect x="3" y="8" width="15.5" height="8" rx="2.2" />
      <path d="M21 11v2" />
      <path d="M6 11v2M9 11v2M12 11v2" />
    </>
  ),
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
};

export interface NeoIconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: IconName;
  size?: number;
}

export function NeoIcon({ name, size = 24, ...rest }: NeoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
