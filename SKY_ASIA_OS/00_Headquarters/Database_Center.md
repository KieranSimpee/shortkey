# Database Center

Index of SKY ASIA structured data. Prefer filling JSON over building UI.

## Files + counts

| Database | Path | Count (Batch 001) |
|----------|------|------------------:|
| Artists | [`../05_Database/artists.json`](../05_Database/artists.json) | 10 |
| Creators | [`../05_Database/creators.json`](../05_Database/creators.json) | 10 |
| Brands | [`../05_Database/brands.json`](../05_Database/brands.json) | 10 |
| Culture | [`../05_Database/culture.json`](../05_Database/culture.json) | 10 |
| Festivals | [`../05_Database/festivals.json`](../05_Database/festivals.json) | 4 |

## Schema + batch log

- Schema: [`../05_Database/SCHEMA.md`](../05_Database/SCHEMA.md)
- Batch 001: [`../05_Database/BATCH_001.md`](../05_Database/BATCH_001.md)
- Folder README: [`../05_Database/README.md`](../05_Database/README.md)

## QC state

All Batch 001 rows marked **CURSOR_RESEARCH · pending KURA_QC** (Artists use `Status` field; others use `Notes` or batch log).

Live Ask Kura: **Needs key** (`KURA_API_KEY` / `BASE44_API_KEY` in `.env.local`).
