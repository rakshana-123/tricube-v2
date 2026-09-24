import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/tricube-v2/" : "/",
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
});
