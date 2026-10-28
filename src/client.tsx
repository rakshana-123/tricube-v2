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
