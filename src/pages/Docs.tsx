import { ArrowLeft, BookOpenText, Laptop, PackageCheck, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

const Section = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section id={id} className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
    <h2 className="text-2xl font-editorial mb-2">{title}</h2>
    <p className="text-sm text-muted-foreground mb-5">{description}</p>
    {children}
  </section>
);

const Code = ({ children }: { children: string }) => (
  <pre className="rounded-lg bg-code-bg p-4 text-xs text-code-foreground font-mono overflow-x-auto leading-relaxed">
    {children}
  </pre>
);

const Docs = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
          <span className="text-sm font-medium tracking-tight">
            <span className="font-editorial">flav</span> docs
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-14 sm:py-20 space-y-10">
        <section className="max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-warm-gray mb-3">Documentation</p>
          <h1 className="text-4xl sm:text-5xl font-editorial leading-tight mb-4">Everything you need to run and ship flav.</h1>
          <p className="text-muted-foreground leading-relaxed">
            This page covers local development, desktop workflow, and release packaging. It mirrors the in-repo docs so the team and website stay aligned.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <a href="#getting-started" className="rounded-lg border border-border px-4 py-3 hover:border-foreground/20 transition-colors">Getting Started</a>
          <a href="#desktop" className="rounded-lg border border-border px-4 py-3 hover:border-foreground/20 transition-colors">Desktop Development</a>
          <a href="#release" className="rounded-lg border border-border px-4 py-3 hover:border-foreground/20 transition-colors">Windows Release</a>
          <a href="#structure" className="rounded-lg border border-border px-4 py-3 hover:border-foreground/20 transition-colors">Repository Layout</a>
        </div>

        <Section
          id="getting-started"
          title="Getting Started"
          description="Install dependencies and run either the website or desktop shell in development."
        >
          <div className="space-y-3 text-sm mb-5">
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Rocket className="w-4 h-4" /> Website development</div>
            <Code>{`npm install\nnpm run dev:web`}</Code>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><BookOpenText className="w-4 h-4" /> Website production build</div>
            <Code>{`npm run build:web`}</Code>
          </div>
        </Section>

        <Section
          id="desktop"
          title="Desktop Development"
          description="The desktop workspace runs in Electron with the renderer served from the dedicated desktop Vite config."
        >
          <div className="space-y-3 text-sm">
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Laptop className="w-4 h-4" /> Start desktop app in development</div>
            <Code>{`npm run dev:desktop`}</Code>
            <p className="text-muted-foreground">
              The desktop renderer reads assets from the root public directory, so shared branding files like logo-main.png are available in both web and desktop builds.
            </p>
          </div>
        </Section>

        <Section
          id="release"
          title="Windows Release"
          description="Build and package a signed portable .exe using electron-builder."
        >
          <div className="space-y-3 text-sm">
            <div className="inline-flex items-center gap-2 text-muted-foreground"><PackageCheck className="w-4 h-4" /> Package command</div>
            <Code>{`npm run dist:win`}</Code>
            <p className="text-muted-foreground">
              Each release writes to a timestamped output directory under release/ to avoid file-lock collisions from previously opened unpacked binaries.
            </p>
          </div>
        </Section>

        <Section
          id="structure"
          title="Repository Layout"
          description="High-level map of the codebase so contributors know where to make changes."
        >
          <Code>{`apps/desktop/electron   # Electron main + preload
apps/desktop/src        # Desktop renderer UI + state
src/components/landing  # Marketing website components
src/pages               # Web routes
src/components/ui       # Shared UI primitives
docs                    # Team-facing markdown docs`}</Code>
        </Section>
      </div>
    </main>
  );
};

export default Docs;
