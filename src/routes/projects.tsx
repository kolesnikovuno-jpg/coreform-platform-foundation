import { createFileRoute } from "@tanstack/react-router";
import { AppShell, EmptyState, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Coreform" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Long-running containers for sessions, module results, and engine configurations."
      />

      <div className="flex items-center justify-between border-b border-hairline pb-4 mb-10">
        <span className="label-eyebrow">All projects · 0</span>
        <button className="text-sm border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
          New project
        </button>
      </div>

      <EmptyState
        title="No projects yet"
        hint="Once Coreform is connected, your projects will live here."
      />
    </AppShell>
  );
}
