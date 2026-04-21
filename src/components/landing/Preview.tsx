const Preview = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-4 font-light">
            In action
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial">
            Feels like it should.
          </h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-border/70 bg-surface/70 shadow-[0_40px_90px_-55px_hsl(var(--foreground)/0.8)] animate-panel-in">
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />
          <img
            src="/demo.png"
            alt="Flav desktop app screenshot showing request and response panels"
            loading="lazy"
            className="block w-full h-auto"
          />
        </div>

        <p className="text-center text-sm text-warm-gray mt-8 font-light">
          Real interface · Real workflow · Built for focus
        </p>
      </div>
    </section>
  );
};

export default Preview;
