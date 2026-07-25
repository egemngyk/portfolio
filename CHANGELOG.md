# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-26

### Changed
- **Simplified Deployment**: Removed build-time environment variable injection system (`build.js`, template files, `.env`). Firebase client credentials are now committed directly as they are public client-side keys; real security is enforced by Firestore Security Rules.
- **Hardened Firestore Security Rules**: Added field-level validation and array size caps (`visitor_ids` max 50,000, `durations` max 1,000) to prevent database abuse and quota exhaustion.
- **Cleaner Dev Workflow**: `npm run dev` now starts the local server directly without an intermediate build step.

### Removed
- `build.js` — no longer needed.
- `firebase/firebase.template.js` — replaced by direct `firebase/firebase.js`.
- `shared/panel-loader.template.js` — replaced by direct `shared/panel-loader.js`.

---

## [1.0.0] - 2026-07-26

### Added
- **ESM Refactoring**: Split monolithic panel rendering into modular ES6 modules and Web Components (`shared/modules/`, `shared/components/`).
- **Secrets Protection**: Externalized Firebase configurations and Admin credentials into environment variables (`.env`), resolved via a custom `build.js` script.
- **Vercel Output Fix**: Configured `"outputDirectory": "."` in `vercel.json` to correctly serve the static website root after build-time credentials compilation.
- **Cleaned Analytics**: Removed static Vercel Insights scripts to resolve local development loading errors (`net::ERR_CONNECTION_REFUSED`).
- **Removed Debug UI**: Cleaned up the `DATA / SNAPSHOT` debugging panel from all theme scripts (`themes/*/js/main/render.js`).
- **Offline Caching**: Added Service Worker (`sw.js`) utilizing a Network-First strategy to cache static assets for offline capability and speed.
- **Multi-Theme Engine**: Initial release supporting 10 customizable themes (Terminal, Cosmic, Minimal, Glass, Ledger, Midnight, Ivory, Brutalist, Royal, Claudemade).
- **Interactive Contact Form**: Integrated message dispatch with real-time Firebase storage and notifications.
- **Admin Control Panel**: Features updates for user status, stats, projects, and active theme management.
