import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Briefcase, CalendarDays, FileText, Image as ImageIcon, LayoutDashboard, MessageSquare, Newspaper, ScrollText } from "lucide-react";

const TABS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/materials", label: "Materials", icon: FileText },
  { to: "/admin/service-requests", label: "Service Requests", icon: MessageSquare },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/audit", label: "Audit", icon: ScrollText },
] as const;

export function AdminTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-6xl px-6 pt-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur">
        {TABS.map((t) => {
          const active = t.to === "/admin" ? pathname === "/admin" : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--gradient-gold)] text-black shadow"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}