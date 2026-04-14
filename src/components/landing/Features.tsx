import { Zap, Eye, Command, Layers } from "lucide-react";

const Features = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-4 font-light">
          Why this exists
        </p>
        <h2 className="text-3xl sm:text-4xl font-editorial leading-tight max-w-lg mb-16">
          Less noise,<br />more signal.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 group bg-surface rounded-2xl p-8 sm:p-10 border border-border/60 transition-all duration-500 hover:border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-warm-gray font-light">01</span>
            </div>
            <h3 className="text-xl font-sans font-medium mb-3 tracking-tight">
              Clarity over features
            </h3>
            <p className="text-muted-foreground leading-relaxed font-light text-[15px] max-w-md">
              Every pixel is intentional. No tabs you'll never open, no menus five levels deep. Just the tools you actually use.
            </p>
          </div>

          <div className="md:row-span-2 group bg-surface rounded-2xl p-8 sm:p-10 border border-border/60 transition-all duration-500 hover:border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs tracking-[0.15em] uppercase text-warm-gray font-light">02</span>
              </div>
              <h3 className="text-xl font-sans font-medium mb-3 tracking-tight">
                Physically smooth
              </h3>
              <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
                60fps transitions, spring-based animations, instant response. It doesn't just work—it feels like something.
              </p>
            </div>
            <div className="mt-8 flex items-end gap-1">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-accent/15 transition-all duration-700 group-hover:bg-accent/25"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>

          <div className="group bg-surface rounded-2xl p-8 border border-border/60 transition-all duration-500 hover:border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Command className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-warm-gray font-light">03</span>
            </div>
            <h3 className="text-xl font-sans font-medium mb-3 tracking-tight">
              Built for focus
            </h3>
            <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
              One request. One response. Full attention.
            </p>
          </div>

          <div className="group bg-surface rounded-2xl p-8 border border-border/60 transition-all duration-500 hover:border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-warm-gray font-light">04</span>
            </div>
            <h3 className="text-xl font-sans font-medium mb-3 tracking-tight">
              Thoughtful details
            </h3>
            <p className="text-muted-foreground leading-relaxed font-light text-[15px]">
              Syntax highlighting that's easy on the eyes. Defaults that don't need changing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
