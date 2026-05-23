import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coreform" },
      { name: "description", content: "A quiet, architectural platform for considered work." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-8 md:px-16 py-8">
        <div className="label-eyebrow">Coreform</div>
        <nav className="flex items-center gap-8 text-sm">
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Request access
          </Link>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 px-8 md:px-16 pt-24 pb-24">
        <section className="md:col-span-8">
          <p className="label-eyebrow">Edition 01 — Shell</p>
          <h1 className="mt-8 font-display text-6xl md:text-8xl leading-[0.95] tracking-tight">
            A workspace<br />
            <span className="italic text-muted-foreground">composed slowly.</span>
          </h1>
          <p className="mt-10 max-w-lg text-base text-muted-foreground leading-relaxed">
            Coreform is a long-form platform for projects, sessions, and engines.
            This is the foundation — quiet, precise, and built to grow.
          </p>

          <div className="mt-12 flex items-center gap-6">
            <Link
              to="/dashboard"
              className="border border-foreground bg-foreground text-background px-6 py-3 text-sm hover:bg-transparent hover:text-foreground transition-colors"
            >
              Enter workspace
            </Link>
            <Link to="/login" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
              Sign in →
            </Link>
          </div>
        </section>

        <aside className="md:col-span-4 md:border-l md:border-hairline md:pl-8 flex flex-col justify-end">
          <div className="space-y-8">
            <Item k="01" t="Projects" d="Long-running work, structured." />
            <Item k="02" t="Sessions" d="Discrete units of attention." />
            <Item k="03" t="Engines" d="Configurable internal modules." />
          </div>
        </aside>
      </main>

      <footer className="px-8 md:px-16 py-8 border-t border-hairline flex justify-between mono text-xs text-muted-foreground">
        <span>© Coreform</span>
        <span>Shell · v0.1</span>
      </footer>
    </div>
  );
}

function Item({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <div className="flex gap-4">
      <span className="mono text-xs text-muted-foreground pt-1">{k}</span>
      <div>
        <div className="font-display text-xl">{t}</div>
        <div className="text-sm text-muted-foreground mt-1">{d}</div>
      </div>
    </div>
  );
}
