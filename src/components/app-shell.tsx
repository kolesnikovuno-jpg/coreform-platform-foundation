import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/dashboard", label: "Dashboard", group: "Workspace" },
  { to: "/projects", label: "Projects", group: "Workspace" },
  { to: "/control-center", label: "Control Center", group: "Operations" },
  { to: "/backoffice", label: "Backoffice", group: "Operations" },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { location } = useRouterState();
  const { user, signOut } = useAuth();
  const current = nav.find((n) => location.pathname.startsWith(n.to));

  const groups = Array.from(new Set(nav.map((n) => n.group)));

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-background text-foreground">
      <aside className="hidden md:flex flex-col border-r border-hairline">
        <div className="px-8 pt-10 pb-12">
          <Link to="/" className="block">
            <div className="label-eyebrow">Coreform</div>
            <div className="mt-2 font-display text-2xl leading-none">Workspace</div>
          </Link>
        </div>

        <nav className="px-4 space-y-8 flex-1">
          {groups.map((g) => (
            <div key={g}>
              <div className="px-4 label-eyebrow">{g}</div>
              <ul className="mt-3">
                {nav.filter((n) => n.group === g).map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      activeProps={{ className: "flex items-center justify-between px-4 py-2 text-sm text-foreground bg-muted" }}
                    >
                      <span>{n.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-8 py-8 border-t border-hairline">
          <div className="label-eyebrow">Session</div>
          <div className="mt-2 text-sm text-foreground truncate">
            {user?.email ?? "Not signed in"}
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="mt-4 text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              Sign out →
            </button>
          ) : (
            <Link to="/login" className="mt-4 inline-block text-sm underline underline-offset-4">
              Sign in →
            </Link>
          )}
        </div>
      </aside>

      <main className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-8 md:px-12 h-16 border-b border-hairline">
          <div className="label-eyebrow">{current?.group ?? "Coreform"} / {current?.label ?? ""}</div>
          <div className="mono text-xs text-muted-foreground">v0.1</div>
        </header>
        <div className="flex-1 px-8 md:px-12 py-12 md:py-16">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-3xl mb-16">
      {eyebrow && <p className="label-eyebrow mb-6">{eyebrow}</p>}
      <h1 className="text-5xl md:text-6xl text-foreground leading-[1.05]">{title}</h1>
      {description && (
        <p className="mt-6 text-base text-muted-foreground max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-hairline px-10 py-20 text-center">
      <p className="label-eyebrow">Empty</p>
      <h3 className="mt-4 font-display text-2xl">{title}</h3>
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
