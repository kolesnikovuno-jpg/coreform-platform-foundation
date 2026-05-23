import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field, PrimaryButton } from "@/components/auth-layout";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Request access — Coreform" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: name },
      },
    });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is on, there's no session yet.
    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
    } else {
      setNotice("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <AuthLayout
      eyebrow="New account"
      title="Request access"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4 text-foreground">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-2">
        <Field
          label="Full name"
          name="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <p className="mono text-xs text-destructive py-2">{error}</p>}
        {notice && <p className="mono text-xs text-muted-foreground py-2">{notice}</p>}
        <div className="pt-4">
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create account"}
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
