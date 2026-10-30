import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

declare global {
  interface Window {
    $_TSR?: unknown;
  }
}

const CHUNK_RELOAD_KEY = "tricube_chunk_reload_at";

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    try {
      const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || "0");
      if (Date.now() - last > 15_000) {
        event.preventDefault();
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
        const url = new URL(window.location.href);
        url.searchParams.set("_v", String(Date.now()));
        window.location.replace(url.toString());
      }
    } catch {
      // Fall through if sessionStorage is unavailable
    }
  });
}

if (typeof window !== "undefined" && window.$_TSR) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
} else if (typeof document !== "undefined") {
  const router = getRouter();
  const rootEl = document.getElementById("root") ?? document.body;
  createRoot(rootEl).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
