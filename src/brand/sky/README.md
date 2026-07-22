# Sky Collective Intelligence OS — ShortKey install

| Layer | Role | Path |
|-------|------|------|
| **Sky** | Intelligence governor | `SKY_COLLECTIVE_INTELLIGENCE_OS.md` |
| **AI Hub** | Collective memory | `bridges/AI_HUB.md` + `vault/` |
| **Base44** | Execution platform | `bridges/BASE44.md` |
| **ShortKey** | UX layer | `bridges/SHORTKEY.md` |

## Quick start (Cursor)
```ts
import { classify } from "@/brand/sky/orchestrator";

const decision = classify("Improve homepage UX whitespace");
// → route: UX_DESIGN, weights: Sonnet 40% …
```

After every significant task: append `learning-log.json` + matching vault entries.
