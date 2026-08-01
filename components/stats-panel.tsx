'use client'

import { motion } from 'framer-motion'
import { ReceiptText, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react'

interface StatsPanelProps {
  totals: {
    totalBill: number
    totalPaid: number
    totalOutstanding: number
    count: number
    clearedCount: number
    outstandingCount: number
  }
}

function formatPKR(n: number) {
  if (n >= 1_000_000) return 'PKR ' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return 'PKR ' + (n / 1_000).toFixed(1) + 'K'
  return 'PKR ' + n.toLocaleString('en-PK')
}

export function StatsPanel({ totals }: StatsPanelProps) {
  const stats = [
    {
      label: 'Total Transactions',
      value: totals.count.toString(),
      sub: `${totals.clearedCount} cleared · ${totals.outstandingCount} outstanding`,
      icon: ReceiptText,
      color: 'oklch(0.65 0.01 240)',
    },
    {
      label: 'Total Collections',
      value: formatPKR(totals.totalPaid),
      sub: 'Amount received',
      icon: CheckCircle2,
      color: 'oklch(0.72 0.17 160)',
    },
    {
      label: 'Outstanding Balance',
      value: formatPKR(totals.totalOutstanding),
      sub: 'Pending recovery',
      icon: AlertCircle,
      color: totals.totalOutstanding > 0 ? 'oklch(0.72 0.20 25)' : 'oklch(0.72 0.17 160)',
    },
    {
      label: 'Total Business',
      value: formatPKR(totals.totalBill),
      sub: 'Gross volume',
      icon: DollarSign,
      color: 'oklch(0.62 0.05 240)',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, sub, icon: Icon, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.06 }}
          className="stat-card rounded-2xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide" style={{ color: 'oklch(0.52 0.01 240)' }}>
              {label}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Icon size={15} style={{ color }} />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold font-mono leading-tight" style={{ color: 'oklch(0.92 0.005 240)' }}>
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.48 0.01 240)' }}>{sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
