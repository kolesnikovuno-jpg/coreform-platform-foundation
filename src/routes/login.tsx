import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AuthLayout, Field, PrimaryButton } from "@/components/auth-layout";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Coreform" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { session } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in, leave the page.
  useEffect(() => {
    if (session) {
      navigate({ to: redirect || "/dashboard", replace: true });
    }
  }, [session, navigate, redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: redirect || "/dashboard", replace: true });
  }

  return (
    <AuthLayout
      eyebrow="Access"
      title="Sign in"
      footer={
        <>
          No account?{" "}
          <Link to="/signup" className="underline underline-offset-4 text-foreground">
            Request access
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-2">
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="mono text-xs text-destructive py-2">{error}</p>
        )}
        <div className="pt-4">
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Continue"}
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
