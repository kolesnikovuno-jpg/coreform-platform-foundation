import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({ meta: [{ title: "Project — Coreform" }] }),
  component: ProjectPage,
});

type Project = {
  id: string;
  user_id: string;
  title: string;
  central_request: string | null;
  created_at: string;
  updated_at: string;
};

type Signal = {
  id: string;
  project_id: string;
  user_id: string;
  signal_type: string;
  content: string;
  created_at: string;
};

type Thread = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  pole_a: string | null;
  pole_b: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function ProjectPage() {
  return (
    <RequireAuth>
      <AppShell>
        <ProjectContent />
      </AppShell>
    </RequireAuth>
  );
}

function ProjectContent() {
  const { projectId } = Route.useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [centralRequest, setCentralRequest] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [requestDirty, setRequestDirty] = useState(false);
  const [requestSaveError, setRequestSaveError] = useState<string | null>(null);
  const [requestSaveSuccess, setRequestSaveSuccess] = useState(false);

  const [signals, setSignals] = useState<Signal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [signalsError, setSignalsError] = useState<string | null>(null);
  const [newSignal, setNewSignal] = useState("");
  const [addingSignal, setAddingSignal] = useState(false);
  const [addSignalError, setAddSignalError] = useState<string | null>(null);
  const [deleteSignalError, setDeleteSignalError] = useState<string | null>(null);

  const loadSignals = useCallback(async () => {
    setSignalsLoading(true);
    setSignalsError(null);
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) {
      setSignalsError(error.message);
      setSignals([]);
    } else {
      setSignals((data ?? []) as Signal[]);
    }
    setSignalsLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  const handleAddSignal = async () => {
    if (!user) return;
    const content = newSignal.trim();
    if (!content) return;
    setAddingSignal(true);
    setAddSignalError(null);
    const { error } = await supabase.from("signals").insert({
      project_id: projectId,
      user_id: user.id,
      content,
      signal_type: "text",
    });
    setAddingSignal(false);
    if (error) {
      setAddSignalError(error.message);
      return;
    }
    setNewSignal("");
    await loadSignals();
  };

  const handleDeleteSignal = async (id: string) => {
    setDeleteSignalError(null);
    const { error } = await supabase.from("signals").delete().eq("id", id);
    if (error) {
      setDeleteSignalError(error.message);
      return;
    }
    await loadSignals();
  };

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("projects")
      .select("id, user_id, title, central_request, created_at, updated_at")
      .eq("id", projectId)
      .maybeSingle();
    if (error) {
      setError(error.message);
      setProject(null);
    } else if (data) {
      const p = data as Project;
      setProject(p);
      setTitle(p.title);
      setCentralRequest(p.central_request ?? "");
      setDirty(false);
      setRequestDirty(false);
    } else {
      setProject(null);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleSave = async () => {
    if (!project || !user) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const { error } = await supabase
      .from("projects")
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq("id", projectId)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setDirty(false);
    setSaveSuccess(true);
    await loadProject();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSaveSuccess(false);
    setDirty(value.trim() !== (project?.title ?? "").trim());
  };

  const handleSaveRequest = async () => {
    if (!project || !user) return;
    setSaving(true);
    setRequestSaveError(null);
    setRequestSaveSuccess(false);
    const { error } = await supabase
      .from("projects")
      .update({ central_request: centralRequest.trim(), updated_at: new Date().toISOString() })
      .eq("id", projectId)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setRequestSaveError(error.message);
      return;
    }
    setRequestDirty(false);
    setRequestSaveSuccess(true);
    await loadProject();
  };

  const handleRequestChange = (value: string) => {
    setCentralRequest(value);
    setRequestSaveSuccess(false);
    setRequestDirty(value.trim() !== (project?.central_request ?? "").trim());
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading project…
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="py-20 text-center">
        <div className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive inline-block">
          {error}
        </div>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Project not found.
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Workspace / Projects"
        title={project.title}
        description="Edit project details below."
      />

      {error && (
        <div className="mb-6 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="max-w-2xl space-y-10">
        <section className="border border-hairline p-8">
          <div className="label-eyebrow mb-6">Project Title</div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-background border border-hairline px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Untitled Project"
          />

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {dirty && (
              <span className="text-xs text-muted-foreground">Unsaved changes</span>
            )}
            {saveSuccess && !dirty && (
              <span className="text-xs text-foreground">Saved</span>
            )}
          </div>

          {saveError && (
            <div className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {saveError}
            </div>
          )}
        </section>

        <section className="border border-hairline p-8">
          <div className="label-eyebrow mb-6">Central Request</div>
          <textarea
            value={centralRequest}
            onChange={(e) => handleRequestChange(e.target.value)}
            className="w-full min-h-[120px] bg-background border border-hairline px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
            placeholder="What is the real request this project is trying to resolve?"
          />

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSaveRequest}
              disabled={!requestDirty || saving}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save Central Request"}
            </button>
            {requestDirty && (
              <span className="text-xs text-muted-foreground">Unsaved changes</span>
            )}
            {requestSaveSuccess && !requestDirty && (
              <span className="text-xs text-foreground">Saved</span>
            )}
          </div>

          {requestSaveError && (
            <div className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {requestSaveError}
            </div>
          )}
        </section>

        <section className="border border-hairline p-8">
          <div className="label-eyebrow mb-6">Signals</div>
          <textarea
            value={newSignal}
            onChange={(e) => setNewSignal(e.target.value)}
            className="w-full min-h-[100px] bg-background border border-hairline px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y"
            placeholder="Capture a signal, observation, friction, idea, contradiction, note..."
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleAddSignal}
              disabled={addingSignal || !newSignal.trim()}
              className="text-sm border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
            >
              {addingSignal ? "Adding…" : "Add Signal"}
            </button>
          </div>

          {addSignalError && (
            <div className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {addSignalError}
            </div>
          )}
          {deleteSignalError && (
            <div className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {deleteSignalError}
            </div>
          )}
          {signalsError && (
            <div className="mt-4 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {signalsError}
            </div>
          )}

          <div className="mt-8 space-y-3">
            {signalsLoading && signals.length === 0 ? (
              <div className="text-sm text-muted-foreground">Loading signals…</div>
            ) : signals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No signals yet.</div>
            ) : (
              signals.map((s) => (
                <div
                  key={s.id}
                  className="border border-hairline p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {s.content}
                    </p>
                    <p className="mono text-xs text-muted-foreground mt-2">
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSignal(s.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="label-eyebrow mb-4">Metadata</div>
          <dl className="divide-y divide-hairline border border-hairline">
            <div className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="mono text-xs text-foreground">
                {new Date(project.created_at).toLocaleString()}
              </dd>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm text-muted-foreground">Updated</dt>
              <dd className="mono text-xs text-foreground">
                {new Date(project.updated_at).toLocaleString()}
              </dd>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm text-muted-foreground">ID</dt>
              <dd className="mono text-xs text-foreground">{project.id}</dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
