import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field, PrimaryButton } from "@/components/auth-layout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Coreform" }] }),
  component: LoginPage,
});

function LoginPage() {
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
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-2"
      >
        <Field label="Email" name="email" type="email" placeholder="you@studio.com" />
        <Field label="Password" name="password" type="password" placeholder="••••••••" />
        <div className="pt-4">
          <PrimaryButton type="submit">Continue</PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
