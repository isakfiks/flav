import { useState, useEffect } from "react";

const methods = ["GET", "POST", "PUT"] as const;
const methodColors: Record<string, string> = {
  GET: "text-emerald-600",
  POST: "text-amber-600",
  PUT: "text-blue-500",
};

const Preview = () => {
  const [activeMethod, setActiveMethod] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowResponse(false);
      setTimeout(() => {
        setActiveMethod((prev) => (prev + 1) % methods.length);
        setTimeout(() => setShowResponse(true), 400);
      }, 300);
    }, 4000);

    const initialTimeout = setTimeout(() => setShowResponse(true), 800);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const method = methods[activeMethod];

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

        {/* Mock interface */}
        <div className="bg-code-bg rounded-xl overflow-hidden shadow-2xl shadow-foreground/5 border border-foreground/5">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-foreground/5">
            <div className="w-3 h-3 rounded-full bg-foreground/10" />
            <div className="w-3 h-3 rounded-full bg-foreground/10" />
            <div className="w-3 h-3 rounded-full bg-foreground/10" />
            <span className="ml-4 text-xs text-code-foreground/40 font-mono">untitled — workspace</span>
          </div>

          <div className="p-6 sm:p-8 font-mono text-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className={`font-semibold text-xs tracking-wider transition-all duration-500 ${methodColors[method]}`}>
                {method}
              </span>
              <span className="text-code-foreground/60">/api/v1/users</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                <span className="text-code-foreground/30 text-xs">200 OK</span>
              </div>
            </div>

            <div className="relative h-px bg-foreground/5 mb-6">
              <div className="absolute inset-y-0 left-0 bg-glow/40 h-full animate-request-flow rounded-full" />
            </div>

            <div
              className={`transition-all duration-500 ${showResponse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              <p className="text-code-foreground/30 text-xs mb-3">Response</p>
              <pre className="text-code-foreground/70 leading-relaxed">
{`{
  "status": "success",
  "data": {
    "id": "usr_29x8fk2",
    "name": "Ada Lovelace",
    "role": "engineer"
  },
  "latency": "12ms"
}`}
              </pre>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-warm-gray mt-8 font-light">
          12ms response time · Syntax highlighted · Keyboard-first
        </p>
      </div>
    </section>
  );
};

export default Preview;
