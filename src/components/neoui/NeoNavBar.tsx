import type { ReactNode } from "react";
import { NeoIcon, type IconName } from "./NeoIcon";
import { FROSTED_RECIPE } from "./NeoUI";
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
 * NeoNavBar — frosted navigation. MD recipe verbatim:
 * `backdrop-filter: saturate(180%) blur(20px)` over 72% canvas; 44px global
 * dark bar / 52px frosted sub-nav; both respect safe-area-inset-top.
 */
export function NeoNavBar({ title, leading = [], trailing = [], global = false }: NeoNavBarProps) {
  return (
    <header
      className={[styles.bar, global ? styles.global : styles.sub].join(" ")}
      style={{
        backdropFilter: FROSTED_RECIPE,
        WebkitBackdropFilter: FROSTED_RECIPE,
      }}
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
 * NeoTabBar — floating pill tab bar (MD floating-sticky-bar anatomy).
 * Raised pearl capsule hovering over content; active tab floods with the
 * highlight tint and gains the accent icon color.
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
