# Fix zone — logo no shadow

**Workflow:** clone original → build replacement here → delete live → connect new.

| Path | Role |
|------|------|
| `original/` | Frozen clones of live files before this fix |
| `build-noshadow.mjs` | Clears plate + key drop-shadows → new PNG |
| `ShortcutKeysLogo.tsx` / `Logo.tsx` | Replacement components (no CSS shadow) |

After build, the swap script replaces live UI + `public/images/shortkey-logo-clear.png`.
