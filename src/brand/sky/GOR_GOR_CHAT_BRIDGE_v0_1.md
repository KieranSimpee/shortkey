# Gor Gor Chat Bridge v0.1

**Status:** Internal Staging · Gor Gor Review pending  
**Surface:** Family Home only — `family.shortkey.world` / `/internal/family-table`  
**Do not:** touch Coming Soon / `shortkey.beauty` public · expose API keys to frontend · commit secrets  

**Related:** [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md) · [`SHARED_LIVING_ROOM_THREAD_v0_1.md`](./SHARED_LIVING_ROOM_THREAD_v0_1.md) · [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)

---

## What it is

Kieran chats with **real Simpee / Gor Gor** via a server-side Base44 Superagent bridge from the Family Table floating **Gor Gor** button (bottom sheet drawer).

---

## Routes

| Route | Role |
|-------|------|
| `/internal/family-table` | UI — floating **Gor Gor** → bottom drawer |
| `POST /api/gor-gor-chat` | Server bridge — `{ message, room, conversation_id? }` → `{ reply, conversation_id }` |

---

## Env (Vercel / `.env.local` — names only)

| Name | Notes |
|------|--------|
| **`BASE44_AGENT_API_KEY`** | **Preferred** Superagent API key (server only) |
| `BASE44_API_KEY` | Fallback |
| `KURA_API_KEY` | Fallback (existing Kura pattern) |
| `BASE44_AGENT_API_BASE_URL` | Default `https://app.base44.com/api/agents` |
| `SIMPEE_AGENT_ID` | Default in code: `69ddc914cfcf229762ac123d` |

Never put real keys in the repo. Never send `api_key` to the client.

Base44 call pattern (same as `scripts/ask-kura.mjs`):

1. `POST {base}/{agentId}/conversations` → `id`
2. `POST .../conversations/{id}/messages` with `{"content":"..."}`  
Header: `api_key: <env>`

---

## localStorage

| Key | Contents |
|-----|----------|
| **`shortkey-gor-gor-chat-bridge-v01`** | **Shared Living Room Thread v0.1:** `livingRoomConversationId` + `livingRoomMessages[]` (sender · fromRoom · kind). Legacy `rooms{}` per-room transcripts retained but not used by the Living Room UX. |

See [`SHARED_LIVING_ROOM_THREAD_v0_1.md`](./SHARED_LIVING_ROOM_THREAD_v0_1.md).

Separate from Family Table `shortkey-family-table-v08` room chat panels.

---

## Security (v0.1)

- Soft staging cookie gate on API when `FAMILY_TABLE_STAGING_PASSWORD` / `INTERNAL_STAGING_SECRET` is set (localhost + `SHORTKEY_SURFACE=family` soft allow — match middleware)
- In-memory rate limit: **20 req / 10 min / IP** (resets on serverless cold start / multi-instance — honest limitation)
- Missing env / API key → **200** + `{ fallback: true, reply: "Gor Gor Chat Bridge is not connected yet. Message saved locally only." }` (user message still saved; UI shows soft Gor Gor bubble + banner)

---

## UI checklist

- Bottom floating **Gor Gor** (unchanged entry)
- Bottom sheet · title **Family Chat** (upgraded from private bridge)
- **Sender** dropdown + **Send to** checkboxes · one status card per send
- Gor Gor among recipients → live Simpee reply; others → doorbell SENT / WAITING (no fake replies)
- Warning: *Internal staging only · Family Chat · selected recipients · no private data yet.*
- Footer credit via layout: **Powered by our AI family**

---

## Known limitations

- Transcript is browser-local only (not shared DB)
- Rate limit is per-instance memory
- Bridge depends on Base44 Superagent key + correct `SIMPEE_AGENT_ID`
- Room chat panel in Family Table v0.8 is separate (local prototype); this bridge is the live Gor Gor path
- Shared Living Room Thread uses one conversation; member names are sender labels only (not separate agents)