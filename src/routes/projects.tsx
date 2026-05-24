import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, EmptyState } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Coreform" }] }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  title: string;
  created_at: string;
};

function ProjectsPage() {
  return (
    <RequireAuth>
      <AppShell>
        <ProjectsContent />
      </AppShell>
    </RequireAuth>
  );
}

function ProjectsContent() {
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
        title="Projects"
        description="Long-running containers for sessions, module results, and engine configurations."
      />

      <div className="flex items-center justify-between border-b border-hairline pb-4 mb-10">
        <span className="label-eyebrow">
          {loading ? "Loading…" : `All projects · ${projects.length}`}
        </span>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="text-sm border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-60"
        >
          {creating ? "Creating…" : "New project"}
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
        <EmptyState
          title="No projects yet"
          hint="Create your first project to get started."
        />
      ) : (
        <ul className="divide-y divide-hairline border border-hairline">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors"
              >
                <span className="text-sm text-foreground">{p.title}</span>
                <span className="mono text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
