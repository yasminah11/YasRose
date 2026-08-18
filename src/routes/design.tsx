import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Plus,
  Minus,
  Undo2,
  Redo2,
  Shuffle,
  Save,
  Share2,
  ShoppingBag,
  Check,
  Sparkles,
  Wand2,
  ChevronRight,
  ChevronLeft,
  Star,
  Info,
  Eye,
  Flower2,
  Package,
  Ribbon,
  MessageSquare,
  Gift,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/site/Layout";
import { IMG } from "@/lib/shop-data";

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "صمم باقتك بنفسك — YasRose" },
      {
        name: "description",
        content:
          "صمم باقتك الفاخرة بنفسك. اختر الزهور، التغليف، الشريط والإضافات وشاهد باقتك تتشكل أمامك مباشرة.",
      },
    ],
  }),
  component: DesignPage,
});

// ── types ─────────────────────────────────────────────────────────────────────

type FlowerKey =
  "rose" | "tulip" | "lily" | "peony" | "hydrangea" | "sunflower" | "orchid" | "baby";

// ── data ─────────────────────────────────────────────────────────────────────

const FLOWERS: {
  key: FlowerKey;
  name: string;
  price: number;
  hex: string;
  emoji: string;
  image: string;
  origin: string;
  mood: string;
}[] = [
  {
    key: "rose",
    name: "ورد جوري",
    price: 22,
    hex: "#B03A48",
    emoji: "🌹",
    image: IMG.b2,
    origin: "هولندا",
    mood: "رومانسي",
  },
  {
    key: "tulip",
    name: "توليب",
    price: 18,
    hex: "#E29A6B",
    emoji: "🌷",
    image: IMG.b3,
    origin: "تركيا",
    mood: "مرح",
  },
  {
    key: "lily",
    name: "زنبق",
    price: 24,
    hex: "#F7F3EE",
    emoji: "🌸",
    image: IMG.b1,
    origin: "اليابان",
    mood: "أنيق",
  },
  {
    key: "peony",
    name: "فاوانيا",
    price: 32,
    hex: "#F5C6D0",
    emoji: "🌺",
    image: IMG.hero,
    origin: "فرنسا",
    mood: "فاخر",
  },
  {
    key: "hydrangea",
    name: "هيدرانجيا",
    price: 28,
    hex: "#7BA6C7",
    emoji: "💠",
    image: IMG.b4,
    origin: "كولومبيا",
    mood: "هادئ",
  },
  {
    key: "sunflower",
    name: "عباد الشمس",
    price: 16,
    hex: "#E8C36A",
    emoji: "🌻",
    image: IMG.b3,
    origin: "إكوادور",
    mood: "مبهج",
  },
  {
    key: "orchid",
    name: "أوركيد",
    price: 36,
    hex: "#7B5EA7",
    emoji: "🌼",
    image: IMG.b4,
    origin: "تايلاند",
    mood: "غامض",
  },
  {
    key: "baby",
    name: "زهرة الطفل",
    price: 10,
    hex: "#F3E7D8",
    emoji: "🌾",
    image: IMG.flatlay,
    origin: "مصر",
    mood: "ناعم",
  },
];

const SIZES = [
  { key: "s", name: "صغيرة", mult: 1.0, stems: "٥–٨", desc: "هدية يومية رقيقة", icon: "🌸" },
  { key: "m", name: "متوسطة", mult: 1.4, stems: "١٢–١٨", desc: "الأكثر طلباً", icon: "💐" },
  { key: "l", name: "كبيرة", mult: 1.8, stems: "٢٠–٣٠", desc: "للمناسبات المميزة", icon: "🎀" },
  { key: "xl", name: "فاخرة", mult: 2.4, stems: "+٣٥", desc: "لحظة استثنائية", icon: "👑" },
];

const WRAPS = [
  { key: "white", name: "أبيض فاخر", hex: "#F7F3EE", price: 25, desc: "ورق مقوى أبيض ناصع" },
  { key: "black", name: "أسود مطفأ", hex: "#2A2A2A", price: 30, desc: "أناقة راقية وجريئة" },
  { key: "pink", name: "وردي ناعم", hex: "#F5C6D0", price: 25, desc: "رومانسي وأنثوي" },
  { key: "clear", name: "شفاف", hex: "#D8F0FF", price: 20, desc: "يُبرز جمال الزهور" },
  { key: "kraft", name: "كرافت بني", hex: "#B08968", price: 15, desc: "طابع طبيعي وعصري" },
  { key: "velvet", name: "مخملي", hex: "#7A2E3B", price: 45, desc: "فخامة استثنائية" },
  { key: "box", name: "علبة فاخرة", hex: "#1C1C1C", price: 65, desc: "علبة هدية رفيعة" },
];

const RIBBONS = [
  { key: "gold", name: "ذهبي", hex: "#C9A55C" },
  { key: "white", name: "أبيض", hex: "#F7F3EE" },
  { key: "black", name: "أسود", hex: "#1C1C1C" },
  { key: "pink", name: "وردي", hex: "#F5C6D0" },
  { key: "red", name: "أحمر", hex: "#B03A48" },
  { key: "silver", name: "فضي", hex: "#C6C6C6" },
];

const CARDS = ["بسيطة", "رومانسية", "عيد ميلاد", "فاخرة", "رسالة مخصصة"];

const EXTRAS: { key: string; name: string; price: number; emoji: string; desc: string }[] = [
  { key: "choco", name: "شوكولاتة", price: 65, emoji: "🍫", desc: "شوكولاتة بلجيكية فاخرة" },
  { key: "perfume", name: "عطر", price: 220, emoji: "🌫️", desc: "عطر فرنسي مختار" },
  { key: "macaron", name: "مكرون", price: 55, emoji: "🍬", desc: "مكرون باريسي أصيل" },
  { key: "teddy", name: "دمية دب", price: 90, emoji: "🧸", desc: "دمية ناعمة بالوردي" },
  { key: "balloons", name: "بالونات", price: 40, emoji: "🎈", desc: "بالونات عيد ملونة" },
  { key: "candle", name: "شمعة فاخرة", price: 120, emoji: "🕯️", desc: "شمعة معطرة يدوية" },
  { key: "giftbox", name: "علبة هدايا", price: 75, emoji: "🎁", desc: "علبة هدية مُزخرفة" },
];

const VASES = [
  { key: "none", name: "بدون مزهرية", price: 0 },
  { key: "glass", name: "زجاجية", price: 60 },
  { key: "luxury", name: "فاخرة", price: 180 },
  { key: "ceramic", name: "سيراميك", price: 120 },
];

type Design = {
  flowers: Record<FlowerKey, number>;
  size: string;
  wrap: string;
  ribbon: string;
  card: string;
  message: string;
  extras: string[];
  vase: string;
  recipient: string;
  date: string;
  time: string;
  notes: string;
};

const emptyFlowers = FLOWERS.reduce(
  (a, f) => ({ ...a, [f.key]: 0 }),
  {} as Record<FlowerKey, number>,
);
const initial: Design = {
  flowers: { ...emptyFlowers, rose: 5 },
  size: "m",
  wrap: "white",
  ribbon: "gold",
  card: "بسيطة",
  message: "",
  extras: [],
  vase: "none",
  recipient: "",
  date: "",
  time: "",
  notes: "",
};

const STEPS = [
  { id: 0, label: "الزهور", icon: Flower2 },
  { id: 1, label: "الكمية", icon: Plus },
  { id: 2, label: "الحجم", icon: Package },
  { id: 3, label: "التغليف", icon: Package },
  { id: 4, label: "الشريط", icon: Ribbon },
  { id: 5, label: "البطاقة", icon: MessageSquare },
  { id: 6, label: "إضافات", icon: Gift },
  { id: 7, label: "المزهرية", icon: Flower2 },
  { id: 8, label: "التوصيل", icon: Truck },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function lighten(hex: string, t: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r + (255 - r) * t)},${Math.round(g + (255 - g) * t)},${Math.round(b + (255 - b) * t)})`;
}
function darken(hex: string, t: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - t))},${Math.round(g * (1 - t))},${Math.round(b * (1 - t))})`;
}

// ── slot engine ───────────────────────────────────────────────────────────────

type FlowerSlot = {
  f: (typeof FLOWERS)[0];
  cx: number;
  cy: number;
  r: number;
  rot: number;
  zOrder: number;
};

function buildSlots(
  design: Design,
  activeFlowers: typeof FLOWERS,
  W: number,
  H: number,
  sizeKey: string,
): FlowerSlot[] {
  const baseR = sizeKey === "xl" ? 44 : sizeKey === "l" ? 38 : sizeKey === "m" ? 33 : 28;
  const units: (typeof FLOWERS)[0][] = [];
  activeFlowers.forEach((f) => {
    const n = Math.min(design.flowers[f.key], 8);
    for (let i = 0; i < n; i++) units.push(f);
  });
  if (units.length === 0) return [];

  const cx = W / 2;
  const dcy = H * 0.34;
  const slots: FlowerSlot[] = [];

  if (units.length === 1) {
    slots.push({ f: units[0], cx, cy: dcy, r: baseR, rot: 0, zOrder: 0 });
    return slots;
  }

  const rings = [
    { cap: 1, rr: 0 },
    { cap: 6, rr: baseR * 1.82 },
    { cap: 12, rr: baseR * 3.52 },
    { cap: 18, rr: baseR * 5.1 },
    { cap: 24, rr: baseR * 6.6 },
  ];

  let placed = 0;
  let ringIdx = 0;
  for (const ring of rings) {
    if (placed >= units.length) break;
    const n = Math.min(ring.cap, units.length - placed);
    for (let i = 0; i < n; i++) {
      const a = ring.rr === 0 ? -Math.PI / 2 : (i / n) * Math.PI * 2 - Math.PI / 2;
      const fcx = cx + Math.cos(a) * ring.rr;
      const fcy = dcy + Math.sin(a) * ring.rr * 0.68;
      const rot = ring.rr === 0 ? 0 : Math.cos(a) * 14;
      slots.push({
        f: units[placed],
        cx: fcx,
        cy: fcy,
        r: baseR * (ring.rr === 0 ? 1 : 0.9),
        rot,
        zOrder: ringIdx,
      });
      placed++;
    }
    ringIdx++;
  }
  return slots;
}

// ── wrap geometry ─────────────────────────────────────────────────────────────

function wrapPath(W: number, H: number): string {
  const cx = W / 2;
  const wrapTopY = H * 0.5;
  const halfTopW = W * 0.38;
  const midY = H * 0.72;
  const halfMidW = W * 0.3;
  const tipY = H * 0.97;
  const tipR = W * 0.04;
  const TL = { x: cx - halfTopW, y: wrapTopY };
  const TR = { x: cx + halfTopW, y: wrapTopY };
  const ML = { x: cx - halfMidW, y: midY };
  const MR = { x: cx + halfMidW, y: midY };
  const TIP = { x: cx, y: tipY };
  return [
    `M ${TL.x} ${TL.y}`,
    `C ${TL.x - W * 0.04} ${wrapTopY + (midY - wrapTopY) * 0.35} ${ML.x - W * 0.03} ${midY - (midY - wrapTopY) * 0.15} ${ML.x} ${midY}`,
    `C ${ML.x - W * 0.01} ${midY + (tipY - midY) * 0.55} ${TIP.x - tipR * 3} ${tipY - (tipY - midY) * 0.08} ${TIP.x} ${tipY}`,
    `C ${TIP.x + tipR * 3} ${tipY - (tipY - midY) * 0.08} ${MR.x + W * 0.01} ${midY + (tipY - midY) * 0.55} ${MR.x} ${midY}`,
    `C ${MR.x + W * 0.03} ${midY - (midY - wrapTopY) * 0.15} ${TR.x + W * 0.04} ${wrapTopY + (midY - wrapTopY) * 0.35} ${TR.x} ${TR.y}`,
    `Q ${cx} ${wrapTopY + H * 0.03} ${TL.x} ${TL.y}`,
    "Z",
  ].join(" ");
}

function leftCreasePath(W: number, H: number): string {
  const cx = W / 2;
  return `M ${cx - W * 0.13} ${H * 0.51} Q ${cx - W * 0.06} ${H * 0.73} ${cx} ${H * 0.97}`;
}
function rightCreasePath(W: number, H: number): string {
  const cx = W / 2;
  return `M ${cx + W * 0.13} ${H * 0.51} Q ${cx + W * 0.06} ${H * 0.73} ${cx} ${H * 0.97}`;
}

// ── SVG sub-components ────────────────────────────────────────────────────────

function BoxWrap({ W, H, wrapHex, uid }: { W: number; H: number; wrapHex: string; uid: string }) {
  const bx = W * 0.1,
    by = H * 0.54,
    bw = W * 0.8,
    bh = H * 0.44;
  const lid = { x: bx, y: by, w: bw, h: H * 0.055 };
  const cx = W / 2;
  return (
    <g>
      <defs>
        <linearGradient id={`boxFace-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darken(wrapHex, 0.18)} />
          <stop offset="40%" stopColor={wrapHex} />
          <stop offset="100%" stopColor={darken(wrapHex, 0.1)} />
        </linearGradient>
        <linearGradient id={`boxLid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(wrapHex, 0.22)} />
          <stop offset="100%" stopColor={wrapHex} />
        </linearGradient>
        <linearGradient id={`boxSheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>
      </defs>
      <rect x={bx + 6} y={by + 6} width={bw} height={bh} rx="8" fill="rgba(0,0,0,0.13)" />
      <rect
        x={bx}
        y={by}
        width={bw}
        height={bh}
        rx="8"
        fill={`url(#boxFace-${uid})`}
        stroke={darken(wrapHex, 0.22)}
        strokeWidth="1"
      />
      <rect x={bx} y={by} width={bw} height={bh} rx="8" fill={`url(#boxSheen-${uid})`} />
      <rect
        x={lid.x}
        y={lid.y}
        width={lid.w}
        height={lid.h}
        rx="6"
        fill={`url(#boxLid-${uid})`}
        stroke={darken(wrapHex, 0.28)}
        strokeWidth="1"
      />
      <line
        x1={bx + 2}
        y1={lid.y + lid.h}
        x2={bx + bw - 2}
        y2={lid.y + lid.h}
        stroke={darken(wrapHex, 0.3)}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line
        x1={cx}
        y1={by + lid.h + 4}
        x2={cx}
        y2={by + bh - 6}
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="1"
      />
      <rect
        x={bx + 8}
        y={by + lid.h + 8}
        width={bw * 0.06}
        height={bh - lid.h - 16}
        rx="3"
        fill="rgba(255,255,255,0.12)"
      />
    </g>
  );
}

function PaperWrap({ W, H, wrapHex, uid }: { W: number; H: number; wrapHex: string; uid: string }) {
  const path = wrapPath(W, H);
  const lc = leftCreasePath(W, H);
  const rc = rightCreasePath(W, H);
  const cx = W / 2;
  const wrapTopY = H * 0.5;
  const halfW = W * 0.38;
  const scallops = 7,
    bumpH = H * 0.022;
  const pts: string[] = [`M ${cx - halfW} ${wrapTopY}`];
  const segW = (halfW * 2) / scallops;
  for (let i = 0; i < scallops; i++) {
    const x0 = cx - halfW + i * segW,
      x1 = x0 + segW / 2,
      x2 = x0 + segW;
    const dy = i % 2 === 0 ? -bumpH : bumpH * 0.4;
    pts.push(`Q ${x1} ${wrapTopY + dy} ${x2} ${wrapTopY}`);
  }
  const wavePath = pts.join(" ");

  const leftP = [
    `M ${cx - W * 0.38} ${wrapTopY}`,
    `L ${cx - W * 0.13} ${wrapTopY + H * 0.01}`,
    `Q ${cx - W * 0.06} ${H * 0.73} ${cx} ${H * 0.97}`,
    `C ${cx - W * 0.12} ${H * 0.88} ${cx - W * 0.3} ${H * 0.72} ${cx - W * 0.3} ${H * 0.72}`,
    `C ${cx - W * 0.33} ${H * 0.56} ${cx - W * 0.42} ${H * 0.52} ${cx - W * 0.38} ${H * 0.5}`,
    "Z",
  ].join(" ");
  const rightP = [
    `M ${cx + W * 0.38} ${wrapTopY}`,
    `L ${cx + W * 0.13} ${wrapTopY + H * 0.01}`,
    `Q ${cx + W * 0.06} ${H * 0.73} ${cx} ${H * 0.97}`,
    `C ${cx + W * 0.12} ${H * 0.88} ${cx + W * 0.3} ${H * 0.72} ${cx + W * 0.3} ${H * 0.72}`,
    `C ${cx + W * 0.33} ${H * 0.56} ${cx + W * 0.42} ${H * 0.52} ${cx + W * 0.38} ${H * 0.5}`,
    "Z",
  ].join(" ");

  return (
    <g>
      <defs>
        <linearGradient id={`wrapCentre-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(wrapHex, 0.14)} />
          <stop offset="60%" stopColor={wrapHex} />
          <stop offset="100%" stopColor={darken(wrapHex, 0.12)} />
        </linearGradient>
        <linearGradient id={`wrapLeft-${uid}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={darken(wrapHex, 0.04)} />
          <stop offset="100%" stopColor={darken(wrapHex, 0.28)} />
        </linearGradient>
        <linearGradient id={`wrapRight-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={darken(wrapHex, 0.04)} />
          <stop offset="100%" stopColor={darken(wrapHex, 0.22)} />
        </linearGradient>
        <radialGradient id={`wrapSheen-${uid}`} cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </radialGradient>
        <pattern
          id={`paper-${uid}`}
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        </pattern>
        <clipPath id={`wrapClip-${uid}`}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill="rgba(0,0,0,0.12)" transform="translate(4,5)" />
      <path d={path} fill={`url(#wrapCentre-${uid})`} />
      <path d={leftP} fill={`url(#wrapLeft-${uid})`} clipPath={`url(#wrapClip-${uid})`} />
      <path d={rightP} fill={`url(#wrapRight-${uid})`} clipPath={`url(#wrapClip-${uid})`} />
      <path d={path} fill={`url(#paper-${uid})`} opacity="0.6" clipPath={`url(#wrapClip-${uid})`} />
      <path d={path} fill={`url(#wrapSheen-${uid})`} clipPath={`url(#wrapClip-${uid})`} />
      <path d={lc} stroke={darken(wrapHex, 0.3)} strokeWidth="1.2" fill="none" opacity="0.55" />
      <path d={rc} stroke={darken(wrapHex, 0.3)} strokeWidth="1.2" fill="none" opacity="0.55" />
      {/* scallop edge */}
      <path
        d={`${wavePath} L ${cx + halfW} ${wrapTopY + bumpH * 2} L ${cx - halfW} ${wrapTopY + bumpH * 2} Z`}
        fill={lighten(wrapHex, 0.18)}
        opacity="0.70"
      />
      <path
        d={wavePath}
        stroke={lighten(wrapHex, 0.35)}
        strokeWidth="1.8"
        fill="none"
        opacity="0.90"
      />
    </g>
  );
}

function RibbonBow({
  W,
  H,
  ribbonHex,
  isBox,
  uid,
}: {
  W: number;
  H: number;
  ribbonHex: string;
  isBox: boolean;
  uid: string;
}) {
  const cx = W / 2;
  const barY = isBox ? H * 0.594 : H * 0.514;
  const barX1 = cx - W * 0.32,
    barX2 = cx + W * 0.32,
    barH = H * 0.018;
  const bowCy = barY - barH / 2;
  const loopRx = W * 0.085,
    loopRy = H * 0.042,
    loopAngle = 32;
  const tailLen = H * 0.055;
  return (
    <g>
      <defs>
        <linearGradient id={`ribBar-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(ribbonHex, 0.3)} />
          <stop offset="50%" stopColor={ribbonHex} />
          <stop offset="100%" stopColor={darken(ribbonHex, 0.2)} />
        </linearGradient>
        <linearGradient id={`ribBow-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={lighten(ribbonHex, 0.25)} />
          <stop offset="100%" stopColor={darken(ribbonHex, 0.15)} />
        </linearGradient>
      </defs>
      <rect
        x={barX1 + 2}
        y={barY + 2}
        width={barX2 - barX1}
        height={barH}
        rx={barH / 2}
        fill="rgba(0,0,0,0.15)"
      />
      <rect
        x={barX1}
        y={barY}
        width={barX2 - barX1}
        height={barH}
        rx={barH / 2}
        fill={`url(#ribBar-${uid})`}
      />
      <rect
        x={barX1 + 4}
        y={barY + 1}
        width={barX2 - barX1 - 8}
        height={barH * 0.38}
        rx={barH / 2}
        fill="rgba(255,255,255,0.28)"
      />
      <ellipse
        cx={cx - loopRx * 0.72}
        cy={bowCy - loopRy * 0.55}
        rx={loopRx}
        ry={loopRy}
        fill={`url(#ribBow-${uid})`}
        transform={`rotate(-${loopAngle},${cx - loopRx * 0.72},${bowCy - loopRy * 0.55})`}
        opacity="0.92"
      />
      <ellipse
        cx={cx - loopRx * 0.72}
        cy={bowCy - loopRy * 0.55}
        rx={loopRx * 0.55}
        ry={loopRy * 0.55}
        fill="rgba(0,0,0,0.08)"
        transform={`rotate(-${loopAngle},${cx - loopRx * 0.72},${bowCy - loopRy * 0.55})`}
      />
      <ellipse
        cx={cx + loopRx * 0.72}
        cy={bowCy - loopRy * 0.55}
        rx={loopRx}
        ry={loopRy}
        fill={`url(#ribBow-${uid})`}
        transform={`rotate(${loopAngle},${cx + loopRx * 0.72},${bowCy - loopRy * 0.55})`}
        opacity="0.92"
      />
      <ellipse
        cx={cx + loopRx * 0.72}
        cy={bowCy - loopRy * 0.55}
        rx={loopRx * 0.55}
        ry={loopRy * 0.55}
        fill="rgba(0,0,0,0.08)"
        transform={`rotate(${loopAngle},${cx + loopRx * 0.72},${bowCy - loopRy * 0.55})`}
      />
      <path
        d={`M ${cx - 5} ${barY + barH} Q ${cx - W * 0.07} ${barY + tailLen * 0.7} ${cx - W * 0.09} ${barY + tailLen}`}
        stroke={`url(#ribBar-${uid})`}
        strokeWidth={barH * 0.85}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + 5} ${barY + barH} Q ${cx + W * 0.07} ${barY + tailLen * 0.7} ${cx + W * 0.09} ${barY + tailLen}`}
        stroke={`url(#ribBar-${uid})`}
        strokeWidth={barH * 0.85}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx={cx}
        cy={bowCy - 1}
        rx={W * 0.028}
        ry={H * 0.02}
        fill={darken(ribbonHex, 0.08)}
        stroke={lighten(ribbonHex, 0.3)}
        strokeWidth="1.2"
      />
      <ellipse
        cx={cx - 2}
        cy={bowCy - 3}
        rx={W * 0.01}
        ry={H * 0.007}
        fill="rgba(255,255,255,0.38)"
      />
    </g>
  );
}

function Stems({ slots, W, H }: { slots: FlowerSlot[]; W: number; H: number }) {
  const tipY = H * 0.97;
  return (
    <g opacity="0.55">
      {slots.map((s, i) => {
        const exitX = W / 2 + (s.cx - W / 2) * 0.1,
          exitY = H * 0.82;
        const c1x = s.cx + (exitX - s.cx) * 0.3 + Math.cos((s.rot * Math.PI) / 180) * 10;
        const c1y = s.cy + s.r + (exitY - s.cy - s.r) * 0.35;
        const c2x = exitX + (W / 2 - exitX) * 0.5,
          c2y = exitY + (tipY - exitY) * 0.4;
        return (
          <path
            key={i}
            d={`M ${s.cx} ${s.cy + s.r - 2} C ${c1x} ${c1y} ${c2x} ${c2y} ${W / 2 + (exitX - W / 2) * 0.2} ${tipY}`}
            stroke="#3d6b30"
            strokeWidth={1.6 - i * 0.02}
            fill="none"
          />
        );
      })}
    </g>
  );
}

// ── Main SVG canvas ───────────────────────────────────────────────────────────

let _uid = 0;

function BouquetSVG({
  design,
  wrap,
  ribbon,
  activeFlowers,
  W = 400,
  H = 520,
  showBadges = false,
  totals,
}: {
  design: Design;
  wrap: (typeof WRAPS)[0];
  ribbon: (typeof RIBBONS)[0];
  activeFlowers: typeof FLOWERS;
  W?: number;
  H?: number;
  showBadges?: boolean;
  totals?: any;
}) {
  const uidRef = useRef("");
  if (!uidRef.current) uidRef.current = `b${++_uid}`;
  const uid = uidRef.current;
  const size = SIZES.find((s) => s.key === design.size)!;
  const isBox = wrap.key === "box";
  const slots = buildSlots(design, activeFlowers, W, H, design.size);
  const isEmpty = slots.length === 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {slots.map((s, i) => (
          <clipPath key={i} id={`fc-${uid}-${i}`}>
            <circle cx={s.cx} cy={s.cy} r={s.r} />
          </clipPath>
        ))}
        <radialGradient id={`bgGrad-${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={wrap.hex} stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFF8F3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.07)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#FFF8F3" />
      <rect width={W} height={H} fill={`url(#bgGrad-${uid})`} />
      {isEmpty && (
        <g>
          <text x={W / 2} y={H / 2 - 14} textAnchor="middle" fontSize="28" fill="#d4c4bc">
            💐
          </text>
          <text
            x={W / 2}
            y={H / 2 + 12}
            textAnchor="middle"
            fontSize="13"
            fill="#9a8a80"
            fontFamily="system-ui,sans-serif"
          >
            اختر زهورك لتبدأ رسم باقتك
          </text>
        </g>
      )}
      {!isEmpty && <Stems slots={slots} W={W} H={H} />}
      {!isEmpty &&
        (isBox ? (
          <BoxWrap W={W} H={H} wrapHex={wrap.hex} uid={uid} />
        ) : (
          <PaperWrap W={W} H={H} wrapHex={wrap.hex} uid={uid} />
        ))}
      {slots.map((s, i) => (
        <g key={i} transform={`rotate(${s.rot},${s.cx},${s.cy})`}>
          <circle cx={s.cx + 2} cy={s.cy + 3} r={s.r} fill="rgba(0,0,0,0.11)" />
          <image
            href={s.f.image}
            x={s.cx - s.r}
            y={s.cy - s.r}
            width={s.r * 2}
            height={s.r * 2}
            clipPath={`url(#fc-${uid}-${i})`}
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: "saturate(1.10) brightness(1.03)" }}
          />
          <circle
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="2.5"
          />
          <path
            d={`M ${s.cx - s.r * 0.85} ${s.cy - s.r * 0.5} A ${s.r} ${s.r} 0 0 1 ${s.cx + s.r * 0.85} ${s.cy - s.r * 0.5}`}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            fill="none"
            clipPath={`url(#fc-${uid}-${i})`}
          />
        </g>
      ))}
      {!isEmpty && <RibbonBow W={W} H={H} ribbonHex={ribbon.hex} isBox={isBox} uid={uid} />}
      <rect width={W} height={H} fill={`url(#vig-${uid})`} />
      {showBadges && !isEmpty && (
        <>
          <rect x={W - 100} y={10} width={90} height={24} rx={12} fill="rgba(255,248,243,0.92)" />
          <text
            x={W - 55}
            y={26}
            textAnchor="middle"
            fontSize="10.5"
            fill="#7a6a60"
            fontFamily="system-ui,sans-serif"
          >
            {size.name} · {totals?.flowerCount ?? 0} زهرة
          </text>
        </>
      )}
    </svg>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

function DesignPage() {
  const navigate = useNavigate({ from: "/design" });
  const [design, setDesign] = useState<Design>(initial);
  const [step, setStep] = useState(0);
  const [finalized, setFinalized] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const historyRef = useRef<{ past: Design[]; future: Design[] }>({ past: [], future: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fn-bouquet-design-page");
      if (raw) setDesign({ ...initial, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const update = useCallback((patch: Partial<Design>) => {
    setDesign((prev) => {
      historyRef.current.past.push(prev);
      historyRef.current.future = [];
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("fn-bouquet-design-page", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const undo = () => {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    setDesign((d) => {
      historyRef.current.future.push(d);
      return prev;
    });
  };
  const redo = () => {
    const nxt = historyRef.current.future.pop();
    if (!nxt) return;
    setDesign((d) => {
      historyRef.current.past.push(d);
      return nxt;
    });
  };
  const random = () => {
    const rnd = FLOWERS.reduce(
      (a, f) => ({ ...a, [f.key]: Math.floor(Math.random() * 8) }),
      {} as Record<FlowerKey, number>,
    );
    update({
      flowers: rnd,
      size: SIZES[Math.floor(Math.random() * SIZES.length)].key,
      wrap: WRAPS[Math.floor(Math.random() * WRAPS.length)].key,
      ribbon: RIBBONS[Math.floor(Math.random() * RIBBONS.length)].key,
    });
  };

  const serializeDesign = (d: Design) => {
    const p = new URLSearchParams();
    (Object.entries(d.flowers) as [string, number][]).forEach(([k, v]) => {
      if (v > 0) p.set(k, String(v));
    });
    p.set("size", d.size);
    p.set("wrap", d.wrap);
    p.set("ribbon", d.ribbon);
    if (d.card) p.set("card", d.card);
    if (d.extras.length) p.set("extras", d.extras.join(","));
    return p.toString();
  };

  const handleSave = () => {
    const qs = serializeDesign(design);
    navigate({ search: qs as unknown as Record<string, string> });
    toast.success("تم حفظ التصميم في الرابط ✓");
  };
  const handleShare = async () => {
    const url = `${window.location.origin}/design?${serializeDesign(design)}`;
    try {
      if (navigator.share) await navigator.share({ title: "تصميمي على YasRose", url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("تم نسخ الرابط! 🔗");
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("تم نسخ الرابط! 🔗");
    }
  };

  const totals = useMemo(() => {
    const size = SIZES.find((s) => s.key === design.size)!;
    const flowersPrice =
      FLOWERS.reduce((sum, f) => sum + f.price * design.flowers[f.key], 0) * size.mult;
    const wrap = WRAPS.find((w) => w.key === design.wrap)?.price ?? 0;
    const vase = VASES.find((v) => v.key === design.vase)?.price ?? 0;
    const extras = design.extras.reduce(
      (s, k) => s + (EXTRAS.find((e) => e.key === k)?.price ?? 0),
      0,
    );
    const subtotal = Math.round(flowersPrice + wrap + vase + extras);
    const delivery = subtotal > 500 ? 0 : 45;
    const discount = subtotal > 800 ? Math.round(subtotal * 0.08) : 0;
    const tax = Math.round((subtotal - discount) * 0.15);
    const total = subtotal + delivery + tax - discount;
    const flowerCount = Object.values(design.flowers).reduce((a, b) => a + b, 0);
    return { subtotal, delivery, discount, tax, total, flowerCount };
  }, [design]);

  const wrap = WRAPS.find((w) => w.key === design.wrap)!;
  const ribbon = RIBBONS.find((r) => r.key === design.ribbon)!;
  const vase = VASES.find((v) => v.key === design.vase)!;
  const activeFlowers = FLOWERS.filter((f) => design.flowers[f.key] > 0);

  const handleFinalize = () => {
    setFinalized(true);
    setTimeout(
      () => document.getElementById("final-bouquet")?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };
  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // dominant color for accent tinting
  const dominantFlower = activeFlowers[0];

  return (
    <Layout>
      {/* ─ Hero ─ */}
      <div className="bg-gradient-to-b from-blush/60 to-cream pt-28 pb-10" dir="rtl">
        <div className="container-luxe">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-rose-gold">صمم باقتك بنفسك</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="eyebrow mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> استوديو التنسيق
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
                صمم باقتك
                <span
                  className="italic font-light mr-3"
                  style={{ fontFamily: "'Cormorant Garamond',serif" }}
                >
                  بنفسك
                </span>
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl">
                اختر زهورك، التغليف، الشريط والإضافات — وشاهد باقتك الفاخرة تتشكل أمامك لحظةً بلحظة.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={undo}
                aria-label="تراجع"
                title="تراجع"
                className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold transition"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                aria-label="إعادة"
                title="إعادة"
                className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold transition"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setDesign(initial);
                  historyRef.current = { past: [], future: [] };
                }}
                title="إعادة ضبط"
                className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={random}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:border-rose-gold text-sm transition"
              >
                <Shuffle className="w-3.5 h-3.5" /> عشوائي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─ Studio ─ */}
      <div className="container-luxe py-8" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 lg:gap-8 items-start">
          {/* LEFT: Preview Panel */}
          <div className="lg:sticky lg:top-24 order-2">
            <BouquetPreview
              design={design}
              wrap={wrap}
              ribbon={ribbon}
              activeFlowers={activeFlowers}
              totals={totals}
              vase={vase}
            />
          </div>

          {/* RIGHT: Step editor — first on mobile */}
          <div className="order-1">
            {/* Step Pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1 scrollbar-hide">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const done = s.id < step;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] border transition-all font-medium ${
                      step === s.id
                        ? "bg-charcoal text-primary-foreground border-charcoal"
                        : done
                          ? "bg-rose-gold/10 border-rose-gold/30 text-rose-gold"
                          : "bg-background border-border hover:border-rose-gold/60 text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-7">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`h-0.5 rounded-full flex-1 transition-all duration-500 ${
                    s.id < step ? "bg-rose-gold" : s.id === step ? "bg-charcoal" : "bg-border/50"
                  }`}
                />
              ))}
            </div>

            {/* Step content */}
            <div className="animate-reveal">
              {/* STEP 0 — Flower types */}
              {step === 0 && (
                <StepWrapper
                  title="اختر أنواع الزهور"
                  subtitle="يمكنك اختيار أكثر من نوع لتنسيق غني"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {FLOWERS.map((f) => {
                      const active = design.flowers[f.key] > 0;
                      return (
                        <button
                          key={f.key}
                          onClick={() =>
                            update({ flowers: { ...design.flowers, [f.key]: active ? 0 : 3 } })
                          }
                          className={`relative p-3 rounded-2xl border transition-all text-right group ${
                            active
                              ? "border-rose-gold bg-background shadow-soft"
                              : "border-border bg-background/60 hover:bg-background hover:border-rose-gold/40"
                          }`}
                        >
                          {active && (
                            <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-rose-gold text-white grid place-items-center z-10">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          <div className="aspect-square rounded-xl overflow-hidden bg-cream mb-2.5 relative">
                            <img
                              src={f.image}
                              alt={f.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* origin pill */}
                            <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-black/40 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                              {f.origin}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="font-display text-sm leading-tight">{f.name}</div>
                              <div className="text-[10px] text-rose-gold mt-0.5">{f.mood}</div>
                            </div>
                            <div className="text-[11px] text-muted-foreground shrink-0 mt-0.5">
                              {f.price} ج.م
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {activeFlowers.length === 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-blush/40 border border-rose-gold/20 text-sm text-muted-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-rose-gold shrink-0" /> اختر نوعاً واحداً على
                      الأقل للمتابعة
                    </div>
                  )}
                </StepWrapper>
              )}

              {/* STEP 1 — Quantities */}
              {step === 1 && (
                <StepWrapper title="حدد الكمية لكل نوع" subtitle="يمكنك ضبط عدد كل زهرة بدقة">
                  <div className="space-y-2.5">
                    {FLOWERS.map((f) => {
                      const qty = design.flowers[f.key];
                      const isActive = qty > 0;
                      return (
                        <div
                          key={f.key}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                            isActive
                              ? "border-rose-gold/40 bg-background shadow-soft"
                              : "border-border bg-background/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-border/40">
                              <img
                                src={f.image}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-display text-sm flex items-center gap-2">
                                {f.name}
                                {isActive && (
                                  <span className="text-[9px] bg-rose-gold/15 text-rose-gold px-1.5 py-0.5 rounded-full">
                                    {f.mood}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {f.price} ج.م/زهرة
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <span className="text-[11px] text-rose-gold font-medium">
                                {qty * f.price} ج.م
                              </span>
                            )}
                            <Counter
                              value={qty}
                              onChange={(v) =>
                                update({ flowers: { ...design.flowers, [f.key]: v } })
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {totals.flowerCount > 0 && (
                    <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-charcoal/5 border border-border/50">
                      <span className="text-sm text-muted-foreground">إجمالي الزهور</span>
                      <span className="font-display text-lg">{totals.flowerCount} زهرة</span>
                    </div>
                  )}
                </StepWrapper>
              )}

              {/* STEP 2 — Size */}
              {step === 2 && (
                <StepWrapper title="حجم الباقة" subtitle="الحجم يؤثر على عدد الزهور وسعر التنسيق">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {SIZES.map((s) => (
                      <PickCard
                        key={s.key}
                        active={design.size === s.key}
                        onClick={() => update({ size: s.key })}
                      >
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className="font-display text-lg">{s.name}</div>
                        <div className="text-xs text-rose-gold mt-1">{s.stems} زهور</div>
                        <div className="text-[11px] text-muted-foreground mt-1.5">{s.desc}</div>
                        <div className="mt-2 text-xs font-medium border-t border-border/40 pt-2">
                          ×{s.mult} السعر
                        </div>
                      </PickCard>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 3 — Wrap */}
              {step === 3 && (
                <StepWrapper
                  title="نوع التغليف"
                  subtitle="التغليف هو أول ما تراه العين عند الاستلام"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {WRAPS.map((w) => (
                      <PickCard
                        key={w.key}
                        active={design.wrap === w.key}
                        onClick={() => update({ wrap: w.key })}
                      >
                        <div
                          className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-border/40 shadow-soft"
                          style={{ background: w.hex }}
                        />
                        <div className="font-display text-sm">{w.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{w.desc}</div>
                        <div className="text-xs text-rose-gold mt-1.5">+{w.price} ج.م</div>
                      </PickCard>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 4 — Ribbon */}
              {step === 4 && (
                <StepWrapper title="لون الشريط" subtitle="الشريط يُكمل جمال الباقة ويعكس ذوقك">
                  <div className="grid grid-cols-3 gap-4">
                    {RIBBONS.map((r) => {
                      const active = design.ribbon === r.key;
                      return (
                        <button
                          key={r.key}
                          onClick={() => update({ ribbon: r.key })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                            active
                              ? "border-rose-gold bg-background shadow-soft"
                              : "border-border bg-background/60 hover:border-rose-gold/50"
                          }`}
                        >
                          <span
                            className={`w-14 h-14 rounded-full border-4 transition-all ${active ? "border-rose-gold scale-110 shadow-soft" : "border-transparent"}`}
                            style={{ background: r.hex }}
                          />
                          <span className="text-sm font-display">{r.name}</span>
                          {active && <Check className="w-4 h-4 text-rose-gold" />}
                        </button>
                      );
                    })}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 5 — Card */}
              {step === 5 && (
                <StepWrapper
                  title="بطاقة الإهداء"
                  subtitle="كلمة صادقة تبقى في القلب أكثر من أي زهرة"
                >
                  <div className="flex flex-wrap gap-2 mb-5">
                    {CARDS.map((c) => (
                      <button
                        key={c}
                        onClick={() => update({ card: c })}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          design.card === c
                            ? "bg-charcoal text-primary-foreground border-charcoal"
                            : "bg-background border-border hover:border-rose-gold"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea
                      placeholder="اكتبي رسالتك الشخصية هنا..."
                      value={design.message}
                      onChange={(e) => update({ message: e.target.value })}
                      maxLength={280}
                      className="w-full p-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold transition min-h-[140px] resize-none text-sm"
                    />
                    <span className="absolute bottom-3 left-3 text-[10px] text-muted-foreground">
                      {design.message.length}/280
                    </span>
                  </div>
                  {design.message && (
                    <div
                      className="mt-4 p-5 rounded-2xl border border-border/60 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg,#FFF8F3,#FCEEF3)` }}
                    >
                      <div className="text-[10px] tracking-[0.3em] text-rose-gold uppercase mb-2 flex items-center gap-1.5">
                        <Eye className="w-3 h-3" /> معاينة البطاقة
                      </div>
                      <p className="font-display text-sm leading-loose text-charcoal/80">
                        {design.message}
                      </p>
                      {/* decorative corner */}
                      <div className="absolute top-2 left-2 text-rose-gold/20 text-4xl leading-none select-none">
                        "
                      </div>
                    </div>
                  )}
                </StepWrapper>
              )}

              {/* STEP 6 — Extras */}
              {step === 6 && (
                <StepWrapper
                  title="إضافات فاخرة"
                  subtitle="أكمل الهدية بلمسة استثنائية تُفاجئ القلب"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {EXTRAS.map((e) => {
                      const active = design.extras.includes(e.key);
                      return (
                        <PickCard
                          key={e.key}
                          active={active}
                          onClick={() =>
                            update({
                              extras: active
                                ? design.extras.filter((x) => x !== e.key)
                                : [...design.extras, e.key],
                            })
                          }
                        >
                          <div className="text-3xl mb-2">{e.emoji}</div>
                          <div className="font-display text-sm">{e.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">{e.desc}</div>
                          <div className="text-xs text-rose-gold mt-1.5">+{e.price} ج.م</div>
                        </PickCard>
                      );
                    })}
                  </div>
                  {design.extras.length > 0 && (
                    <div className="mt-4 p-3.5 rounded-xl bg-blush/40 border border-rose-gold/20 text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {design.extras.length} إضافات مختارة
                      </span>
                      <span className="font-display text-rose-gold">
                        +
                        {design.extras.reduce(
                          (s, k) => s + (EXTRAS.find((e) => e.key === k)?.price ?? 0),
                          0,
                        )}{" "}
                        ج.م
                      </span>
                    </div>
                  )}
                </StepWrapper>
              )}

              {/* STEP 7 — Vase */}
              {step === 7 && (
                <StepWrapper title="المزهرية" subtitle="أضيفي مزهرية وتبقى الذكرى أطول">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {VASES.map((v) => (
                      <PickCard
                        key={v.key}
                        active={design.vase === v.key}
                        onClick={() => update({ vase: v.key })}
                      >
                        <div className="text-2xl mb-2">
                          {v.key === "none"
                            ? "🚫"
                            : v.key === "glass"
                              ? "🫙"
                              : v.key === "luxury"
                                ? "🏺"
                                : "🪴"}
                        </div>
                        <div className="font-display text-sm">{v.name}</div>
                        <div className="text-xs text-rose-gold mt-1.5">
                          {v.price ? `+${v.price} ج.م` : "مجاناً"}
                        </div>
                      </PickCard>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {/* STEP 8 — Delivery */}
              {step === 8 && (
                <StepWrapper title="تفاصيل التوصيل" subtitle="حدد موعد ومكان استلام باقتك الفاخرة">
                  <div className="grid gap-3">
                    <FormInput
                      label="اسم المستلم"
                      value={design.recipient}
                      onChange={(v) => update({ recipient: v })}
                      placeholder="أدخلي اسم المستلم"
                    />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                      <FormInput
                        label="تاريخ التوصيل"
                        type="date"
                        value={design.date}
                        onChange={(v) => update({ date: v })}
                      />
                      <FormInput
                        label="وقت التوصيل"
                        type="time"
                        value={design.time}
                        onChange={(v) => update({ time: v })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        ملاحظات خاصة
                      </label>
                      <textarea
                        value={design.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                        placeholder="أي تعليمات للتوصيل..."
                        className="w-full p-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold transition min-h-[90px] resize-none text-sm"
                      />
                    </div>
                    {/* Delivery info card */}
                    <div className="rounded-2xl border border-border/50 overflow-hidden">
                      <div className="bg-charcoal text-primary-foreground px-4 py-3 text-xs tracking-wider uppercase flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5" /> معلومات التوصيل
                      </div>
                      <div className="p-4 space-y-2.5 bg-background">
                        {[
                          "توصيل في نفس اليوم للطلبات قبل الساعة ٢ ظهراً",
                          "التوصيل مجاني للطلبات التي تتجاوز ٥٠٠ ج.م",
                          `رسوم التوصيل الحالية: ${totals.delivery ? `${totals.delivery} ج.م` : "مجاني 🎉"}`,
                        ].map((t, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-gold/60 mt-1.5 shrink-0" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </StepWrapper>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 btn-ghost-luxe disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" /> السابق
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {step + 1} / {STEPS.length}
                </span>
                <span className="text-[10px] text-rose-gold">{STEPS[step].label}</span>
              </div>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                  className="flex items-center gap-2 btn-luxe"
                >
                  التالي <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalize}
                  className="flex items-center gap-2 btn-luxe !bg-rose-gold hover:!bg-rose-gold/90"
                >
                  <Sparkles className="w-4 h-4" /> أنهِ التصميم
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─ Final reveal ─ */}
      {finalized && (
        <div id="final-bouquet" className="bg-gradient-to-b from-cream to-blush/40 py-20" dir="rtl">
          <div className="container-luxe">
            <div className="text-center mb-12">
              <div className="eyebrow mb-3 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-rose-gold text-rose-gold" /> باقتك الفاخرة جاهزة
                <Star className="w-4 h-4 fill-rose-gold text-rose-gold" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                إبداعك اكتمل
                <span
                  className="italic font-light mr-3"
                  style={{ fontFamily: "'Cormorant Garamond',serif" }}
                >
                  بلمسة YasRose
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              {/* Final visual */}
              <div
                className="rounded-[32px] overflow-hidden shadow-luxe border border-border/30"
                style={{ aspectRatio: "4/5" }}
              >
                <BouquetSVG
                  design={design}
                  wrap={wrap}
                  ribbon={ribbon}
                  activeFlowers={activeFlowers}
                  W={500}
                  H={625}
                />
              </div>

              {/* Summary */}
              <div className="space-y-5">
                <div className="rounded-3xl bg-background border border-border/60 overflow-hidden shadow-soft">
                  <div className="p-6 border-b border-border/60 bg-charcoal text-primary-foreground">
                    <div className="font-display text-xl">ملخص تصميمك</div>
                    <div className="text-primary-foreground/60 text-sm mt-1">
                      مراجعة شاملة لباقتك الفاخرة
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <SummaryRow
                      icon="🌸"
                      label="الزهور"
                      value={
                        activeFlowers
                          .map((f) => `${f.name} (${design.flowers[f.key]})`)
                          .join("، ") || "—"
                      }
                    />
                    <SummaryRow
                      icon="📐"
                      label="الحجم"
                      value={SIZES.find((s) => s.key === design.size)?.name || "—"}
                    />
                    <SummaryRow icon="🎀" label="التغليف" value={wrap.name} />
                    <SummaryRow icon="🎗️" label="الشريط" value={ribbon.name} />
                    <SummaryRow icon="💌" label="البطاقة" value={design.card} />
                    {design.extras.length > 0 && (
                      <SummaryRow
                        icon="✨"
                        label="الإضافات"
                        value={design.extras
                          .map((k) => EXTRAS.find((e) => e.key === k)?.name)
                          .filter(Boolean)
                          .join("، ")}
                      />
                    )}
                    {design.vase !== "none" && (
                      <SummaryRow
                        icon="🏺"
                        label="المزهرية"
                        value={VASES.find((v) => v.key === design.vase)?.name || "—"}
                      />
                    )}
                    {design.recipient && (
                      <SummaryRow icon="👤" label="المستلم" value={design.recipient} />
                    )}
                    {design.date && (
                      <SummaryRow
                        icon="📅"
                        label="التوصيل"
                        value={`${design.date}${design.time ? ` الساعة ${design.time}` : ""}`}
                      />
                    )}
                  </div>
                  <div className="p-6 border-t border-border/60 bg-cream space-y-2 text-sm">
                    <PriceRow
                      label="الزهور والتنسيق"
                      value={`${Math.round(totals.subtotal - (wrap.price ?? 0) - (vase.price ?? 0))} ج.م`}
                    />
                    <PriceRow label={`التغليف · ${wrap.name}`} value={`+${wrap.price} ج.م`} />
                    {vase.key !== "none" && (
                      <PriceRow label={`مزهرية · ${vase.name}`} value={`+${vase.price} ج.م`} />
                    )}
                    {design.extras.length > 0 && (
                      <PriceRow
                        label={`إضافات (${design.extras.length})`}
                        value={`+${design.extras.reduce((s, k) => s + (EXTRAS.find((e) => e.key === k)?.price ?? 0), 0)} ج.م`}
                      />
                    )}
                    <PriceRow
                      label="التوصيل"
                      value={totals.delivery ? `${totals.delivery} ج.م` : "مجاني 🎉"}
                      highlight={totals.delivery === 0}
                    />
                    {totals.discount > 0 && (
                      <PriceRow
                        label="خصم ٨٪ للباقات الكبيرة"
                        value={`−${totals.discount} ج.م`}
                        highlight
                      />
                    )}
                    <PriceRow label="ضريبة القيمة المضافة (١٥٪)" value={`${totals.tax} ج.م`} />
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
                      <span className="font-display text-lg">الإجمالي</span>
                      <div className="text-left">
                        <div className="font-display text-3xl text-shimmer">{totals.total}</div>
                        <div className="text-[10px] text-muted-foreground">ج.م شامل الضريبة</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`btn-luxe w-full justify-center text-base py-4 transition-all ${addedToCart ? "!bg-emerald-600" : ""}`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" /> تمت الإضافة إلى السلة!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> أضف إلى السلة
                      </>
                    )}
                  </button>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-border hover:border-rose-gold text-sm transition"
                    >
                      <Save className="w-4 h-4" /> احفظ التصميم
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-border hover:border-rose-gold text-sm transition"
                    >
                      <Share2 className="w-4 h-4" /> شارك التصميم
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setFinalized(false);
                      setStep(0);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition text-center py-2"
                  >
                    ← تعديل التصميم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// ── Live Preview ──────────────────────────────────────────────────────────────

function BouquetPreview({
  design,
  wrap,
  ribbon,
  activeFlowers,
  totals,
  vase,
}: {
  design: Design;
  wrap: (typeof WRAPS)[0];
  ribbon: (typeof RIBBONS)[0];
  activeFlowers: typeof FLOWERS;
  totals: any;
  vase: (typeof VASES)[0];
}) {
  const size = SIZES.find((s) => s.key === design.size)!;

  return (
    <div className="rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blush/20 via-cream to-cream/80 border border-border/40 overflow-hidden shadow-luxe">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 lg:px-5 lg:pt-5 lg:pb-3 flex items-center justify-between border-b border-border/30">
        <div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-rose-gold mb-0.5">
            معاينة مباشرة
          </div>
          <div className="font-display text-lg">باقتك الآن</div>
        </div>
        {activeFlowers.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded-full border border-border/50"
              style={{ background: wrap.hex }}
            />
            <div
              className="w-3.5 h-3.5 rounded-full border border-border/50"
              style={{ background: ribbon.hex }}
            />
            <span className="text-[11px] text-muted-foreground mr-1">
              {totals.flowerCount} زهرة
            </span>
          </div>
        )}
      </div>

      {/* SVG */}
      <div
        className="mx-3 my-3 lg:mx-4 lg:my-4 rounded-2xl overflow-hidden bg-[#FFF8F3] border border-border/30 relative"
        style={{ aspectRatio: "4/5", maxHeight: "50vw" }}
      >
        <BouquetSVG
          design={design}
          wrap={wrap}
          ribbon={ribbon}
          activeFlowers={activeFlowers}
          W={400}
          H={500}
          showBadges
          totals={totals}
        />
        {activeFlowers.length > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/85 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: wrap.hex }} />
            <span className="text-[10px] text-charcoal/70">{wrap.name}</span>
          </div>
        )}
      </div>

      {/* Flowers row */}
      <div className="px-4 pb-4 space-y-3">
        {activeFlowers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeFlowers.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] border border-border bg-background"
              >
                <span className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                  <img src={f.image} alt="" className="w-full h-full object-cover" />
                </span>
                <span className="font-medium">{f.name}</span>
                <span className="text-muted-foreground">×{design.flowers[f.key]}</span>
              </span>
            ))}
          </div>
        )}

        {/* Extras row */}
        {design.extras.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {design.extras.map((k) => {
              const ex = EXTRAS.find((e) => e.key === k);
              return ex ? (
                <span
                  key={k}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] bg-blush/60 border border-rose-gold/25"
                >
                  {ex.emoji} {ex.name}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Price box */}
        <div className="rounded-2xl border border-border/60 bg-background/70 p-4 space-y-2">
          <PriceRow
            label={`الزهور (${totals.flowerCount})`}
            value={`${Math.round(totals.subtotal - (wrap.price ?? 0) - (vase.price ?? 0))} ج.م`}
          />
          <PriceRow label={`تغليف · ${wrap.name}`} value={`+${wrap.price} ج.م`} />
          {vase.key !== "none" && (
            <PriceRow label={`مزهرية · ${vase.name}`} value={`+${vase.price} ج.م`} />
          )}
          {totals.delivery > 0 ? (
            <PriceRow label="توصيل" value={`+${totals.delivery} ج.م`} />
          ) : (
            <PriceRow label="توصيل مجاني" value="✓" highlight />
          )}
          {totals.discount > 0 && (
            <PriceRow label="خصم ٨٪" value={`−${totals.discount} ج.م`} highlight />
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-sm font-medium">الإجمالي</span>
            <div className="text-left">
              <div className="font-display text-2xl text-shimmer">{totals.total}</div>
              <div className="text-[10px] text-muted-foreground">ج.م (شامل ١٥٪ ضريبة)</div>
            </div>
          </div>
        </div>

        {activeFlowers.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            اختر زهورك أعلاه لحساب السعر
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label="نقص"
        className="w-8 h-8 rounded-full border border-border grid place-items-center hover:border-rose-gold transition"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-6 text-center font-display text-lg select-none">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="إضافة"
        className="w-8 h-8 rounded-full border border-border grid place-items-center hover:border-rose-gold transition"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function PickCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative p-4 rounded-2xl border transition-all text-center ${
        active
          ? "border-rose-gold bg-background shadow-soft -translate-y-0.5"
          : "border-border bg-background/60 hover:bg-background hover:-translate-y-0.5 hover:border-rose-gold/50"
      }`}
    >
      {active && (
        <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-rose-gold text-white grid place-items-center">
          <Check className="w-3 h-3" />
        </span>
      )}
      {children}
    </button>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold transition text-sm"
      />
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className="text-muted-foreground flex-shrink-0 w-16">{label}</span>
      <span className="text-right flex-1 font-medium leading-snug">{value}</span>
    </div>
  );
}

function PriceRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-sm ${highlight ? "text-emerald-600" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      <span className={highlight ? "font-medium" : ""}>{value}</span>
    </div>
  );
}
