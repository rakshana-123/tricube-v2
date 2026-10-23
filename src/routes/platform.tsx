import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage } from "@/components/lms/PlatformPage";

export const Route = createFileRoute("/platform")({
  staticData: { bare: true },
  head: () => ({
    meta: [
      { title: "TRI CUBE LMS — Learn. Build. Launch." },
      {
        name: "description",
        content:
          "Live cohorts, real client projects and placement support. The professional learning platform from TRI CUBE Digital Solutions.",
      },
      { property: "og:title", content: "TRI CUBE LMS — Learn. Build. Launch." },
      {
        property: "og:description",
        content: "Live cohorts, real projects, placement support.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: PlatformRoute,
});

function PlatformRoute() {
  return <PlatformPage />;
}
