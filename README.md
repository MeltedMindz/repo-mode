# Repo Mode Proof

## What This Is

This repository exists to demonstrate App Factory's REPO MODE.

The deployed application you are viewing only exists because this repository was successfully cloned, built, and deployed. No templates, prompts, or generated code were used.

## Why This Exists

Most "launchpads" deploy placeholders or generated artifacts.

REPO MODE deploys real repositories.
If the build fails, nothing ships.

This app is the proof.

## How It Works

1. App Factory clones the repository at a specific commit
2. The build pipeline runs
3. If the proof gate passes, the app is deployed
4. Build metadata is injected and rendered as an immutable receipt

## Running Locally

```bash
npm install
npm run build
npm start
```

## Build Metadata

The application automatically detects build metadata from the following sources:

### Priority Order

1. **Environment Variables** (highest priority) - Override any auto-detected values
2. **Git Auto-Detection** - Derived from local git repository when env vars are not set
3. **UNKNOWN Fallback** - Displayed when data cannot be determined

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_REPO_SLUG` | No* | GitHub repository slug (e.g., `owner/repo`) |
| `NEXT_PUBLIC_COMMIT_SHA` | No* | Full 40-character commit SHA |
| `NEXT_PUBLIC_REPO_URL` | No | Repository URL (derived from slug or git if missing) |
| `NEXT_PUBLIC_BUILD_ID` | No | Build identifier |
| `NEXT_PUBLIC_BUILD_TIMESTAMP` | No | ISO 8601 timestamp (generated at runtime if missing) |
| `NEXT_PUBLIC_BUILD_HASH` | No | Build hash |

*\*These variables are automatically derived from git when not set.*

### Git Auto-Detection

When environment variables are not set, the application automatically derives metadata from git:

- **COMMIT_SHA**: Runs `git rev-parse HEAD` to get the current commit
- **REPO_SLUG / REPO_URL**: Parses `git remote get-url origin` supporting both formats:
  - HTTPS: `https://github.com/owner/repo(.git)`
  - SSH: `git@github.com:owner/repo(.git)`

### Fallback Behavior

If git commands fail or return no data:
- Fields display as `UNKNOWN` rather than fake placeholder values
- The "View Source Commit" button is disabled when commit URL cannot be determined

### Example: Override with Environment Variables

```bash
NEXT_PUBLIC_REPO_SLUG=appfactory/repo-mode-proof \
NEXT_PUBLIC_COMMIT_SHA=abc1234567890def1234567890abc1234567890d \
npm run build && npm start
```

### Example: Auto-Detection (No Env Vars)

From a cloned repository with git origin set:

```bash
npm install
npm run build
PORT=3003 npm start
```

The UI will display:
- REPO_URL: Derived from git remote origin
- REPO_SLUG: Parsed from the remote URL
- COMMIT_SHA: Current HEAD commit (short display with full copy)
- "View Source Commit": Links to the actual commit on GitHub

## App Factory

Built with App Factory REPO MODE
https://appfactory.fun
