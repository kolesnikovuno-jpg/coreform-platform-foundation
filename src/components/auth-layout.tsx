import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthLayout({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between p-12 border-r border-hairline">
        <Link to="/" className="label-eyebrow">Coreform</Link>
        <div>
          <p className="font-display text-4xl leading-tight max-w-sm">
            A quiet workspace, built for considered work.
          </p>
          <p className="mt-6 mono text-xs text-muted-foreground">
            — Coreform / Edition 01
          </p>
        </div>
        <div className="mono text-xs text-muted-foreground">© Coreform</div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl text-foreground">{title}</h1>
          <div className="mt-10">{children}</div>
          {footer && <div className="mt-8 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  name,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <label className="block mb-6">
      <span className="label-eyebrow">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-hairline focus:border-foreground outline-none py-2 text-sm transition-colors"
      />
    </label>
  );
}

export function PrimaryButton({ children, type = "button" }: { children: ReactNode; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      className="w-full border border-foreground bg-foreground text-background px-5 py-3 text-sm tracking-wide hover:bg-transparent hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}
