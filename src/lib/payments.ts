// Payment helper with demo/mock fallback when backend is unreachable.

const RAW_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:5000";

export const API_BASE = RAW_API_BASE.replace(/\/+$/, "").replace(/\/api$/i, "");

export const DEMO_FLAG =
  (import.meta.env.VITE_DEMO_PAYMENTS as string | undefined) === "true";

export type PayResult = {
  status: "paid" | "demo" | "cancelled" | "failed";
  message?: string;
  paymentId?: string;
};

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, ms = 2500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function checkBackend(): Promise<boolean> {
  if (DEMO_FLAG) return false;
  try {
    const r = await fetchWithTimeout(`${API_BASE}/health`, { method: "GET" }, 1500);
    return r.ok;
  } catch {
    return false;
  }
}

// Demo modal removed — a demo run must never unlock paid content.
// If VITE_DEMO_PAYMENTS is explicitly enabled, callers still see status:"demo"
// but consumer routes must NOT treat it as an unlock.

type StartArgs = {
  createOrderPath: string;
  createOrderBody: any;
  onPaid: (resp: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void>;
  title: string;
  amountInr: number;
  prefill?: { name?: string; email?: string; contact?: string };
  // Extra headers appended to the create-order fetch (e.g. Authorization).
  extraHeaders?: Record<string, string>;
};

// Try real backend + Razorpay; on unreachable backend, fall back to demo.
export async function startPayment(args: StartArgs): Promise<PayResult> {
  // Only enter demo path when explicitly enabled via env flag AND the caller
  // opts in. We no longer silently demo on network errors — that would let a
  // user "unlock" a course/material/service without an actual payment.
  const backendFailed = (msg: string): PayResult => ({
    status: "failed",
    message: msg,
  });

  if (DEMO_FLAG) {
    return {
      status: "demo",
      message:
        "Demo mode is enabled (VITE_DEMO_PAYMENTS=true). No real payment was taken and paid content stays locked.",
    };
  }

  let orderRes: Response;
  try {
    orderRes = await fetchWithTimeout(
      `${API_BASE}${args.createOrderPath}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(args.extraHeaders || {}) },
        body: JSON.stringify(args.createOrderBody),
      },
      8000,
    );
  } catch {
    return backendFailed(
      "Payment server is unreachable. Please make sure the backend is running and try again.",
    );
  }

  if (!orderRes.ok) {
    let msg = "Could not initialise payment.";
    try {
      const j = await orderRes.json();
      msg = j.error || msg;
    } catch {}
    return { status: "failed", message: msg };
  }

  const { order, keyId, key } = await orderRes.json();
  const rzpKey = keyId || key;
  if (rzpKey) {
    const isTest = rzpKey.startsWith("rzp_test_");
    if (import.meta.env.PROD && isTest) {
      console.warn(
        "[payments] Backend returned a TEST Razorpay key on a production build. " +
        "Update RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET in backend/.env to your LIVE keys.",
      );
    } else if (!import.meta.env.PROD && !isTest) {
      console.warn(
        "[payments] Backend returned a LIVE Razorpay key in development. " +
        "Switch backend/.env to rzp_test_* keys before testing.",
      );
    }
  } else {
    return { status: "failed", message: "Backend did not return a Razorpay Key Id. Check backend/.env." };
  }
  const loaded = await loadRazorpay();
  if (!loaded) return { status: "failed", message: "Payment SDK failed to load." };

  return new Promise<PayResult>((resolve) => {
    const rzp = new (window as any).Razorpay({
      key: rzpKey,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "TRI CUBE Digital Solutions",
      description: args.title,
      order_id: order.id,
      prefill: args.prefill || {},
      theme: { color: "#c89600" },
      handler: async (resp: any) => {
        try {
          await args.onPaid(resp);
          resolve({ status: "paid", paymentId: resp.razorpay_payment_id });
        } catch (err: any) {
          resolve({ status: "failed", message: err?.message || "Verification failed." });
        }
      },
      modal: {
        ondismiss: () => resolve({ status: "cancelled", message: "Payment cancelled." }),
      },
    });
    rzp.open();
  });
}