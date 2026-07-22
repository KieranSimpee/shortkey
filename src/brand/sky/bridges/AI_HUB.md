# AI Hub — Collective Memory Brain

**Role in Sky OS:** Shared intelligence across all AI families.  
**Sky M:** memory layer that feeds this Hub (`../SKY_M.md`) — MVP = manual logs, no over-engineering.

## Responsibilities
- Share learning across families  
- Prevent repeated mistakes  
- Build knowledge graph (vault entries)  
- Track performance rankings  
- Improve model weightings over time  

## Sources of truth (this repo)
| Vault | Path |
|-------|------|
| Knowledge | `src/brand/sky/vault/knowledge.json` |
| Lessons | `src/brand/sky/vault/lessons.json` |
| Performance | `src/brand/sky/vault/performance.json` |
| Learning log | `src/brand/sky/learning-log.json` |
| Capability registry | `src/brand/sky/capability-registry.json` |
| Families / routing | `src/brand/sky/families.json` |

All families benefit from lessons learned. Sky writes; Hub distributes.
