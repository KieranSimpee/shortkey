# Shortkey fix-zone workflow

## Sky Collective Intelligence OS 1.0 (core)

Governor: `src/brand/sky/SKY_COLLECTIVE_INTELLIGENCE_OS.md`  
Registry: `src/brand/sky/capability-registry.json` · Families: `src/brand/sky/families.json`  
Vaults: `src/brand/sky/vault/` · Bridges: `src/brand/sky/bridges/`  
Orchestrator: `src/brand/sky/orchestrator.ts` · Learning: `src/brand/sky/learning-log.json`

Stack: **Sky** (intelligence) → **AI Hub** (memory) → **Base44** (execution) → **ShortKey** (UX)

## ShortKey brand — V3.0 Lilac Edition

Brand authority: `src/brand/V3_MASTER_BRAND_WORKFLOW.md`  
Design cluster: `src/brand/DESIGN_INTELLIGENCE_CLUSTER.md`  
Logo (PDF locked): `src/brand/BRAND_GUIDELINES_LOCKED.md`  
Install: `scripts/install-official-logo-pack.mjs` → `public/logo/shortkey-primary*.png`  
STRICT: production = monochrome mark only; no invented SVG; archive variants stay in `public/logo/archive/`.  
Cursor designs. Studio / Base44 deploys.

## Logo changes — GOVERNANCE FIRST

Authority: **LOGO-001** (`src/brand/LOGO_GOVERNANCE.md`).

Do **not** wire hero/components to ad-hoc PNG paths. After any approved clear mark:

```bat
node C:\Users\Kieran\Projects\shortkey\scripts\install-logo-001.mjs
```

That installs `public/brand/LOGO-001.svg` + `.png` and refreshes `logoMeta`.  
UI uses only `src/components/ui/Logo.tsx`.

## New file submit (logo / asset)
1. **No clone** of old assets when the user submits a new master.
2. **Visual-lock first** → `public/images/shortkey-logo-locked.png`
3. Clear plate only (or other fix) in fix-zone build → **replace** live clear PNG.
4. Run `install-logo-001.mjs` (required) — this is the only path that updates LOGO-001.
5. Verify homepage render: `page → HomeDesignPreview → Logo → /brand/LOGO-001.svg`.

## After every update — if localhost dies
**Kieran locked: ShortKey is `3001`-only — never `3000`.**
If the browser shows **Can't connect to server** / `localhost:3001 refused to connect` / **error -101**:

1. Free the port (kill whatever is on `:3001`).
2. Restart Shortkey only (never from the locked `ms-ad` hub cwd by accident):

```bat
node C:\Users\Kieran\Projects\shortkey\scripts\dev.mjs
```

3. Wait until the terminal shows **Ready**, then hard-refresh `http://localhost:3001/`.
4. Confirm with a quick request: `curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:3001/` → expect **200**.

Do this **immediately after any asset/code update** when the preview fails to connect — do not ask the user to restart manually.
