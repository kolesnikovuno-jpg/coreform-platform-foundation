import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Coreform" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const email = user?.email ?? "you@company.com";
  const initial = email.charAt(0).toUpperCase();

  return (
    <RequireAuth>
      <AppShell>
        <header className="max-w-4xl mb-12">
          <h1 className="text-5xl md:text-6xl text-foreground leading-[1.05]">FOUNDATION</h1>
          <p className="mt-6 text-base text-muted-foreground max-w-xl leading-relaxed">Welcome back</p>
        </header>

        <div className="flex items-start justify-between gap-8 mb-10">
          <div className="flex-1" />
          <div className="user-panel flex items-center gap-6">
            <div>
              <div className="user-email">{email}</div>
              <div className="user-meta text-sm text-muted-foreground">Role: Founder · Plan: Foundation</div>
            </div>
            <div className="avatar">{initial}</div>
            <button className="btn-primary">Create Project</button>
          </div>
        </div>

        <section>
          <div className="mb-6">
            <h2 className="font-display text-2xl">Projects</h2>
          </div>
          <div className="py-16 text-center text-sm text-muted-foreground">
            No active projects yet.
          </div>
        </section>
      </AppShell>
    </RequireAuth>
  );
}


