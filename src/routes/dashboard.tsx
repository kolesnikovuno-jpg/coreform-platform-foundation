import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Coreform" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        description="A single, calm surface. Modules, sessions, and engine state will appear here once connected."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
        <Stat label="Projects" value="—" />
        <Stat label="Sessions" value="—" />
        <Stat label="Engines" value="—" />
      </div>

      <section className="mt-20">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-8">
          <h2 className="font-display text-2xl">Recent activity</h2>
          <span className="label-eyebrow">Live</span>
        </div>
        <div className="py-16 text-center text-sm text-muted-foreground">
          No activity yet.
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-10">
      <div className="label-eyebrow">{label}</div>
      <div className="mt-4 font-display text-5xl">{value}</div>
    </div>
  );
}
