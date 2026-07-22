/** Local Coming Soon / signup page copy — page language only (not J/K/C market switch). */

export const COMING_SOON_LOCALES = [
  { id: "en", label: "EN" },
  { id: "ja", label: "日本語" },
  { id: "ko", label: "한국어" },
  { id: "zh", label: "简体中文" },
] as const;

export type ComingSoonLocale = (typeof COMING_SOON_LOCALES)[number]["id"];

export type ComingSoonCopy = {
  langSwitcherLabel: string;
  heroAria: string;
  comingSoon: string;
  platformTitle: string;
  tagline: string;
  welcomeHeading: string;
  welcomeBody: string;
  bookCreator: string;
  bookBrand: string;
  noSpam: string;
  emailPlaceholder: string;
  notifyMe: string;
  sending: string;
  emailInvalid: string;
  emailFail: string;
  emailNetwork: string;
  emailSuccess: string;
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
    welcomeHeading: "A Warm Welcome to Our Shared Beauty Space",
    welcomeBody:
      "We believe in the power of moving forward together. Whether you are a brand ready to expand or a creator ready to inspire, let's cultivate a supportive space for Asian beauty to thrive globally.",
    bookCreator: "Book Creator Appointment",
    bookBrand: "Book Brand Appointment",
    noSpam: "No spam — just one email before launch.",
    emailPlaceholder: "you@email.com",
    notifyMe: "Notify Me →",
    sending: "Sending…",
    emailInvalid: "Enter a valid email.",
    emailFail: "Could not pre-register. Try again.",
    emailNetwork: "Network error. Please try again.",
    emailSuccess: "You're on the list.",
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
    creatorHeading: "Book a meeting — appointment only for now.",
    creatorBody: "Arrange a 1-hour appointment. Rates and offers stay in the conversation.",
    forBrands: "For Brands",
    brandHeading: "Book a meeting — appointment only for now.",
    brandBody: "Arrange a 1-hour appointment. Founding terms stay in the conversation.",
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
  ja: {
    langSwitcherLabel: "表示言語",
    heroAria: "Shortkey — AIアジアビューティープラットフォーム、近日公開",
    comingSoon: "近日公開",
    platformTitle: "AIアジアビューティープラットフォーム",
    tagline: "Your Style. Your CTRL.",
    welcomeHeading: "共有のビューティースペースへようこそ",
    welcomeBody:
      "私たちは、ともに前へ進む力を信じています。拡大を目指すブランドでも、インスピレーションを届けたいクリエイターでも、アジアビューティーが世界で輝くための支え合う場をつくりましょう。",
    bookCreator: "クリエイター面談を予約",
    bookBrand: "ブランド面談を予約",
    noSpam: "スパムなし — ローンチ前にメール1通のみ。",
    emailPlaceholder: "you@email.com",
    notifyMe: "通知を受け取る →",
    sending: "送信中…",
    emailInvalid: "有効なメールアドレスを入力してください。",
    emailFail: "事前登録できませんでした。もう一度お試しください。",
    emailNetwork: "ネットワークエラーです。もう一度お試しください。",
    emailSuccess: "リストに登録されました。",
    tryOnEyebrow: "AI試着",
    tryOnHeading: "買う前に、あなたの顔で色を確認。",
    tryOnBody: "カメラを向けて色を試し、数秒で判断。AI試着はローンチと同時に開放。",
    tryOnPreview: "試着プレビュー",
    tryOnAlt: "AI試着プレビュー",
    skinEyebrow: "肌分析",
    skinHeading: "AI肌診断で、あなたに合うルーティンへ。",
    skinBody: "肌を理解し、本当に合うものを見つける。肌分析はローンチと同時に開放。",
    skinPreview: "肌分析プレビュー",
    skinAlt: "肌分析プレビュー",
    forCreators: "クリエイター向け",
    creatorHeading: "面談を予約 — 当面はアポイント制です。",
    creatorBody: "1時間の面談を設定。料金やオファーは会話の中で。",
    forBrands: "ブランド向け",
    brandHeading: "面談を予約 — 当面はアポイント制です。",
    brandBody: "1時間の面談を設定。創業条件は会話の中で。",
    alreadyJoining: "すでに参加中",
    socialProof:
      "K-Beauty・J-Beauty・C-Beautyのクリエイターとブランドが、ローンチに向けて事前登録しています。",
    proofCreators: "クリエイター",
    proofKBeauty: "K-Beautyブランド",
    proofJBeauty: "J-Beautyブランド",
    proofCBeauty: "C-Beautyブランド",
    privacy: "プライバシー",
    terms: "利用規約",
    cookies: "Cookie",
    copyright: "© 2026 Shortkey. All rights reserved.",
    legalNav: "法務",
  },
  ko: {
    langSwitcherLabel: "페이지 언어",
    heroAria: "Shortkey — AI 아시안 뷰티 플랫폼, 곧 공개",
    comingSoon: "곧 공개",
    platformTitle: "AI 아시안 뷰티 플랫폼",
    tagline: "Your Style. Your CTRL.",
    welcomeHeading: "함께하는 뷰티 공간에 오신 것을 환영합니다",
    welcomeBody:
      "우리는 함께 나아가는 힘을 믿습니다. 확장을 준비하는 브랜드든, 영감을 전할 크리에이터든, 아시안 뷰티가 세계로 뻗어갈 수 있는 든든한 공간을 함께 만들어 가요.",
    bookCreator: "크리에이터 미팅 예약",
    bookBrand: "브랜드 미팅 예약",
    noSpam: "스팸 없음 — 런칭 전 이메일 한 통만.",
    emailPlaceholder: "you@email.com",
    notifyMe: "알림 받기 →",
    sending: "보내는 중…",
    emailInvalid: "유효한 이메일을 입력해 주세요.",
    emailFail: "사전 등록에 실패했습니다. 다시 시도해 주세요.",
    emailNetwork: "네트워크 오류입니다. 다시 시도해 주세요.",
    emailSuccess: "리스트에 등록되었습니다.",
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
    creatorHeading: "미팅 예약 — 지금은 예약제만 가능합니다.",
    creatorBody: "1시간 미팅을 잡으세요. 요금과 제안은 대화 안에서.",
    forBrands: "브랜드용",
    brandHeading: "미팅 예약 — 지금은 예약제만 가능합니다.",
    brandBody: "1시간 미팅을 잡으세요. 파운딩 조건은 대화 안에서.",
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
  zh: {
    langSwitcherLabel: "页面语言",
    heroAria: "Shortkey — AI 亚洲美妆平台，即将上线",
    comingSoon: "即将上线",
    platformTitle: "AI 亚洲美妆平台",
    tagline: "Your Style. Your CTRL.",
    welcomeHeading: "欢迎来到我们共同的美妆空间",
    welcomeBody:
      "我们相信一起向前的力量。无论你是准备拓展的品牌，还是准备启发他人的创作者，让我们一起打造一个支持亚洲美妆走向全球的温暖空间。",
    bookCreator: "预约创作者会面",
    bookBrand: "预约品牌会面",
    noSpam: "无垃圾邮件 — 上线前仅一封邮件。",
    emailPlaceholder: "you@email.com",
    notifyMe: "通知我 →",
    sending: "发送中…",
    emailInvalid: "请输入有效邮箱。",
    emailFail: "预登记失败，请重试。",
    emailNetwork: "网络错误，请重试。",
    emailSuccess: "你已加入名单。",
    tryOnEyebrow: "AI 试妆",
    tryOnHeading: "下单前，先在脸上看到色号。",
    tryOnBody: "对准镜头、试色、几秒内做决定。AI 试妆将随上线开放。",
    tryOnPreview: "试妆预览",
    tryOnAlt: "AI 试妆预览",
    skinEyebrow: "皮肤分析",
    skinHeading: "AI 肤质解读，匹配你的护肤步骤。",
    skinBody: "了解你的皮肤，再发现真正适合的产品。皮肤分析将随上线开放。",
    skinPreview: "皮肤分析预览",
    skinAlt: "皮肤分析预览",
    forCreators: "创作者",
    creatorHeading: "预约会面 — 目前仅限预约。",
    creatorBody: "安排 1 小时会面。费率与合作细节留在对话中。",
    forBrands: "品牌",
    brandHeading: "预约会面 — 目前仅限预约。",
    brandBody: "安排 1 小时会面。创始条款留在对话中。",
    alreadyJoining: "已有人加入",
    socialProof: "来自 K-Beauty、J-Beauty 与 C-Beauty 的创作者和品牌正在预登记，等待上线。",
    proofCreators: "创作者",
    proofKBeauty: "K-Beauty 品牌",
    proofJBeauty: "J-Beauty 品牌",
    proofCBeauty: "C-Beauty 品牌",
    privacy: "隐私",
    terms: "条款",
    cookies: "Cookie",
    copyright: "© 2026 Shortkey. All rights reserved.",
    legalNav: "法律信息",
  },
};
