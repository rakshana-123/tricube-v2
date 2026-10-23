import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { COMPANY, COURSES, EVENTS } from "@/lib/site-data";
import { NEO_TYPE_SIZES, NeoUI, useNeoUI } from "../NeoUI";
import { NeoButton } from "../NeoButton";
import { NeoCard } from "../NeoCard";
import { NeoChip } from "../NeoChip";
import { NeoIcon } from "../NeoIcon";
import { NeoInput } from "../NeoInput";
import { NeoNavBar, NeoTabBar } from "../NeoNavBar";
import { NeoSegmented } from "../NeoSegmented";
import { NeoSlider } from "../NeoSlider";
import { NeoToggle } from "../NeoToggle";
import styles from "./StudioApp.module.css";

type Tab = "home" | "browse" | "profile";
type Sort = "popular" | "price" | "rating";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/**
 * StudioApp — TRI CUBE's learner surface on the white-primary neomorphic
 * theme with the brand system pixel-sampled from the logo set: brand blue
 * #265CA0 carries all interaction, navy #0E263A is the inverse/dark ground,
 * teal marks live states, gold marks premium.
 */
export function StudioApp() {
  return (
    <NeoUI>
      <StudioShell />
    </NeoUI>
  );
}

function StudioShell() {
  const navigate = useNavigate();
  const { theme, toggleTheme, typeKey, setTypeKey } = useNeoUI();
  const [tab, setTab] = useState<Tab>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(true);

  if (!signedIn) {
    return <StudioAuth onSignedIn={() => setSignedIn(true)} />;
  }

  return (
    <div>
      <NeoNavBar
        title={
          <span className={styles.navLockup}>
            <img src="/tricube-logo-square.jpg" alt="" className={styles.navLogo} />
            <span>TRI CUBE Studio</span>
          </span>
        }
        leading={[{ icon: "chevron-left", label: "Back to site", onClick: () => void navigate({ to: "/" }) }]}
        trailing={[
          { icon: theme === "light" ? "moon" : "sun", label: "Toggle theme", onClick: toggleTheme },
          { icon: "gear", label: "Settings", onClick: () => setSettingsOpen((o) => !o) },
        ]}
      />

      {settingsOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setSettingsOpen(false)} aria-hidden />
          <div className={styles.settingsCard}>
            <NeoCard padding="sm">
              <p className="type-caption-strong">Appearance</p>
              <NeoSegmented
                full
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
                value={theme}
                onValueChange={(v) => v !== theme && toggleTheme()}
              />
              <p className="type-caption-strong" style={{ marginTop: "var(--space-sm)" }}>
                Text size
              </p>
              <NeoSegmented
                full
                options={NEO_TYPE_SIZES.map((s) => ({ value: s.key, label: s.label }))}
                value={typeKey}
                onValueChange={(v) => setTypeKey(v as typeof typeKey)}
              />
              <p className="type-micro-legal" style={{ marginTop: "var(--space-xs)" }}>
                Dynamic Type scales the whole SF Pro ladder, like iOS.
              </p>
            </NeoCard>
          </div>
        </>
      )}

      <main className={`neo-container ${styles.main}`}>
        {tab === "home" && <HomeTab onBrowse={() => setTab("browse")} />}
        {tab === "browse" && <BrowseTab />}
        {tab === "profile" && <ProfileTab onSignOut={() => setSignedIn(false)} />}
      </main>

      <div className={styles.tabDock}>
        <NeoTabBar
          tabs={[
            { icon: "house", label: "Home", active: tab === "home", onClick: () => setTab("home") },
            { icon: "grid", label: "Browse", active: tab === "browse", onClick: () => setTab("browse") },
            { icon: "person", label: "Profile", active: tab === "profile", onClick: () => setTab("profile") },
          ]}
        />
      </div>
    </div>
  );
}

/* ---- Auth ---------------------------------------------------------------------- */

/** Branded sign-in — the wide logo lockup banners a white neomorphic card. */
function StudioAuth({ onSignedIn }: { onSignedIn(): void }) {
  const [email, setEmail] = useState("ada@tricube.dev");
  const [password, setPassword] = useState("");

  return (
    <main className={`neo-container ${styles.authWrap}`}>
      <NeoCard padding="none" className={styles.authCard}>
        <img
          src="/tricube-logo-wide.png"
          alt="TRI CUBE Digital Solutions"
          className={styles.authBanner}
          width={772}
          height={227}
        />
        <div className={styles.authBody}>
          <h1 className="type-display-md">Welcome back.</h1>
          <p className="type-lead-airy" style={{ color: "var(--text-secondary)" }}>
            {COMPANY.motto}
          </p>
          <NeoInput
            label="Email"
            type="email"
            leadingIcon="person"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <NeoInput
            label="Password"
            type="password"
            leadingIcon="gear"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helper="Minimum 8 characters."
          />
          <NeoButton variant="primary" fullwidth icon="check" onClick={onSignedIn}>
            Sign in to Studio
          </NeoButton>
          <NeoButton variant="ghost" fullwidth onClick={onSignedIn}>
            Continue as guest
          </NeoButton>
          <p className={`${styles.authLegal} type-micro-legal`}>
            <NeoIcon
              name="check"
              size={12}
              style={{ color: "var(--badge-teal)", display: "inline", verticalAlign: "-1px" }}
            />{" "}
            Secured with JWT · {COMPANY.name}
          </p>
        </div>
      </NeoCard>
    </main>
  );
}

/* ---- Home -------------------------------------------------------------------- */

function HomeTab({ onBrowse }: { onBrowse(): void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const continueCourse = COURSES.find((c) => c.slug === "full-stack-mern") ?? COURSES[0];
  const sessions = EVENTS.filter((e) => e.status !== "completed");

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        <h1 className="type-display-md" suppressHydrationWarning>
          {greeting}, Ada.
        </h1>
        <p className="type-lead-airy" style={{ color: "var(--text-secondary)" }}>
          You're 2 lessons away from finishing Module 6.
        </p>
      </div>

      <div className={styles.statGrid}>
        {[
          { icon: "sparkle" as const, value: "12 days", label: "Focus streak" },
          { icon: "grid" as const, value: "4", label: "Active courses" },
          { icon: "play" as const, value: "9.5 hrs", label: "This week" },
        ].map((s) => (
          <NeoCard key={s.label} padding="sm">
            <div className={styles.statCard}>
              <span className={styles.statIcon}>
                <NeoIcon name={s.icon} size={20} />
              </span>
              <p className="type-body-strong">{s.value}</p>
              <p className="type-fine-print">{s.label}</p>
            </div>
          </NeoCard>
        ))}
      </div>

      <NeoCard variant="dark" padding="lg">
        <div className={styles.continue}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-sm)" }}>
            <p className="type-tagline">Continue learning</p>
            <p className="type-caption-strong" style={{ opacity: 0.8 }}>
              64%
            </p>
          </div>
          <p className="type-body-strong">{continueCourse?.title}</p>
          <p className="type-caption" style={{ opacity: 0.75 }}>
            Module 6 · Redux Toolkit · {continueCourse?.duration} total
          </p>
          <div className={styles.progressWell} role="progressbar" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.progressFill} style={{ width: "64%" }} />
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <NeoButton variant="primary" icon="play">
              Resume lesson
            </NeoButton>
            <NeoButton variant="pearl" size="small">
              Restart module
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <p className="type-tagline">Upcoming sessions</p>
          <NeoButton variant="ghost" size="small" icon="chevron-right" iconPosition="trailing" onClick={onBrowse}>
            Catalog
          </NeoButton>
        </div>
        <div className={styles.sessions}>
          {sessions.map((e) => {
            const [y, m, d] = e.date.split("-").map(Number);
            return (
              <div key={e.slug} className={styles.sessionRow}>
                <span className={styles.dateBadge}>
                  <span className="type-caption-strong">{d}</span>
                  <span className="type-micro-legal">{MONTHS[(m ?? 1) - 1]} {y}</span>
                </span>
                <span className={styles.sessionText}>
                  <span className="type-caption-strong">
                    {e.status === "live" && (
                      <>
                        <span className={styles.liveDot} aria-label="Live now" /> LIVE ·{" "}
                      </>
                    )}
                    {e.title}
                  </span>
                  <span className="type-micro-legal">
                    {e.time} · {e.venue}
                  </span>
                </span>
                <NeoButton variant="pearl" size="small" icon={e.status === "live" ? "play" : "bell"}>
                  {e.status === "live" ? "Join" : "Remind"}
                </NeoButton>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---- Browse -------------------------------------------------------------------- */

function BrowseTab() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("popular");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(COURSES.map((c) => c.category)))],
    [],
  );

  const courses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = COURSES.filter((c) => {
      const matchesCat = category === "All" || c.category === category;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.trainer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
    const sorted = [...filtered];
    if (sort === "popular") sorted.sort((a, b) => b.students - a.students);
    if (sort === "price") sorted.sort((a, b) => a.price - b.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [query, category, sort]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        <h1 className="type-display-md">Browse</h1>
        <p className="type-lead-airy" style={{ color: "var(--text-secondary)" }}>
          {courses.length} of {COURSES.length} courses · live cohorts with mentors.
        </p>
      </div>

      <div className={styles.filterBar}>
        <NeoInput
          label="Search"
          placeholder="Course, trainer or category…"
          leadingIcon="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.chipRow}>
          {categories.map((cat) => (
            <NeoChip key={cat} selected={category === cat} onClick={() => setCategory(cat)}>
              {cat}
            </NeoChip>
          ))}
        </div>
        <NeoSegmented
          label="Sort"
          full
          options={[
            { value: "popular", label: "Popular" },
            { value: "price", label: "Price ↑" },
            { value: "rating", label: "Rating" },
          ]}
          value={sort}
          onValueChange={(v) => setSort(v as Sort)}
        />
      </div>

      {courses.length === 0 ? (
        <NeoCard variant="sunken" padding="lg">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)" }}>
            <NeoIcon name="search" size={26} style={{ color: "var(--text-tertiary)" }} />
            <p className="type-body-strong">No courses match</p>
            <p className="type-fine-print">Try a different search or category.</p>
            <NeoButton
              variant="ghost"
              size="small"
              icon="close"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </NeoButton>
          </div>
        </NeoCard>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map((c) => (
            <NeoCard key={c.slug} data-interactive className={styles.courseCard}>
              <div className={styles.courseBody}>
                <p className="type-caption-strong" style={{ color: "var(--accent-bg)" }}>
                  {c.category}
                </p>
                <p className="type-tagline">{c.title}</p>
                <p className="type-caption" style={{ color: "var(--text-secondary)" }}>
                  {c.trainer} · {c.level}
                </p>
                <p className="type-fine-print">
                  {c.duration} · {c.students.toLocaleString("en-IN")} learners
                </p>
              </div>
              <div className={styles.courseFooter}>
                <p className="type-body-strong">₹{c.price.toLocaleString("en-IN")}</p>
                <span className={`${styles.ratingChip} type-caption-strong`}>
                  <NeoIcon name="sparkle" size={14} />
                  {c.rating}
                </span>
                <NeoButton
                  variant="pearl"
                  size="small"
                  onClick={() => void navigate({ to: "/courses/$slug", params: { slug: c.slug } })}
                >
                  View
                </NeoButton>
              </div>
            </NeoCard>
          ))}
        </div>
      )}
    </>
  );
}

/* ---- Profile --------------------------------------------------------------------- */

function ProfileTab({ onSignOut }: { onSignOut(): void }) {
  const [notify, setNotify] = useState(true);
  const [cellular, setCellular] = useState(false);
  const [goal, setGoal] = useState(60);
  const [speed, setSpeed] = useState(1);

  return (
    <>
      <NeoCard padding="lg">
        <div className={styles.profileHead}>
          <span className={styles.avatarCircle}>
            <NeoIcon name="person" size={30} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <p className="type-tagline">Ada Lovelace</p>
            <p className="type-caption" style={{ color: "var(--text-secondary)" }}>
              ada@tricube.dev
            </p>
            <div style={{ marginTop: "var(--space-xxs)" }}>
              <NeoChip
                selected
                icon="sparkle"
                style={
                  {
                    borderColor: "transparent",
                    background: "var(--badge-gold-bg)",
                    color: "var(--badge-gold-fg)",
                  } as React.CSSProperties
                }
              >
                Pro plan
              </NeoChip>
            </div>
          </div>
        </div>
      </NeoCard>

      <NeoCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <p className="type-caption-strong">Learning preferences</p>
          <NeoToggle
            checked={notify}
            onCheckedChange={setNotify}
            label="Quiet notifications"
            helper="One daily digest instead of per-lesson pings"
          />
          <NeoToggle
            checked={cellular}
            onCheckedChange={setCellular}
            label="Download over cellular"
            helper="Lesson videos can use mobile data"
          />
          <NeoSlider
            label="Daily goal (minutes)"
            value={goal}
            onValueChange={setGoal}
            min={30}
            max={150}
            step={15}
            ticks={[30, 60, 90, 120, 150]}
          />
          <NeoSlider
            label="Playback speed"
            value={speed}
            onValueChange={setSpeed}
            min={0.75}
            max={2}
            step={0.25}
            ticks={[0.75, 1, 1.25, 1.5, 1.75, 2]}
          />
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <NeoButton variant="primary" icon="check">
              Save preferences
            </NeoButton>
            <NeoButton variant="ghost">Reset</NeoButton>
          </div>
        </div>
      </NeoCard>

      <NeoCard variant="dark" padding="lg">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <p className="type-tagline">Pro membership</p>
          <p className="type-body" style={{ opacity: 0.75 }}>
            Unlimited cohorts, certificate verification and 1:1 mentor calls.
          </p>
          <p className="type-caption" style={{ opacity: 0.7 }}>
            Renews Oct 12 · ₹499/mo · billed annually
          </p>
          <div>
            <NeoButton variant="pearl" size="small">
              Manage plan
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      <div className={styles.signoutRow}>
        <NeoButton variant="ghost" icon="close" onClick={onSignOut}>
          Sign out
        </NeoButton>
      </div>
    </>
  );
}
