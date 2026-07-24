# Shared Living Room Thread v0.1

**Status:** Internal Staging · Gor Gor Review pending  
**Surface:** Family Home only — `family.shortkey.world` / `/internal/family-table`  
**Do not:** touch Coming Soon / public beauty `/` · expose API keys · commit secrets  

**Related:** [`GOR_GOR_CHAT_BRIDGE_v0_1.md`](./GOR_GOR_CHAT_BRIDGE_v0_1.md) · [`FAMILY_TABLE_v0_8.md`](./FAMILY_TABLE_v0_8.md) · [`STUDIO_PUSH_LEDGER.md`](./STUDIO_PUSH_LEDGER.md)

---

## What it is

Different Family Home rooms / members send into the **same** Gor Gor Chat Bridge conversation so it feels like one Living Room. **One Simpee agent only** — no separate AI agents yet.

---

## Storage choice (documented)

| Choice | Detail |
|--------|--------|
| **Key** | Nest under existing **`shortkey-gor-gor-chat-bridge-v01`** (not a separate `shortkey-living-room-thread-v01` key) |
| **Shared id** | `livingRoomConversationId` — one Base44 / Simpee conversation for the Living Room Thread |
| **Shared transcript** | `livingRoomMessages[]` — sender · fromRoom · kind · role · text |
| **Legacy** | `rooms{}` per-room transcripts kept in the same key for backwards compatibility; **this UX does not write them** |

All Living Room Thread posts use `conversation_id: livingRoomConversationId` regardless of which room the message is “from.”

---

## Message prepend (frontend → API)

Frontend builds the string; API skips re-prefix when content already starts with `[Family Home`:

```
[Family Home · Living Room]
[Sender: Sky]
message text
```

From a personal room:

```
[Family Home · Senti Room]
[Sender: Senti]
[Kind: HOMEWORK SUBMITTED]
message text
```

(`[Kind: …]` omitted when kind is `CHAT`.)

---

## UI

- Floating **Gor Gor** → bottom sheet (unchanged entry) — upgraded to **Family Chat**
- Title: **Family Chat** (selected recipients · internal staging)
- **Sender** (Kieran · Little Brother · Gor Gor) separate from **Send to** checkboxes (Gor Gor · Sky · Senti · Kura · Agent R · All Family)
- One message card per send: recipients + statuses; Gor Gor path shows real Simpee reply; other members SENT / WAITING (doorbell · no fake replies)
- Legacy bubbles from earlier Living Room Thread still render if present in storage

---

## API

`POST /api/gor-gor-chat` — still **SIMPEE_AGENT_ID** only.

Body (Living Room Thread):

```json
{
  "message": "[Family Home · …]\\n[Sender: …]\\n…",
  "room": "senti",
  "conversation_id": "<livingRoomConversationId>",
  "sender": "Senti",
  "kind": "HOMEWORK SUBMITTED",
  "from_room": "senti"
}
```

Optional `sender` / `kind` / `from_room` are accepted and ignored upstream (diagnostics / future). Soft fallback **200** `{ fallback: true, reply }` when key missing — unchanged.

---

## Known limitations

- Browser localStorage only — not a shared family DB
- One Simpee agent — other members are **sender labels**, not separate agents
- Legacy per-room `rooms{}` transcripts are not auto-merged into `livingRoomMessages`
- Rate limit still in-memory per instance
