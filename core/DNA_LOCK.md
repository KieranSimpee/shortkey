# ShortKey DNA Lock

**Lock name:** ShortKey DNA Lock  
**Formats:** Markdown + JSON (canonical). Plain text allowed for continuity packs.  
**Date:** 2026-08-18  
**Status:** GOR_GOR_REVIEW

## Purpose

Store Brand DNA, Maya editorial packets, and AI-family logic in **platform-agnostic** files so the soul is not trapped in Notion, Google Docs, Base44 UI, or a single chat.

Cursor may **index and back up**. Cursor may **not** invent or rewrite DNA.

## Canonical storage

| Kind | Format | Examples |
|------|--------|----------|
| Brand DNA, family charters, Maya packets | Markdown | `src/brand/**/*.md`, `src/brand/sky/maya/**` |
| Registries, vaults, routing weights | JSON | `families.json`, `vault/*.json`, `index.json` |
| Continuity working memory | Text | `ShortKey_Cursor_Continuity_Pack_2026-07-25.txt` |
| Agent rules / skills | Markdown (`.mdc` / `.md`) | `.cursor/rules`, `.cursor/skills` |
| Logo binaries | PNG under logo governance | `public/logo/shortkey-primary.png` — indexed, not converted |
| Runtime implementation | TypeScript | Indexed as implementation, **not** canonical DNA |

## Rules

1. **No placeholders** in DNA or core files.
2. **No secrets** — never commit `.env.local`, API keys, or tokens.
3. **No PII** in creative assets.
4. **No auto-publish** to social. No public pricing disclosure.
5. **No DNA invention** — empty Maya slots stay awaiting.
6. New soul documents land as `.md` or `.json` only.
7. Every DNA change in this Control Center is **committed and pushed in the same turn** (backup). Unreviewed auto-commit of the whole working tree is **not** enabled — that would risk committing secrets.
8. Regenerating the inventory: `npm run dna:lock`. CI fails if `core/index.json` drifts.

## Pipeline (unchanged)

Google research → Kieran feel → Gor Gor translate/protect → Builder / Sky execute.

## Triple-Check Loop

1. File is Markdown or JSON (or an indexed binary logo / implementation pointer).
2. Path appears in `core/index.json` after `npm run dna:lock`.
3. Change is committed to GitHub. Gor Gor still gates public release.
