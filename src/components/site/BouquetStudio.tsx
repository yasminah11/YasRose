import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X, Plus, Minus, Undo2, Redo2, Shuffle, Save, Share2, Copy, ShoppingBag,
  Sparkles, Check,
} from "lucide-react";
import { IMG } from "@/lib/shop-data";

type FlowerKey = "rose" | "tulip" | "lily" | "peony" | "hydrangea" | "sunflower" | "orchid" | "baby";
const FLOWERS: { key: FlowerKey; name: string; price: number; hex: string; emoji: string; image: string }[] = [
  { key: "rose", name: "ورد جوري", price: 22, hex: "#B03A48", emoji: "🌹", image: IMG.b2 },
  { key: "tulip", name: "توليب", price: 18, hex: "#E29A6B", emoji: "🌷", image: IMG.b3 },
  { key: "lily", name: "زنبق", price: 24, hex: "#F7F3EE", emoji: "🌸", image: IMG.b1 },
  { key: "peony", name: "فاوانيا", price: 32, hex: "#F5C6D0", emoji: "🌺", image: IMG.hero },
  { key: "hydrangea", name: "هيدرانجيا", price: 28, hex: "#7BA6C7", emoji: "💠", image: IMG.b4 },
  { key: "sunflower", name: "عباد الشمس", price: 16, hex: "#E8C36A", emoji: "🌻", image: IMG.b3 },
  { key: "orchid", name: "أوركيد", price: 36, hex: "#7B5EA7", emoji: "🌼", image: IMG.b4 },
  { key: "baby", name: "زهرة الطفل", price: 10, hex: "#F3E7D8", emoji: "🌾", image: IMG.flatlay },
];

const SIZES = [
  { key: "s", name: "صغيرة", mult: 1 },
  { key: "m", name: "متوسطة", mult: 1.4 },
  { key: "l", name: "كبيرة", mult: 1.8 },
  { key: "xl", name: "فاخرة", mult: 2.4 },
];

const WRAPS = [
  { key: "white", name: "أبيض فاخر", hex: "#F7F3EE", price: 25 },
  { key: "black", name: "أسود مطفأ", hex: "#1C1C1C", price: 30 },
  { key: "pink", name: "وردي ناعم", hex: "#F5C6D0", price: 25 },
  { key: "clear", name: "شفاف", hex: "#E8E4DE", price: 20 },
  { key: "kraft", name: "كرافت بني", hex: "#B08968", price: 15 },
  { key: "velvet", name: "مخملي", hex: "#7A2E3B", price: 45 },
  { key: "box", name: "علبة فاخرة", hex: "#2A2A2A", price: 65 },
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

const EXTRAS: { key: string; name: string; price: number; emoji: string }[] = [
  { key: "choco", name: "شوكولاتة", price: 65, emoji: "🍫" },
  { key: "perfume", name: "عطر", price: 220, emoji: "🌫️" },
  { key: "macaron", name: "مكرون", price: 55, emoji: "🍬" },
  { key: "teddy", name: "دمية دب", price: 90, emoji: "🧸" },
  { key: "balloons", name: "بالونات", price: 40, emoji: "🎈" },
  { key: "candle", name: "شمعة فاخرة", price: 120, emoji: "🕯️" },
  { key: "giftbox", name: "علبة هدايا", price: 75, emoji: "🎁" },
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

const emptyFlowers = FLOWERS.reduce((a, f) => ({ ...a, [f.key]: 0 }), {} as Record<FlowerKey, number>);
const initial: Design = {
  flowers: { ...emptyFlowers, rose: 5 },
  size: "m", wrap: "white", ribbon: "gold", card: "بسيطة", message: "",
  extras: [], vase: "none", recipient: "", date: "", time: "", notes: "",
};

const SECTIONS = [
  "أنواع الزهور", "الكمية", "الحجم", "التغليف", "الشريط",
  "بطاقة الإهداء", "إضافات فاخرة", "المزهرية", "التوصيل",
];

// ─── Premium SVG Bouquet Preview ──────────────────────────────────────────────

type FlowerDef = typeof FLOWERS[number];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lighten(hex: string, amount = 40): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, r + amount)},${Math.min(255, g + amount)},${Math.min(255, b + amount)})`;
}

function darken(hex: string, amount = 40): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.max(0, r - amount)},${Math.max(0, g - amount)},${Math.max(0, b - amount)})`;
}

// Deterministic pseudo-random using seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

interface BouquetPreviewProps {
  activeFlowers: FlowerDef[];
  flowerCounts: Record<FlowerKey, number>;
  wrapColor: string;
  wrapKey: string;
  ribbonColor: string;
  sizeName: string;
  flowerCount: number;
}

function BouquetPreview({ activeFlowers, flowerCounts, wrapColor, wrapKey, ribbonColor, sizeName, flowerCount }: BouquetPreviewProps) {
  // SVG viewport
  const W = 400;
  const H = 500;
  const cx = W / 2;

  const isTransparent = wrapKey === "clear";
  const wrapOpacity = isTransparent ? 0.17 : 1;

  // Build flower positions: center flowers larger, edges smaller, rotated outward
  type FlowerPos = {
    x: number; y: number; r: number; hex: string; zIndex: number;
    rotate: number; shadowR: number; id: string; emoji: string;
  };

  const flowerPositions: FlowerPos[] = [];

  if (activeFlowers.length > 0) {
    // Center flower (largest)
    const centerFlower = activeFlowers[0];
    flowerPositions.push({
      x: cx, y: 175,
      r: 38, hex: centerFlower.hex,
      zIndex: 10, rotate: 0,
      shadowR: 6, id: `f-center`,
      emoji: centerFlower.emoji,
    });

    // Ring flowers arranged in natural clusters
    const ringCount = activeFlowers.length - 1;
    for (let i = 0; i < ringCount; i++) {
      const f = activeFlowers[i + 1];
      const count = flowerCounts[f.key];
      // Spread across 2 rings
      const ring = i % 2 === 0 ? 0 : 1;
      const ringRadius = ring === 0 ? 62 : 100;
      const totalInRing = ringCount;
      const angle = ((i / totalInRing) * Math.PI * 2) - Math.PI / 2 + seededRandom(i * 17) * 0.4;
      const jitter = seededRandom(i * 31) * 18 - 9;
      const px = cx + Math.cos(angle) * (ringRadius + jitter);
      const py = 175 + Math.sin(angle) * (ringRadius * 0.75 + jitter * 0.5);
      // Size based on ring + count
      const baseR = ring === 0 ? 30 : 22;
      const countBoost = Math.min(count, 10) * 0.5;
      // outward rotation
      const outwardAngle = (angle * 180 / Math.PI) + (ring === 0 ? 12 : 20);

      flowerPositions.push({
        x: px, y: py,
        r: baseR + countBoost,
        hex: f.hex,
        zIndex: ring === 0 ? 7 : 4,
        rotate: outwardAngle,
        shadowR: 4,
        id: `f-${i}`,
        emoji: f.emoji,
      });
    }

    // Sort by y for natural layering
    flowerPositions.sort((a, b) => a.zIndex - b.zIndex || a.y - b.y);
  }

  // Wrap geometry
  const wrapTopY = 280;
  const wrapBottomY = H - 30;
  const wrapLeftX = cx - 95;
  const wrapRightX = cx + 95;

  // Stem bundle visible below wrap
  const stemBottomY = wrapBottomY + 10;
  const stemTopY = wrapTopY + 40;

  // Ribbon bow center
  const ribbonY = wrapTopY + 55;

  // Background gradient stops based on wrapColor
  const bgLight = lighten(wrapColor, 90);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-label="معاينة الباقة"
    >
      <defs>
        {/* Background radial gradient */}
        <radialGradient id="bg-grad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={bgLight} stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFF8F3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F5EDE8" />
        </radialGradient>

        {/* Ground shadow */}
        <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2A1A14" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2A1A14" stopOpacity="0" />
        </radialGradient>

        {/* Wrap gradient — top-left light source */}
        <linearGradient id="wrap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(wrapColor, 55)} stopOpacity={wrapOpacity} />
          <stop offset="40%" stopColor={wrapColor} stopOpacity={wrapOpacity} />
          <stop offset="100%" stopColor={darken(wrapColor, 30)} stopOpacity={wrapOpacity} />
        </linearGradient>

        {/* Fold highlights */}
        <linearGradient id="fold-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fold-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0.25" />
        </linearGradient>

        {/* Flower petal gradients — one per active flower */}
        {activeFlowers.map((f) => (
          <radialGradient key={`fgrad-${f.key}`} id={`fgrad-${f.key}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={lighten(f.hex, 60)} />
            <stop offset="50%" stopColor={f.hex} />
            <stop offset="100%" stopColor={darken(f.hex, 25)} />
          </radialGradient>
        ))}

        {/* Specular highlight */}
        <radialGradient id="specular" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Ribbon gradient */}
        <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(ribbonColor, 40)} />
          <stop offset="50%" stopColor={ribbonColor} />
          <stop offset="100%" stopColor={darken(ribbonColor, 30)} />
        </linearGradient>

        {/* Bokeh blur filter */}
        <filter id="bokeh-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Ambient occlusion / contact shadow */}
        <filter id="ao-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#3D1A10" floodOpacity="0.22" />
        </filter>

        {/* Stem shadow */}
        <filter id="stem-shadow">
          <feDropShadow dx="2" dy="1" stdDeviation="2" floodColor="#2A1005" floodOpacity="0.35" />
        </filter>

        {/* Wrap outline for transparent */}
        <filter id="wrap-outline">
          <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="expanded" />
          <feFlood floodColor={darken(wrapColor, 20)} floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="expanded" operator="in" result="outline" />
          <feMerge><feMergeNode in="outline" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Background ── */}
      <rect width={W} height={H} fill="url(#bg-grad)" />

      {/* Bokeh circles for depth */}
      {[
        { cx: 30, cy: 80, r: 28 }, { cx: 370, cy: 120, r: 20 },
        { cx: 60, cy: 310, r: 16 }, { cx: 350, cy: 380, r: 24 },
        { cx: 320, cy: 60, r: 12 }, { cx: 80, cy: 430, r: 18 },
        { cx: 15, cy: 200, r: 10 }, { cx: 385, cy: 260, r: 14 },
      ].map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r}
          fill={i % 2 === 0 ? lighten(wrapColor, 60) : "#F5C6D0"}
          opacity={0.18 + (i % 3) * 0.04}
          filter="url(#bokeh-blur)"
        />
      ))}

      {/* ── Ground shadow ── */}
      <ellipse cx={cx} cy={H - 18} rx={80} ry={12} fill="url(#ground-shadow)" />

      {/* ── Stems (below wrap, peeking out) ── */}
      <g filter="url(#stem-shadow)">
        {[-12, -4, 4, 12].map((offset, i) => (
          <path
            key={i}
            d={`M ${cx + offset} ${stemTopY} Q ${cx + offset + seededRandom(i * 7) * 10 - 5} ${(stemTopY + stemBottomY) / 2} ${cx + offset * 0.7} ${stemBottomY}`}
            stroke={i % 2 === 0 ? "#4A7C47" : "#3A6438"}
            strokeWidth={i === 1 || i === 2 ? 3.5 : 2.5}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* ── Leaves peeking from sides ── */}
      {/* Left leaf */}
      <g transform={`translate(${wrapLeftX - 8}, ${wrapTopY + 30}) rotate(-35)`}>
        <ellipse rx={22} ry={9} fill="#5A8C57" opacity={0.88} />
        <line x1={-18} y1={0} x2={18} y2={0} stroke="#3D6B3A" strokeWidth={1} opacity={0.5} />
      </g>
      {/* Left leaf 2 */}
      <g transform={`translate(${wrapLeftX - 4}, ${wrapTopY + 70}) rotate(-50)`}>
        <ellipse rx={16} ry={7} fill="#4A7C47" opacity={0.8} />
      </g>
      {/* Right leaf */}
      <g transform={`translate(${wrapRightX + 8}, ${wrapTopY + 40}) rotate(30)`}>
        <ellipse rx={20} ry={8} fill="#5A8C57" opacity={0.85} />
        <line x1={-16} y1={0} x2={16} y2={0} stroke="#3D6B3A" strokeWidth={1} opacity={0.5} />
      </g>
      {/* Right leaf 2 */}
      <g transform={`translate(${wrapRightX + 5}, ${wrapTopY + 80}) rotate(48)`}>
        <ellipse rx={14} ry={6} fill="#4A7C47" opacity={0.75} />
      </g>

      {/* ── Wrapping paper — 5 layered folds ── */}
      {/* Fold 5 (back-most, darkest) */}
      <path
        d={`
          M ${wrapLeftX - 10} ${wrapTopY + 10}
          Q ${cx - 60} ${wrapTopY - 8} ${cx} ${wrapTopY - 2}
          Q ${cx + 60} ${wrapTopY - 8} ${wrapRightX + 10} ${wrapTopY + 10}
          L ${wrapRightX + 14} ${wrapBottomY}
          Q ${cx} ${wrapBottomY + 8} ${wrapLeftX - 14} ${wrapBottomY}
          Z
        `}
        fill={darken(wrapColor, 20)}
        opacity={wrapOpacity * 0.85}
        filter={isTransparent ? "url(#wrap-outline)" : undefined}
      />
      {/* Fold 4 */}
      <path
        d={`
          M ${wrapLeftX - 5} ${wrapTopY + 6}
          Q ${cx - 48} ${wrapTopY - 14} ${cx} ${wrapTopY - 6}
          Q ${cx + 48} ${wrapTopY - 14} ${wrapRightX + 5} ${wrapTopY + 6}
          L ${wrapRightX + 10} ${wrapBottomY - 4}
          Q ${cx} ${wrapBottomY + 4} ${wrapLeftX - 10} ${wrapBottomY - 4}
          Z
        `}
        fill={darken(wrapColor, 10)}
        opacity={wrapOpacity * 0.9}
        filter={isTransparent ? "url(#wrap-outline)" : undefined}
      />
      {/* Fold 3 — wavy scalloped top */}
      <path
        d={`
          M ${wrapLeftX} ${wrapTopY + 2}
          C ${wrapLeftX + 15} ${wrapTopY - 22} ${cx - 35} ${wrapTopY - 18} ${cx - 10} ${wrapTopY - 10}
          S ${cx + 35} ${wrapTopY - 22} ${wrapRightX} ${wrapTopY + 2}
          L ${wrapRightX + 6} ${wrapBottomY - 6}
          Q ${cx} ${wrapBottomY + 2} ${wrapLeftX - 6} ${wrapBottomY - 6}
          Z
        `}
        fill="url(#wrap-grad)"
        filter={isTransparent ? "url(#wrap-outline)" : undefined}
      />
      {/* Fold 2 (highlight) */}
      <path
        d={`
          M ${wrapLeftX + 12} ${wrapTopY - 6}
          C ${wrapLeftX + 22} ${wrapTopY - 30} ${cx - 20} ${wrapTopY - 26} ${cx + 5} ${wrapTopY - 16}
          L ${cx + 8} ${wrapBottomY - 20}
          Q ${cx - 20} ${wrapBottomY - 10} ${wrapLeftX + 8} ${wrapBottomY - 22}
          Z
        `}
        fill="url(#fold-1)"
        opacity={isTransparent ? 0.5 : 0.7}
      />
      {/* Fold 1 — right-side highlight */}
      <path
        d={`
          M ${wrapRightX - 12} ${wrapTopY - 4}
          C ${wrapRightX - 8} ${wrapTopY - 26} ${cx + 30} ${wrapTopY - 22} ${cx + 15} ${wrapTopY - 12}
          L ${cx + 12} ${wrapBottomY - 18}
          Q ${wrapRightX - 20} ${wrapBottomY - 10} ${wrapRightX - 10} ${wrapBottomY - 24}
          Z
        `}
        fill="url(#fold-2)"
        opacity={isTransparent ? 0.4 : 0.6}
      />

      {/* ── Flowers ── (rendered in z-index order) */}
      {activeFlowers.length === 0 && (
        <text
          x={cx} y={200}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="14" fill="#8A6A5A" fontFamily="Cairo, sans-serif"
        >
          اختر زهورك لتبدأ التصميم
        </text>
      )}

      {flowerPositions.map((fp, idx) => {
        const fDef = activeFlowers.find((f) => {
          if (idx === 0 && fp.id === "f-center") return true;
          const pos = flowerPositions.indexOf(fp);
          return activeFlowers[pos] !== undefined;
        }) ?? activeFlowers[idx % activeFlowers.length];

        return (
          <g key={fp.id} transform={`translate(${fp.x},${fp.y})`} filter="url(#ao-shadow)">
            {/* Petal ring (outer) */}
            {[0, 60, 120, 180, 240, 300].map((deg, pi) => (
              <ellipse
                key={pi}
                cx={Math.cos((deg + fp.rotate) * Math.PI / 180) * fp.r * 0.68}
                cy={Math.sin((deg + fp.rotate) * Math.PI / 180) * fp.r * 0.5}
                rx={fp.r * 0.44}
                ry={fp.r * 0.32}
                transform={`rotate(${deg + fp.rotate})`}
                fill={`url(#fgrad-${fDef?.key ?? "rose"})`}
                opacity={0.9}
              />
            ))}
            {/* Center disc */}
            <circle
              r={fp.r * 0.32}
              fill={lighten(fDef?.hex ?? "#B03A48", 30)}
              opacity={0.95}
            />
            {/* Center texture dots */}
            {[0, 72, 144, 216, 288].map((deg, di) => (
              <circle
                key={di}
                cx={Math.cos(deg * Math.PI / 180) * fp.r * 0.15}
                cy={Math.sin(deg * Math.PI / 180) * fp.r * 0.15}
                r={fp.r * 0.045}
                fill={darken(fDef?.hex ?? "#B03A48", 15)}
                opacity={0.6}
              />
            ))}
            {/* Specular highlight (top-left) */}
            <ellipse
              cx={-fp.r * 0.22}
              cy={-fp.r * 0.22}
              rx={fp.r * 0.28}
              ry={fp.r * 0.18}
              fill="url(#specular)"
            />
          </g>
        );
      })}

      {/* ── Ribbon band ── */}
      <rect
        x={wrapLeftX + 8}
        y={ribbonY - 7}
        width={wrapRightX - wrapLeftX - 16}
        height={14}
        rx={4}
        fill="url(#ribbon-grad)"
        opacity={0.95}
      />
      {/* Ribbon bow */}
      {/* Left wing */}
      <path
        d={`M ${cx} ${ribbonY} C ${cx - 28} ${ribbonY - 22} ${cx - 52} ${ribbonY - 18} ${cx - 40} ${ribbonY}`}
        fill={lighten(ribbonColor, 20)}
        opacity={0.95}
      />
      <path
        d={`M ${cx} ${ribbonY} C ${cx - 28} ${ribbonY + 22} ${cx - 52} ${ribbonY + 18} ${cx - 40} ${ribbonY}`}
        fill={ribbonColor}
        opacity={0.9}
      />
      {/* Right wing */}
      <path
        d={`M ${cx} ${ribbonY} C ${cx + 28} ${ribbonY - 22} ${cx + 52} ${ribbonY - 18} ${cx + 40} ${ribbonY}`}
        fill={lighten(ribbonColor, 20)}
        opacity={0.95}
      />
      <path
        d={`M ${cx} ${ribbonY} C ${cx + 28} ${ribbonY + 22} ${cx + 52} ${ribbonY + 18} ${cx + 40} ${ribbonY}`}
        fill={ribbonColor}
        opacity={0.9}
      />
      {/* Bow knot center */}
      <ellipse cx={cx} cy={ribbonY} rx={10} ry={8} fill={lighten(ribbonColor, 35)} opacity={0.98} />
      <ellipse cx={cx - 2} cy={ribbonY - 2} rx={4} ry={3} fill="white" opacity={0.35} />

      {/* ── Badge / info pill ── */}
      <rect x={W - 130} y={14} width={116} height={30} rx={15}
        fill="white" fillOpacity={0.72}
        style={{ backdropFilter: "blur(12px)" }}
      />
      <text
        x={W - 72} y={29}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fill="#3D2A20" fontFamily="Cairo, sans-serif"
      >
        {sizeName} · {flowerCount} زهرة
      </text>
    </svg>
  );
}

// ─── BouquetStudio ─────────────────────────────────────────────────────────────

export function BouquetStudio({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [design, setDesign] = useState<Design>(initial);
  const [step, setStep] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const historyRef = useRef<{ past: Design[]; future: Design[] }>({ past: [], future: [] });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // autosave
  useEffect(() => {
    try { localStorage.setItem("fn-bouquet-design", JSON.stringify(design)); } catch {}
  }, [design]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fn-bouquet-design");
      if (raw) setDesign({ ...initial, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const update = (patch: Partial<Design>) => {
    historyRef.current.past.push(design);
    historyRef.current.future = [];
    setDesign({ ...design, ...patch });
  };
  const undo = () => {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    historyRef.current.future.push(design);
    setDesign(prev);
  };
  const redo = () => {
    const nxt = historyRef.current.future.pop();
    if (!nxt) return;
    historyRef.current.past.push(design);
    setDesign(nxt);
  };

  const totals = useMemo(() => {
    const size = SIZES.find((s) => s.key === design.size)!;
    const flowersPrice = FLOWERS.reduce((sum, f) => sum + f.price * design.flowers[f.key], 0) * size.mult;
    const wrap = WRAPS.find((w) => w.key === design.wrap)?.price ?? 0;
    const vase = VASES.find((v) => v.key === design.vase)?.price ?? 0;
    const extras = design.extras.reduce((s, k) => s + (EXTRAS.find((e) => e.key === k)?.price ?? 0), 0);
    const subtotal = Math.round(flowersPrice + wrap + vase + extras);
    const delivery = subtotal > 500 ? 0 : 45;
    const discount = subtotal > 800 ? Math.round(subtotal * 0.08) : 0;
    const tax = Math.round((subtotal - discount) * 0.15);
    const total = subtotal + delivery + tax - discount;
    const flowerCount = Object.values(design.flowers).reduce((a, b) => a + b, 0);
    return { subtotal, delivery, discount, tax, total, flowerCount };
  }, [design]);

  const random = () => {
    const rnd = FLOWERS.reduce((a, f) => ({ ...a, [f.key]: Math.floor(Math.random() * 8) }), {} as Record<FlowerKey, number>);
    update({
      flowers: rnd,
      size: SIZES[Math.floor(Math.random() * SIZES.length)].key,
      wrap: WRAPS[Math.floor(Math.random() * WRAPS.length)].key,
      ribbon: RIBBONS[Math.floor(Math.random() * RIBBONS.length)].key,
    });
  };

  const finalize = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
  };

  if (!open) return null;

  const wrap = WRAPS.find((w) => w.key === design.wrap)!;
  const ribbon = RIBBONS.find((r) => r.key === design.ribbon)!;
  const activeFlowers = FLOWERS.filter((f) => design.flowers[f.key] > 0);

  const node = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-charcoal/40 backdrop-blur-md animate-reveal" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative flex-1 flex flex-col bg-cream m-2 sm:m-6 rounded-[28px] overflow-hidden shadow-luxe">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border/60 bg-background/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-rose-gold grid place-items-center">🌸</span>
            <div>
              <div className="eyebrow text-rose-gold">استوديو التنسيق</div>
              <div className="font-display text-lg">صمّم باقتك بنفسك</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBtn label="تراجع" onClick={undo}><Undo2 className="w-4 h-4" /></IconBtn>
            <IconBtn label="إعادة" onClick={redo}><Redo2 className="w-4 h-4" /></IconBtn>
            <IconBtn label="عشوائي" onClick={random}><Shuffle className="w-4 h-4" /></IconBtn>
            <button onClick={onClose} aria-label="إغلاق" className="w-10 h-10 grid place-items-center rounded-full hover:bg-blush/60 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden grid lg:grid-cols-[1.1fr_1fr]">
          {/* LEFT — Studio */}
          <div className="overflow-y-auto p-6 sm:p-10 border-l border-border/60">
            <StepNav step={step} setStep={setStep} />

            <div className="mt-8">
              {step === 0 && (
                <Section title="اختر أنواع الزهور">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {FLOWERS.map((f) => {
                      const active = design.flowers[f.key] > 0;
                      return (
                        <button
                          key={f.key}
                          onClick={() => update({ flowers: { ...design.flowers, [f.key]: active ? 0 : 3 } })}
                          className={`relative p-4 rounded-2xl border transition-all text-center ${
                            active ? "border-rose-gold bg-background shadow-soft" : "border-border bg-background/60 hover:bg-background"
                          }`}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden bg-cream mb-2">
                            <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-display text-sm">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground">{f.price} ج.م / زهرة</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 1 && (
                <Section title="حدد الكمية لكل نوع">
                  <div className="space-y-3">
                    {FLOWERS.map((f) => (
                      <div key={f.key} className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full grid place-items-center text-lg" style={{ background: `${f.hex}33` }}>{f.emoji}</span>
                          <div>
                            <div className="font-display">{f.name}</div>
                            <div className="text-xs text-muted-foreground">{f.price} ج.م</div>
                          </div>
                        </div>
                        <Counter
                          value={design.flowers[f.key]}
                          onChange={(v) => update({ flowers: { ...design.flowers, [f.key]: v } })}
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {step === 2 && (
                <Section title="حجم الباقة">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SIZES.map((s) => (
                      <PickCard key={s.key} active={design.size === s.key} onClick={() => update({ size: s.key })}>
                        <div className="font-display">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">×{s.mult}</div>
                      </PickCard>
                    ))}
                  </div>
                </Section>
              )}

              {step === 3 && (
                <Section title="نوع التغليف">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {WRAPS.map((w) => (
                      <PickCard key={w.key} active={design.wrap === w.key} onClick={() => update({ wrap: w.key })}>
                        <span className="w-10 h-10 rounded-full mx-auto mb-2 block border border-border" style={{ background: w.hex }} />
                        <div className="font-display text-sm">{w.name}</div>
                        <div className="text-xs text-muted-foreground">+{w.price} ج.م</div>
                      </PickCard>
                    ))}
                  </div>
                </Section>
              )}

              {step === 4 && (
                <Section title="لون الشريط">
                  <div className="flex flex-wrap gap-4">
                    {RIBBONS.map((r) => {
                      const active = design.ribbon === r.key;
                      return (
                        <button key={r.key} onClick={() => update({ ribbon: r.key })} className="flex flex-col items-center gap-2">
                          <span className={`w-14 h-14 rounded-full border-2 transition-all ${active ? "border-rose-gold scale-110" : "border-transparent"}`} style={{ background: r.hex }} />
                          <span className="text-xs">{r.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 5 && (
                <Section title="بطاقة الإهداء">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {CARDS.map((c) => (
                      <button key={c} onClick={() => update({ card: c })}
                        className={`px-4 py-2 rounded-full text-sm border transition ${design.card === c ? "bg-charcoal text-primary-foreground border-charcoal" : "bg-background border-border hover:border-rose-gold"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="اكتب رسالتك الشخصية..."
                    value={design.message}
                    onChange={(e) => update({ message: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold transition min-h-[120px] resize-none"
                  />
                </Section>
              )}

              {step === 6 && (
                <Section title="إضافات فاخرة">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EXTRAS.map((e) => {
                      const active = design.extras.includes(e.key);
                      return (
                        <PickCard key={e.key} active={active} onClick={() => update({ extras: active ? design.extras.filter((x) => x !== e.key) : [...design.extras, e.key] })}>
                          <div className="text-2xl">{e.emoji}</div>
                          <div className="font-display text-sm mt-1">{e.name}</div>
                          <div className="text-xs text-muted-foreground">+{e.price} ج.م</div>
                        </PickCard>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 7 && (
                <Section title="المزهرية">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {VASES.map((v) => (
                      <PickCard key={v.key} active={design.vase === v.key} onClick={() => update({ vase: v.key })}>
                        <div className="font-display text-sm">{v.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{v.price ? `+${v.price} ج.م` : "مجاناً"}</div>
                      </PickCard>
                    ))}
                  </div>
                </Section>
              )}

              {step === 8 && (
                <Section title="تفاصيل التوصيل">
                  <div className="grid gap-3">
                    <Input label="اسم المستلم" value={design.recipient} onChange={(v) => update({ recipient: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="تاريخ التوصيل" type="date" value={design.date} onChange={(v) => update({ date: v })} />
                      <Input label="وقت التوصيل" type="time" value={design.time} onChange={(v) => update({ time: v })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">ملاحظات خاصة</label>
                      <textarea
                        value={design.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </Section>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn-ghost-luxe disabled:opacity-30 disabled:pointer-events-none"
              >السابق</button>
              <button
                onClick={() => setStep(Math.min(SECTIONS.length - 1, step + 1))}
                disabled={step === SECTIONS.length - 1}
                className="btn-luxe disabled:opacity-40 disabled:pointer-events-none"
              >التالي</button>
            </div>
          </div>

          {/* RIGHT — Preview */}
          <div className="overflow-y-auto bg-gradient-to-br from-blush/40 via-cream to-cream p-6 sm:p-10 relative">
            {confetti && <Confetti />}

            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-luxe mb-6">
              <BouquetPreview
                activeFlowers={activeFlowers}
                flowerCounts={design.flowers}
                wrapColor={wrap.hex}
                wrapKey={design.wrap}
                ribbonColor={ribbon.hex}
                sizeName={SIZES.find((s) => s.key === design.size)?.name ?? ""}
                flowerCount={totals.flowerCount}
              />
            </div>

            {/* summary */}
            <div className="rounded-3xl bg-background border border-border p-6">
              <div className="font-display text-lg mb-4">ملخص الباقة</div>
              <div className="space-y-2 text-sm">
                <Row label="عدد الزهور" value={`${totals.flowerCount}`} />
                <Row label="التغليف" value={wrap.name} />
                <Row label="الشريط" value={ribbon.name} />
                <Row label="بطاقة" value={design.card} />
                <Row label="إضافات" value={design.extras.length ? `${design.extras.length} عنصر` : "—"} />
                <Row label="التوصيل المتوقع" value={design.date || "قريباً"} />
              </div>
              <div className="mt-5 pt-5 border-t border-border space-y-2 text-sm">
                <Row label="المجموع الفرعي" value={`${totals.subtotal} ج.م`} />
                <Row label="التوصيل" value={totals.delivery ? `${totals.delivery} ج.م` : "مجاني"} />
                {totals.discount > 0 && <Row label="خصم" value={`- ${totals.discount} ج.م`} accent />}
                <Row label="الضريبة" value={`${totals.tax} ج.م`} />
                <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                  <span className="font-display">الإجمالي</span>
                  <span className="font-display text-2xl">{totals.total} <span className="text-xs text-muted-foreground">ج.م</span></span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={finalize} className="btn-luxe !py-3 col-span-2">
                  <ShoppingBag className="w-4 h-4" /> أضف إلى السلة
                </button>
                <button className="rounded-full py-2.5 text-xs border border-border hover:border-rose-gold transition flex items-center justify-center gap-1">
                  <Save className="w-3.5 h-3.5" /> احفظ التصميم
                </button>
                <button className="rounded-full py-2.5 text-xs border border-border hover:border-rose-gold transition flex items-center justify-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> شارك
                </button>
                <button className="col-span-2 rounded-full py-2.5 text-xs border border-border hover:border-rose-gold transition flex items-center justify-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> كرّر هذا التصميم
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

function StepNav({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {SECTIONS.map((s, i) => (
        <button
          key={s}
          onClick={() => setStep(i)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs border transition ${
            step === i ? "bg-charcoal text-primary-foreground border-charcoal" : "bg-background border-border hover:border-rose-gold"
          }`}
        >
          {i + 1}. {s}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-reveal">
      <div className="font-display text-xl mb-5">{title}</div>
      {children}
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full border border-border grid place-items-center hover:border-rose-gold transition" aria-label="نقص">
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center font-display">{value}</span>
      <button onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-full border border-border grid place-items-center hover:border-rose-gold transition" aria-label="إضافة">
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function PickCard({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative p-4 rounded-2xl border transition-all text-center ${
        active ? "border-rose-gold bg-background shadow-soft -translate-y-0.5" : "border-border bg-background/60 hover:bg-background hover:-translate-y-0.5"
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

function IconBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold transition">
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-rose-gold transition"
      />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-rose-gold" : ""}>{value}</span>
    </div>
  );
}

function Confetti() {
  const bits = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {bits.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.4 + Math.random() * 1.2;
        const size = 6 + Math.random() * 8;
        const colors = ["#B03A48", "#C9A55C", "#F5C6D0", "#7B5EA7", "#E8C36A"];
        const bg = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`, top: "-10px", width: size, height: size, background: bg,
              animation: `confetti-fall ${dur}s ${delay}s ease-in forwards`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(540deg); opacity: 0; } }`}</style>
    </div>
  );
}
