import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/control-center")({
  head: () => ({ meta: [{ title: "Control Center — Coreform" }] }),
  component: ControlCenterPage,
});

function ControlCenterPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Control Center"
        description="Engine configurations, module orchestration, and system-level controls."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
        <Panel title="Engine configs" status="Not connected" />
        <Panel title="Module results" status="Not connected" />
        <Panel title="Sessions" status="Not connected" />
        <Panel title="System health" status="Standby" />
      </div>
    </AppShell>
  );
}

function Panel({ title, status }: { title: string; status: string }) {
  return (
    <div className="bg-background p-10 min-h-[180px] flex flex-col justify-between">
      <div>
        <div className="label-eyebrow">Module</div>
        <h3 className="mt-3 font-display text-2xl">{title}</h3>
      </div>
      <div className="flex items-center gap-2 mono text-xs text-muted-foreground">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        {status}
      </div>
    </div>
  );
}
