# Family Home — Living Room Shared Chat (simple)

Internal Staging only. Soft pearl / lavender Living Room surface.

**P0 = recipient pick only** (no smart routing · no auto replies).

## Intent

One **shared chat box** with **manual recipient selection**. No complex auto-router. No autonomous fake replies. Not production-ready. Not a public launch.

## UX (P0 wireframe)

Before send:

- **Sender:** Kieran · Little Brother · Gor Gor
- **Send to:** checkboxes Gor Gor · Sky · Senti · Kura · Agent R · All Family
- **Urgency:** Normal · Today · Urgent · Red
- **Message** + **Send**

After send card:

```
{Sender} → {recipients}
Urgency: {level}
Message: {text}
Status:
{Member}: {STATUS}
```

Only selected members need to respond. Receipt statuses per member: `SENT` | `RECEIVED` | `READING` | `IN_PROGRESS` | `NEEDS_GOR_GOR` | `BLOCKED` | `PLACED_IN_CABINET`

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
- Floating **Gor Gor** button opens the same drawer upgraded to **Family Chat** (`GorGorChatDrawer.tsx`): Sender dropdown + Send-to checkboxes · Gor Gor → `/api/gor-gor-chat` · others → doorbell SENT/WAITING (no fake replies)
- Meeting v0.9.3 store + member ack panels remain available; Living Room compose UX is the simple chat

## Limits

- No secrets in frontend
- No Social expansion
- Does not touch Studio P0, beauty Coming Soon, or public routes
- Shared sync only when backend env is present; otherwise local fallback is honest
