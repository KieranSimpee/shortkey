/**
 * Maya E-Magazine v0.1 — Nihon Sakura Issue 01
 * Interactive page-turn + readable overlays · GOR_GOR_REVIEW · not Beauty V1
 *
 * ALWAYS TO TRUE:
 * - Titles / lines grounded in locked Lovart page art + overview map only.
 * - Body columns that are garbled in PNG art → awaiting (never invent EN/JP).
 * - Lovart canvas: pnMAt6CTYc
 *
 * Sibling to locked baseline magazine-demo.js (do not treat as silent overwrite).
 */
(function () {
  const ASSET = "/magazine-demo/issue-01/";
  const REMOTE = {
    cover: "https://a.lovart.ai/artifacts/agent/Bk9AumlPff8pPUU2.png",
    "editors-letter": "https://a.lovart.ai/artifacts/agent/oNW9g1xPrB9uMcnc.png",
    heritage: "https://a.lovart.ai/artifacts/agent/q7qhrETuZz1ssd6t.png",
    ingredient: "https://a.lovart.ai/artifacts/agent/ap9Pd7kpU0EFal03.png",
    brand: "https://a.lovart.ai/artifacts/agent/g28Kd91YZPIIheVU.png",
    discovery: "https://a.lovart.ai/artifacts/agent/uR3whwr7mbAfqA1Q.png",
    "try-on-skin-next": "https://a.lovart.ai/artifacts/agent/BEBCC2fQCd3DaJiw.png",
    creator: "https://a.lovart.ai/artifacts/agent/QiTPCf4e2CDt5npp.png",
    culture: "https://a.lovart.ai/artifacts/agent/oqIR3gcrGTGyV7l2.png",
    overview: "https://a.lovart.ai/artifacts/agent/WZ3AoiTZGiKkwUw1.png",
  };

  /**
   * Readable overlay inventory — grounded in locked page art / overview only.
   * awaitingBody: true → do not invent replacement prose.
   * garble: soft scrim over known corrupted body zones in the PNG.
   */
  const COPY = {
    cover: {
      eyebrow: "Cover · locked art titles",
      jp: "桜の美しさ",
      title: "NIHON SAKURA",
      en: "The Beauty of Japanese Cherry Blossom",
      body: "Issue 01 cover titles from Lovart art. Footer zones: Try On · Skin Analysis · Personal Space.",
      awaitingBody: false,
      artNote: "Gold corner mark in art (Maya + digits/symbol) looks like a render artifact — not treated as approved copy.",
    },
    "editors-letter": {
      eyebrow: "Editor's Letter",
      jp: "",
      title: "Editor's Letter",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail:
        "Headline + 3 body columns in PNG are garbled / placeholder glyphs. No approved EN or JP letter body in repo — awaiting Maya / Gor Gor.",
      garble: { t: "42%", l: "6%", w: "88%", h: "38%" },
    },
    heritage: {
      eyebrow: "Heritage",
      jp: "桜の伝承",
      title: "The Legend of Sakura Beauty",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail:
        "JP/EN titles locked from page art. Body columns + sidebar in PNG are corrupted — awaiting approved body.",
      garble: { t: "62%", l: "6%", w: "72%", h: "28%" },
    },
    ingredient: {
      eyebrow: "Ingredient",
      jp: "桜エキス",
      title: "Sakura Extract",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail:
        "Titles locked from page art. Ingredient body block in PNG is pseudo/garbled English — awaiting approved EN/JP body.",
      garble: { t: "48%", l: "8%", w: "48%", h: "32%" },
    },
    brand: {
      eyebrow: "Brand Spotlight",
      jp: "日本桜",
      title: "NIHON SAKURA",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail:
        "Brand label from overview / art. Body columns awaiting approved copy. Demo only — no partnership claim.",
      garble: { t: "55%", l: "8%", w: "55%", h: "30%" },
    },
    discovery: {
      eyebrow: "Discovery Edit",
      jp: "",
      title: "NIHON SAKURA DISCOVERY EDIT",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail: "Section title from overview map. Discovery body / captions awaiting approved EN/JP.",
      garble: { t: "58%", l: "8%", w: "70%", h: "26%" },
    },
    "try-on": {
      eyebrow: "Try-On · SIMULATOR",
      jp: "桜の美しさ",
      title: "TRY ON",
      en: "Find your nature glow. Say hello to radiant.",
      body: "Shared Lovart frame with Skin Analysis + What's Next. Makeup picker = SIMULATOR only (not live Banuba/TINT).",
      awaitingBody: false,
    },
    "skin-analysis": {
      eyebrow: "Skin Analysis · SIMULATOR",
      jp: "肌分析",
      title: "SKIN ANALYSIS",
      en: "Know Your Skin",
      body: "UI lines from locked try-on/skin frame. Scores below are demo placeholders — not clinical diagnosis.",
      awaitingBody: false,
    },
    creator: {
      eyebrow: "Creator Spotlight",
      jp: "桜と共に創る美しさ",
      title: "CREATOR SPOTLIGHT",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail:
        "Title lines from overview map. Creator name / interview body not approved in repo — awaiting. No fake partnership.",
      garble: { t: "58%", l: "8%", w: "60%", h: "28%" },
    },
    culture: {
      eyebrow: "Culture",
      jp: "桜の文化",
      title: "The Culture of Sakura",
      en: "",
      body: "",
      awaitingBody: true,
      awaitingDetail: "Titles from overview map. Culture body awaiting approved EN/JP.",
      garble: { t: "60%", l: "8%", w: "70%", h: "26%" },
    },
    "whats-next": {
      eyebrow: "What's Next",
      jp: "次号予告",
      title: "WHAT'S NEXT",
      en: "Coming Next",
      body: "Lines visible on locked try-on/skin/next frame. Issue 02 schedule / product names in art stay GOR_GOR_REVIEW — not treated as live launch claims.",
      awaitingBody: false,
    },
    overview: {
      eyebrow: "Issue map",
      jp: "桜の美しさ",
      title: "NIHON SAKURA ISSUE 01",
      en: "The Beauty of Japanese Cherry Blossom",
      body: "Overview map from Lovart. Jump via strip, hotspots, or Next. Motto: ShortKey 不模仿畫面。ShortKey 捕捉生命力。",
      awaitingBody: false,
    },
  };

  const PAGES = [
    {
      id: "cover",
      title: "Cover",
      file: "cover.png",
      remote: REMOTE.cover,
      hotspots: [
        { label: "Editor's Letter", href: "#/editors-letter", t: "72%", l: "18%", w: "28%", h: "14%" },
        { label: "Overview", href: "#/overview", t: "78%", l: "55%", w: "28%", h: "12%" },
        { label: "Try On", href: "#/try-on", t: "90%", l: "8%", w: "28%", h: "8%", action: "tryon" },
        { label: "Skin Analysis", href: "#/skin-analysis", t: "90%", l: "36%", w: "28%", h: "8%", action: "skin" },
        { label: "Personal Space", href: "#/cover", t: "90%", l: "64%", w: "28%", h: "8%", action: "space" },
      ],
    },
    {
      id: "editors-letter",
      title: "Editor's Letter",
      file: "editors-letter.png",
      remote: REMOTE["editors-letter"],
      hotspots: [
        { label: "Heritage", href: "#/heritage", t: "70%", l: "12%", w: "30%", h: "14%" },
        { label: "Culture", href: "#/culture", t: "70%", l: "55%", w: "30%", h: "14%" },
      ],
    },
    {
      id: "heritage",
      title: "Heritage",
      file: "heritage.png",
      remote: REMOTE.heritage,
      hotspots: [
        { label: "Culture", href: "#/culture", t: "22%", l: "8%", w: "26%", h: "12%" },
        { label: "Ingredient", href: "#/ingredient", t: "68%", l: "55%", w: "32%", h: "14%" },
        { label: "Skin · SIM", href: "#/skin-analysis", t: "88%", l: "8%", w: "28%", h: "8%", action: "skin" },
      ],
    },
    {
      id: "ingredient",
      title: "Ingredient",
      file: "ingredient.png",
      remote: REMOTE.ingredient,
      hotspots: [
        { label: "Brand Spotlight", href: "#/brand", t: "65%", l: "10%", w: "32%", h: "14%" },
        { label: "Try-On · SIM", href: "#/try-on", t: "40%", l: "78%", w: "18%", h: "22%", action: "tryon" },
      ],
    },
    {
      id: "brand",
      title: "Brand Spotlight",
      file: "brand.png",
      remote: REMOTE.brand,
      hotspots: [
        { label: "Ingredient", href: "#/ingredient", t: "20%", l: "8%", w: "28%", h: "12%" },
        { label: "Try-On · SIM", href: "#/try-on", t: "68%", l: "12%", w: "30%", h: "14%", action: "tryon" },
        { label: "Discovery", href: "#/discovery", t: "68%", l: "55%", w: "30%", h: "14%" },
      ],
    },
    {
      id: "discovery",
      title: "Discovery Edit",
      file: "discovery.png",
      remote: REMOTE.discovery,
      hotspots: [
        { label: "Creator", href: "#/creator", t: "18%", l: "55%", w: "28%", h: "12%" },
        { label: "Brand", href: "#/brand", t: "68%", l: "10%", w: "28%", h: "12%" },
        { label: "Skin · SIM", href: "#/skin-analysis", t: "68%", l: "55%", w: "30%", h: "14%", action: "skin" },
      ],
    },
    {
      id: "try-on",
      title: "Try-On",
      file: "try-on-skin-next.png",
      remote: REMOTE["try-on-skin-next"],
      hotspots: [
        { label: "Open Makeup Try-On", href: "#/try-on", t: "18%", l: "8%", w: "28%", h: "55%", action: "tryon" },
        { label: "Skin Analysis", href: "#/skin-analysis", t: "18%", l: "36%", w: "28%", h: "55%" },
        { label: "What's Next", href: "#/whats-next", t: "18%", l: "64%", w: "28%", h: "55%" },
      ],
    },
    {
      id: "skin-analysis",
      title: "Skin Analysis",
      file: "try-on-skin-next.png",
      remote: REMOTE["try-on-skin-next"],
      hotspots: [
        { label: "Open Skin SIM", href: "#/skin-analysis", t: "18%", l: "36%", w: "28%", h: "55%", action: "skin" },
        { label: "Try-On", href: "#/try-on", t: "18%", l: "8%", w: "28%", h: "55%" },
        { label: "What's Next", href: "#/whats-next", t: "18%", l: "64%", w: "28%", h: "55%" },
      ],
    },
    {
      id: "creator",
      title: "Creator",
      file: "creator.png",
      remote: REMOTE.creator,
      hotspots: [
        { label: "Discovery", href: "#/discovery", t: "70%", l: "12%", w: "32%", h: "14%" },
        { label: "Culture", href: "#/culture", t: "70%", l: "55%", w: "30%", h: "14%" },
      ],
    },
    {
      id: "culture",
      title: "Culture",
      file: "culture.png",
      remote: REMOTE.culture,
      hotspots: [
        { label: "Heritage", href: "#/heritage", t: "20%", l: "10%", w: "28%", h: "12%" },
        { label: "Overview", href: "#/overview", t: "70%", l: "50%", w: "32%", h: "14%" },
      ],
    },
    {
      id: "whats-next",
      title: "What's Next",
      file: "try-on-skin-next.png",
      remote: REMOTE["try-on-skin-next"],
      hotspots: [
        { label: "Overview", href: "#/overview", t: "78%", l: "64%", w: "28%", h: "12%" },
        { label: "Cover", href: "#/cover", t: "88%", l: "8%", w: "24%", h: "8%" },
        { label: "Skin · SIM", href: "#/skin-analysis", t: "18%", l: "36%", w: "28%", h: "20%", action: "skin" },
      ],
    },
    {
      id: "overview",
      title: "Overview",
      file: "overview.png",
      remote: REMOTE.overview,
      hotspots: [
        { label: "Cover", href: "#/cover", t: "22%", l: "8%", w: "18%", h: "18%" },
        { label: "Heritage", href: "#/heritage", t: "22%", l: "28%", w: "18%", h: "18%" },
        { label: "Ingredient", href: "#/ingredient", t: "22%", l: "48%", w: "18%", h: "18%" },
        { label: "Try-On", href: "#/try-on", t: "48%", l: "8%", w: "18%", h: "18%" },
        { label: "Creator", href: "#/creator", t: "48%", l: "48%", w: "18%", h: "18%" },
        { label: "Culture", href: "#/culture", t: "48%", l: "68%", w: "18%", h: "18%" },
      ],
    },
  ];

  const BLUEPRINTS = [
    {
      title: "Global Elements",
      file: "blueprint-global-elements.png",
      remote: "https://a.lovart.ai/artifacts/agent/7smdnORZdI3Sg0C4.png",
    },
    {
      title: "Zone Map",
      file: "blueprint-zone-map.png",
      remote: "https://a.lovart.ai/artifacts/agent/J83iVRw1Gi6NS5Vk.png",
    },
    {
      title: "Modal Overlays",
      file: "blueprint-modal-overlays.png",
      remote: "https://a.lovart.ai/artifacts/agent/ZFNznbuNTV1aBFId.png",
    },
    {
      title: "Developer Handoff",
      file: "blueprint-developer-handoff.png",
      remote: "https://a.lovart.ai/artifacts/agent/37Qvk1aVhmFH71tF.png",
    },
  ];

  const MAKEUP_SLOTS = [
    { id: "lip", label: "Lip" },
    { id: "blush", label: "Blush" },
    { id: "eye", label: "Eye" },
    { id: "base", label: "Base" },
  ];

  const MAKEUP_ITEMS = [
    {
      id: "sakura-lip-oil",
      sku: "SK-M003",
      slot: "lip",
      name: "Rose Oil Lip Tint",
      shadeName: "Sakura Rose",
      color: "#C45A62",
      overlay: { lip: "rgba(196, 90, 98, 0.62)" },
    },
    {
      id: "glass-gloss",
      sku: "SK-M001",
      slot: "lip",
      name: "Glass Lip Gloss",
      shadeName: "Clear Bloom",
      color: "#E8A0A8",
      overlay: { lip: "rgba(232, 160, 168, 0.55)" },
    },
    {
      id: "berry-tint",
      sku: "SK-M014",
      slot: "lip",
      name: "Berry Water Tint",
      shadeName: "Night Berry",
      color: "#8B3A4A",
      overlay: { lip: "rgba(139, 58, 74, 0.58)" },
    },
    {
      id: "peach-blush",
      sku: "SK-M015",
      slot: "blush",
      name: "Peach Flush Stick",
      shadeName: "Peach Sakura",
      color: "#E87868",
      overlay: { cheek: "rgba(232, 120, 104, 0.42)" },
    },
    {
      id: "cherry-cheek",
      sku: "SK-M013",
      slot: "blush",
      name: "Cherry Lip Cheek Tint",
      shadeName: "Cherry Petal",
      color: "#C45A6A",
      overlay: {
        cheek: "rgba(196, 90, 106, 0.4)",
        lip: "rgba(196, 90, 106, 0.35)",
      },
    },
    {
      id: "sakura-eye",
      sku: "SK-M019",
      slot: "eye",
      name: "Soft Sakura Eye Duo",
      shadeName: "Petal Taupe",
      color: "#A67C6D",
      overlay: { eye: "rgba(166, 124, 109, 0.45)" },
      editorial: true,
    },
    {
      id: "felt-liner",
      sku: "SK-M004",
      slot: "eye",
      name: "Precision Felt Liner",
      shadeName: "Soft Black",
      color: "#2A2422",
      overlay: { eye: "rgba(42, 36, 34, 0.55)" },
    },
    {
      id: "skin-cushion",
      sku: "SK-M010",
      slot: "base",
      name: "Skin Fit Cushion",
      shadeName: "Dew 21",
      color: "#E8C4B0",
      overlay: { base: "rgba(232, 196, 176, 0.28)" },
    },
    {
      id: "tirtir-cushion",
      sku: "SK-M104",
      slot: "base",
      name: "Mask Fit Red Cushion",
      shadeName: "Red Cushion 21N",
      color: "#E5C2B0",
      overlay: { base: "rgba(229, 194, 176, 0.3)" },
      editorial: true,
    },
  ];

  let makeupSlot = "lip";
  let makeupId = "sakura-lip-oil";
  let index = 0;
  let turnDir = 1;
  let copyPanelOn = true;

  const pageById = Object.fromEntries(PAGES.map(function (p) {
    return [p.id, p];
  }));

  const els = {
    strip: document.getElementById("strip-track"),
    bg: document.getElementById("page-bg"),
    art: document.getElementById("page-art"),
    plane: document.getElementById("page-plane"),
    hotspots: document.getElementById("hotspot-layer"),
    garble: document.getElementById("garble-mask"),
    cpEyebrow: document.getElementById("cp-eyebrow"),
    cpJp: document.getElementById("cp-jp"),
    cpTitle: document.getElementById("cp-title"),
    cpEn: document.getElementById("cp-en"),
    cpBody: document.getElementById("cp-body"),
    cpAwait: document.getElementById("cp-await"),
    navIndex: document.getElementById("nav-index"),
    navTotal: document.getElementById("nav-total"),
    navTitle: document.getElementById("nav-title"),
    navProgress: document.getElementById("nav-progress"),
    prev: document.getElementById("nav-prev"),
    next: document.getElementById("nav-next"),
    edgePrev: document.getElementById("edge-prev"),
    edgeNext: document.getElementById("edge-next"),
    tryon: document.getElementById("tryon-modal"),
    skin: document.getElementById("skin-modal"),
    space: document.getElementById("space-sheet"),
    blueprints: document.getElementById("blueprints-modal"),
    bpGrid: document.getElementById("bp-grid"),
    tryonSlots: document.getElementById("tryon-slots"),
    tryonSwatches: document.getElementById("tryon-swatches"),
    tryonSelected: document.getElementById("tryon-selected"),
    simBase: document.getElementById("sim-base"),
    simLip: document.getElementById("sim-lip"),
    simCheekL: document.getElementById("sim-cheek-l"),
    simCheekR: document.getElementById("sim-cheek-r"),
    simEyeL: document.getElementById("sim-eye-l"),
    simEyeR: document.getElementById("sim-eye-r"),
    btnCopy: document.getElementById("btn-copy-panel"),
  };

  if (els.navTotal) els.navTotal.textContent = String(PAGES.length).padStart(2, "0");

  function getMakeupItem(id) {
    return MAKEUP_ITEMS.find(function (m) {
      return m.id === id;
    });
  }

  function applyMakeupFace(item) {
    if (!item || !els.simLip) return;
    const o = item.overlay || {};

    els.simLip.style.opacity = o.lip ? "1" : "0";
    if (o.lip) els.simLip.style.background = o.lip;

    els.simCheekL.style.opacity = o.cheek ? "1" : "0";
    els.simCheekR.style.opacity = o.cheek ? "1" : "0";
    if (o.cheek) {
      els.simCheekL.style.background = o.cheek;
      els.simCheekR.style.background = o.cheek;
    }

    els.simEyeL.style.opacity = o.eye ? "1" : "0";
    els.simEyeR.style.opacity = o.eye ? "1" : "0";
    if (o.eye) {
      els.simEyeL.style.background = o.eye;
      els.simEyeR.style.background = o.eye;
    }

    els.simBase.style.opacity = o.base ? "1" : "0";
    if (o.base) els.simBase.style.background = o.base;

    const ed = item.editorial ? " · editorial" : "";
    els.tryonSelected.textContent =
      item.name + " · " + item.shadeName + " · " + item.sku + ed;
  }

  function renderMakeupPicker() {
    if (!els.tryonSlots || !els.tryonSwatches) return;

    els.tryonSlots.innerHTML = MAKEUP_SLOTS.map(function (s) {
      const active = s.id === makeupSlot ? " active" : "";
      return (
        '<button type="button" class="tryon-slot' +
        active +
        '" data-makeup-slot="' +
        s.id +
        '">' +
        s.label +
        "</button>"
      );
    }).join("");

    const items = MAKEUP_ITEMS.filter(function (m) {
      return m.slot === makeupSlot;
    });

    els.tryonSwatches.innerHTML = items
      .map(function (m) {
        const active = m.id === makeupId ? " active" : "";
        return (
          '<li><button type="button" class="tryon-swatch' +
          active +
          '" data-makeup-id="' +
          m.id +
          '">' +
          '<span class="tryon-swatch-dot" style="background:' +
          m.color +
          '"></span>' +
          '<span class="tryon-swatch-meta">' +
          '<span class="tryon-swatch-name">' +
          m.name +
          "</span>" +
          '<span class="tryon-swatch-sub">' +
          m.shadeName +
          (m.editorial ? " · editorial" : "") +
          "</span>" +
          "</span></button></li>"
        );
      })
      .join("");

    applyMakeupFace(getMakeupItem(makeupId) || items[0]);
  }

  function selectMakeupSlot(slot) {
    makeupSlot = slot;
    const first = MAKEUP_ITEMS.find(function (m) {
      return m.slot === slot;
    });
    if (first) makeupId = first.id;
    renderMakeupPicker();
  }

  function selectMakeupId(id) {
    const item = getMakeupItem(id);
    if (!item) return;
    makeupId = id;
    makeupSlot = item.slot;
    renderMakeupPicker();
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function layoutArtFrame() {
    const img = els.bg;
    const art = els.art;
    const plane = els.plane;
    if (!art || !plane || !img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const pw = plane.clientWidth;
    const ph = plane.clientHeight;
    if (!nw || !nh || !pw || !ph) {
      art.style.width = "100%";
      art.style.height = "100%";
      return;
    }
    const scale = Math.min(pw / nw, ph / nh);
    art.style.width = Math.max(1, Math.round(nw * scale)) + "px";
    art.style.height = Math.max(1, Math.round(nh * scale)) + "px";
  }

  function routeId() {
    const raw = (location.hash || "#/cover").replace(/^#\/?/, "").split("?")[0];
    return pageById[raw] ? raw : "cover";
  }

  function setImg(img, localPath, remote) {
    img.onload = function () {
      layoutArtFrame();
    };
    img.onerror = function () {
      if (remote && img.src !== remote) {
        img.onerror = null;
        img.src = remote;
      }
    };
    img.src = localPath;
    if (img.complete && img.naturalWidth) layoutArtFrame();
  }

  function renderStrip() {
    els.strip.innerHTML = PAGES.map(function (p, i) {
      const active = i === index ? " active" : "";
      return (
        '<button type="button" class="strip-item' +
        active +
        '" data-goto="' +
        p.id +
        '">' +
        p.title +
        "</button>"
      );
    }).join("");

    const activeBtn = els.strip.querySelector(".strip-item.active");
    if (activeBtn && activeBtn.scrollIntoView) {
      activeBtn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }

  function renderProgress() {
    if (!els.navProgress) return;
    els.navProgress.innerHTML = PAGES.map(function (p, i) {
      const active = i === index ? " active" : "";
      return (
        '<button type="button" class="nav-dot' +
        active +
        '" data-goto="' +
        p.id +
        '" aria-label="' +
        p.title +
        '"></button>'
      );
    }).join("");
  }

  function renderHotspots(page) {
    els.hotspots.innerHTML = (page.hotspots || [])
      .map(function (h) {
        const cls = "hotspot" + (h.action ? " action" : "");
        const action = h.action ? ' data-open="' + h.action + '"' : "";
        return (
          '<a class="' +
          cls +
          '" href="' +
          h.href +
          '"' +
          action +
          ' style="top:' +
          h.t +
          ";left:" +
          h.l +
          ";width:" +
          h.w +
          ";height:" +
          h.h +
          '"><span>' +
          h.label +
          "</span></a>"
        );
      })
      .join("");
  }

  function renderGarble(pageId) {
    const copy = COPY[pageId];
    if (!els.garble) return;
    if (!copy || !copy.garble) {
      els.garble.hidden = true;
      return;
    }
    const g = copy.garble;
    els.garble.hidden = false;
    els.garble.style.top = g.t;
    els.garble.style.left = g.l;
    els.garble.style.width = g.w;
    els.garble.style.height = g.h;
  }

  function renderCopy(pageId) {
    const copy = COPY[pageId] || {};
    if (els.cpEyebrow) els.cpEyebrow.textContent = copy.eyebrow || "Readable overlay";

    if (els.cpJp) {
      if (copy.jp) {
        els.cpJp.hidden = false;
        els.cpJp.textContent = copy.jp;
      } else {
        els.cpJp.hidden = true;
        els.cpJp.textContent = "";
      }
    }

    if (els.cpTitle) els.cpTitle.textContent = copy.title || pageById[pageId].title;

    if (els.cpEn) {
      if (copy.en) {
        els.cpEn.hidden = false;
        els.cpEn.textContent = copy.en;
      } else {
        els.cpEn.hidden = true;
        els.cpEn.textContent = "";
      }
    }

    if (els.cpBody) {
      const parts = [];
      if (copy.body) parts.push(copy.body);
      if (copy.artNote) parts.push(copy.artNote);
      els.cpBody.textContent = parts.join(" ");
      els.cpBody.hidden = !parts.length;
    }

    if (els.cpAwait) {
      if (copy.awaitingBody) {
        els.cpAwait.hidden = false;
        els.cpAwait.textContent =
          copy.awaitingDetail ||
          "Awaiting approved EN / JP body — ALWAYS TO TRUE";
      } else {
        els.cpAwait.hidden = true;
      }
    }
  }

  function setNavDisabled() {
    const atStart = index === 0;
    const atEnd = index === PAGES.length - 1;
    if (els.prev) els.prev.disabled = atStart;
    if (els.next) els.next.disabled = atEnd;
    if (els.edgePrev) els.edgePrev.disabled = atStart;
    if (els.edgeNext) els.edgeNext.disabled = atEnd;
  }

  function renderPage() {
    const page = PAGES[index];
    els.plane.classList.remove("is-switching", "is-turn-next", "is-turn-prev");
    void els.plane.offsetWidth;
    els.plane.classList.add(turnDir >= 0 ? "is-turn-next" : "is-turn-prev");

    setImg(els.bg, ASSET + page.file, page.remote);
    els.bg.alt = "shortkey · " + page.title + " · Nihon Sakura Issue 01";

    renderHotspots(page);
    renderGarble(page.id);
    renderCopy(page.id);
    renderStrip();
    renderProgress();
    setNavDisabled();

    els.navIndex.textContent = pad(index + 1);
    els.navTitle.textContent = page.title;

    document.title = page.title + " · Maya E-Magazine · shortkey";
  }

  function go(id, pushHash) {
    const page = pageById[id];
    if (!page) return;
    const nextIndex = PAGES.indexOf(page);
    turnDir = nextIndex >= index ? 1 : -1;
    index = nextIndex;
    if (pushHash !== false) {
      const nextHash = "#/" + page.id;
      if (location.hash !== nextHash) {
        location.hash = nextHash;
      }
    }
    renderPage();
  }

  function goDelta(delta) {
    const next = index + delta;
    if (next < 0 || next >= PAGES.length) return;
    turnDir = delta;
    go(PAGES[next].id);
  }

  function openModal(name) {
    if (name === "tryon") {
      els.tryon.hidden = false;
      renderMakeupPicker();
    }
    if (name === "skin") els.skin.hidden = false;
    if (name === "space") els.space.hidden = false;
    if (name === "blueprints") els.blueprints.hidden = false;
  }

  function closeModal(name) {
    if (name === "tryon") els.tryon.hidden = true;
    if (name === "skin") els.skin.hidden = true;
    if (name === "space") els.space.hidden = true;
    if (name === "blueprints") els.blueprints.hidden = true;
  }

  function renderBlueprints() {
    els.bpGrid.innerHTML = BLUEPRINTS.map(function (b) {
      const local = ASSET + b.file;
      return (
        '<a class="bp-card" href="' +
        local +
        '" target="_blank" rel="noopener">' +
        '<img src="' +
        local +
        '" alt="' +
        b.title +
        '" data-remote="' +
        b.remote +
        '" />' +
        "<span>" +
        b.title +
        "</span></a>"
      );
    }).join("");
    els.bpGrid.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        const remote = img.getAttribute("data-remote");
        if (remote && img.src !== remote) img.src = remote;
      });
    });
  }

  function toggleCopyPanel() {
    copyPanelOn = !copyPanelOn;
    document.body.classList.toggle("copy-panel-hidden", !copyPanelOn);
    if (els.btnCopy) {
      els.btnCopy.setAttribute("aria-pressed", copyPanelOn ? "true" : "false");
      els.btnCopy.classList.toggle("is-active", copyPanelOn);
    }
  }

  document.addEventListener("click", function (e) {
    const makeupSlotBtn = e.target.closest("[data-makeup-slot]");
    if (makeupSlotBtn) {
      e.preventDefault();
      selectMakeupSlot(makeupSlotBtn.getAttribute("data-makeup-slot"));
      return;
    }

    const makeupIdBtn = e.target.closest("[data-makeup-id]");
    if (makeupIdBtn) {
      e.preventDefault();
      selectMakeupId(makeupIdBtn.getAttribute("data-makeup-id"));
      return;
    }

    const t = e.target.closest("[data-goto],[data-open],[data-close]");
    if (!t) return;

    if (t.hasAttribute("data-goto")) {
      e.preventDefault();
      go(t.getAttribute("data-goto"));
      return;
    }

    if (t.hasAttribute("data-open")) {
      e.preventDefault();
      openModal(t.getAttribute("data-open"));
      return;
    }

    if (t.hasAttribute("data-close")) {
      e.preventDefault();
      closeModal(t.getAttribute("data-close"));
    }
  });

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a[href^='#/']");
    if (!a || a.hasAttribute("data-open")) return;
    const href = a.getAttribute("href") || "";
    const id = href.replace(/^#\/?/, "").split("?")[0];
    if (!pageById[id]) return;
    e.preventDefault();
    go(id);
  });

  if (els.prev) {
    els.prev.addEventListener("click", function (e) {
      e.preventDefault();
      goDelta(-1);
    });
  }
  if (els.next) {
    els.next.addEventListener("click", function (e) {
      e.preventDefault();
      goDelta(1);
    });
  }
  if (els.edgePrev) {
    els.edgePrev.addEventListener("click", function (e) {
      e.preventDefault();
      goDelta(-1);
    });
  }
  if (els.edgeNext) {
    els.edgeNext.addEventListener("click", function (e) {
      e.preventDefault();
      goDelta(1);
    });
  }

  const psi = document.getElementById("personal-space-icon");
  if (psi) {
    psi.addEventListener("click", function () {
      openModal("space");
    });
  }

  if (els.btnCopy) {
    els.btnCopy.addEventListener("click", function () {
      toggleCopyPanel();
    });
  }

  window.addEventListener("hashchange", function () {
    go(routeId(), false);
  });

  document.addEventListener("keydown", function (e) {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      closeModal("tryon");
      closeModal("skin");
      closeModal("space");
      closeModal("blueprints");
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goDelta(-1);
    } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      goDelta(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go("cover");
    } else if (e.key === "End") {
      e.preventDefault();
      go("overview");
    } else if (e.key === "c" || e.key === "C") {
      toggleCopyPanel();
    }
  });

  (function bindSwipe() {
    const stage = document.getElementById("magazine-stage");
    if (!stage) return;
    let x0 = null;
    let y0 = null;
    stage.addEventListener(
      "touchstart",
      function (e) {
        const t = e.changedTouches[0];
        x0 = t.clientX;
        y0 = t.clientY;
      },
      { passive: true },
    );
    stage.addEventListener(
      "touchend",
      function (e) {
        if (x0 == null || y0 == null) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - x0;
        const dy = t.clientY - y0;
        x0 = y0 = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
        if (dx < 0) goDelta(1);
        else goDelta(-1);
      },
      { passive: true },
    );
  })();

  window.addEventListener("resize", layoutArtFrame);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", layoutArtFrame);
  }

  if (els.bpGrid) renderBlueprints();
  renderMakeupPicker();
  go(routeId(), false);
  if (!location.hash || location.hash === "#" || location.hash === "#/") {
    location.hash = "#/cover";
  }
})();
