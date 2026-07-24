# ShortKey StickerEmoji Tray — P0 (Influencer Portal)

**Status:** **UNDER_REVIEW** · **GOR_GOR_REVIEW** · staging prototype · **not production**  
**Surface:** `/social` Creator Early Access portal · port **3004** (`npm run social:dev`)  
**Cultural line:** Same as Fan Sticker Wall — ShortKey-owned visual language, **not** random emoji chaos.  
**Instruction file:** `ShortKey_InfluencerPortal_StickerEmoji_Addon_Cursor_Instructions.txt` was **not found** in-repo / common folders; built from founder brief + Continuity Pack.

## What it is

A **StickerEmoji Tray** so creators can decorate preview cards with built-in SVG/CSS chips:

1. Creator profile card  
2. Campaign submission preview  
3. Product story card  
4. Media kit preview  
5. Creator shop / Creator Edit card  

## Packs (built-in only)

| Pack | Stickers |
|------|----------|
| **ShortKey Native** | ctrl · alt · Beauty Signal · Creator Circle · Product Story · Saved Look |
| **J-Beauty Fresh** | soft sparkle · pearl glow · first discovery · soft ribbon · morning light |
| **K-Beauty Signal** | routine step · swatch signal · trend pulse · creator review · texture tap |
| **C-Beauty Color** | color swatch burst · packaging sparkle · color aura · fantasy frame · bold bloom |
| **Creator Circle** | my style · my shelf · try this · campaign ready · profile complete |

## Hard rules (locked)

1. No Sanrio / Disney / anime / idol / celebrity  
2. No third-party brand logos  
3. No AI-generated text stickers  
4. No underage / school-uniform sexualized vibe  
5. No fake review / fake verified stickers  
6. P0: **no creator-uploaded** custom stickers  
7. All decorated submissions remain **UNDER_REVIEW** / **GOR_GOR_REVIEW**

## Technical

| Piece | Path |
|-------|------|
| Pack definitions | `src/lib/social/stickerPacks.ts` |
| Glyphs (SVG) | `src/components/social/StickerGlyph.tsx` |
| Tray UI | `src/components/social/StickerEmojiTray.tsx` |
| Styles | `src/components/social/sticker-emoji-tray.css` |
| Portal integrate | `src/components/social/CreatorEarlyAccessPortal.tsx` |

- Placements: **localStorage** key `shortkey-social-sticker-emoji-v01` (this device · staging)  
- Early access form unchanged  
- Staging banner retained — no production claim  

## Preview

```bash
npm run social:dev
# → http://localhost:3004/social
```

## Continuity

Pointer in Continuity Pack §6 / §8. Cursor builds; does not decide DNA.
