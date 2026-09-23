import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/payments";

export type BackendStatus = "checking" | "online" | "offline";

async function ping(): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    const r = await fetch(`${API_BASE}/health`, { signal: ctrl.signal, cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Polls the local backend `/health` endpoint so admin UIs can show a
 * connectivity banner and block CRUD actions when the API is unreachable.
 */
export function useBackendStatus(intervalMs = 15000): {
  status: BackendStatus;
  online: boolean;
  lastCheckedAt: number | null;
  recheck: () => Promise<void>;
} {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);

  async function run() {
    const ok = await ping();
    setStatus(ok ? "online" : "offline");
    setLastCheckedAt(Date.now());
  }

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    (async () => {
      if (cancelled) return;
      await run();
    })();
    timer = setInterval(run, intervalMs);
    const onFocus = () => run();
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onFocus);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { status, online: status === "online", lastCheckedAt, recheck: run };
}
