import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field, PrimaryButton } from "@/components/auth-layout";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Request access — Coreform" }] }),
  component: SignupPage,
});

function SignupPage() {
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
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <Field label="Full name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@studio.com" />
        <Field label="Password" name="password" type="password" placeholder="Choose a password" />
        <div className="pt-4">
          <PrimaryButton type="submit">Create account</PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
