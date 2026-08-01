'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Phone, Zap, Shield, Clock, Users, ChevronRight, Layers, Cpu, Activity } from 'lucide-react'

const STATS = [
  { value: '10+', label: 'Years in Business' },
  { value: '200+', label: 'Active Clients' },
  { value: '500K+', label: 'Components Sourced' },
  { value: '99%', label: 'On-Time Delivery' },
]

const PRODUCTS = [
  {
    id: 'hot',
    code: 'BP-HP-001',
    name: 'Hot Plates',
    urdu: 'Garm Plate',
    type: 'Positive Grid',
    alloy: 'Lead-Calcium Alloy',
    icon: Zap,
    accent: 'oklch(0.72 0.20 25)',
    accentGlow: 'oklch(0.72 0.20 25 / 0.20)',
    accentBorder: 'oklch(0.72 0.20 25 / 0.35)',
    specs: ['High-purity lead-calcium', 'Superior corrosion resistance', 'Optimised for UPS / standby'],
    badge: 'POSITIVE',
  },
  {
    id: 'cold',
    code: 'BP-CP-002',
    name: 'Cold Plates',
    urdu: 'Thandi Plate',
    type: 'Negative Grid',
    alloy: 'Lead-Antimony Alloy',
    icon: Shield,
    accent: 'oklch(0.78 0.14 210)',
    accentGlow: 'oklch(0.78 0.14 210 / 0.20)',
    accentBorder: 'oklch(0.78 0.14 210 / 0.35)',
    specs: ['Lead-antimony formulation', 'Deep-cycle performance', 'Industrial battery grade'],
    badge: 'NEGATIVE',
  },
  {
    id: 'sep',
    code: 'MS-PE-003',
    name: 'Microporous Separators',
    urdu: null,
    type: 'AGM / PE Microporous',
    alloy: 'Polyethylene Matrix',
    icon: Layers,
    accent: 'oklch(0.72 0.17 160)',
    accentGlow: 'oklch(0.72 0.17 160 / 0.20)',
    accentBorder: 'oklch(0.72 0.17 160 / 0.35)',
    specs: ['Microporous PE membrane', 'Low electrical resistance', 'AGM & flooded compatible'],
    badge: 'SEPARATOR',
  },
]

/* ── Animated wireframe battery SVG ───────────────────────── */
function BatteryWireframe() {
  const pathRef = useRef<SVGPathElement>(null)

  return (
    <div className="relative w-full flex items-center justify-center select-none" style={{ height: 320 }}>
      {/* Ambient glow layers */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: 340, height: 200,
          background: 'radial-gradient(ellipse, oklch(0.65 0.14 210 / 0.18) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute rounded-full blur-2xl pointer-events-none"
        style={{
          width: 180, height: 180,
          background: 'radial-gradient(ellipse, oklch(0.78 0.14 210 / 0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Battery wireframe SVG */}
      <motion.svg
        className="battery-float relative z-10"
        viewBox="0 0 320 260"
        width="320"
        height="260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid cell plates — repeated slabs */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 52 + i * 44
          return (
            <g key={i}>
              {/* Front face of plate */}
              <rect x={x} y={68} width={26} height={130} rx={2}
                stroke={i % 2 === 0 ? 'oklch(0.72 0.20 25 / 0.70)' : 'oklch(0.78 0.14 210 / 0.70)'}
                strokeWidth={1.2} fill={i % 2 === 0 ? 'oklch(0.72 0.20 25 / 0.04)' : 'oklch(0.78 0.14 210 / 0.04)'} />
              {/* Vertical grid lines on plate */}
              {[6, 13, 20].map((dx) => (
                <line key={dx} x1={x + dx} y1={76} x2={x + dx} y2={190}
                  stroke={i % 2 === 0 ? 'oklch(0.72 0.20 25 / 0.35)' : 'oklch(0.78 0.14 210 / 0.35)'}
                  strokeWidth={0.7} />
              ))}
              {/* Horizontal grid lines */}
              {[20, 40, 60, 80, 100].map((dy) => (
                <line key={dy} x1={x + 2} y1={76 + dy} x2={x + 24} y2={76 + dy}
                  stroke={i % 2 === 0 ? 'oklch(0.72 0.20 25 / 0.28)' : 'oklch(0.78 0.14 210 / 0.28)'}
                  strokeWidth={0.6} />
              ))}
              {/* Tab/lug at top */}
              <rect x={x + 8} y={55} width={10} height={14} rx={1}
                stroke={i % 2 === 0 ? 'oklch(0.72 0.20 25 / 0.85)' : 'oklch(0.78 0.14 210 / 0.85)'}
                strokeWidth={1.2} fill="none" />
            </g>
          )
        })}

        {/* Outer battery case — front */}
        <rect x={36} y={52} width={248} height={158} rx={6}
          stroke="oklch(0.58 0.04 240 / 0.70)" strokeWidth={1.5} fill="none" />

        {/* Isometric top face */}
        <path d="M36 52 L60 28 L308 28 L284 52 Z"
          stroke="oklch(0.58 0.04 240 / 0.55)" strokeWidth={1.2} fill="oklch(0.22 0.015 240 / 0.35)" />

        {/* Isometric right face */}
        <path d="M284 52 L308 28 L308 186 L284 210 Z"
          stroke="oklch(0.58 0.04 240 / 0.45)" strokeWidth={1.2} fill="oklch(0.18 0.015 240 / 0.30)" />

        {/* Terminal posts */}
        <rect x={72} y={36} width={20} height={18} rx={3}
          stroke="oklch(0.72 0.20 25 / 0.90)" strokeWidth={1.5} fill="oklch(0.72 0.20 25 / 0.08)" />
        <text x={82} y={48} textAnchor="middle" fontSize={7} fill="oklch(0.72 0.20 25 / 0.85)" fontFamily="monospace">+</text>

        <rect x={228} y={36} width={20} height={18} rx={3}
          stroke="oklch(0.78 0.14 210 / 0.90)" strokeWidth={1.5} fill="oklch(0.78 0.14 210 / 0.08)" />
        <text x={238} y={48} textAnchor="middle" fontSize={7} fill="oklch(0.78 0.14 210 / 0.85)" fontFamily="monospace">−</text>

        {/* Separator lines between plates */}
        {[1, 2, 3, 4].map((i) => (
          <line key={i} x1={50 + i * 44} y1={68} x2={50 + i * 44} y2={198}
            stroke="oklch(0.72 0.17 160 / 0.40)" strokeWidth={0.8} strokeDasharray="3 3" />
        ))}

        {/* Scan line overlay */}
        <rect
          ref={pathRef as React.RefObject<SVGRectElement>}
          className="scan-line"
          x={36} y={52} width={248} height={12}
          fill="url(#scanGrad)"
          style={{ opacity: 0.4 }}
        />
        <defs>
          <linearGradient id="scanGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 210)" stopOpacity={0} />
            <stop offset="50%" stopColor="oklch(0.78 0.14 210)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="oklch(0.78 0.14 210)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Corner brackets — industrial HUD style */}
        {[
          [36, 52], [284, 52], [36, 210], [284, 210]
        ].map(([cx, cy], i) => {
          const dx = i % 2 === 0 ? 1 : -1
          const dy = i < 2 ? 1 : -1
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + dx * 14} y2={cy} stroke="oklch(0.78 0.14 210 / 0.9)" strokeWidth={1.5} />
              <line x1={cx} y1={cy} x2={cx} y2={cy + dy * 14} stroke="oklch(0.78 0.14 210 / 0.9)" strokeWidth={1.5} />
            </g>
          )
        })}

        {/* HUD labels */}
        <text x={36} y={230} fontSize={8} fill="oklch(0.55 0.04 240 / 0.70)" fontFamily="monospace">BATTERY_STACK_v2.4</text>
        <text x={232} y={230} fontSize={7} fill="oklch(0.55 0.04 240 / 0.55)" fontFamily="monospace">SN-SOURCING</text>
        <text x={232} y={240} fontSize={6.5} fill="oklch(0.45 0.03 240 / 0.50)" fontFamily="monospace">CHN-IMP · LIVE</text>
      </motion.svg>

      {/* Floating data tags */}
      <div className="absolute top-4 left-4 font-mono text-xs pointer-events-none"
        style={{ color: 'oklch(0.78 0.14 210 / 0.75)' }}>
        <div>PLATES: 10 CELLS</div>
        <div className="mt-0.5" style={{ color: 'oklch(0.55 0.04 240 / 0.60)' }}>AMP: 100–200Ah</div>
      </div>
      <div className="absolute top-4 right-4 font-mono text-xs text-right pointer-events-none"
        style={{ color: 'oklch(0.72 0.20 25 / 0.75)' }}>
        <div>STATUS: ACTIVE</div>
        <div className="mt-0.5" style={{ color: 'oklch(0.55 0.04 240 / 0.60)' }}>QC: PASSED</div>
      </div>
    </div>
  )
}

/* ── Product Card ─────────────────────────────────────────── */
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const Icon = product.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="product-card rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Top accent stripe */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${product.accent}, transparent)` }} />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: product.accentGlow, border: `1px solid ${product.accentBorder}` }}
          >
            <Icon size={22} style={{ color: product.accent }} />
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full border tracking-widest"
            style={{ color: product.accent, borderColor: product.accentBorder, background: product.accentGlow }}
          >
            {product.badge}
          </span>
        </div>

        {/* Name */}
        <div>
          <p className="text-xs font-mono mb-1" style={{ color: 'oklch(0.42 0.015 240)' }}>{product.code}</p>
          <h3 className="text-xl font-black leading-tight" style={{ color: 'oklch(0.92 0.005 240)' }}>
            {product.name}
          </h3>
          {product.urdu && (
            <p className="text-sm mt-0.5 font-semibold" style={{ color: product.accent }}>
              {product.urdu}
            </p>
          )}
          <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 240)' }}>
            {product.type} · {product.alloy}
          </p>
        </div>

        {/* Specs list */}
        <ul className="flex flex-col gap-2 flex-1">
          {product.specs.map((s) => (
            <li key={s} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: product.accent }} />
              <span className="text-sm" style={{ color: 'oklch(0.65 0.008 240)' }}>{s}</span>
            </li>
          ))}
        </ul>

        {/* Enquire CTA */}
        <a
          href="https://wa.me/923376316941"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group"
          style={{
            background: product.accentGlow,
            border: `1px solid ${product.accentBorder}`,
            color: product.accent,
          }}
        >
          <span>Enquire on WhatsApp</span>
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}

/* ── Main Showcase Tab ────────────────────────────────────── */
export function ShowcaseTab() {
  const [tick, setTick] = useState(0)

  // Blinking cursor effect for hero
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col">
      {/* ── HERO SECTION ── */}
      <section
        className="relative overflow-hidden hero-grid"
        style={{ minHeight: 560 }}
      >
        {/* Ambient glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600, height: 400,
            background: 'radial-gradient(ellipse, oklch(0.65 0.14 210 / 0.12) 0%, transparent 65%)',
            top: -60, left: '30%', transform: 'translateX(-50%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400, height: 300,
            background: 'radial-gradient(ellipse, oklch(0.72 0.17 160 / 0.07) 0%, transparent 65%)',
            bottom: 0, right: '10%',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left: copy */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.72 0.17 160)', boxShadow: '0 0 8px oklch(0.72 0.17 160 / 0.7)' }} />
              <span className="text-xs font-bold tracking-widest uppercase font-mono" style={{ color: 'oklch(0.72 0.17 160)' }}>
                China-Imported · Quality Certified
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-balance" style={{ color: 'oklch(0.95 0.005 240)' }}>
              SN Sourcing —{' '}
              <span style={{ color: 'oklch(0.78 0.14 210)' }}>Precision</span>{' '}
              Battery Components &amp; Separators
            </h1>

            {/* Sub */}
            <p className="text-base leading-relaxed max-w-lg" style={{ color: 'oklch(0.62 0.01 240)' }}>
              {"Pakistan's trusted importer of Hot Plates, Cold Plates, and Microporous Separators for UPS and Industrial battery manufacturing."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href="https://wa.me/923376316941"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all btn-emerald"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
              <a
                href="tel:03376316941"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all btn-metal"
              >
                <Phone size={16} />
                03376316941
              </a>
            </div>

            {/* Terminal readout */}
            <div
              className="mt-2 font-mono text-xs px-4 py-3 rounded-xl border w-fit"
              style={{ background: 'oklch(0.13 0.012 240)', border: '1px solid oklch(0.26 0.018 240)', color: 'oklch(0.72 0.17 160)' }}
            >
              <span style={{ color: 'oklch(0.42 0.015 240)' }}>$ </span>
              sn-sourcing --status
              <span style={{ opacity: tick % 2 === 0 ? 1 : 0 }}>_</span>
              <br />
              <span style={{ color: 'oklch(0.55 0.04 240)' }}>→ </span>
              STOCK: AVAILABLE · DISPATCH: 24-48h
            </div>
          </div>

          {/* Right: 3D wireframe */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <BatteryWireframe />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section
        style={{ borderTop: '1px solid oklch(0.22 0.012 240)', borderBottom: '1px solid oklch(0.22 0.012 240)', background: 'oklch(0.14 0.012 240)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex flex-col items-center justify-center py-4 gap-1 text-center"
              >
                <span className="text-2xl font-black font-mono" style={{ color: 'oklch(0.78 0.14 210)' }}>{value}</span>
                <span className="text-xs font-semibold tracking-wide" style={{ color: 'oklch(0.52 0.01 240)' }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATALOGUE ── */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: 'oklch(0.55 0.04 240)' }} />
            <span className="text-xs font-bold tracking-widest uppercase font-mono" style={{ color: 'oklch(0.48 0.015 240)' }}>
              Product Catalogue
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-balance" style={{ color: 'oklch(0.92 0.005 240)' }}>
            China-Sourced Components,{' '}
            <span style={{ color: 'oklch(0.78 0.14 210)' }}>Industrial Grade</span>
          </h2>
          <p className="text-sm max-w-xl" style={{ color: 'oklch(0.58 0.01 240)' }}>
            Every component is sourced directly from certified Chinese manufacturers and quality-checked before dispatch across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section
        className="w-full py-14"
        style={{ background: 'oklch(0.14 0.012 240)', borderTop: '1px solid oklch(0.22 0.012 240)' }}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-10">
          <div className="flex flex-col gap-2 text-center">
            <span className="text-xs font-bold tracking-widest uppercase font-mono" style={{ color: 'oklch(0.48 0.015 240)' }}>
              Why Choose SN Sourcing
            </span>
            <h2 className="text-2xl font-black" style={{ color: 'oklch(0.92 0.005 240)' }}>
              Built for Pakistani Battery Manufacturers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Activity, title: 'Direct China Import', desc: 'No middlemen. Sourced directly from certified factories in China at best prices.', color: 'oklch(0.78 0.14 210)' },
              { icon: Clock, title: '24–48h Dispatch', desc: 'Fast turnaround with ready stock for hot plates, cold plates, and separators.', color: 'oklch(0.72 0.17 160)' },
              { icon: Users, title: '200+ Clients', desc: 'Trusted by UPS assemblers, industrial battery makers, and repair workshops nationwide.', color: 'oklch(0.72 0.20 25)' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="industrial-card rounded-2xl p-6 flex flex-col gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color.replace(')', ' / 0.12)')}`, border: `1px solid ${color.replace(')', ' / 0.30)')}` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'oklch(0.90 0.005 240)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.58 0.01 240)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-6xl mx-auto w-full px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="industrial-card rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ borderColor: 'oklch(0.38 0.04 210)', boxShadow: '0 0 40px oklch(0.65 0.14 210 / 0.10)' }}
        >
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-black" style={{ color: 'oklch(0.92 0.005 240)' }}>
              Need a Quote or Sample?
            </h3>
            <p className="text-sm" style={{ color: 'oklch(0.58 0.01 240)' }}>
              Reach us directly on WhatsApp for pricing, samples, and bulk orders.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap shrink-0">
            <a
              href="https://wa.me/923376316941"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all btn-emerald"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
            <a
              href="tel:03376316941"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all btn-metal"
            >
              <Phone size={16} />
              Call Now
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
