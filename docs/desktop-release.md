# Desktop Release Guide

## Build and Package

```bash
npm run dist:win
```

## Output

`dist:win` builds a Windows NSIS installer and writes the final distributable to `dist/desktop/`.

Example:

```text
dist/desktop/flav-setup-0.0.0-x64.exe
```

## Notes

- The installer uses a custom wizard flow (`oneClick: false`) and lets users choose install directory.
- Packaging runs in a temporary `release/.tmp-*` folder and only the final installer is kept.
- Build uses max compression and only bundles `en-US` Electron locale to reduce download size.
- Windows icon is sourced from `public/logo-main.png`.
