# Desktop Release Guide

## Prerequisites

- Rust toolchain (cargo) installed and available on PATH.
- Verify before packaging:

```bash
cargo --version
```

Windows quick setup:

```powershell
winget install Rustlang.Rustup
rustup default stable
cargo --version
```

## Build and Package

```bash
npm run dist:win
```

## Output

`dist:win` runs a Tauri NSIS build and copies the newest installer to `dist/desktop/`.

Example:

```text
dist/desktop/flav_<version>_x64-setup.exe
```

## Notes

- Build artifacts are produced by Tauri under `apps/desktop/src-tauri/target/release/bundle/nsis/`.
- `scripts/dist-win.cjs` keeps CI-friendly output by copying only the newest installer into `dist/desktop/`.
- Packaging requires a Rust toolchain and Tauri prerequisites on the build machine.
