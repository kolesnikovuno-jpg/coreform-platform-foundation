import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/backoffice")({
  head: () => ({ meta: [{ title: "Backoffice — Coreform" }] }),
  component: BackofficePage,
});

function BackofficePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Backoffice"
        description="User profiles, subscriptions, and administrative records."
      />

      <div className="border border-hairline">
        <Row label="Profiles" value="—" />
        <Row label="Subscriptions" value="—" />
        <Row label="Sessions log" value="—" />
        <Row label="Audit trail" value="—" last />
      </div>
    </AppShell>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-8 py-6 ${last ? "" : "border-b border-hairline"}`}>
      <div>
        <div className="label-eyebrow">Table</div>
        <div className="mt-1 font-display text-xl">{label}</div>
      </div>
      <div className="mono text-sm text-muted-foreground">{value}</div>
    </div>
  );
}
