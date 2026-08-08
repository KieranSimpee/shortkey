"use client";

import { useCallback, useEffect, useState } from "react";

type ProfilePayload = {
  ok?: boolean;
  profile?: { status?: string };
  work?: {
    magazineDemo?: {
      href: string;
      pageArtCount: number;
      pages: Array<{ id: string; href: string }>;
    };
    pipelineDrafts?: Array<{ id?: string; summary?: string }>;
    asi1SessionNotes?: Array<{ id?: string; title?: string }>;
    syncInbox?: Array<{ file?: string }>;
    authorityDocs?: Array<{ id: string; path: string }>;
  };
};

const ASI1_CHAT = "https://asi1.ai/chat";
const LOVART_CANVAS = "https://www.lovart.ai/canvas?projectId=pnMAt6CTYc";
const MJ_WEB = "https://www.midjourney.com/imagine";

type Tab = "live" | "tools" | "work";

/**
 * Maya Lab :3008 — ASI:One Maya + Lovart/MJ tools (honest handoff).
 */
export function MayaLabShell() {
  const [tab, setTab] = useState<Tab>("tools");
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [tryEmbed, setTryEmbed] = useState(false);
  const [lovartBrief, setLovartBrief] = useState(
    "Issue 01 Nihon Sakura — Cover + Editor’s Letter visual brief for locked Lovart canvas",
  );
  const [mjBrief, setMjBrief] = useState(
    "Soft editorial J-Beauty Fresh Texture mood stills for Issue 01 Cover atmosphere",
  );
  const [lovartOut, setLovartOut] = useState("");
  const [mjOut, setMjOut] = useState("");
  const [lovartBusy, setLovartBusy] = useState(false);
  const [mjBusy, setMjBusy] = useState(false);
  const [autoStatus, setAutoStatus] = useState("");
  const [autoBusy, setAutoBusy] = useState(false);
  const [toolErr, setToolErr] = useState("");
  /** Founder art gate: open/copy Lovart·MJ only after content reviewed & confirmed */
  const [contentConfirmed, setContentConfirmed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/maya/profile");
      setProfile((await res.json()) as ProfilePayload);
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  async function runLovart(opts?: { open?: boolean; copy?: boolean }) {
    const wantsOpen = opts?.open !== false;
    const wantsCopy = opts?.copy !== false;
    const wantsHandoff = wantsOpen || wantsCopy;
    const open = contentConfirmed && wantsOpen;
    const copy = contentConfirmed && wantsCopy;
    setLovartBusy(true);
    setToolErr("");
    try {
      const res = await fetch("/api/maya/tools/lovart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: lovartBrief }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setToolErr(data.error || `Lovart tool failed (${res.status})`);
        return null;
      }
      const out = String(data.mayaOutput || "");
      setLovartOut(out);
      if (copy && out) await copyText(out);
      if (open) {
        window.open(
          data.canvasUrl || LOVART_CANVAS,
          "_blank",
          "noopener,noreferrer",
        );
      } else if (wantsHandoff && !contentConfirmed) {
        setToolErr(
          "Brief written only. Art handoff locked — check “Content reviewed & confirmed” before open/copy to Lovart.",
        );
      }
      return out;
    } catch (err) {
      setToolErr(err instanceof Error ? err.message : "Lovart tool error");
      return null;
    } finally {
      setLovartBusy(false);
    }
  }

  async function runMj(opts?: { open?: boolean; copy?: boolean }) {
    const wantsOpen = opts?.open !== false;
    const wantsCopy = opts?.copy !== false;
    const wantsHandoff = wantsOpen || wantsCopy;
    const open = contentConfirmed && wantsOpen;
    const copy = contentConfirmed && wantsCopy;
    setMjBusy(true);
    setToolErr("");
    try {
      const res = await fetch("/api/maya/tools/midjourney", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: mjBrief }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setToolErr(data.error || `MJ tool failed (${res.status})`);
        return null;
      }
      const out = String(data.mayaOutput || "");
      setMjOut(out);
      if (copy && out) await copyText(out);
      if (open) window.open(MJ_WEB, "_blank", "noopener,noreferrer");
      else if (wantsHandoff && !contentConfirmed) {
        setToolErr(
          "Prompts written only. Art handoff locked — check “Content reviewed & confirmed” before open/copy to Midjourney.",
        );
      }
      return out;
    } catch (err) {
      setToolErr(err instanceof Error ? err.message : "MJ tool error");
      return null;
    } finally {
      setMjBusy(false);
    }
  }

  /** One-click: Maya briefs both tools → clipboard → open Google-logged tabs (art gate) */
  async function runAutoBoth() {
    if (!contentConfirmed) {
      setToolErr(
        "Art handoff locked. Confirm content first — check “Content reviewed & confirmed — allow art handoff”.",
      );
      setAutoStatus("");
      return;
    }
    setAutoBusy(true);
    setLovartBusy(true);
    setMjBusy(true);
    setAutoStatus("Maya 寫緊 Lovart + Midjourney…");
    setToolErr("");
    try {
      const [lovartRes, mjRes] = await Promise.all([
        fetch("/api/maya/tools/lovart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief: lovartBrief }),
        }),
        fetch("/api/maya/tools/midjourney", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief: mjBrief }),
        }),
      ]);
      const lovartData = await lovartRes.json();
      const mjData = await mjRes.json();
      const lovart =
        lovartRes.ok && lovartData.ok ? String(lovartData.mayaOutput || "") : "";
      const mj = mjRes.ok && mjData.ok ? String(mjData.mayaOutput || "") : "";
      if (lovart) setLovartOut(lovart);
      if (mj) setMjOut(mj);
      if (!lovart || !mj) {
        setToolErr(
          [!lovart && (lovartData.error || "Lovart failed"), !mj && (mjData.error || "MJ failed")]
            .filter(Boolean)
            .join(" · "),
        );
      }
      window.open(
        lovartData.canvasUrl || LOVART_CANVAS,
        "_blank",
        "noopener,noreferrer",
      );
      window.open(MJ_WEB, "_blank", "noopener,noreferrer");
      const combined = [
        "=== LOVART (paste on canvas pnMAt6CTYc) ===",
        lovart || "(failed)",
        "",
        "=== MIDJOURNEY (paste in Imagine / Discord) ===",
        mj || "(failed)",
      ].join("\n");
      const copied = await copyText(combined);
      setAutoStatus(
        copied
          ? "完成：已開 Lovart + Midjourney · brief 已複製。用 Google Pro 已 login 嘅分頁 Ctrl+V。"
          : "完成：已開分頁 · 請手動 Copy 下面 output（剪貼簿被擋）。",
      );
    } catch (err) {
      setToolErr(err instanceof Error ? err.message : "Auto run failed");
      setAutoStatus("");
    } finally {
      setAutoBusy(false);
      setLovartBusy(false);
      setMjBusy(false);
    }
  }

  const w = profile?.work;
  const online = profile?.profile?.status === "online";

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0c] text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            Port 3008 · Maya Lab
          </p>
          <h1 className="font-display text-lg font-semibold tracking-tight">
            Maya @shortkey
          </h1>
          <p className="text-xs text-white/50">
            Tools: Lovart · Midjourney · ASI:One chat
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
              online ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"
            }`}
          >
            {online ? "Maya API · wired" : "Needs ASI_ONE_API_KEY"}
          </span>
          <div className="flex rounded-lg border border-white/15 p-0.5 text-xs">
            {(
              [
                ["tools", "Tools"],
                ["live", "ASI:One"],
                ["work", "Local work"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-md px-3 py-1.5 font-semibold ${
                  tab === id ? "bg-white text-black" : "text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <a
            href="/magazine-demo/issues.html"
            className="rounded-md border border-white/25 px-3 py-2 text-sm font-semibold text-white/90"
            title="Issue 1 Maya vs Issue 2 Copilot"
          >
            Issues hub
          </a>
          <a
            href={ASI1_CHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#22c55e] px-3 py-2 text-sm font-semibold text-black"
          >
            Open Maya chat
          </a>
        </div>
      </header>

      {tab === "tools" ? (
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-semibold">Maya Tools</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Lovart + Midjourney 當 Maya 嘅創作工具。Auth lock：你嘅{" "}
              <strong className="text-white/80">Google Pro</strong>
              {" "}帳號喺 Lovart / Midjourney 網站 SSO（browser）。
            </p>
            <p className="mt-3 max-w-2xl rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
              Art only after content reviewed &amp; confirmed (founder / Gor Gor).
              Maya may write briefs; do not generate pictures for empty / unconfirmed packets.
            </p>

            <ol className="mt-6 list-decimal space-y-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-5 pl-9 text-sm text-white/75">
              <li>
                <span className="font-semibold text-white">開機</span>
                ：Terminal 跑{" "}
                <code className="rounded bg-black/50 px-1.5 py-0.5 text-[12px] text-emerald-200">
                  npm run maya:dev
                </code>
                ，開{" "}
                <a
                  className="text-emerald-300 underline-offset-2 hover:underline"
                  href="http://127.0.0.1:3008/internal/maya"
                >
                  3008 Maya Lab
                </a>
                。頂欄顯示 online 先繼續。
              </li>
              <li>
                <span className="font-semibold text-white">內容先 · review &amp; confirm</span>
                ：Season / Issue packet 入庫後，founder 或 Gor Gor 確認。未 confirm 唔好出圖。
              </li>
              <li>
                <span className="font-semibold text-white">Google Pro 登入（一次）</span>
                ：同一個 browser，用 Google Pro 登入{" "}
                <a
                  className="text-emerald-300 underline-offset-2 hover:underline"
                  href={LOVART_CANVAS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lovart canvas
                </a>{" "}
                同{" "}
                <a
                  className="text-emerald-300 underline-offset-2 hover:underline"
                  href={MJ_WEB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Midjourney Imagine
                </a>
                。保持 login。
              </li>
              <li>
                <span className="font-semibold text-white">改 brief（可選）</span>
                ：下面 Lovart / Midjourney 兩個框。可只寫 brief；開分頁 / 複製 gen prompts 要先打勾 art handoff。
              </li>
              <li>
                <span className="font-semibold text-white">打勾後撳綠色掣</span>
                ：「自動：Maya → Lovart + Midjourney」。等 status 話完成 · brief 入咗剪貼簿 · 兩個分頁會開。
              </li>
              <li>
                <span className="font-semibold text-white">貼上生成</span>
                ：去已 login 嘅 Lovart / MJ 分頁，Ctrl+V（或 Cmd+V），再自己撳 Generate。ShortKey{" "}
                <strong className="text-white">唔會</strong>代你登入或撳掣。
              </li>
              <li>
                <span className="font-semibold text-white">睇結果</span>
                ：批准後嘅圖放入{" "}
                <code className="rounded bg-black/50 px-1.5 py-0.5 text-[12px] text-emerald-200">
                  public/magazine-demo/
                </code>
                ，再開{" "}
                <a
                  className="text-emerald-300 underline-offset-2 hover:underline"
                  href="http://127.0.0.1:3008/magazine-demo/issues.html"
                >
                  Issues hub
                </a>
                {" "}（Issue 1 Maya · Issue 2 Copilot）或{" "}
                <a
                  className="text-emerald-300 underline-offset-2 hover:underline"
                  href="http://127.0.0.1:3008/magazine-demo/emagazine.html#/cover"
                >
                  Issue 1 e-magazine
                </a>
                。
              </li>
            </ol>

            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h3 className="text-sm font-semibold text-emerald-200">
                一鍵自動（內容已 confirm · Google Pro 已 login）
              </h3>
              <p className="mt-1 text-xs text-white/50">
                同時跑 Lovart brief + MJ prompts · 開兩個分頁 · 合併結果入剪貼簿
              </p>
              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={contentConfirmed}
                  onChange={(e) => setContentConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-black/40"
                />
                <span>
                  Content reviewed &amp; confirmed — allow art handoff
                  <span className="mt-0.5 block text-[11px] text-white/45">
                    Founder or Gor Gor. Unticked = write briefs only; no open/copy to Lovart/MJ.
                  </span>
                </span>
              </label>
              <button
                type="button"
                disabled={autoBusy || !online || !contentConfirmed}
                onClick={() => void runAutoBoth()}
                className="mt-3 rounded-md bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
              >
                {autoBusy ? "自動執行中…" : "自動：Maya → Lovart + Midjourney"}
              </button>
              {!contentConfirmed ? (
                <p className="mt-2 text-[11px] text-amber-100/80" role="status">
                  Handoff disabled until content is reviewed &amp; confirmed.
                </p>
              ) : null}
              {autoStatus ? (
                <p className="mt-2 text-xs text-emerald-100/90" role="status">
                  {autoStatus}
                </p>
              ) : null}
            </div>

            {toolErr ? (
              <p className="mt-3 text-sm text-amber-300" role="status">
                {toolErr}
              </p>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Lovart */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Lovart</h3>
                    <p className="mt-1 text-xs text-white/45">
                      Locked canvas · pnMAt6CTYc · magazine visuals
                    </p>
                  </div>
                  <a
                    href={LOVART_CANVAS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white/80"
                  >
                    Open canvas
                  </a>
                </div>
                <textarea
                  value={lovartBrief}
                  onChange={(e) => setLovartBrief(e.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-lg border border-white/15 bg-black/40 p-3 text-sm text-white outline-none focus:border-white/35"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={lovartBusy || !lovartBrief.trim() || !online}
                    onClick={() => void runLovart({ open: false, copy: false })}
                    className="rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {lovartBusy ? "Maya writing…" : "Write brief only"}
                  </button>
                  <button
                    type="button"
                    disabled={
                      lovartBusy ||
                      !lovartBrief.trim() ||
                      !online ||
                      !contentConfirmed
                    }
                    onClick={() => void runLovart()}
                    className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
                  >
                    {lovartBusy
                      ? "Maya writing Lovart brief…"
                      : "Handoff：複製 + 開 canvas"}
                  </button>
                </div>
                {lovartOut ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                        Maya output
                      </p>
                      <button
                        type="button"
                        disabled={!contentConfirmed}
                        className="text-[11px] text-emerald-300 disabled:opacity-40"
                        onClick={() => void copyText(lovartOut)}
                        title={
                          contentConfirmed
                            ? "Copy for Lovart paste"
                            : "Confirm content before copying gen prompts"
                        }
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-white/75">
                      {lovartOut}
                    </pre>
                  </div>
                ) : null}
              </section>

              {/* Midjourney */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Midjourney</h3>
                    <p className="mt-1 text-xs text-white/45">
                      Prompt pack · paste Discord / Imagine (no live MJ API)
                    </p>
                  </div>
                  <a
                    href={MJ_WEB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white/80"
                  >
                    Open Imagine
                  </a>
                </div>
                <textarea
                  value={mjBrief}
                  onChange={(e) => setMjBrief(e.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-lg border border-white/15 bg-black/40 p-3 text-sm text-white outline-none focus:border-white/35"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={mjBusy || !mjBrief.trim() || !online}
                    onClick={() => void runMj({ open: false, copy: false })}
                    className="rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {mjBusy ? "Maya writing…" : "Write prompts only"}
                  </button>
                  <button
                    type="button"
                    disabled={
                      mjBusy || !mjBrief.trim() || !online || !contentConfirmed
                    }
                    onClick={() => void runMj()}
                    className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
                  >
                    {mjBusy
                      ? "Maya writing MJ prompts…"
                      : "Handoff：複製 + 開 Imagine"}
                  </button>
                </div>
                {mjOut ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                        Maya output
                      </p>
                      <button
                        type="button"
                        disabled={!contentConfirmed}
                        className="text-[11px] text-emerald-300 disabled:opacity-40"
                        onClick={() => void copyText(mjOut)}
                        title={
                          contentConfirmed
                            ? "Copy for Midjourney paste"
                            : "Confirm content before copying gen prompts"
                        }
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-white/75">
                      {mjOut}
                    </pre>
                  </div>
                ) : null}
              </section>
            </div>

            <ol className="mt-10 space-y-2 border-l border-white/15 pl-4 text-sm text-white/55">
              <li>
                <strong className="text-white">1.</strong> Content packet reviewed &amp; confirmed
              </li>
              <li>
                <strong className="text-white">2.</strong> Maya（ASI:One）寫 Lovart brief / MJ prompts
              </li>
              <li>
                <strong className="text-white">3.</strong> Art handoff checkbox → 開 Lovart / Midjourney 貼上
              </li>
              <li>
                <strong className="text-white">4.</strong> 批核後放 art →{" "}
                <code className="text-[11px]">magazine-demo/issue-01/</code>
              </li>
              <li>
                <strong className="text-white">5.</strong> Local work tab 睇本機庫
              </li>
            </ol>
          </div>
        </div>
      ) : null}

      {tab === "live" ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {tryEmbed ? (
            <iframe
              title="Maya on ASI:One"
              src={ASI1_CHAT}
              className="h-[calc(100vh-64px)] w-full border-0 bg-black"
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
              <div className="max-w-lg">
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  Maya @shortkey
                </h2>
                <p className="mt-3 text-sm text-white/60">
                  完整 chat UI + history 喺 asi1.ai 正版（唔抄產品版面）。
                </p>
                <a
                  href={ASI1_CHAT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-xl bg-[#22c55e] px-6 py-3.5 text-base font-semibold text-black"
                >
                  開啟 https://asi1.ai/chat
                </a>
                <button
                  type="button"
                  onClick={() => setTryEmbed(true)}
                  className="mt-6 block w-full text-xs text-white/35 underline-offset-2 hover:underline"
                >
                  Try embed (often blocked)
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {tab === "work" ? (
        <div className="flex-1 overflow-y-auto bg-[#111113] px-5 py-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-xl font-semibold">Local ShortKey work</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Season topics · 8 per season · awaiting Maya —{" "}
              <code className="rounded bg-black/50 px-1.5 py-0.5 text-[12px] text-emerald-200">
                src/brand/sky/maya/seasons/SEASON_TOPICS_INTAKE.md
              </code>
              {" "}(slots under{" "}
              <code className="rounded bg-black/50 px-1.5 py-0.5 text-[12px] text-emerald-200">
                seasons/season-01/
              </code>
              ). Not claimed live on Beauty V1.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/magazine-demo/issues.html"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black"
                title="Issue 1 Maya vs Issue 2 Copilot"
              >
                Issues hub · 1 vs 2
              </a>
              <a
                href="/magazine-demo/emagazine.html#/cover"
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold"
              >
                Issue 1 · Maya e-mag
              </a>
              <a
                href="/magazine-demo/copilot-hidden-gems-magazine.html#cover"
                className="rounded-md border border-emerald-500/50 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100"
                title="Issue 2 · Copilot Hidden Gems"
              >
                Issue 2 · COPILOT
              </a>
              <a
                href="/magazine-demo/lovart-phone/index.html"
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold"
              >
                Phone showcase
              </a>
              <a
                href={w?.magazineDemo?.href || "/magazine-demo/#/cover"}
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold"
              >
                Art files ({w?.magazineDemo?.pageArtCount ?? 0})
              </a>
              <a
                href="/api/maya/profile"
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold"
                target="_blank"
                rel="noreferrer"
              >
                Profile JSON
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(w?.magazineDemo?.pages || []).slice(0, 8).map((page) => (
                <a
                  key={page.id}
                  href={page.href}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.href} alt={page.id} className="aspect-[3/4] w-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
