import { createRouter as createTanStackRouter, createHashHistory, createBrowserHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Use hash history on GitHub Pages to prevent 404s and base path hydration invariants
const history = typeof window !== "undefined"
  ? (window.location.hostname.includes("github.io") ? createHashHistory() : createBrowserHistory())
  : undefined;

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    history,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
  });

  return router;
}

// Alias for TanStack Start compatibility
export { createRouter as getRouter };

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
