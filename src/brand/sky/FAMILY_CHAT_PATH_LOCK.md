# Family chat path lock — Minion Chat Box wins



Status: **GOR_GOR_REVIEW** · Internal · Cursor builds, does not decide DNA  

Date: 2026-08-06 · Founder ask: pick the more stable path and remove the weaker one



## Winner



**Minion Chat Box** on Founder Desk



| Context | URL |

|---------|-----|

| **Phone / remote INTERNAL** | https://shortkey.beauty/desk/#family |

| Local Beauty | http://localhost:3005/desk/#family |

| Vercel fallback | https://shortkey.vercel.app/desk/#family |



- Soft PIN: `SITE_ACCESS_PASSWORD` (or `DESK_ACCESS_PASSWORD`) on Work → Unlock  

- Chat env: `K_MINION_API_KEY` on the server  

- Next + Base44 Minion Relay (`appId` 6a5f20ace942aedd542584a2)  

- Verbatim minion lock · Message `parent_id` threads  

- Family seats via existing `askFamilyAgent` / env keys already wired  

- Humans stay honest: Maya portal · Sky email (no fake API seats)



**Do not bookmark** `shortkey.world/desk` until that apex points at Vercel (still Squarespace parking).  

**Do not wait** for `desk.shortkey.world` DNS — optional later only.



Doc: `src/brand/sky/command-center/FOUNDER_DESK_REMOTE.md` · constant `src/lib/minionChatBookmark.ts`



## Rejected (do not start)



**Greenfield Python FastAPI + CrewAI/LangGraph + React/Streamlit** multi-agent chat app.



Not in this repo. Do **not** create a second family-chat product. It would fork credentials, DNA/GOR_GOR_REVIEW, minion lock, and deploy surface into two sources of truth.



## Removed as weaker in-repo duplicates



| Path | Why removed |

|---|---|

| Desk single-seat ask UI (`public/desk/index.html` legacy silo) | Private one-agent; siblings cannot see; Minion Chat replaces as primary UX |

| `GorGorChatDrawer.tsx` | LocalStorage “Family Chat” · Simpee-only bridge · no minion verbatim board |

| `POST /api/gor-gor-chat` | Only served that weaker drawer |

| RoomChatThread UI (Family Table panel 9) | localStorage fake room chat |



## Kept (not competing chat products)



- `npm run ask:kura` / `ask:gorgor` / `ask:senti` / `ask:agent-r` — CLI tools

- `/api/family/ask` + `familyAsk.ts` — power tool + Minion seat posts

- Family Table (3002) house · doorbell · cabinet — work routing, not multi-agent chat

- Living Room Shared Chat / doorbell API — recipient pick + receipts (honest, no fake AI replies)



## Daily open



**INTERNAL phone:** https://shortkey.beauty/desk/#family  



**Local:** http://localhost:3005/desk/#family



If production `/desk` is 404: push this repo to the Vercel-connected branch, set env vars, redeploy — then re-open the beauty bookmark.


