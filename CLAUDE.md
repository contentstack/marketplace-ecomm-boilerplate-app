## Developer Ecosystem workflow (read first)

This repo belongs to a Developer Ecosystem pod (DevEx: MCP, CLI, SDK, Starters including the SAP connector; Marketplace; Mkt Apps; Developer Hub).
New features and changes go through the deveco workflow before any code is written here:

1. Find the work's DSCDX idea and where it is in the flow. No idea yet: write one with the `brief` skill in `contentstack/product-wiki`.
2. The PRD, TRD, test cases, tickets and code come from your own routines (PM, Architect, QA agent, Dev), gate by gate. Do not plan, draft or build them in this session. No routine for a step yet: set it up with the `deveco-aisdlc-onboarding` skill in `contentstack/agent-skills`.
3. The order, gates and intake: https://github.com/contentstack/agent-skills/blob/main/skills/deveco-aisdlc-onboarding/references/run-protocol.md

Bug fixes and support cases keep this repo's usual path. Not sure which applies? Ask before building.

## This repo

Ecommerce boilerplate: a TEMPLATE, not a deployed app (Tier 3, UI + API). Real apps are copies of it: sfcc, shopify, sapcc, bigcommerce and others start here. Nothing is released or hosted from this repo (no prod host). Epic: MKT-19906. Wiki: `marketplace-apps/ecommboilerplate/` in `contentstack/product-wiki` if present (none yet).

What a copy inherits (so a change here reaches every future copy; existing copies do not update): the `ui/` shell (providers, hooks, routes, selector page, jest setup), the `api/` handler and config decryption, build scripts, CI workflows, and the husky pre-commit hook. Fix template bugs here, but do not add app-specific code or vendor names. App-specific logic belongs only in the `root_config/` files.

How to copy it: create a new repo from this one; rename `name` in `ui/package.json` and `api/package.json`; set `<title>` in `ui/public/index.html` and the favicon; copy `ui/.env.example` to `ui/.env`; replace `ui/src/root_config/index.ts` and `api/root_config/index.ts` with your vendor's, starting from `examples/bigcommerce/` or `examples/sapcc/`; see `TEMPLATE.md`.

- `ui/`: React 18 CRA, `BrowserRouter` (a `HomeRedirectHandler` works around iframe path detection), port 4000. Routes: `/config`, `/product-field`, `/category-field`, `/sidebar-widget`, `/selector-page`. Manifest `ui/update-app-info.json` has `/config`, `/field-extension`, `/product-field`, `/sidebar-widget`; there is no `/category-field` entry although the route exists.
- `api/`: TypeScript Lambda handler (`api/index.ts`, `api/handler/index.ts`), decrypts sensitive config keys with CryptoJS. `api/constants/index.ts` has an empty `DECRYPTION.password` with a note to add one: a copy must supply it without committing the value.
- `examples/`: `bigcommerce` and `sapcc` `root_config` samples for ui and api.
- Env var names: `REACT_APP_API_URL`, `REACT_APP_UI_URL` (read by the code); `TEMPLATE.md` also lists `REACT_APP_NAME`, `SELECTOR_PAGE_LOGO`, `APP_ENG_NAME`, `UNIQUE_KEY`, `FETCH_PER_PAGE` as root-config fields.
- Tests: 8 Jest spec files in `ui/src/` (4 hooks, 4 containers). None for `api/`, which has a `jest` script but no config or specs.
- CI: `.github/workflows/policy-scan.yml`, `sca-scan.yml` (Snyk) only. No `.nvmrc`; the README states Node 14.18.2, which is out of date and unverified.
- `api` `dev` runs `server.ts`, which is not in the repo (the README gives sample code for it).

### Commands (from package.json; not yet run in CI — verified in the [Tests]/[Routine] PR)

- `ui/`: `npm start`, `npm run startWin`, `npm run build`, `npm test` (`jest`), `npm run prettify`, `npm run lint:fix`, `npm run precommit`
- `api/`: `npm run dev` (`nodemon --exec ts-node server.ts`), `npm test` (`jest`), `npm run prettify`, `npm run lint:fix`, `npm run precommit`
- Root: `bash build.sh` (zips `api/` and `ui/build/` into `to-deploy/`); `test` is a stub that exits 1

Branches `claude/<type>/<KEY>-<slug>`, PRs into `main`.
