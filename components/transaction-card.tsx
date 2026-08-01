'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, Pencil, Trash2, Package, Calendar, Hash, TrendingUp } from 'lucide-react'
import type { Transaction } from '@/lib/types'

interface TransactionCardProps {
  transaction: Transaction
  index: number
  onEdit: (t: Transaction) => void
  onDelete: (id: string) => void
  isUnlocked: boolean
  onRequestPin: (callback: () => void) => void
}

function formatPKR(amount: number): string {
  return 'PKR ' + amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function TransactionCard({ transaction: t, index, onEdit, onDelete, isUnlocked, onRequestPin }: TransactionCardProps) {
  const isOutstanding = t.remaining_balance > 0

  const handleEdit = () => {
    if (isUnlocked) {
      onEdit(t)
    } else {
      onRequestPin(() => onEdit(t))
    }
  }

  const handleDelete = () => {
    if (isUnlocked) {
      onDelete(t.id)
    } else {
      onRequestPin(() => onDelete(t.id))
    }
  }

  const handleWhatsAppShare = () => {
    // Strip spaces, hyphens, and any leading zero, then prepend Pakistan country code 92
    const sanitizedNumber = '92' + t.phone_number.replace(/[\s\-]/g, '').replace(/^0+/, '')

    const msg = encodeURIComponent(
      `*SN Sourcing — Transaction Statement*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📅 Date: ${formatDate(t.created_at)}\n` +
      `👤 Customer: ${t.customer_name}\n` +
      `📦 Item: ${t.item_description}\n` +
      `🔢 Quantity: ${t.quantity}\n` +
      `💰 Rate: ${formatPKR(t.rate)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Total Bill: *${formatPKR(t.total_bill)}*\n` +
      `✅ Amount Paid: *${formatPKR(t.amount_paid)}*\n` +
      `${isOutstanding ? '🔴' : '🟢'} Remaining: *${isOutstanding ? formatPKR(t.remaining_balance) : 'CLEAR — Fully Paid'}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_SN Sourcing | Battery Plates & Lead Components_`
    )
    window.open(`https://wa.me/${sanitizedNumber}?text=${msg}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="industrial-card rounded-2xl overflow-hidden"
    >
      {/* Status stripe */}
      <div
        className="h-[3px] w-full"
        style={{
          background: isOutstanding
            ? 'linear-gradient(90deg, transparent, oklch(0.62 0.22 25), transparent)'
            : 'linear-gradient(90deg, transparent, oklch(0.72 0.17 160), transparent)',
        }}
      />

      <div className="p-5">
        {/* Header row: customer name + status badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight truncate" style={{ color: 'oklch(0.92 0.005 240)' }}>
              {t.customer_name}
            </h3>
            <a
              href={`tel:${t.phone_number}`}
              className="text-sm font-mono flex items-center gap-1.5 mt-0.5 transition-opacity hover:opacity-80"
              style={{ color: 'oklch(0.60 0.01 240)' }}
            >
              <Phone size={12} />
              {t.phone_number}
            </a>
          </div>
          <span
            className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border tracking-wide ${isOutstanding ? 'badge-outstanding' : 'badge-clear'}`}
          >
            {isOutstanding ? 'OUTSTANDING' : 'CLEAR'}
          </span>
        </div>

        {/* Item + Date row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Package size={13} style={{ color: 'oklch(0.45 0.012 240)' }} />
            <span className="text-sm" style={{ color: 'oklch(0.70 0.008 240)' }}>{t.item_description}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: 'oklch(0.40 0.012 240)' }} />
            <span className="text-xs" style={{ color: 'oklch(0.55 0.01 240)' }}>{formatDate(t.created_at)}</span>
          </div>
        </div>

        {/* Financials grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
          {[
            { label: 'Qty', value: t.quantity.toString(), icon: Hash },
            { label: 'Rate', value: formatPKR(t.rate), icon: TrendingUp },
            { label: 'Total Bill', value: formatPKR(t.total_bill), icon: null },
            { label: 'Amount Paid', value: formatPKR(t.amount_paid), icon: null },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
              style={{ background: 'oklch(0.14 0.012 240)', border: '1px solid oklch(0.22 0.012 240)' }}
            >
              <div className="flex items-center gap-1">
                {Icon && <Icon size={11} style={{ color: 'oklch(0.42 0.012 240)' }} />}
                <span className="text-xs" style={{ color: 'oklch(0.48 0.01 240)' }}>{label}</span>
              </div>
              <span className="text-sm font-bold font-mono leading-tight" style={{ color: 'oklch(0.88 0.005 240)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Remaining balance highlight */}
        <div
          className={`rounded-xl px-4 py-3 flex items-center justify-between mb-4 border ${isOutstanding ? 'badge-outstanding' : 'badge-clear'}`}
          style={{ background: isOutstanding ? 'oklch(0.62 0.22 25 / 0.07)' : 'oklch(0.72 0.17 160 / 0.07)' }}
        >
          <span className="text-xs font-semibold tracking-wide uppercase">Remaining Balance</span>
          <span className="text-base font-bold font-mono">
            {isOutstanding ? formatPKR(t.remaining_balance) : 'FULLY PAID'}
          </span>
        </div>

        {/* Action bar */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all btn-emerald"
          >
            <MessageCircle size={14} />
            Share
          </button>

          {/* Direct Call */}
          <a
            href={`tel:${t.phone_number}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all btn-metal"
          >
            <Phone size={14} />
            Call
          </a>

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all btn-metal"
          >
            <Pencil size={14} />
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all btn-crimson"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}
