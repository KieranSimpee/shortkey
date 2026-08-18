# Private vault migration — `shortkey-core`

This cloud agent **cannot** create GitHub repositories. Founder (or Gor Gor with org rights) must create the private vault, then Key can link and move DNA.

## Founder steps

1. On GitHub, create a **private** repository named `shortkey-core` under `KieranSimpee` (empty, no README if you want a clean first push from this tree).
2. Do not make it public.
3. Tell Key: “`shortkey-core` is created — migrate DNA.”
4. Key will then:
   - add `git remote` `shortkey-core`
   - copy or subtree the DNA trees (`core/`, `src/brand/`, `MASTER_REFERENCE/`, `.cursor/rules`, `.cursor/skills`)
   - keep product code in `shortkey` if the public site must stay public
   - update `core/lock.json` `privateRepoCreated: true`

## What must not go to a public remote later

- Family letters not meant for public routes (`LETTER_TO_THE_WORLD_AI.md` is already family-archive)
- Vault lessons that contain private operating detail
- Any future key material (never commit `.env.local`)

## What can stay on the public product repo

- Production UI code
- Public logo PNGs that are meant to ship
- Coming Soon surfaces

Split is a Gor Gor decision. This file does not move files until the private repo exists.
