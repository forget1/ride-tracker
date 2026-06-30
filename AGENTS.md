# AGENTS.md

## Project overview

骑行记录 (Ride Tracker) — a mobile-first React SPA for tracking cycling rides. Data lives entirely in `localStorage` (no backend). Deployed to GitHub Pages.

## Commands

```bash
npm run dev        # Vite dev server on port 5173, bound to 0.0.0.0
npm run build      # tsc (type-check only, no emit) then vite build
npm run preview    # preview the production build locally
npm run deploy     # build + push dist/ to gh-pages branch
```

There are **no linter, formatter, or test scripts** configured. `npm run build` is the only verification step — it runs `tsc` first so type errors block the build.

## Architecture

- **Stack**: Vite 5 + React 18 + TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`)
- **UI library**: `antd-mobile` v5 — use its components (`Card`, `Button`, `Form`, `Popup`, `Toast`, `Modal`, `Calendar`, etc.)
- **Styling**: SCSS modules in `src/styles/`; variables in `variables.scss`
- **Path alias**: `@/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`)
- **Base path**: `/ride-tracker/` — set in `vite.config.ts` for GitHub Pages; links/assets must account for this

### Key directories

```
src/
  main.tsx          # entry point, mounts <App/>
  App.tsx           # all app state and layout lives here
  components/       # RecordForm.tsx, Calendar.tsx (unused), RecordList.tsx (unused)
  types/index.ts    # RideRecord, DayInfo interfaces
  utils/storage.ts  # localStorage CRUD (single key: ride_records)
  utils/date.ts     # date formatting/parsing helpers
  styles/           # global.scss, app.scss, variables.scss
```

## Gotchas

- `vue`, `vant`, and `@ant-design/icons` are in `package.json` dependencies but **not used** in the source. Don't be confused — the app is pure React + antd-mobile.
- `src/components/Calendar.tsx` and `src/components/RecordList.tsx` exist as files but are **not imported** anywhere. The app uses antd-mobile's built-in `Calendar` component directly in `App.tsx`.
- All text in the UI is Chinese (zh-CN). Keep new strings in Chinese to match.
- Form fields are strings in antd-mobile's `Form` but stored as numbers in `RideRecord`. Conversion happens in `RecordForm.handleSubmit` via `parseInt`/`parseFloat`.
- `RideRecord.id` is generated client-side with `Date.now().toString(36) + Math.random()`.
