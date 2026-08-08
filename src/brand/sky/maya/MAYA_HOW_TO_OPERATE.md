# Maya Lab 操作教學（3008）

**Auth lock:** Google Pro SSO on Lovart + Midjourney websites (browser).  
**Maya brain:** ASI:One API (`ASI1_API_KEY` / `ASI_ONE_API_KEY` in `.env.local`).  
**Art lock (founder):** **Do NOT generate any pictures until content is reviewed and confirmed.** Maya 可寫 brief/prompts；開 Lovart/MJ / 複製 gen prompts 前要打勾 *Content reviewed & confirmed — allow art handoff*（founder 或 Gor Gor）。ALWAYS TO TRUE · GOR_GOR_REVIEW · 唔發明 DNA。

## 步驟

1. **開機** — `npm run maya:dev` → http://127.0.0.1:3008/internal/maya （頂欄 online）
2. **內容先** — Season / Issue packet 入庫 · founder 或 Gor Gor **review & confirm**（空 slot 繼續 awaiting · 唔發明 copy · 唔出圖）
3. **Google Pro 登入（一次）** — 同一 browser 登入 Lovart canvas `pnMAt6CTYc` + Midjourney Imagine
4. **改 brief（可選）** — Tools tab 兩個文字框 · 可只叫 Maya 寫 brief（唔開分頁）
5. **打勾 art handoff** —「Content reviewed & confirmed — allow art handoff」
6. **撳綠色掣** —「自動：Maya → Lovart + Midjourney」→ brief 入剪貼簿 + 開兩個分頁
7. **貼上生成** — Ctrl+V → 你自己撳 Generate（ShortKey 唔代登入、唔代撳掣）
8. **睇結果** — 批准圖放入 `public/magazine-demo/` → http://127.0.0.1:3008/magazine-demo/emagazine.html#/cover

## 其他入口

| 想做 | 點做 |
|------|------|
| 同 Maya 傾稿 | Lab **ASI:One** tab · 或 https://asi1.ai/chat |
| Terminal 問 Maya | `npm run ask:maya -- "你嘅問題"` |
| E-Beauty Magazine Strategy Blueprint v1.0 | [`MAYA_E_BEAUTY_MAGAZINE_STRATEGY_BLUEPRINT_v1.0.md`](./MAYA_E_BEAUTY_MAGAZINE_STRATEGY_BLUEPRINT_v1.0.md) · morning sync `npm run maya:sync-blueprint` |
| Season topics（8 / season · awaiting Maya） | [`seasons/SEASON_TOPICS_INTAKE.md`](./seasons/SEASON_TOPICS_INTAKE.md) · slots [`seasons/season-01/`](./seasons/season-01/) — 唔好發明 topic copy |
| 只跑 Lovart / 只跑 MJ | Tools 下面各自白色掣 |

## 唔會發生嘅事

- 唔會代你 Google Pro 登入
- 唔會自動撳 Lovart / Midjourney Generate
- 唔會在內容未 review / confirm 前鼓勵或一鍵開 Lovart/MJ 出圖
- 唔會把 Base44 Maya portal（已刪）

## 喺 Cursor 對話點講（令佢哋知自己工作）

複製下面其中一句即可。

### 開工 / 分工 lock
```
分工 lock：Key=Cursor 執行；Maya=ASI:One 編輯心 + Lovart/MJ brief；
Kura=品牌設計方向；Sky=研究學習；Gor Gor=gatekeeper；Senti=creative 文件；
Agent R=秘書紀錄。Google Pro 登入 Lovart/MJ 係我自己做。唔發明 DNA。
```

### 叫 Maya
```
Ask Maya: 為 Issue 01 Cover 寫 Lovart brief + Midjourney prompts（J Fresh Texture）。
```

### Season topics 入庫（Maya 交包後）
```
Key：將 Maya Season One packet 對入 src/brand/sky/maya/seasons/season-01/ slots 1–8。
唔好發明缺槽。唔好話 Beauty V1 已上線季節。
```

### 叫 Key（呢個 Cursor chat）做工具手
```
Key：開 maya:dev。內容已 review 先打勾 art handoff · 再喺 Tools 跑一鍵自動 · 教我 Ctrl+V 去 Lovart/MJ。
未 confirm 內容就唔好開 Lovart/MJ 或出圖。
```

### 叫 Kura / Gor Gor / Senti / Agent R / Sky
```
Ask Kura: 檢查呢個 brief 有冇偏品牌。
Ask Gor Gor: GOR_GOR_REVIEW — 呢包可唔可以出。
Ask Senti: 將 Maya 輸出整成可執行 creative pack。
Ask Agent R: 記低今日 Maya Lab 操作結果。
Ask Sky: 研究呢個方向 · Reason / Approach / Why / Expect。
```

### 全家一次
```
Family HALO：各自報一次座位同今日可做嘅事（唔搶 Maya DNA · 唔代 Google 登入）。
```
