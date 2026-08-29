/**
 * Studio discovery demo — large preview actions + pin-to-top + one Save
 * ALWAYS TO TRUE — interview shown only if founder pasted body
 */
(function () {
  const API = "/api/studio/discovery-curation";
  const PIN_KEY = "shortkey-discovery-pinned-v1";

  const PACKS = [
    {
      id: "platform-magazine-dna",
      title: "Platform · Magazine DNA Wall",
      path: "public/platform-magazine-dna/v1/",
      reason: "Founder-selected main platform + magazine DNA visual (2026-08-20). GOR_GOR_REVIEW for formal DNA text.",
      base: "/platform-magazine-dna/v1",
      files: [
        { file: "platform-magazine-dna-wall.png", reason: "Main DNA wall · lilac multicultural calligraphy" },
      ],
    },
    {
      id: "lovart-issue-01",
      title: "Lovart · Issue 01 pages",
      path: "public/magazine-demo/issue-01/",
      reason: "Locked Nihon Sakura page art from canvas pnMAt6CTYc.",
      base: "/magazine-demo/issue-01",
      files: [
        { file: "cover.png", reason: "Issue cover" },
        { file: "editors-letter.png", reason: "Editorial open" },
        { file: "heritage.png", reason: "Heritage thread" },
        { file: "ingredient.png", reason: "Ingredient story" },
        { file: "brand.png", reason: "Brand spotlight" },
        { file: "discovery.png", reason: "Discovery edit" },
        { file: "try-on-skin-next.png", reason: "Try-on + skin hub" },
        { file: "creator.png", reason: "Creator character" },
        { file: "culture.png", reason: "Culture / game cue" },
        { file: "overview.png", reason: "Overview map" },
      ],
    },
    {
      id: "blueprints",
      title: "Lovart · Blueprints",
      path: "public/magazine-demo/issue-01/",
      reason: "Builder handoff boards.",
      base: "/magazine-demo/issue-01",
      files: [
        { file: "blueprint-global-elements.png", reason: "Global elements" },
        { file: "blueprint-zone-map.png", reason: "Zone map" },
        { file: "blueprint-modal-overlays.png", reason: "Modals" },
        { file: "blueprint-developer-handoff.png", reason: "Dev handoff" },
      ],
    },
    {
      id: "dna-cards",
      title: "DNA cards",
      path: "public/shortkey-assets/dna-cards/",
      reason: "Export walkthrough — not signed DNA.",
      base: "/shortkey-assets/dna-cards",
      files: [
        "D0-cover.png", "D1-overview.png", "D2-brand-identity.png", "D3-visual-system.png",
        "D4-emagazine.png", "D5-video-assets.png", "D6-audio-assets.png",
        "D7-platform-features.png", "D8-production-standards.png", "D9-work-with-us.png",
      ].map((file) => ({ file, reason: file.replace(/\.png$/, "") })),
    },
    {
      id: "posters",
      title: "Posters",
      path: "public/shortkey-assets/posters/",
      reason: "Campaign poster stills.",
      base: "/shortkey-assets/posters",
      files: [
        { file: "S1-back-cover.png", reason: "Back cover" },
        { file: "S2-skin-analysis-poster.png", reason: "Skin analysis" },
        { file: "S3-virtual-tryon-poster.png", reason: "Virtual try-on" },
        { file: "S4-catalog-poster.png", reason: "Catalog" },
      ],
    },
    {
      id: "magazine-pages",
      title: "Magazine P1–P8",
      path: "public/shortkey-assets/magazine-pages/",
      reason: "Earlier lane stills.",
      base: "/shortkey-assets/magazine-pages",
      files: [
        "P1-cover.png", "P2-toc.png", "P3-kbeauty.png", "P4-jbeauty.png",
        "P5-cbeauty.png", "P6-catalog.png", "P7-skin-analysis.png", "P8-virtual-tryon.png",
      ].map((file) => ({ file, reason: file })),
    },
    {
      id: "videos",
      title: "Videos",
      path: "public/shortkey-assets/videos/",
      reason: "Motion candidates.",
      base: "/shortkey-assets/videos",
      files: [
        { file: "V1-flagship-60s-homepage.mp4", reason: "Flagship 60s" },
        { file: "V2-usa-canada-with-audio.mp4", reason: "US / Canada" },
        { file: "V3-traditional-chinese-with-audio.mp4", reason: "ZH-TW" },
        { file: "V4-portrait-mobile-social.mp4", reason: "Portrait social" },
      ],
    },
    {
      id: "audio",
      title: "Audio",
      path: "public/shortkey-assets/audio/",
      reason: "BGM + VO stems.",
      base: "/shortkey-assets/audio",
      files: [
        { file: "A1-flagship-bgm.mp3", reason: "Flagship BGM" },
        { file: "A2-flagship-voiceover-en.wav", reason: "EN VO" },
        { file: "A3-pan-asian-bgm.mp3", reason: "Pan-Asian BGM" },
        { file: "A4-multilingual-voiceover.wav", reason: "Multilingual VO" },
        { file: "A5-chinese-bgm.mp3", reason: "Chinese BGM" },
        { file: "A6-chinese-voiceover.wav", reason: "Chinese VO" },
      ],
    },
    {
      id: "logos",
      title: "Logos",
      path: "public/shortkey-assets/logos/",
      reason: "Pack logo copies.",
      base: "/shortkey-assets/logos",
      files: [
        { file: "logo-full.png", reason: "Full" },
        { file: "logo-wordmark.png", reason: "Wordmark" },
        { file: "logo-icon.png", reason: "Icon" },
      ],
    },
    {
      id: "founder-adds",
      title: "Founder adds",
      path: "public/studio-review/discovery-uploads/",
      reason: "Uploads when a pack file is wrong / missing.",
      base: "/studio-review/discovery-uploads",
      files: [],
      emptyNote: "Use Edit → Add / Upload.",
    },
  ];

  let curation = { removed: [], added: [], meta: [], workflows: [], games: [] };
  let seasons = [
    { id: "season-01", label: "Season 1 · Hidden Gems" },
    { id: "season-02", label: "Season 2 (slot)" },
    { id: "season-03", label: "Season 3 (slot)" },
    { id: "unassigned", label: "Unassigned" },
    { id: "other", label: "Other / later" },
  ];
  let editOn = false;
  let activeFilter = "all";
  let pinned = loadPinned();
  let selected = null;
  let draft = emptyDraft();

  const chips = document.getElementById("chips");
  const packsRoot = document.getElementById("packs");
  const selectedTop = document.getElementById("selected-top");
  const selectedGrid = document.getElementById("selected-grid");
  const dlg = document.getElementById("preview");
  const dlgTitle = document.getElementById("preview-title");
  const previewMedia = document.getElementById("preview-media");
  const previewActions = document.getElementById("preview-actions");
  const previewFields = document.getElementById("preview-fields");
  const previewReason = document.getElementById("preview-reason");
  const previewStatus = document.getElementById("preview-status");
  const statusEl = document.getElementById("edit-status");
  const addPack = document.getElementById("add-pack");
  const storyDlg = document.getElementById("story-dialog");
  const storyBody = document.getElementById("story-body");

  function key(packId, file) { return packId + "::" + file; }
  function extOf(name) { return name.split(".").pop().toLowerCase(); }
  function isRemoved(packId, file) {
    return (curation.removed || []).some((r) => key(r.packId, r.file) === key(packId, file));
  }
  function getMeta(packId, file) {
    return (curation.meta || []).find((m) => key(m.packId, m.file) === key(packId, file));
  }
  function setStatus(msg, isErr) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("err", !!isErr);
  }
  function setPreviewStatus(msg, isErr) {
    if (!previewStatus) return;
    previewStatus.textContent = msg || "";
    previewStatus.classList.toggle("err", !!isErr);
  }

  function loadPinned() {
    try {
      const raw = JSON.parse(localStorage.getItem(PIN_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  function savePinned() {
    try { localStorage.setItem(PIN_KEY, JSON.stringify(pinned)); } catch (e) {}
  }
  function isPinned(packId, file) {
    return pinned.indexOf(key(packId, file)) >= 0;
  }
  function pinToTop(packId, file) {
    const k = key(packId, file);
    pinned = [k].concat(pinned.filter((x) => x !== k));
    savePinned();
  }
  function unpin(packId, file) {
    pinned = pinned.filter((x) => x !== key(packId, file));
    savePinned();
  }

  function emptyDraft() {
    return {
      edit: false,
      editNote: "",
      remove: false,
      removeNote: "Not correct",
      redesign: false,
      redesignNote: "Redesign in Lovart / Kura lane",
      seasonOn: false,
      season: "season-01",
      seasonNote: "",
      buyReal: false,
      buyRealNote: "Need real photograph + rights",
      interview: false,
      interviewTitle: "",
      interviewBody: "",
      interviewSource: "",
      game: false,
      gameName: "Little Culture game",
      gameBrief: "",
    };
  }

  async function loadCuration() {
    const res = await fetch(API, { cache: "no-store" });
    const data = await res.json();
    if (data.ok && data.curation) curation = data.curation;
    if (data.seasons) seasons = data.seasons;
  }

  async function postJson(body) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Request failed");
    curation = data.curation;
    return data;
  }

  function itemUrl(pack, item) {
    return item.url || pack.base + "/" + item.file;
  }

  function findAsset(k) {
    const [packId, file] = k.split("::");
    const pack = PACKS.find((p) => p.id === packId);
    if (!pack) return null;
    const files = visibleFilesForPack(pack);
    const item = files.find((f) => f.file === file);
    if (!item) return null;
    return { pack, item };
  }

  function openPreview(pack, item) {
    selected = { pack, item };
    const meta = getMeta(pack.id, item.file) || {};
    draft = emptyDraft();
    draft.editNote = meta.editNote || "Edit requested";
    draft.redesignNote = "Redesign in Lovart / Kura lane";
    draft.season = meta.season || "season-01";
    draft.seasonNote = meta.editNote || "";
    draft.interviewTitle = (meta.interviewStory && meta.interviewStory.title) || "";
    draft.interviewBody = (meta.interviewStory && meta.interviewStory.body) || "";
    draft.interviewSource = (meta.interviewStory && meta.interviewStory.source) || "";

    dlgTitle.textContent = pack.title + " · " + item.file;
    renderPreviewMedia(pack, item);
    renderPreviewActions();
    renderPreviewFields();
    previewReason.innerHTML =
      "<strong>Reason:</strong> " + escapeHtml(item.reason || pack.reason) +
      "<br><a href='" + itemUrl(pack, item) + "' target='_blank' rel='noopener'>" +
      escapeHtml(itemUrl(pack, item)) + "</a>";
    setPreviewStatus("Toggle actions, then press Save once.");
    document.getElementById("btn-pin-top").textContent = isPinned(pack.id, item.file)
      ? "Unpin from top"
      : "Move to top";
    dlg.showModal();
  }

  function renderPreviewMedia(pack, item) {
    const url = itemUrl(pack, item);
    const ext = extOf(item.file);
    previewMedia.innerHTML = "";
    if (ext === "mp4") {
      const v = document.createElement("video");
      v.src = url; v.controls = true; v.playsInline = true;
      previewMedia.appendChild(v);
    } else if (ext === "mp3" || ext === "wav") {
      const a = document.createElement("audio");
      a.src = url; a.controls = true;
      previewMedia.appendChild(a);
    } else {
      const img = document.createElement("img");
      img.src = url; img.alt = item.file;
      previewMedia.appendChild(img);
    }
  }

  function renderPreviewActions() {
    const specs = [
      ["edit", "Edit", false],
      ["remove", "Remove", true],
      ["redesign", "Redesign", false],
      ["seasonOn", "Season", false],
      ["buyReal", "Buy real", false],
      ["interview", "Interview", false],
      ["game", "+ Game", false],
    ];
    previewActions.innerHTML = "";
    specs.forEach(([field, label, danger]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      if (danger) b.classList.add("danger");
      if (draft[field]) b.classList.add("on");
      b.onclick = () => {
        draft[field] = !draft[field];
        renderPreviewActions();
        renderPreviewFields();
      };
      previewActions.appendChild(b);
    });
  }

  function renderPreviewFields() {
    const bits = [];
    if (draft.edit) {
      bits.push(
        "<label>Edit note <input id='df-editNote' value='" +
          escapeAttr(draft.editNote) + "' /></label>",
      );
    }
    if (draft.remove) {
      bits.push(
        "<label>Remove reason <input id='df-removeNote' value='" +
          escapeAttr(draft.removeNote) + "' /></label>",
      );
    }
    if (draft.redesign) {
      bits.push(
        "<label>Redesign brief <input id='df-redesignNote' value='" +
          escapeAttr(draft.redesignNote) + "' /></label>",
      );
    }
    if (draft.seasonOn) {
      bits.push(
        "<label>Season <select id='df-season'>" +
          seasons
            .map(
              (s) =>
                "<option value='" +
                s.id +
                "'" +
                (draft.season === s.id ? " selected" : "") +
                ">" +
                escapeHtml(s.label) +
                "</option>",
            )
            .join("") +
          "</select></label>" +
          "<label>Modification comment <textarea id='df-seasonNote' placeholder='What to change for Season 1 (colour, crop, type, keep as-is…)'>" +
          escapeHtml(draft.seasonNote) +
          "</textarea></label>",
      );
    }
    if (draft.buyReal) {
      bits.push(
        "<label>Buy / license note <input id='df-buyRealNote' value='" +
          escapeAttr(draft.buyRealNote) + "' /></label>",
      );
    }
    if (draft.interview) {
      bits.push(
        "<label>Interview title <input id='df-interviewTitle' value='" +
          escapeAttr(draft.interviewTitle) + "' /></label>" +
          "<label>Interview body (empty = AWAITING) <textarea id='df-interviewBody'>" +
          escapeHtml(draft.interviewBody) +
          "</textarea></label>" +
          "<label>Source <input id='df-interviewSource' value='" +
          escapeAttr(draft.interviewSource) + "' /></label>",
      );
    }
    if (draft.game) {
      bits.push(
        "<label>Game name <input id='df-gameName' value='" +
          escapeAttr(draft.gameName) + "' /></label>" +
          "<label>Game brief (empty = AWAITING) <textarea id='df-gameBrief'>" +
          escapeHtml(draft.gameBrief) +
          "</textarea></label>",
      );
    }
    if (!bits.length) {
      bits.push("<p class='muted'>No actions staged yet. Toggle buttons above.</p>");
    }
    previewFields.innerHTML = bits.join("");
    bindDraftFields();
  }

  function bindDraftFields() {
    const map = [
      ["df-editNote", "editNote"],
      ["df-removeNote", "removeNote"],
      ["df-redesignNote", "redesignNote"],
      ["df-buyRealNote", "buyRealNote"],
      ["df-interviewTitle", "interviewTitle"],
      ["df-interviewBody", "interviewBody"],
      ["df-interviewSource", "interviewSource"],
      ["df-gameName", "gameName"],
      ["df-gameBrief", "gameBrief"],
    ];
    map.forEach(([id, field]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.oninput = () => { draft[field] = el.value; };
    });
    const season = document.getElementById("df-season");
    if (season) season.onchange = () => { draft.season = season.value; };
    const seasonNote = document.getElementById("df-seasonNote");
    if (seasonNote) seasonNote.oninput = () => { draft.seasonNote = seasonNote.value; };
  }

  function readDraftFromDom() {
    const get = (id) => {
      const el = document.getElementById(id);
      return el ? el.value : "";
    };
    if (draft.edit) draft.editNote = get("df-editNote") || draft.editNote;
    if (draft.remove) draft.removeNote = get("df-removeNote") || draft.removeNote;
    if (draft.redesign) draft.redesignNote = get("df-redesignNote") || draft.redesignNote;
    if (draft.seasonOn) {
      draft.season = get("df-season") || draft.season;
      draft.seasonNote = get("df-seasonNote");
    }
    if (draft.buyReal) draft.buyRealNote = get("df-buyRealNote") || draft.buyRealNote;
    if (draft.interview) {
      draft.interviewTitle = get("df-interviewTitle");
      draft.interviewBody = get("df-interviewBody");
      draft.interviewSource = get("df-interviewSource");
    }
    if (draft.game) {
      draft.gameName = get("df-gameName") || draft.gameName;
      draft.gameBrief = get("df-gameBrief");
    }
  }

  async function saveOnce() {
    if (!selected) return;
    readDraftFromDom();
    const { pack, item } = selected;
    const steps = [];
    if (draft.edit) steps.push("edit");
    if (draft.redesign) steps.push("redesign");
    if (draft.seasonOn) steps.push("season");
    if (draft.buyReal) steps.push("buy-real");
    if (draft.interview) steps.push("interview");
    if (draft.game) steps.push("game");
    if (draft.remove) steps.push("remove");
    if (!steps.length) {
      setPreviewStatus("Nothing staged — toggle at least one action.", true);
      return;
    }
    setPreviewStatus("Saving once · " + steps.join(" · ") + " …");
    try {
      if (draft.edit) {
        await postJson({
          action: "workflow",
          kind: "edit",
          packId: pack.id,
          file: item.file,
          note: draft.editNote || "Edit requested",
        });
      }
      if (draft.redesign) {
        await postJson({
          action: "workflow",
          kind: "redesign",
          packId: pack.id,
          file: item.file,
          note: draft.redesignNote || "Redesign",
        });
      }
      if (draft.seasonOn) {
        await postJson({
          action: "workflow",
          kind: "move-season",
          packId: pack.id,
          file: item.file,
          season: draft.season,
          note: (draft.seasonNote || "").trim() || "Move to " + draft.season,
        });
      }
      if (draft.buyReal) {
        await postJson({
          action: "workflow",
          kind: "buy-real-picture",
          packId: pack.id,
          file: item.file,
          note: draft.buyRealNote || "Buy real",
        });
      }
      if (draft.interview) {
        await postJson({
          action: "workflow",
          kind: "interview-story",
          packId: pack.id,
          file: item.file,
          title: draft.interviewTitle,
          body: draft.interviewBody,
          source: draft.interviewSource,
        });
      }
      if (draft.game) {
        if (!(draft.gameName || "").trim()) throw new Error("Game name required");
        await postJson({
          action: "workflow",
          kind: "add-game",
          packId: pack.id,
          file: item.file,
          gameName: draft.gameName.trim(),
          brief: draft.gameBrief,
          season: "season-01",
        });
      }
      if (draft.remove) {
        if (item.added) {
          await postJson({ action: "remove-added", packId: pack.id, file: item.file });
        } else {
          await postJson({
            action: "hide",
            packId: pack.id,
            file: item.file,
            note: draft.removeNote || "Not correct",
          });
        }
        unpin(pack.id, item.file);
      }
      const didRemove = !!draft.remove;
      const doneSteps = steps.slice();
      setPreviewStatus("Saved once · " + doneSteps.join(" · "));
      setStatus("Saved · " + item.file + " · " + doneSteps.join(" · "));
      draft = emptyDraft();
      renderAll();
      if (didRemove || isRemoved(pack.id, item.file)) {
        previewMedia.querySelectorAll("video,audio").forEach((el) => {
          try { el.pause(); } catch (e) {}
        });
        dlg.close();
      } else {
        const still = findAsset(key(pack.id, item.file));
        if (still) {
          openPreview(still.pack, still.item);
          setPreviewStatus("Saved once · " + doneSteps.join(" · "));
        }
      }
    } catch (e) {
      setPreviewStatus(e.message || String(e), true);
      setStatus(e.message || String(e), true);
    }
  }

  async function showStory(packId, file) {
    try {
      const res = await fetch(
        API + "?packId=" + encodeURIComponent(packId) + "&file=" + encodeURIComponent(file),
      );
      const data = await res.json();
      const interview = data.interview || { status: "AWAITING" };
      storyBody.innerHTML = "";
      if (interview.status === "HAS_STORY") {
        storyBody.innerHTML =
          "<h3>" + escapeHtml(interview.title || "Interview story") + "</h3>" +
          (interview.source ? "<p class='muted'>Source: " + escapeHtml(interview.source) + "</p>" : "") +
          "<div class='story-text'>" + escapeHtml(interview.body).replace(/\n/g, "<br>") + "</div>";
      } else {
        const meta = getMeta(packId, file);
        const body = meta && meta.interviewStory && meta.interviewStory.body;
        if (body && String(body).trim()) {
          storyBody.innerHTML =
            "<h3>" + escapeHtml((meta.interviewStory && meta.interviewStory.title) || "Interview story") + "</h3>" +
            "<div class='story-text'>" + escapeHtml(body).replace(/\n/g, "<br>") + "</div>";
        } else {
          storyBody.innerHTML =
            "<h3>No interview story yet</h3>" +
            "<p class='muted'>AWAITING founder / Maya paste. Cursor will not invent interview copy.</p>";
        }
      }
      storyDlg.showModal();
    } catch (e) {
      storyBody.innerHTML =
        "<h3>Story unavailable</h3><p class='muted'>" + escapeHtml(e.message || String(e)) + "</p>";
      storyDlg.showModal();
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function visibleFilesForPack(pack) {
    const base = (pack.files || []).filter((f) => !isRemoved(pack.id, f.file));
    const extras = (curation.added || [])
      .filter((a) => a.packId === pack.id && !isRemoved(a.packId, a.file))
      .map((a) => ({ file: a.file, reason: a.reason, url: a.url, added: true }));
    return base.concat(extras);
  }

  function badgeHtml(packId, file) {
    const m = getMeta(packId, file);
    if (!m) return "";
    const bits = [];
    if (m.season) bits.push(m.season);
    if (m.editNote) bits.push("mod");
    if (m.needsRealPhoto) bits.push("buy-real");
    if (m.redesign) bits.push("redesign");
    if (m.interviewStory && (m.interviewStory.body || "").trim()) bits.push("story");
    else if (m.interviewStory) bits.push("story?");
    if (!bits.length) return "";
    return "<div class='badges'>" + bits.map((b) => "<span class='badge'>" + b + "</span>").join("") + "</div>";
  }

  function makeCard(pack, item) {
    const wrap = document.createElement("button");
    wrap.type = "button";
    wrap.className =
      "card-wrap" +
      (item.added ? " added" : "") +
      (isPinned(pack.id, item.file) ? " pinned" : "");

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    if (isPinned(pack.id, item.file)) {
      const mark = document.createElement("span");
      mark.className = "pin-mark";
      mark.textContent = "Top";
      thumb.appendChild(mark);
    }
    const url = itemUrl(pack, item);
    const ext = extOf(item.file);
    if (ext === "mp4") {
      const v = document.createElement("video");
      v.src = url; v.muted = true; v.playsInline = true; v.preload = "metadata";
      thumb.appendChild(v);
    } else if (ext === "mp3" || ext === "wav") {
      const tone = document.createElement("span");
      tone.textContent = "♪";
      tone.style.color = "#9b6bb5";
      tone.style.fontSize = "1.5rem";
      thumb.appendChild(tone);
    } else {
      const img = document.createElement("img");
      img.src = url; img.alt = item.file; img.loading = "lazy";
      thumb.appendChild(img);
    }

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML =
      "<strong>" + escapeHtml(item.file) + "</strong><span>" +
      (item.added ? "Added · " : "") + escapeHtml(item.reason) + "</span>" +
      badgeHtml(pack.id, item.file);

    wrap.appendChild(thumb);
    wrap.appendChild(meta);
    wrap.onclick = () => openPreview(pack, item);
    return wrap;
  }

  function renderSelectedTop() {
    if (!selectedTop || !selectedGrid) return;
    selectedGrid.innerHTML = "";
    const items = pinned
      .map((k) => findAsset(k))
      .filter(Boolean);
    if (!items.length) {
      selectedTop.classList.remove("on");
      return;
    }
    selectedTop.classList.add("on");
    items.forEach(({ pack, item }) => {
      selectedGrid.appendChild(makeCard(pack, item));
    });
  }

  function renderWorkflowBoard() {
    const board = document.getElementById("workflow-board");
    const gamesEl = document.getElementById("games-board");
    if (!board) return;
    const wfs = curation.workflows || [];
    if (!wfs.length) {
      board.innerHTML = "<p class='muted'>No workflow items yet. Open a picture → stage actions → Save.</p>";
    } else {
      board.innerHTML = wfs
        .slice(0, 40)
        .map((w) => {
          return (
            "<div class='wf-row'>" +
            "<div><strong>" + w.kind + "</strong> · " + w.packId + " / " + w.file +
            (w.season ? " · " + w.season : "") +
            "<br><span class='muted'>" + escapeHtml(w.note || "") + "</span></div>" +
            "<div class='wf-status'>" +
            "<select data-wf='" + w.id + "'>" +
            ["TODO", "DOING", "REVIEW", "DONE", "AWAITING"]
              .map((s) => "<option value='" + s + "'" + (w.status === s ? " selected" : "") + ">" + s + "</option>")
              .join("") +
            "</select></div></div>"
          );
        })
        .join("");
      board.querySelectorAll("select[data-wf]").forEach((sel) => {
        sel.onchange = async () => {
          try {
            await postJson({ action: "update-workflow", id: sel.getAttribute("data-wf"), status: sel.value });
            setStatus("Workflow → " + sel.value);
            renderAll();
          } catch (e) {
            setStatus(e.message || String(e), true);
          }
        };
      });
    }
    if (gamesEl) {
      const games = curation.games || [];
      gamesEl.innerHTML = games.length
        ? games
            .map(
              (g) =>
                "<div class='wf-row'><div><strong>" +
                escapeHtml(g.name) +
                "</strong> · " +
                (g.season || "—") +
                " · " +
                g.status +
                "<br><span class='muted'>" +
                escapeHtml(g.brief || "AWAITING brief — no invented game DNA") +
                "</span></div></div>",
            )
            .join("")
        : "<p class='muted'>No game stubs yet.</p>";
    }
  }

  function renderRemoved() {
    const list = document.getElementById("removed-list");
    if (!list) return;
    list.innerHTML = "";
    if (!(curation.removed || []).length) {
      list.innerHTML = "<li>None hidden.</li>";
      return;
    }
    curation.removed.forEach((r) => {
      const li = document.createElement("li");
      li.innerHTML = "<span><strong>" + r.packId + "</strong> · " + r.file + "</span>";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Restore";
      btn.onclick = async () => {
        await postJson({ action: "restore", packId: r.packId, file: r.file });
        setStatus("Restored " + r.file);
        renderAll();
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function renderAll() {
    chips.innerHTML = "";
    packsRoot.innerHTML = "";
    renderSelectedTop();

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.textContent = "All packs";
    allBtn.dataset.filter = "all";
    allBtn.setAttribute("aria-pressed", String(activeFilter === "all"));
    chips.appendChild(allBtn);

    const s1Btn = document.createElement("button");
    s1Btn.type = "button";
    s1Btn.textContent = "Season 1 picks";
    s1Btn.dataset.filter = "season-01-picks";
    s1Btn.setAttribute("aria-pressed", String(activeFilter === "season-01-picks"));
    chips.appendChild(s1Btn);

    PACKS.forEach((pack) => {
      let files = visibleFilesForPack(pack);
      if (activeFilter === "season-01-picks") {
        files = files.filter((item) => {
          const m = getMeta(pack.id, item.file);
          return m && m.season === "season-01";
        });
      }
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = pack.title.split("·")[0].trim();
      chip.dataset.filter = pack.id;
      chip.setAttribute("aria-pressed", String(activeFilter === pack.id));
      chips.appendChild(chip);

      const hidePack =
        activeFilter === "season-01-picks"
          ? files.length === 0
          : activeFilter !== "all" && activeFilter !== pack.id;
      const sec = document.createElement("section");
      sec.className = "pack" + (hidePack ? " hidden" : "");
      sec.dataset.pack = pack.id;
      sec.innerHTML =
        "<div class='pack-head'><h2></h2><span class='count'></span></div>" +
        "<p class='pack-reason'></p><p class='path'></p>";
      sec.querySelector("h2").textContent = pack.title;
      sec.querySelector(".count").textContent = files.length + " files";
      sec.querySelector(".pack-reason").innerHTML = "<em>Reason:</em> " + pack.reason;
      sec.querySelector(".path").textContent = pack.path;

      if (!files.length) {
        const note = document.createElement("p");
        note.className = "pack-reason";
        note.textContent = pack.emptyNote || "No visible files.";
        sec.appendChild(note);
      } else {
        const grid = document.createElement("div");
        grid.className = "grid";
        const pinnedHere = [];
        const rest = [];
        files.forEach((item) => {
          (isPinned(pack.id, item.file) ? pinnedHere : rest).push(item);
        });
        pinnedHere.concat(rest).forEach((item) => {
          grid.appendChild(makeCard(pack, item));
        });
        sec.appendChild(grid);
      }
      packsRoot.appendChild(sec);
    });

    chips.querySelectorAll("button").forEach((chip) => {
      chip.onclick = () => {
        activeFilter = chip.dataset.filter;
        renderAll();
      };
    });

    renderRemoved();
    renderWorkflowBoard();
  }

  document.getElementById("btn-edit").onclick = () => {
    editOn = !editOn;
    document.body.classList.toggle("edit-on", editOn);
    document.getElementById("btn-edit").setAttribute("aria-pressed", String(editOn));
    document.getElementById("btn-edit").textContent = editOn ? "Edit mode · ON" : "Edit mode";
  };

  document.getElementById("preview-close").onclick = () => {
    previewMedia.querySelectorAll("video,audio").forEach((el) => { try { el.pause(); } catch (e) {} });
    dlg.close();
  };
  document.getElementById("story-close").onclick = () => storyDlg.close();
  document.getElementById("btn-save-once").onclick = () => saveOnce();
  document.getElementById("btn-show-story").onclick = () => {
    if (!selected) return;
    showStory(selected.pack.id, selected.item.file);
  };
  document.getElementById("btn-pin-top").onclick = () => {
    if (!selected) return;
    const { pack, item } = selected;
    if (isPinned(pack.id, item.file)) {
      unpin(pack.id, item.file);
      setPreviewStatus("Unpinned from top.");
    } else {
      pinToTop(pack.id, item.file);
      setPreviewStatus("Moved to top.");
    }
    document.getElementById("btn-pin-top").textContent = isPinned(pack.id, item.file)
      ? "Unpin from top"
      : "Move to top";
    renderAll();
  };

  PACKS.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.title;
    addPack.appendChild(opt);
  });

  document.getElementById("add-form").onsubmit = async (e) => {
    e.preventDefault();
    const packId = addPack.value;
    const reason = document.getElementById("add-reason").value.trim();
    const fileInput = document.getElementById("add-file");
    const url = document.getElementById("add-url").value.trim();
    const fileName = document.getElementById("add-filename").value.trim();
    try {
      if (fileInput.files && fileInput.files[0]) {
        const fd = new FormData();
        fd.set("action", "upload");
        fd.set("packId", packId);
        fd.set("reason", reason);
        fd.set("file", fileInput.files[0]);
        const res = await fetch(API, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
        curation = data.curation;
        setStatus("Uploaded · " + (data.added && data.added.file));
      } else if (url) {
        await postJson({
          action: "add",
          packId,
          file: fileName || url.split("/").pop(),
          url,
          reason,
        });
        setStatus("Registered " + url);
      } else {
        throw new Error("Upload a file or paste a URL path.");
      }
      document.getElementById("add-form").reset();
      renderAll();
    } catch (err) {
      setStatus(err.message || String(err), true);
    }
  };

  (async function init() {
    try {
      await loadCuration();
    } catch (e) {
      setStatus("Curation API offline — browse + pin work; Save needs Beauty/Studio Next", true);
    }
    renderAll();
  })();
})();
