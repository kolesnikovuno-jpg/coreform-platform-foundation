import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    if (!loading && !session) {
      navigate({
        to: "/login",
        search: { redirect: location.pathname },
        replace: true,
      });
    }
  }, [loading, session, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="label-eyebrow text-muted-foreground">Loading session…</p>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
