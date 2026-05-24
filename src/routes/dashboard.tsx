import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Coreform" }] }),
  component: DashboardPage,
});

type Project = {
  id: string;
  title: string;
  created_at: string;
};

function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setProjects(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) loadProjects();
  }, [user, loadProjects]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    setError(null);
    const { error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, title: "Untitled Project" });
    setCreating(false);
    if (error) {
      setError(error.message);
      return;
    }
    await loadProjects();
  };

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        description="A single, calm surface. Modules, sessions, and engine state will appear here once connected."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
        <Stat label="Projects" value={loading ? "—" : String(projects.length)} />
        <Stat label="Sessions" value="—" />
        <Stat label="Engines" value="—" />
      </div>

      <section className="mt-20">
        <div className="flex items-baseline justify-between border-b border-hairline pb-4 mb-8">
          <h2 className="font-display text-2xl">Projects</h2>
          <button
            onClick={handleCreate}
            className="text-sm border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-60"
            disabled={creating}
          >
            {creating ? "Creating…" : "Create Project"}
          </button>
        </div>

        {error && (
          <div className="mb-6 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No projects yet.</div>
        ) : (
          <ul className="divide-y divide-hairline border border-hairline">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm text-foreground">{p.title}</span>
                <span className="mono text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
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
