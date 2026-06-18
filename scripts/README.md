# Scripts — Marketplace App Tooling

Command-line helpers to authenticate with Contentstack and to **create, manage, and deploy** the marketplace app (and scaffold a sample content model). These commands drive the app's lifecycle in Developer Hub and on Launch; they are separate from running the app itself.

All commands are run from the `scripts` folder and are multi-region aware (the region is chosen at login and reused everywhere).

> **Note on `api` references:** some of these scripts still reference a sibling `api` folder (for example they generate `../api/.env` and bundle `../api` into the Launch deployment as cloud functions). This boilerplate has since become frontend-only and that folder was renamed (see the root [README](../README.md)). Those `api` path references are intentionally left **as-is** here and may need reconciling before the dev/prod setup scripts run end-to-end.

## Prerequisites

* Node.js & npm
* A Contentstack account with the required **Marketplace & Launch** permissions
* OpenSSL on PATH (the dev setup generates a secret with it)
* A terminal emulator the setup scripts can open (macOS Terminal, Windows CMD, or a Linux terminal)

## Install

```bash
cd <APP_DIRECTORY>/scripts
npm i
```

## Authentication

```bash
npm run login
```

Prompts for region, email, password (and 2FA if enabled) and stores the session in `settings/credentials.json` (`region`, `authtoken`, `userOrgs`). **Run this first** — every other command reads these credentials.

## Commands

| Command | Runs | What it does |
|---------|------|--------------|
| `npm run login` | `src/ops/login.js` | Authenticate and save `settings/credentials.json`. |
| `npm run dev-app-initial-setup` | `src/dev-setup.sh` | One-shot local setup (see below). |
| `npm run prod-app-initial-setup` | `src/prod-setup.sh` | One-shot production setup + deploy (see below). |
| `npm run create-dev-app` | `src/ops/create-update.js create-app dev` | Create the dev marketplace app and install it to a stack. |
| `npm run update-dev-app` | `src/ops/create-update.js update-app dev` | Update the dev app from `settings/dev-app-manifest.json`. |
| `npm run create-prod-app` | `src/ops/create-update.js create-app prod` | Create the prod marketplace app and install it to a stack. |
| `npm run update-prod-app` | `src/ops/create-update.js update-app prod` | Update the prod app from `settings/prod-app-manifest.json`. |
| `npm run deploy-prod-app` | `src/ops/deploy.js` | Build and deploy the app to Contentstack Launch. |
| `npm run create-content-model` | `src/ops/content-model.js` | Create a sample content type (product + category fields) and a sample entry. |
| `npm run open-collected-links` | `src/ops/open-collected-links.js` | Open links collected during setup (used by prod setup). |

## First-time development setup

```bash
cd <APP_DIRECTORY>/scripts
npm i
npm run login
npm run dev-app-initial-setup
```

`dev-app-initial-setup` (`src/dev-setup.sh`) will:

1. Generate a random `JWT_API_SECRET`.
2. Install dependencies and write the `.env` file for the API folder (`../api/.env`: `NODE_ENV`, `JWT_API_SECRET`).
3. Install dependencies and write `../ui/.env` (`REACT_APP_UI_URL`, `REACT_APP_API_URL`, `REACT_APP_API_AUTH_URL`, `REACT_APP_ENCRYPTION_KEY`).
4. Run `create-dev-app` to create & install the dev marketplace app.
5. Open separate terminals to start the backend (port 8080) and the UI (port 4000).
6. Run `create-content-model` to scaffold a sample content type & entry.

## First-time production setup

```bash
cd <APP_DIRECTORY>/scripts
npm run login          # if not already logged in
npm run prod-app-initial-setup
```

`prod-app-initial-setup` (`src/prod-setup.sh`) collects the links it would open (instead of opening them immediately), then:

1. `deploy-prod-app` — builds the app zip and deploys it to Launch.
2. `create-prod-app` — creates the prod marketplace app and installs it.
3. `create-content-model` — scaffolds the sample content type & entry.
4. `open-collected-links` — opens all collected links at the end.

## `settings/` files

| File | Holds | Written by |
|------|-------|------------|
| `credentials.json` | `region`, `authtoken`, `userOrgs` | `login` |
| `dev-app-manifest.json` | Dev app manifest (UI locations, config, etc.) | `create-dev-app` / `update-dev-app` |
| `prod-app-manifest.json` | Prod app manifest (+ hosting/webhook/deploy URLs) | `create-prod-app` / `update-prod-app` / `deploy` |
| `prod-app-launch-manifest.json` | Launch project metadata (`project_uid`, `env_uid`, `deployment_uid`, `deployment_url`, …) | `deploy` |
| `app-installations.json` | Records of app installs across stacks | `create-update.js` (install step) |
| `collected-links.json` | Temporary list of links to open after setup | prod setup / `open-collected-links` |

## Multi-region support

The region is selected during `npm run login` and saved in `settings/credentials.json`. Supported regions (from `src/constants/index.js`):

* AWS North America (default)
* AWS Europe
* Azure North America
* Azure Europe
* GCP North America

All subsequent commands read the saved region to pick the correct Contentstack API, app, Developer Hub, and Launch base URLs (resolved via helpers in `src/utils/index.js`).

## Updating the app manifest

To change the app's UI locations, Advanced Settings, webhook, etc., edit the relevant manifest in `settings/` (`dev-app-manifest.json` or `prod-app-manifest.json`) and run the matching `update-*-app` command.
