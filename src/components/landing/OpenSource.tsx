import { Github, Download } from "lucide-react";
import { Link } from "react-router-dom";

const OpenSource = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-4 font-light">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial mb-6">
            Open source. Always.
          </h2>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Arc is MIT licensed and fully open source. Clone from GitHub, build it yourself, and use it however you want.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-border rounded-xl p-8 transition-colors duration-300 hover:border-foreground/15">
            <p className="text-xs tracking-[0.15em] uppercase text-warm-gray mb-6">
              Install Now
            </p>
            <p className="text-lg font-sans font-medium mb-4">From GitHub</p>
            <p className="text-sm text-muted-foreground font-light mb-8">
              Get the source, build it, and run Arc locally. Everything you need is in the repository.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground hover:border-foreground/20"
            >
              <Github className="w-4 h-4" />
              Clone Repository
            </a>
          </div>

          <div className="border border-foreground/10 bg-surface rounded-xl p-8 transition-colors duration-300 hover:border-foreground/15">
            <p className="text-xs tracking-[0.15em] uppercase text-warm-gray mb-6">
              Soon
            </p>
            <p className="text-lg font-sans font-medium mb-4">Release Downloads</p>
            <p className="text-sm text-muted-foreground font-light mb-8">
              When we publish stable releases, you'll be able to download pre-built binaries directly from GitHub.
            </p>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-md border border-border/40 px-4 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Coming Soon
            </button>
          </div>
        </div>

        <div id="desktop" className="mt-12 rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
          <p className="text-xs tracking-[0.15em] uppercase text-warm-gray mb-3">Desktop app</p>
          <h3 className="text-xl font-editorial mb-3">Desktop setup and release docs</h3>
          <p className="text-sm text-muted-foreground font-light mb-4">
            The Electron workspace is documented step-by-step, including local development, test flow, and Windows packaging.
          </p>
          <Link
            to="/docs#desktop"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground hover:border-foreground/20"
          >
            Open desktop docs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
