import { Check, X } from "lucide-react";

const Comparison = () => {
  const features = [
    {
      category: "Philosophy",
      items: [
        { feature: "Open Source", arc: true, postman: false },
        { feature: "No Account Required", arc: true, postman: false },
        { feature: "Fully Local", arc: true, postman: false },
        { feature: "Lightweight", arc: true, postman: false },
      ],
    },
    {
      category: "Core Features",
      items: [
        { feature: "REST API Testing", arc: true, postman: true },
        { feature: "Request/Response History", arc: true, postman: true },
        { feature: "Environment Variables", arc: true, postman: true },
        { feature: "Collections", arc: true, postman: true },
        { feature: "Auth Methods (Basic, Bearer, OAuth)", arc: true, postman: true },
      ],
    },
    {
      category: "Developer Focus",
      items: [
        { feature: "No Upsells or Paywalls", arc: true, postman: false },
        { feature: "Extendable via Plugins", arc: true, postman: true },
        { feature: "Works Offline", arc: true, postman: false },
        { feature: "Desktop App (Electron)", arc: true, postman: true },
        { feature: "Dark/Light Theme", arc: true, postman: true },
      ],
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-warm-gray mb-4 font-light">
            How it compares
          </p>
          <h2 className="text-3xl sm:text-4xl font-editorial mb-6">
            Why developers choose flav
          </h2>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Built for those who value simplicity, privacy, and freedom over corporate features.
          </p>
        </div>

        <div className="space-y-12">
          {features.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-medium mb-6 text-foreground">{section.category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground font-sans">
                        Feature
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground font-sans">
                        flav
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground font-sans">
                        Postman
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-b border-border/50 hover:bg-surface/50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 text-sm text-foreground font-light">{item.feature}</td>
                        <td className="py-4 px-4 text-center">
                          {item.arc ? (
                            <Check className="w-4 h-4 text-accent mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {item.postman ? (
                            <Check className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-surface/60 p-8">
          <p className="text-sm text-warm-gray tracking-[0.15em] uppercase mb-3 font-light">Bottom Line</p>
          <h3 className="text-xl font-editorial mb-3">flav is for developers who want to work, not navigate.</h3>
          <p className="text-muted-foreground font-light">
            No free tier limitations. No cloud sync upsells. No unnecessary complexity. Just a clean, fast API client that respects your time and your data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
