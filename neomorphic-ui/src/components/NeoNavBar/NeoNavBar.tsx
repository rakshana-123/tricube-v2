import type { ReactNode } from "react";
import { NeoIcon, type IconName } from "../NeoIcon/NeoIcon";
import styles from "./NeoNavBar.module.css";

export interface NavAction {
  icon: IconName;
  label: string;
  onClick?(): void;
}

export interface NeoNavBarProps {
  title: ReactNode;
  leading?: NavAction[];
  trailing?: NavAction[];
  /** Renders the 44px dark global bar instead of the 52px frosted sub-nav */
  global?: boolean;
}

/**
 * NeoNavBar — frosted navigation (MD sub-nav-frosted / global-nav).
 *
 * Frosted recipe is the MD's, verbatim: `backdrop-filter: saturate(180%)
 * blur(20px)` over a 72%-opacity canvas. Heights follow the MD — 44px
 * global, 52px sub-nav — and both respect safe-area-inset-top so the bar
 * clears the notch on standalone/PWA installs.
 */
export function NeoNavBar({ title, leading = [], trailing = [], global = false }: NeoNavBarProps) {
  return (
    <header
      className={[styles.bar, global ? styles.global : styles.sub].join(" ")}
      data-theme={global ? "dark" : undefined}
    >
      <div className={styles.side}>
        {leading.map((a) => (
          <button key={a.label} className={styles.iconBtn} onClick={a.onClick} aria-label={a.label}>
            <NeoIcon name={a.icon} size={20} />
          </button>
        ))}
      </div>
      <div className={`${styles.title} type-body-strong`}>{title}</div>
      <div className={styles.side}>
        {trailing.map((a) => (
          <button key={a.label} className={styles.iconBtn} onClick={a.onClick} aria-label={a.label}>
            <NeoIcon name={a.icon} size={20} />
          </button>
        ))}
      </div>
    </header>
  );
}

export interface NeoTab {
  icon: IconName;
  label: string;
  active?: boolean;
  onClick?(): void;
}

/**
 * NeoTabBar — floating pill tab bar (MD floating-sticky-bar anatomy, 64px).
 * A raised pearl capsule that hovers over content; active tab floods with
 * the highlight tint and gains the accent icon color.
 */
export function NeoTabBar({ tabs }: { tabs: NeoTab[] }) {
  return (
    <nav className={styles.tabbar} aria-label="Primary">
      {tabs.map((t) => (
        <button
          key={t.label}
          className={[styles.tab, t.active ? styles.tabActive : ""].join(" ")}
          aria-current={t.active ? "page" : undefined}
          onClick={t.onClick}
        >
          <NeoIcon name={t.icon} size={22} />
          <span className={`${styles.tabLabel} type-nav-link`}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
