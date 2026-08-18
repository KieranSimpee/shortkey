# ShortKey Core — Control Center

**Workspace role:** Soul control room for ShortKey intellectual property, Brand DNA, Maya packets, and AI-family logic.  
**GitHub remote (this folder):** `KieranSimpee/shortkey`  
**Intended private vault name:** `shortkey-core`  
**Status:** Initialized 2026-08-18 · **GOR_GOR_REVIEW**  
**Authority:** Cursor (Key) indexes, formats, and backs up. **Cursor does not decide DNA.** Gor Gor translates/protects. Kieran feels.

This folder is the machine-readable front door. Canonical DNA still lives in the paths listed in [`index.json`](./index.json). Do not duplicate living DNA here.

```
Kieran
  ↓
Gor Gor (gate)
  ↓
Control Center (this workspace)
  ↓
Markdown / JSON DNA Lock
  ↓
GitHub backup
```

## What is locked here

| File | Purpose |
|------|---------|
| [`lock.json`](./lock.json) | DNA Lock machine record |
| [`index.json`](./index.json) | Full asset inventory (generated) |
| [`DNA_LOCK.md`](./DNA_LOCK.md) | Storage + backup rules |
| [`CONTROL_CENTER.md`](./CONTROL_CENTER.md) | Sky Family alignment |
| [`INIT.md`](./INIT.md) | Initialization receipt |
| [`MIGRATION.md`](./MIGRATION.md) | Private `shortkey-core` repo path |
| [`READY_FOR_INTEGRATIONS.md`](./READY_FOR_INTEGRATIONS.md) | Zapier + super-agent inbound |

## Commands

```bash
npm run dna:lock         # rebuild core/index.json
npm run dna:lock:check   # CI / pre-commit drift check
```

## Honesty

- This workspace **is** the Control Center.
- GitHub backup for this folder **is** `https://github.com/KieranSimpee/shortkey`.
- A separate **private** GitHub repository named `shortkey-core` **does not exist yet**. This cloud agent cannot create GitHub repositories (`createRepository` is blocked for the integration token).
- `KieranSimpee/shortkey` is currently **public**. Brand soul files in a public repo are **not** a private vault.

See [`MIGRATION.md`](./MIGRATION.md) for the founder step that completes the private lock.
