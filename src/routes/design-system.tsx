import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseApp } from "@/components/neoui/showcase/ShowcaseApp";

export const Route = createFileRoute("/design-system")({
  staticData: { bare: true },
  head: () => ({
    meta: [
      { title: "Design System — TRI CUBE" },
      {
        name: "description",
        content:
          "Neomorphic component gallery built on Apple design tokens: colors with live WCAG ratios, the SF Pro type ladder, elevation demos, and every control in every state.",
      },
      { property: "og:title", content: "TRI CUBE Design System" },
      { property: "og:description", content: "Neomorphic UI on Apple design tokens." },
    ],
  }),
  component: DesignSystemPage,
});

function DesignSystemPage() {
  return <ShowcaseApp />;
}
