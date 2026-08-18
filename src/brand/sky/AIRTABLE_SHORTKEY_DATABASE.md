# Airtable — ShortKey_Database

**Status:** Ready for Kieran to create · Sky can fill rows later · **GOR_GOR_REVIEW**  
**Used by:** `/portal` via `GET /api/portal/stories?lane=brand|creator|soul`  
**Machine copy:** [`../../data/airtable-schema.json`](../../data/airtable-schema.json)

Sky’s first sketch was one table with `Brand_Name`, `Story`, `Image_URL`. That is kept. Three extra fields make the three doors work without a second base.

## Create this in Airtable (free)

1. New base named **`ShortKey_Database`**.
2. Rename the first table to **`Stories`**.
3. Add the fields below (delete leftover default columns you do not need).
4. Copy the **Base ID** (`app…`) from Help → API documentation.
5. Create a **Personal Access Token** with `data.records:read` on this base.
6. Put both values in `.env.local` (never commit):

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_TABLE_NAME=Stories
```

7. Redeploy / restart `npm run dev`. The portal footer line switches from `DNA seed` to `Live from Airtable` when rows exist for that lane.

## Table `Stories`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `Lane` | Single select | yes | Exactly: `brand` · `creator` · `soul` |
| `Brand_Name` | Single line text | yes | Sky’s first column. Use `ShortKey` until a real brand sits here. |
| `Title` | Single line text | yes | Card heading |
| `Story` | Long text | yes | Mobile paragraph. No pricing. No fake creators. |
| `Image_URL` | URL | no | HTTPS only. Empty → locked logo. |
| `Image` | Attachment | no | Used if `Image_URL` is empty |
| `Sort_Order` | Number | yes | 1, 2, 3… |
| `Status` | Single select | yes | `DRAFT` · `GOR_GOR_REVIEW` · `READY` · `DO_NOT_USE` |

The API filters by `Lane` and hides `DO_NOT_USE`. `DRAFT` / `GOR_GOR_REVIEW` / `READY` all appear so Kieran can demo before public lock.

## Lane map

| Lane value | Door (ZH) | Door (EN) |
|------------|-----------|-----------|
| `brand` | 品牌展示 | Brand Story |
| `creator` | 創作人共鳴 | Creator Hub |
| `soul` | AI 靈魂開發 | AI Soul Lab |

## Do not put in this base

- API keys
- Personal data of creators who have not consented
- Public price figures
- Invented reviews or partnership claims
- Celebrity names/images without rights

## First three rows (optional)

If you want Airtable live on day one, copy the seed stories from `src/data/portal-seed.json` — they are already Brand DNA, not placeholder copy.
