# Family Home — Living Room Shared Chat (simple)

Internal Staging only. Soft pearl / lavender Living Room surface.

## Intent

One **shared chat box** with **manual recipient selection**. No complex auto-router. No autonomous fake replies. Not production-ready. Not a public launch.

## UX

Before send:

- Recipient checkboxes: Gor Gor · Sky · Senti · Kura · Agent R · All Family
- Urgency: `NORMAL` | `TODAY` | `URGENT` | `RED`
- Button: **Send to selected family**

Each message shows:

- Message · Sender · Selected recipients · Urgency · Receipt status per recipient · Timestamp

Receipt statuses (per selected member):

`SENT` | `RECEIVED` | `READING` | `IN_PROGRESS` | `NEEDS_GOR_GOR` | `BLOCKED` | `PLACED_IN_CABINET`

Only selected members need to respond.

## Storage / API

Prefers shared doorbell API (cross-device when Upstash / Vercel KV is configured):

- `POST /api/family-doorbell/messages` with `target_members` / `selected_recipients`, `body`, `sender`, `urgency`, `mode: "doorbell"`
- `GET /api/family-doorbell/messages`
- `PATCH /api/family-doorbell/messages/[id]/receipt`

Fallback: browser `localStorage` key `shortkey-family-doorbell-v092` (this device only).

Redis key unchanged: `shortkey:family-doorbell:v092`.

## Surface

- Component: `src/components/internal/LivingRoomSharedChat.tsx`
- Wired in Family Table Living Room (`FamilyTableWorkbench`)
- Replaces the complex Family Meeting / Thread router composer on that surface
- Gor Gor floating drawer is optional AI bridge only — points people back to Shared Chat for family messages
- Meeting v0.9.3 store + member ack panels remain available; Living Room compose UX is the simple chat

## Limits

- No secrets in frontend
- No Social expansion
- Does not touch Studio P0, beauty Coming Soon, or public routes
- Shared sync only when backend env is present; otherwise local fallback is honest
