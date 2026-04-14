# Desktop Release Guide

## Build and Package

```bash
npm run dist:win
```

## Output

`dist:win` writes artifacts to a timestamped folder in `release/`.

Example:

```text
release/2026-04-14T11-28-24-123Z/flav-0.0.0-x64.exe
```

## Notes

- Using timestamped output avoids Windows file-lock conflicts on `win-unpacked/resources/app.asar`.
- Windows icon is sourced from `public/logo-main.png`.
