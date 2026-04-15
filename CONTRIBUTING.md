# Contributing to flav

Thanks for your interest in contributing! We welcome contributions of all kinds — bug reports, feature requests, documentation, and code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flav.git
   cd flav
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Website (Landing + Docs)

```bash
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173). Changes hot-reload automatically.

Note: this target serves only the marketing site and docs. The API client itself runs in the desktop app.

### Desktop App

```bash
npm run dev:desktop
```

### Testing

```bash
npm run test
```

## Code Style

- Use TypeScript for new code
- Follow existing patterns in the codebase
- Format code with Prettier (runs automatically on commit)
- Keep components small and focused

## Commit Messages

Write clear commit messages:

```
fix: resolve issue with auth header not persisting
feat: add support for OAuth 2.0 PKCE flow
docs: update contributing guide
```

## Submitting Changes

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request** on the main repository
3. **Describe what you changed** and why
4. **Link any related issues** using GitHub's #123 syntax

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Add tests for new functionality
- Update documentation if needed
- Respond to feedback and review comments

## Issues

### Reporting Bugs

Include:
- What you were trying to do
- What happened
- What you expected to happen
- Your environment (OS, browser/Electron version, flav version)

### Suggesting Features

Describe:
- The problem you're trying to solve
- How flav currently prevents this
- Your proposed solution (if you have one)

## Questions?

- Open a discussion in [GitHub Discussions](https://github.com/isakfiks/flav/discussions)
- Check existing issues to see if someone already asked

## Code of Conduct

Be respectful and inclusive. We're all here to make flav better.

---

**Thank you for contributing!** 🎉
