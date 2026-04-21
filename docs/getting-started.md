# Getting Started

## Install

```bash
npm install
```

## Run Website (Landing + Docs)

```bash
npm run dev:web
```

This starts the marketing site and docs at http://localhost:5173.

> Note: the interactive API client is desktop-only.

## Run Desktop App (API Client)

```bash
npm run dev:desktop
```

> Desktop development/build now uses Tauri and requires a Rust toolchain.
>
> Windows setup (if cargo is missing):
>
> `winget install Rustlang.Rustup` then restart your shell and run `rustup default stable`.

## Build

```bash
npm run build:web      # landing/docs site
npm run build:desktop
```
