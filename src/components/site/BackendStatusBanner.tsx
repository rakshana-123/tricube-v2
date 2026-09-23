import { useContext, createContext, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { useBackendStatus, type BackendStatus } from "@/hooks/useBackendStatus";
import { API_BASE } from "@/lib/payments";

type Ctx = { online: boolean; status: BackendStatus };
const BackendCtx = createContext<Ctx>({ online: true, status: "checking" });

/** Read the current backend status (for CRUD buttons to disable themselves). */
export function useBackendOnline() {
  return useContext(BackendCtx);
}

/**
 * Provider + banner. Renders a red banner when the local backend is
 * unreachable and a subtle green pill when it's online, and exposes the
 * status through `useBackendOnline()` so CRUD buttons can be disabled.
 */
export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const { status, online, recheck, lastCheckedAt } = useBackendStatus();

  return (
    <BackendCtx.Provider value={{ online, status }}>
      <div className="mx-auto max-w-6xl px-6 pt-4">
        {status === "offline" && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" />
              <div>
                <p className="font-semibold">Backend not reachable at {API_BASE}</p>
                <p className="mt-1 text-red-800/90">
                  All create, edit, upload, and delete actions are disabled. Start the local API and try again:
                </p>
                <code className="mt-2 inline-block rounded bg-red-100 px-2 py-1 font-mono text-xs">
                  cd backend &amp;&amp; npm run dev
                </code>
              </div>
            </div>
            <button
              onClick={() => recheck()}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-900 hover:bg-red-100"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry connection
            </button>
          </div>
        )}
        {status === "checking" && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking backend at {API_BASE}…
          </div>
        )}
        {status === "online" && lastCheckedAt && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> API online · {API_BASE}
          </div>
        )}
      </div>
      <div
        aria-disabled={!online}
        className={!online ? "pointer-events-none select-none opacity-60" : undefined}
      >
        {children}
      </div>
    </BackendCtx.Provider>
  );
}