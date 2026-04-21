import { Download, Github } from "lucide-react";

const WINDOWS_SETUP_URL = "https://github.com/isakfiks/flav/releases/download/v1.0.0/flav-v1.0.0-windows-x86_64-setup.exe";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-glow animate-float-slow"
          style={{ filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-foreground animate-float-slower"
          style={{ filter: "blur(120px)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-reveal">
            <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-8 font-light">
              Open Source API Client
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-editorial font-normal leading-[1.1] tracking-tight animate-reveal animate-reveal-delay-1">
            Your API tools should{" "}
            <em className="font-editorial italic">respect</em>{" "}
            your time.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto font-light animate-reveal animate-reveal-delay-2">
            Fast, clean, and quiet. An API client that gets out of the way
            and lets you work.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal animate-reveal-delay-3">
            <a
              href={WINDOWS_SETUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-lg text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-foreground/20"
            >
              <Download className="w-4 h-4" />
              Download for Windows
            </a>
            <a
              href="https://github.com/isakfiks/flav"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-90"
            >
              <Github className="w-4 h-4" />
              Star us on GitHub
            </a>
          </div>

          <p className="mt-10 text-xs text-warm-gray animate-reveal animate-reveal-delay-4">
            Free &amp; open source
          </p>
        </div>

        <div className="mt-14 sm:mt-16 animate-reveal animate-reveal-delay-4">
          <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border/70 bg-surface/70 shadow-[0_45px_120px_-60px_hsl(var(--foreground)/0.95)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />
            <img
              src="/demo.png"
              alt="Flav desktop app screenshot showing request and response panels"
              loading="lazy"
              className="block w-full h-auto"
            />
          </div>
          <p className="text-center text-xs sm:text-sm text-warm-gray mt-5 font-light">
            Real interface. Real response flow.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
