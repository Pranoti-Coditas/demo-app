# Conventions for the store-inventory repo

These notes are given to the planning, coding and review agents.

## Layout
- `api/` – Node.js API built on json-server 0.17. `src/app.js` wires middleware, `src/validate.js` holds request validation. Data lives in `db.json`.
- `web/` – React 18 + Vite. `src/api.js` is the only place that calls `fetch`. Components live in `src/components/`, one component per file.

## Rules
- ES modules everywhere (`import`/`export`), no CommonJS.
- API validation errors return HTTP 400 with `{ "errors": ["message", ...] }`. Messages are lowercase and name the field.
- Prices are whole rupees (integers). Format them with `formatPrice` from `web/src/format.js`, never by hand.
- UI copy is sentence case. Buttons say exactly what they do ("Add product", not "Submit").
- Every bug fix needs a test that fails before the fix and passes after it.
- New UI behaviour needs a test in `web/tests/` using Testing Library queries by role or text, not CSS classes.
- Do not add new npm dependencies unless the plan lists them and explains why.
- Do not edit `api/db.json`; tests use in-memory data passed to `createApp()`.
