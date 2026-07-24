import type { StickerGlyphKind, StickerDef } from "@/lib/social/stickerPacks";

const TINT: Record<StickerDef["tint"], { fill: string; stroke: string; soft: string }> = {
  lilac: { fill: "#B9B3FF", stroke: "#8C82FC", soft: "#EDEAFF" },
  pearl: { fill: "#F7F5FF", stroke: "#C4BDF5", soft: "#FFFFFF" },
  mint: { fill: "#D8F3E8", stroke: "#7BC4A8", soft: "#F0FAF5" },
  rose: { fill: "#F8DDE8", stroke: "#E8A0B8", soft: "#FFF5F8" },
  amber: { fill: "#F8EBD4", stroke: "#E0C08A", soft: "#FFF9F0" },
  sky: { fill: "#D9E8F8", stroke: "#8AB0D8", soft: "#F2F7FC" },
};

type GlyphProps = { kind: StickerGlyphKind; tint: StickerDef["tint"]; title: string };

/** ShortKey-owned geometric chips — not emoji, not third-party characters. */
export function StickerGlyph({ kind, tint, title }: GlyphProps) {
  const c = TINT[tint];
  const common = {
    viewBox: "0 0 48 48",
    width: 40,
    height: 40,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (kind) {
    case "ctrl":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="6" y="10" width="36" height="28" rx="8" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill={c.stroke} fontFamily="system-ui,sans-serif">
            ctrl
          </text>
        </svg>
      );
    case "alt":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="6" y="10" width="36" height="28" rx="8" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill={c.stroke} fontFamily="system-ui,sans-serif">
            alt
          </text>
        </svg>
      );
    case "beauty-signal":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="14" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <path d="M16 26 L22 18 L26 24 L32 14" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="14" r="2.5" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "creator-circle":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="15" fill="none" stroke={c.stroke} strokeWidth="1.5" />
          <circle cx="24" cy="18" r="5" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          <path d="M14 34c2-6 18-6 20 0" fill="none" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "product-story":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="12" y="8" width="24" height="32" rx="4" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <line x1="16" y1="16" x2="32" y2="16" stroke={c.stroke} strokeWidth="1.2" />
          <line x1="16" y1="22" x2="28" y2="22" stroke={c.fill} strokeWidth="1.2" />
          <line x1="16" y1="28" x2="30" y2="28" stroke={c.fill} strokeWidth="1.2" />
        </svg>
      );
    case "saved-look":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path
            d="M24 38 L12 26 Q8 20 12 14 Q16 10 24 16 Q32 10 36 14 Q40 20 36 26 Z"
            fill={c.fill}
            stroke={c.stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "soft-sparkle":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path d="M24 8 L26 20 L38 22 L26 24 L24 36 L22 24 L10 22 L22 20 Z" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          <circle cx="34" cy="12" r="2" fill={c.soft} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "pearl-glow":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="12" fill={c.soft} stroke={c.stroke} strokeWidth="1.2" opacity="0.9" />
          <circle cx="24" cy="24" r="7" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
          <circle cx="21" cy="21" r="2" fill="#fff" opacity="0.85" />
        </svg>
      );
    case "first-discovery":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="20" cy="20" r="10" fill="none" stroke={c.stroke} strokeWidth="1.8" />
          <line x1="27" y1="27" x2="36" y2="36" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill={c.fill} />
        </svg>
      );
    case "soft-ribbon":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path d="M10 28 Q18 12 24 22 Q30 12 38 28" fill="none" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18 26 L24 34 L30 26" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case "morning-light":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="8" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={24 + Math.cos(r) * 12}
                y1={24 + Math.sin(r) * 12}
                x2={24 + Math.cos(r) * 18}
                y2={24 + Math.sin(r) * 18}
                stroke={c.stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      );
    case "routine-step":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="12" cy="24" r="4.5" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          <circle cx="24" cy="24" r="4.5" fill={c.soft} stroke={c.stroke} strokeWidth="1.2" />
          <circle cx="36" cy="24" r="4.5" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          <line x1="16.5" y1="24" x2="19.5" y2="24" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28.5" y1="24" x2="31.5" y2="24" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "swatch-signal":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="8" y="14" width="10" height="20" rx="3" fill={c.fill} stroke={c.stroke} strokeWidth="1.2" />
          <rect x="19" y="14" width="10" height="20" rx="3" fill={c.soft} stroke={c.stroke} strokeWidth="1.2" />
          <rect x="30" y="14" width="10" height="20" rx="3" fill="#E8A0B8" stroke={c.stroke} strokeWidth="1.2" opacity="0.85" />
        </svg>
      );
    case "trend-pulse":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path d="M8 30 L16 22 L22 26 L30 14 L40 20" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="14" r="3" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "creator-review":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="8" y="12" width="32" height="24" rx="6" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <line x1="14" y1="20" x2="34" y2="20" stroke={c.stroke} strokeWidth="1.2" />
          <line x1="14" y1="26" x2="28" y2="26" stroke={c.fill} strokeWidth="1.2" />
        </svg>
      );
    case "texture-tap":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="14" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <circle cx="18" cy="20" r="2" fill={c.stroke} opacity="0.45" />
          <circle cx="26" cy="18" r="1.5" fill={c.stroke} opacity="0.35" />
          <circle cx="22" cy="28" r="2.2" fill={c.stroke} opacity="0.4" />
          <circle cx="30" cy="26" r="1.8" fill={c.stroke} opacity="0.5" />
        </svg>
      );
    case "color-swatch-burst":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="18" r="7" fill="#F8DDE8" stroke={c.stroke} strokeWidth="1" />
          <circle cx="16" cy="28" r="7" fill="#B9B3FF" stroke={c.stroke} strokeWidth="1" />
          <circle cx="32" cy="28" r="7" fill="#F8EBD4" stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "packaging-sparkle":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="14" y="10" width="20" height="28" rx="3" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <rect x="17" y="14" width="14" height="8" rx="1.5" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
          <path d="M34 12 L36 16 L40 14 L36 18 L38 22 L34 19 L30 22 L32 18 L28 14 L32 16 Z" fill={c.fill} stroke={c.stroke} strokeWidth="0.8" />
        </svg>
      );
    case "color-aura":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="16" fill="none" stroke={c.fill} strokeWidth="4" opacity="0.7" />
          <circle cx="24" cy="24" r="10" fill="none" stroke={c.stroke} strokeWidth="2" opacity="0.6" />
          <circle cx="24" cy="24" r="4" fill={c.soft} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "fantasy-frame":
      return (
        <svg {...common}>
          <title>{title}</title>
          <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke={c.stroke} strokeWidth="1.5" />
          <path d="M8 16 Q24 10 40 16" fill="none" stroke={c.fill} strokeWidth="2" />
          <path d="M8 32 Q24 38 40 32" fill="none" stroke={c.fill} strokeWidth="2" />
        </svg>
      );
    case "bold-bloom":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="5" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const r = (deg * Math.PI) / 180;
            const cx = 24 + Math.cos(r) * 10;
            const cy = 24 + Math.sin(r) * 10;
            return (
              <ellipse
                key={deg}
                cx={cx}
                cy={cy}
                rx="5"
                ry="7"
                fill={c.soft}
                stroke={c.stroke}
                strokeWidth="1"
                transform={`rotate(${deg} ${cx} ${cy})`}
              />
            );
          })}
        </svg>
      );
    case "my-style":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path d="M16 34 V18 Q16 10 24 10 Q32 10 32 18 V34" fill="none" stroke={c.stroke} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="24" cy="22" r="3" fill={c.fill} />
        </svg>
      );
    case "my-shelf":
      return (
        <svg {...common}>
          <title>{title}</title>
          <line x1="8" y1="34" x2="40" y2="34" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" />
          <rect x="10" y="18" width="8" height="16" rx="1.5" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
          <rect x="20" y="14" width="8" height="20" rx="1.5" fill={c.soft} stroke={c.stroke} strokeWidth="1" />
          <rect x="30" y="20" width="8" height="14" rx="1.5" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "try-this":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="14" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <path d="M20 24 L23 27 L29 19" fill="none" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "campaign-ready":
      return (
        <svg {...common}>
          <title>{title}</title>
          <path d="M10 30 L24 10 L38 30 Z" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="3" fill={c.fill} stroke={c.stroke} strokeWidth="1" />
        </svg>
      );
    case "profile-complete":
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="15" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
          <path d="M16 24 L22 30 L34 16" fill="none" stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <title>{title}</title>
          <circle cx="24" cy="24" r="12" fill={c.soft} stroke={c.stroke} strokeWidth="1.5" />
        </svg>
      );
  }
}
