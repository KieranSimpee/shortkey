# Database schemas (empty tables)

All data files are JSON arrays starting as `[]`. Field names below are exact.

## Artist Database (`artists.json`)

| Field | Type (intended) |
|-------|-----------------|
| Name | string |
| Country | string |
| Instagram | string |
| Category | string |
| Story | string |
| Status | string |

## Creator Database (`creators.json`)

| Field | Type (intended) |
|-------|-----------------|
| Name | string |
| Platform | string |
| Followers | number or string |
| Country | string |
| Reason Selected | string |

## Brand Database (`brands.json`)

| Field | Type (intended) |
|-------|-----------------|
| Brand | string |
| Country | string |
| Category | string |
| Website | string |
| Notes | string |

## Festival Database (`festivals.json`)

| Field | Type (intended) |
|-------|-----------------|
| Festival | string |
| Country | string |
| Month | string |
| Description | string |

## Culture Database (`culture.json`)

| Field | Type (intended) |
|-------|-----------------|
| Topic | string |
| Country | string |
| Category | string |
| Reference | string |

**Note:** JSON keys may use camelCase or exact labels when filled in Phase 2; prefer the field labels above as the source of truth until a loader is defined.
