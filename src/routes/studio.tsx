import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/neoui/studio/StudioApp";

export const Route = createFileRoute("/studio")({
  staticData: { bare: true },
  head: () => ({
    meta: [
      { title: "Studio — TRI CUBE Digital Solutions" },
      {
        name: "description",
        content:
          "The TRI CUBE learner app — neomorphic UI on Apple design tokens. Courses, sessions and preferences with soft extruded surfaces and spring micro-interactions.",
      },
      { property: "og:title", content: "TRI CUBE Studio" },
      { property: "og:description", content: "The TRI CUBE learner app in neomorphic UI." },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return <StudioApp />;
}
