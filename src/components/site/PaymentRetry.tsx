import { RefreshCw, XCircle } from "lucide-react";

interface PaymentRetryProps {
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
  busy?: boolean;
  attempt?: number;
  className?: string;
}

export function PaymentRetry({ message, onRetry, onDismiss, busy, attempt, className }: PaymentRetryProps) {
  return (
    <div
      role="alert"
      className={
        "mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-left text-sm text-destructive " +
        (className || "")
      }
    >
      <div className="flex items-start gap-2">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="flex-1">
          <div className="font-medium">Payment didn&apos;t go through</div>
          <div className="mt-0.5 text-xs opacity-90">{message}</div>
          {attempt && attempt > 1 ? (
            <div className="mt-0.5 text-[10px] uppercase tracking-widest opacity-70">Attempt {attempt}</div>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gradient-gold)] px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          <RefreshCw className={"h-3.5 w-3.5 " + (busy ? "animate-spin" : "")} />
          {busy ? "Reopening checkout…" : "Retry payment"}
        </button>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            disabled={busy}
            className="rounded-full border border-destructive/30 px-4 py-1.5 text-xs font-medium text-destructive/80 hover:bg-destructive/5"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default PaymentRetry;