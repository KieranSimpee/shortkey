/** Local Coming Soon / signup page copy — page language only (not J/K/C market switch).
 * Simpee board (2026-07-23): public locales = EN / 繁中 / KO.
 */

export const COMING_SOON_LOCALES = [
  { id: "en", label: "EN" },
  { id: "zh-Hant", label: "繁中" },
  { id: "ko", label: "KO" },
] as const;

export type ComingSoonLocale = (typeof COMING_SOON_LOCALES)[number]["id"];

export type ComingSoonCopy = {
  langSwitcherLabel: string;
  heroAria: string;
  comingSoon: string;
  platformTitle: string;
  tagline: string;
  discoveryBody: string;
  bookCreator: string;
  bookBrand: string;
  registerMeeting: string;
  noSpam: string;
  emailPlaceholder: string;
  notifyMe: string;
  sending: string;
  emailInvalid: string;
  emailFail: string;
  emailNetwork: string;
  emailSuccess: string;
  meetWorldEyebrow: string;
  meetWorldHeading: string;
  meetWorldBody: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  launchLabel: string;
  tryOnEyebrow: string;
  tryOnHeading: string;
  tryOnBody: string;
  tryOnPreview: string;
  tryOnAlt: string;
  skinEyebrow: string;
  skinHeading: string;
  skinBody: string;
  skinPreview: string;
  skinAlt: string;
  forCreators: string;
  creatorHeading: string;
  creatorBody: string;
  forBrands: string;
  brandHeading: string;
  brandBody: string;
  alreadyJoining: string;
  socialProof: string;
  proofCreators: string;
  proofKBeauty: string;
  proofJBeauty: string;
  proofCBeauty: string;
  privacy: string;
  terms: string;
  cookies: string;
  copyright: string;
  legalNav: string;
};

export const comingSoonMessages: Record<ComingSoonLocale, ComingSoonCopy> = {
  en: {
    langSwitcherLabel: "Page language",
    heroAria: "Shortkey — AI Asian Beauty Platform, Coming Soon",
    comingSoon: "Coming Soon",
    platformTitle: "AI Asian Beauty Platform",
    tagline: "Your Style. Your CTRL.",
    discoveryBody:
      "Discover Asian beauty for the world — K, J, and C Beauty in one calm, editorial space. Brands and creators, meet here before we open.",
    bookCreator: "Book Creator Appointment",
    bookBrand: "Book Brand Appointment",
    registerMeeting: "Register for a Meeting",
    noSpam: "No spam — just one email before launch.",
    emailPlaceholder: "you@email.com",
    notifyMe: "Notify Me →",
    sending: "Sending…",
    emailInvalid: "Enter a valid email.",
    emailFail: "Could not pre-register. Try again.",
    emailNetwork: "Network error. Please try again.",
    emailSuccess: "You're on the list.",
    meetWorldEyebrow: "Launch story",
    meetWorldHeading: "Before I Meet The World",
    meetWorldBody:
      "August 14, 2026 — Shortkey opens gently. Until then, this is our quiet room: appointments, pre-register, and a soft first look.",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMinutes: "Min",
    countdownSeconds: "Sec",
    launchLabel: "August 14, 2026",
    tryOnEyebrow: "AI Try-On",
    tryOnHeading: "See the shade on your face — before you buy.",
    tryOnBody: "Point your camera, try a shade, decide in seconds. AI Try-On opens with launch.",
    tryOnPreview: "Try-On Preview",
    tryOnAlt: "AI Try-On preview",
    skinEyebrow: "Skin Analysis",
    skinHeading: "An AI skin read, matched to your routine.",
    skinBody:
      "Understand your skin, then discover what actually fits it. Skin Analysis opens with launch.",
    skinPreview: "Skin Analysis Preview",
    skinAlt: "Skin Analysis preview",
    forCreators: "For Creators",
    creatorHeading: "Join the conversation — appointment only for now.",
    creatorBody: "Register for a 1-hour meeting. Rates and offers stay in the conversation.",
    forBrands: "For Brands & Founders",
    brandHeading: "An invitation to build with us.",
    brandBody:
      "Founding brands and partners: register for a private meeting. Founding terms stay in the conversation.",
    alreadyJoining: "Already Joining",
    socialProof:
      "Creators and brands across K-Beauty, J-Beauty, and C-Beauty are pre-registering ahead of launch.",
    proofCreators: "Creators",
    proofKBeauty: "K-Beauty Brands",
    proofJBeauty: "J-Beauty Brands",
    proofCBeauty: "C-Beauty Brands",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    copyright: "© 2026 Shortkey. All rights reserved.",
    legalNav: "Legal",
  },
  "zh-Hant": {
    langSwitcherLabel: "頁面語言",
    heroAria: "Shortkey — AI 亞洲美妝平台，即將登場",
    comingSoon: "即將登場",
    platformTitle: "AI 亞洲美妝平台",
    tagline: "Your Style. Your CTRL.",
    discoveryBody:
      "把亞洲美妝帶到世界——K、J、C Beauty 匯於一處沉靜而編輯感的空間。品牌與創作者，在開放前先在這裡相遇。",
    bookCreator: "預約創作者會面",
    bookBrand: "預約品牌會面",
    registerMeeting: "登記會面",
    noSpam: "無垃圾郵件 — 上線前僅一封郵件。",
    emailPlaceholder: "you@email.com",
    notifyMe: "通知我 →",
    sending: "傳送中…",
    emailInvalid: "請輸入有效電郵。",
    emailFail: "預先登記失敗，請重試。",
    emailNetwork: "網絡錯誤，請重試。",
    emailSuccess: "你已加入名單。",
    meetWorldEyebrow: "登場故事",
    meetWorldHeading: "Before I Meet The World",
    meetWorldBody:
      "2026 年 8 月 14 日 — Shortkey 溫柔開放。在此之前，這裡是我們的安靜房間：會面、預先登記，與柔和的第一眼。",
    countdownDays: "日",
    countdownHours: "時",
    countdownMinutes: "分",
    countdownSeconds: "秒",
    launchLabel: "2026 年 8 月 14 日",
    tryOnEyebrow: "AI 試妝",
    tryOnHeading: "下單前，先在臉上看到色號。",
    tryOnBody: "對準鏡頭、試色、幾秒內決定。AI 試妝將隨上線開放。",
    tryOnPreview: "試妝預覽",
    tryOnAlt: "AI 試妝預覽",
    skinEyebrow: "肌膚分析",
    skinHeading: "AI 膚質解讀，匹配你的護膚步驟。",
    skinBody: "了解你的肌膚，再發現真正適合的產品。肌膚分析將隨上線開放。",
    skinPreview: "肌膚分析預覽",
    skinAlt: "肌膚分析預覽",
    forCreators: "創作者",
    creatorHeading: "先對話 — 目前僅限預約。",
    creatorBody: "登記一小時會面。費率與合作細節留在對話中。",
    forBrands: "品牌與創辦人",
    brandHeading: "邀請你與我們一起建立。",
    brandBody: "創始品牌與夥伴：登記私人會面。創始條款留在對話中。",
    alreadyJoining: "已有人加入",
    socialProof: "來自 K-Beauty、J-Beauty 與 C-Beauty 的創作者和品牌正在預先登記，等待上線。",
    proofCreators: "創作者",
    proofKBeauty: "K-Beauty 品牌",
    proofJBeauty: "J-Beauty 品牌",
    proofCBeauty: "C-Beauty 品牌",
    privacy: "私隱",
    terms: "條款",
    cookies: "Cookie",
    copyright: "© 2026 Shortkey. All rights reserved.",
    legalNav: "法律資訊",
  },
  ko: {
    langSwitcherLabel: "페이지 언어",
    heroAria: "Shortkey — AI 아시안 뷰티 플랫폼, 곧 공개",
    comingSoon: "곧 공개",
    platformTitle: "AI 아시안 뷰티 플랫폼",
    tagline: "Your Style. Your CTRL.",
    discoveryBody:
      "아시아 뷰티를 세계로 — K·J·C Beauty가 고요하고 에디토리얼한 한 공간에. 브랜드와 크리에이터, 오픈 전에 여기서 만나요.",
    bookCreator: "크리에이터 미팅 예약",
    bookBrand: "브랜드 미팅 예약",
    registerMeeting: "미팅 등록",
    noSpam: "스팸 없음 — 런칭 전 이메일 한 통만.",
    emailPlaceholder: "you@email.com",
    notifyMe: "알림 받기 →",
    sending: "보내는 중…",
    emailInvalid: "유효한 이메일을 입력해 주세요.",
    emailFail: "사전 등록에 실패했습니다. 다시 시도해 주세요.",
    emailNetwork: "네트워크 오류입니다. 다시 시도해 주세요.",
    emailSuccess: "리스트에 등록되었습니다.",
    meetWorldEyebrow: "런칭 스토리",
    meetWorldHeading: "Before I Meet The World",
    meetWorldBody:
      "2026년 8월 14일 — Shortkey가 부드럽게 문을 엽니다. 그때까지 여기는 조용한 방: 미팅, 사전 등록, 그리고 부드러운 첫인상.",
    countdownDays: "일",
    countdownHours: "시",
    countdownMinutes: "분",
    countdownSeconds: "초",
    launchLabel: "2026년 8월 14일",
    tryOnEyebrow: "AI 가상 체험",
    tryOnHeading: "사기 전에, 내 얼굴에서 색을 확인해 보세요.",
    tryOnBody: "카메라를 비추고 색을 시도한 뒤 몇 초 만에 결정. AI 가상 체험은 런칭과 함께 열려요.",
    tryOnPreview: "가상 체험 미리보기",
    tryOnAlt: "AI 가상 체험 미리보기",
    skinEyebrow: "피부 분석",
    skinHeading: "AI 피부 리딩으로, 나에게 맞는 루틴을.",
    skinBody: "피부를 이해하고, 진짜 맞는 제품을 발견하세요. 피부 분석은 런칭과 함께 열려요.",
    skinPreview: "피부 분석 미리보기",
    skinAlt: "피부 분석 미리보기",
    forCreators: "크리에이터용",
    creatorHeading: "먼저 대화해요 — 지금은 예약제만 가능합니다.",
    creatorBody: "1시간 미팅을 등록하세요. 요금과 제안은 대화 안에서.",
    forBrands: "브랜드 & 파운더",
    brandHeading: "함께 만들어 달라는 초대.",
    brandBody: "파운딩 브랜드와 파트너: 프라이빗 미팅을 등록하세요. 파운딩 조건은 대화 안에서.",
    alreadyJoining: "이미 참여 중",
    socialProof:
      "K-Beauty, J-Beauty, C-Beauty의 크리에이터와 브랜드가 런칭을 앞두고 사전 등록하고 있습니다.",
    proofCreators: "크리에이터",
    proofKBeauty: "K-Beauty 브랜드",
    proofJBeauty: "J-Beauty 브랜드",
    proofCBeauty: "C-Beauty 브랜드",
    privacy: "개인정보",
    terms: "이용약관",
    cookies: "쿠키",
    copyright: "© 2026 Shortkey. All rights reserved.",
    legalNav: "법적 고지",
  },
};
