import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
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
            href="https://github.com/isakfiks/flav"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-300 hover:opacity-90"
          >
            <Github className="w-4 h-4" />
            Star us on GitHub
          </a>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-lg text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-foreground/20"
          >
            Read Docs
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-10 text-xs text-warm-gray animate-reveal animate-reveal-delay-4">
          Free &amp; open source
        </p>
      </div>
    </section>
  );
};

export default Hero;
