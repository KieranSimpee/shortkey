# Database schemas (MVP — founder fields)

All Batch 001 rows live as JSON arrays. Field names below are exact keys.

## Artist Database (`artists.json`)

| Field | Type |
|-------|------|
| Name | string |
| Country | string |
| Instagram | string (`unknown` if not verified — never invent) |
| Category | string |
| Website | string (`unknown` if not verified) |
| Story Potential | string |
| Status | string (keep `CURSOR_RESEARCH · pending KURA_QC` until Kura QC) |

## Creator Database (`creators.json`)

| Field | Type |
|-------|------|
| Name | string |
| Country | string |
| Platform | string |
| Followers | number \| null (`null` if not verified — never invent) |
| Niche | string |
| Contact | string (`unknown` until verified) |

## Brand Database (`brands.json`)

| Field | Type |
|-------|------|
| Brand | string |
| Country | string |
| Beauty/Fashion/Lifestyle | string (bucket + short descriptor) |
| Website | string |
| Potential Collaboration | string (includes QC status tags until cleared) |

## Festival Database (`festivals.json`)

| Field | Type |
|-------|------|
| Festival | string |
| Country | string |
| Date | string |
| Story Angle | string |
| Content Ready | string (`no` / `draft` / `ready`) |

## Culture Database (`culture.json`)

| Field | Type |
|-------|------|
| Topic | string |
| Country | string |
| Category | string |
| Reference | string (URL) |

## Migration notes (Batch 001 → founder fields)

| Old key | New key |
|---------|---------|
| Artists.`Story` | `Story Potential` |
| Artists — (new) | `Website` |
| Creators.`Reason Selected` | `Niche` |
| Creators — (new) | `Contact` |
| Brands.`Category` | `Beauty/Fashion/Lifestyle` |
| Brands.`Notes` | `Potential Collaboration` |
| Festivals.`Month` | `Date` |
| Festivals.`Description` | `Story Angle` |
| Festivals — (new) | `Content Ready` |
