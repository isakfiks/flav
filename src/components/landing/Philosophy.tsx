const Philosophy = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-4 font-light">
          Philosophy
        </p>
        <h2 className="text-3xl sm:text-4xl font-editorial mb-10 leading-tight">
          Software should be<br />calm.
        </h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-[16px]">
          <p>
            Most developer tools add until they break. Features compound,
            interfaces bloat, and what started as a simple utility becomes
            something you dread opening.
          </p>
          <p>
            We went the other direction. Every addition has to earn its place.
            Every interaction is considered. The result is a tool that feels
            quiet—not because it does less, but because it does exactly enough.
          </p>
          <p className="text-foreground/60 text-sm italic">
            Speed is a feature. Simplicity is a feature. Respect for your
            attention is a feature.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
