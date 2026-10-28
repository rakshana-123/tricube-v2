import { QueryClient } from "@tanstack/react-query";
import {
  createRouter,
  createHashHistory,
  createBrowserHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const history =
    typeof window !== "undefined"
      ? window.location.hostname.includes("github.io")
        ? createHashHistory()
        : createBrowserHistory()
      : undefined;

  const router = createRouter({
    routeTree,
    history,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
