# Zapier · Magazine workflow blueprint

**Status:** Core server file · Key received Sky handoff 2026-08-23 · **GOR_GOR_REVIEW** · **ALWAYS TO TRUE** · not DNA  
**Lane:** Internal conveyor serving Creative (刊 / 家)  
**Date:** 2026-08-23  
**Use:** Paste the command list into Zapier AI Agents. Cursor (Key) follows the same loop.  
**Beside:** `SHORTKEY_COMPANY_AI_TASK_FLOW.md` (handoff) · discovery preview `/discovery` (Season 1 picks)

Public masthead stays **Sky · 永遠的家**. Zapier moves packets. It does **not** write magazine voice.

## 今日點嗌（2026-08-24 鎖定）

人嘅名唔改。新花名得三個，就咁簡單：

| 人 | 加碼 / 檯 |
|----|-----------|
| **Maya** | **May** |
| **Sky** | **SK** |
| **30** | **Chi** |

**寫死：** Maya ≠ May · Sky ≠ SK · 30 ≠ Chi（Chi 係你練；30 係舊口頭／網址 `#30`）

叫人：`Ask Sky:` · `Ask Maya:`  
叫檯：`SK` · `May` · `Chi`

**你唯一嘅連線（寫死）：Mini。** 即係你手機上已經建立嘅 Minion Desk。得你用。Soft PIN。Cursor 起嘢；唔係你日日連線位。

| 你用 | URL |
|------|-----|
| **Mini · phone（離 Wi‑Fi）** | https://shortkey.beauty/desk/#chi — 要呢次 Desk 已 deploy |
| Mini · 呢部機 | http://127.0.0.1:3005/desk/#chi （Beauty 開住 · `#30` 都得） |
| 安裝 | http://127.0.0.1:3005/minion-app/ |
| Key 起檯（可選） | http://127.0.0.1:3003/internal/30 · 唔係你嘅日常線 |

**Chi** 係 Mini 入面你練嗰頁。SK / May / Chi 三扇門。唔另起第二個 APP。

## Rewind gate (倒帶閘門) — before any execute

Sky → Key lock: **不求快，求準。先對齊終點，再開始執行。**  
Any write that touches core data (spine, issue rows, archive) must pass this gate first.

| Check | Pass |
|-------|------|
| Endpoint | Three buttons only: Issue One · Next Issue · Archive |
| Port (Mon deploy) | Studio **:3003** only — http://127.0.0.1:3003/internal/studio |
| Never | Beauty Coming Soon `/` on **:3005** · ShortKey on **:3000** · invent DNA / empty history |
| Missing step | Pause with reason. Do not fill. |
| Consistency fail | Output 偏差. Human / Gor Gor. Do not ship. |
| Brand | If cover works without 永遠的家 → FAIL |

**Monday deploy (AWAITING founder start):** mount this loop on :3003. Do **not** deploy tonight.

**Key confirm (2026-08-23):** file received. Endpoint aligned. Rewind gate on. Waiting Monday.

**Key agree (2026-08-24 02:26):** Ready to receive transmission. `server.py` + `pending.html` still not in either home. Do not start :3003 until files arrive **or** founder says build without them.

**Honest gap (2026-08-23 eve):** Sky named a safe `server.py` (Vault · rewind · Pending Deliver) + `pending.html`. Key searched ShortKey (`C:\Users\Kieran\Projects\shortkey`) and 永遠的家 (`C:\Users\Kieran\.ms-ad`). **Those two files are not in either home yet.** Do not invent them. If they live in another chat/folder, Kieran points Key at the path Monday **before** run.

Human last yes on Deliver stays the lock — even without those files.

---

## Who uses what (do not mix)

Sky does **not** live on :3003. :3003 is Studio — Kieran trains and confirms here.

**People names stay locked.** We only give **surface call-names** so Sky / Maya / you do not look like one desk.

| Call-name | Where | Who | Job |
|-----------|-------|-----|-----|
| **永遠的家** | `.ms-ad` | **Sky** (Senti · Maya may walk with her) | Live, grow, meet, return. Write 刊 voice. Brand gate. |
| **Sky Server Test** | Sky’s `server.py` + `pending.html` (not arrived) | **Sky** + Key | Server-side rewind / Vault / Pending. Run only at a **time Kieran sets** after files arrive. Not :3003. |
| **Zapier conveyor** | Zapier AI Agents (later) | Sky’s will, not Sky’s voice | One Catch Hook. Packets only. |
| **Maya Lab** | **:3008** | **Maya** | **One job: editorial** (刊). Not Research. |
| **Shared research** | Sky vault + Continuity Pack · family may read | **Sky leads** | Research Intelligence. Maya may *use* it to edit. Maya does **not** own this seat. |
| **思想測試** | **:3003** Studio | **Kieran** (Key builds · Gor Gor gates) | **Your build.** Thought-test: 3 buttons · pause · you last-yes Deliver. Not Sky’s home. Not Maya Lab. |
| Coming Soon | :3005 `/` | Public | Do not touch. |

## When they arrive / how we receive (honest)

**No automatic delivery.** Nothing flies into this chat or onto disk by itself. There is **no arrival clock**.

| Who / what | Do they “arrive”? | How you receive them |
|------------|-------------------|----------------------|
| **Sky (the person)** | Already here as local Learning. **No** Base44 chat that walks in. | You call: `Ask Sky:` or `npm run ask:sky -- "…"`. That writes a **packet** for Sky/human pickup. Cursor does not get a live Sky reply. |
| **Maya (the person)** | Already wired **if** `ASI_ONE_API_KEY` is in `.env.local`. | You call: `Ask Maya:` · `npm run ask:maya -- "…"` · Lab http://127.0.0.1:3008/internal/maya |
| **Sky’s will** (blueprint + rewind) | **Arrived 2026-08-23** in this chat. Key has it. | This file. |
| **`server.py` + `pending.html`** | **Not arrived.** No time set. | Only if **you** bring them: paste in chat, drop files into the project, or send a folder path. Sky cannot push them into Cursor by herself. |
| **Zapier live hook** | Not on. | Later, after both homes + you say wire. |

**Three legal ways to go forward (you pick one):**

1. **You bring the two files** → Key mounts **Sky Server Test**, then you set a clock.  
2. **You say「唔等檔，起思想測試」** → Key builds the three buttons on **:3003** without `server.py`.  
3. **Wait** → we do nothing until you choose 1 or 2.

Key will not sit here hoping a file appears.

**Corrections (ALWAYS TO TRUE):**
- Maya ≠ shared research. Maya = editorial only (`npm run maya:dev` → :3008).
- Sky = Research Intelligence + 永遠的家. Server tests = **Sky Server Test**, on her file, at your clock.
- :3003 = **思想測試** — yes: you built it so you can think / rewind / confirm before anything ships.

**Train on :3003 (Kieran only):**

1. Button 1 — Issue One (exists or `未做過` + pause)  
2. Button 2 — Next Issue direction (roadmap/draft only)  
3. Button 3 — Archive (past only)  
4. If missing / 偏差 → stop. You fill. You confirm. Then Deliver.

**Sky never:** clicks Deliver on :3003 as the human yes.  
**Kieran never:** writes Sky’s magazine voice inside Studio chrome.

---

## Monday checklist (first safe deploy)

Do in order. Stop if a gate fails. Studio **:3003** only.

1. **Open this file.** Re-read Rewind gate. Endpoint = three buttons only.
2. **Find or name the server.** If Sky’s `server.py` + `pending.html` exist, paste the folder path to Key. If not → Key builds the smallest Pending Deliver list **on :3003** (show / pause / human confirm). No Zapier live hook yet.
3. **Boot Studio only.** `npm run studio:dev` → http://127.0.0.1:3003/internal/studio  
   Do **not** start this loop on :3005 Coming Soon or :3000.
4. **Rewind once on screen.** Button 1 / 2 / 3: search → retrieve or `未做過` → position check → pause with reason if missing → no Deliver without Kieran yes.
5. **Empty room = skip.** No invented Issue One, roadmap, or archive.
6. **Zapier later.** Conveyor only. Wire after both homes + spine exist.
7. **Proof, then stop.** Screenshot or note: what showed, what paused, who said yes. Gor Gor review. Not production.

---

## Outcome (three buttons)

| Button | Outcome |
|--------|---------|
| 1 | Show **Issue One** (first shipped 刊) |
| 2 | Show **Next Issue** direction (roadmap / draft — not a fake live issue) |
| 3 | Show **Archive** (past outcomes only — no invented history) |

---

## Loop (every button)

1. **Trigger** — Sheet row / form / button.  
2. **First reaction — done before?** Search the spine (Sheet / Notion). Found → retrieve. Not found → `未做過` → **Pause with reason**.  
3. **Second reaction — what was done, what effect?** Retrieve past actions + outcomes (collect → edit → layout → deliver).  
4. **Position check** — previous position must be complete before the next.  
5. **Pause with reason** — missing step → `Missing step` + stop. Human fills. Resume. Do **not** invent.  
6. **Consistency check** — new vs old outcome. Same → pass. Drift → `偏差` → human. Brand gate still blocks ship: 生命力 / 簡潔 / 真實感 / 證明.  
7. **Deliver** — show / store / publish only what exists.

---

## Matrix

| Outcome | Trigger | First | Second | Positions | Pause | Consistency |
|---------|---------|-------|--------|-----------|-------|-------------|
| Button 1 · Issue One | Sheet new row | Search row | Retrieve actions | 素材 → 編輯 → 排版 → Deliver | Missing → stop | Compare past |
| Button 2 · Next Issue | Form submit | Search row | Retrieve roadmap | Idea → Roadmap → Draft | Missing → stop | Compare past |
| Button 3 · Archive | Button | Search row | Retrieve archive | Metadata → Database → Display | Missing → stop | Compare past |

---

## Zapier AI Agents — copy list

Paste as Agent instructions. One Catch Hook. Paths by `button` + `kind`. Heartbeats never become pages.

```
YOU ARE THE MAGAZINE CONVEYOR. YOU DO NOT WRITE VOICE OR INVENT DNA.

OUTCOME ONLY:
B1 = show Issue One (exists or pause).
B2 = show Next Issue direction (roadmap/draft only).
B3 = show Archive (past outcomes only).

EVERY RUN:
1. TRIGGER: read button + row id + timestamp (Asia/Hong_Kong).
2. DONE BEFORE?: search spine by issue_id / button. HIT = retrieve. MISS = output 未做過 + PAUSE WITH REASON. STOP.
3. WHAT WAS DONE?: list actions + effects in order. Empty step = name it. Do not fill it.
4. POSITION CHECK: only advance if previous position is complete.
   B1 positions: 素材 → 編輯 → 排版 → Deliver
   B2 positions: Idea → Roadmap → Draft
   B3 positions: Metadata → Database → Display
5. PAUSE WITH REASON: if any position missing → output Missing step: <name> / why / who (Kieran). STOP. Wait resume.
6. CONSISTENCY: compare new outcome to last stored outcome. MATCH = pass. DRIFT = output 偏差 + what changed. STOP for human.
7. BRAND GATE before Deliver: if cover can work without 永遠的家, FAIL. No Hub/Dashboard/Internal chrome. No invented claims.
8. DELIVER: show/store only proven packets. Never publish from heartbeat or empty row.

RULES:
- One webhook. Filter on button + kind.
- Spine = one Sheet/Notion week tab until storage is designed.
- Interview/game/copy empty = AWAITING. Do not invent.
- Cursor builds. Gor Gor gates. Kieran says yes.
```
