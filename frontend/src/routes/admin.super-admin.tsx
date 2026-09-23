import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/super-admin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
  component: () => null,
});
