# flav — API Client

flav is a clean, lightweight, open-source API client built for developers who value simplicity, privacy, and focus. No account required. No cloud lock-in. No unnecessary complexity.

## Demo

![flav demo](https://github.com/isakfiks/flav/blob/main/public/flav_demo.gif?raw=true)

## Why flav?

**Built differently.** flav is a response to the bloat of modern API clients. It's localStorage-based, no accounts, no syncing hassles, and completely open source. Postman works for teams drowning in enterprise features. flav works for developers.

### Why not Postman?

- **Open Source & Free Forever** — flav is MIT licensed. No freemium limitations, no "upgrade to team" nags
- **No Account Required** — Clone the repo, build it, use it. Your data stays local
- **Lightweight** — Purpose-built for API testing, not overloaded with workflow automation, mocking servers, and other bloat
- **Fully Local** — Works completely offline. No cloud sync, no connection to external servers
- **Respectful UI** — Clean, focused interface. One request at a time. No tabs you'll never use
- **Zero Vendor Lock-in** — Export collections anytime. Standard formats. Built with web tech

## Features

- **Collections** — Organize requests into logical groups
- **Environments** — Manage variables and environment-specific configs
- **Auth Methods** — Basic, Bearer, API Key, OAuth 2.0
- **Syntax Highlighting** — Readable request/response formatting
- **60fps Animations** — Smooth, polished interactions
- **Desktop App** — Electron-based desktop client for macOS and Windows
- **Extensible** — Plugin system for custom functionality

## Quick Start

### Clone and Install

```bash
git clone https://github.com/isakfiks/flav.git
cd flav
npm install
```

### Website (Landing + Docs)

```bash
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173) for the landing page and documentation site.

> Note: flav does not currently ship a web API client. The request/response workspace is desktop-only.

### Desktop App (API Client)

```bash
npm run dev:desktop
```

## Building

```bash
# Website build (landing/docs only)
npm run build:web

# Desktop app build
npm run build:desktop

# Windows distribution
npm run dist:win
```

## Project Structure

```
flav/
├── src/                    # Website (landing + docs)
│   ├── components/
│   │   ├── landing/       # Marketing site components
│   │   └── ui/            # Shared UI primitives
│   ├── pages/
│   └── App.tsx
├── apps/
│   └── desktop/
│       ├── src/           # Desktop renderer
│       ├── electron/      # Main process & preload
│       └── vite.config.ts
├── docs/                  # Project documentation
└── package.json
```

## Documentation

- [Getting Started](./docs/getting-started.md) — Setup and first request
- [Desktop Release](./docs/desktop-release.md) — Building and packaging the Electron app
- [API](/docs) — Full documentation (also available at /docs on the web app)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License — See [LICENSE](./LICENSE) for details.

## Questions?

- Open an issue on GitHub: [isakfiks/flav issues](https://github.com/isakfiks/flav/issues)
- Check [discussions](https://github.com/isakfiks/flav/discussions)
