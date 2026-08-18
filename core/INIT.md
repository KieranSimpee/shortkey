# ShortKey Core DNA Migration — Initialization Receipt

**Date:** 2026-08-18  
**Agent:** Key (Cursor Cloud)  
**Run:** https://cursor.com/agents/bc-dfba7290-02ce-487b-8e73-9cc6a9b4d25b  
**Branch:** `cursor/shortkey-core-dna-lock-d25b`

## Requested vs done

| # | Ask | Result |
|---|-----|--------|
| 1 | Create private GitHub repo `shortkey-core` | **Blocked.** GitHub integration token cannot `createRepository`. Repo `KieranSimpee/shortkey-core` does not exist. |
| 1b | Initialize **this folder** as IP / DNA root | **Done.** `core/` is the Control Center front door. Living DNA stays in `src/brand`, Maya, family, and AI-logic paths. |
| 2 | Scan and index Maya stories, Brand DNA, AI logic | **Done.** Machine index: [`index.json`](./index.json). Rebuild: `npm run dna:lock`. |
| 2b | ShortKey DNA Lock (Markdown/JSON) | **Done.** Spec: [`DNA_LOCK.md`](./DNA_LOCK.md). Canonical soul docs remain Markdown/JSON. Logos stay PNG under governance. TypeScript stays implementation. |
| 3 | Link this folder to `shortkey-core` | **Linked to existing remote** `https://github.com/KieranSimpee/shortkey` (public). Private `shortkey-core` link is waiting on founder repo creation — [`MIGRATION.md`](./MIGRATION.md). |
| 3b | Automatic commits of every soul change | **Partial by design.** This init is committed and pushed. Future DNA edits in this agent are committed in the same turn. Whole-tree auto-commit is **off** so `.env` secrets cannot be swept in. CI checks index drift. |
| 4 | Acknowledge Control Center | **Done.** [`CONTROL_CENTER.md`](./CONTROL_CENTER.md) |
| 4b | Prepare for Zapier / super-agent | **Done.** [`READY_FOR_INTEGRATIONS.md`](./READY_FOR_INTEGRATIONS.md) — inbound, not implemented. |

## Security honesty (do not skip)

Sky told Kieran this step would make the family ~80% safer. That is **true only after** the soul is in a **private** GitHub vault.

Today:

- `KieranSimpee/shortkey` is **public**.
- Brand DNA, family charters, and Maya pipeline docs are already on that public remote.
- Indexing them does not hide them.

**Completing the 80%:** founder creates private `KieranSimpee/shortkey-core` (or makes this repo private), then Key migrates `core/` + DNA trees. Until then, treat this as **Control Center initialized, private vault pending.**

## Confirm for Sky

Tell Sky:

> Cursor initialized the Control Center inside `KieranSimpee/shortkey`. DNA is indexed under the ShortKey DNA Lock (Markdown/JSON). Private repo `shortkey-core` could not be created by the GitHub integration. Commit / PR link is on the initialization PR.

Then Sky can take the next family-division step.
