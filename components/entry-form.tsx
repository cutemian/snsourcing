'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, Package, Hash, DollarSign, CreditCard, Calculator, Save, X, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import type { Transaction } from '@/lib/types'

// Supabase Client Initialisation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface EntryFormProps {
  onSave: (data: Omit<Transaction, 'id' | 'created_at'>) => void
  onCancel: () => void
  initialData?: Transaction | null
}

const emptyForm = {
  customer_name: '',
  phone_number: '',
  item_description: '',
  quantity: '',
  rate: '',
  amount_paid: '',
}

export function EntryForm({ onSave, onCancel, initialData }: EntryFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        customer_name: initialData.customer_name,
        phone_number: initialData.phone_number,
        item_description: initialData.item_description,
        quantity: String(initialData.quantity),
        rate: String(initialData.rate),
        amount_paid: String(initialData.amount_paid),
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialData])

  const qty = parseFloat(form.quantity) || 0
  const rate = parseFloat(form.rate) || 0
  const paid = parseFloat(form.amount_paid) || 0
  const totalBill = qty * rate
  const remaining = Math.max(0, totalBill - paid)
  const isOutstanding = remaining > 0

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.customer_name.trim() || !form.phone_number.trim() || !form.item_description.trim()) return
    if (qty <= 0 || rate <= 0) return

    setLoading(true)

    const payload = {
      customer_name: form.customer_name.trim(),
      phone_number: form.phone_number.trim(),
      item_description: form.item_description.trim(),
      quantity: qty,
      rate: rate,
      total_bill: totalBill,
      amount_paid: paid,
    }

    try {
      if (initialData?.id) {
        // Update Existing Record in Supabase
        const { error } = await supabase
          .from('transactions')
          .update(payload)
          .eq('id', initialData.id)

        if (error) console.error('Supabase Update Error:', error)
      } else {
        // Insert New Record into Supabase
        const { error } = await supabase
          .from('transactions')
          .insert([payload])

        if (error) console.error('Supabase Insert Error:', error)
      }
    } catch (err) {
      console.error('Database connection failed:', err)
    } finally {
      setLoading(false)
      // Local state sync callback
      onSave({
        ...payload,
        remaining_balance: remaining,
      })
    }
  }

  const fields = [
    { key: 'customer_name', label: 'Customer Name', icon: User, placeholder: 'e.g. Muhammad Ali', type: 'text', inputMode: 'text' as const },
    { key: 'phone_number', label: 'Phone Number', icon: Phone, placeholder: 'e.g. 03376316941', type: 'tel', inputMode: 'tel' as const },
    { key: 'item_description', label: 'Item Description', icon: Package, placeholder: 'e.g. Battery Plates 100Ah', type: 'text', inputMode: 'text' as const },
    { key: 'quantity', label: 'Quantity', icon: Hash, placeholder: '0', type: 'number', inputMode: 'decimal' as const },
    { key: 'rate', label: 'Rate (PKR)', icon: DollarSign, placeholder: '0.00', type: 'number', inputMode: 'decimal' as const },
    { key: 'amount_paid', label: 'Amount Paid (PKR)', icon: CreditCard, placeholder: '0.00', type: 'number', inputMode: 'decimal' as const },
  ]

  const isValid = form.customer_name.trim() && form.phone_number.trim() && form.item_description.trim() && qty > 0 && rate > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
      className="industrial-card rounded-2xl overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.17 160), transparent)' }} />

      <div className="p-5 pb-0">
        <h2 className="text-base font-bold tracking-wide mb-4" style={{ color: 'oklch(0.90 0.005 240)' }}>
          {initialData ? 'Edit Transaction' : 'New Transaction Entry'}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, icon: Icon, placeholder, type, inputMode }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'oklch(0.55 0.01 240)' }}>
                {label}
              </label>
              <div className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'oklch(0.45 0.012 240)' }} />
                <input
                  className="neo-input w-full pl-9 pr-3 py-2.5 rounded-lg text-sm"
                  type={type}
                  inputMode={inputMode}
                  placeholder={placeholder}
                  value={form[key as keyof typeof emptyForm]}
                  onChange={(e) => handleChange(key as keyof typeof emptyForm, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-calculated results */}
      <div className="mx-5 mt-4 rounded-xl p-4" style={{ background: 'oklch(0.14 0.012 240)', border: '1px solid oklch(0.25 0.015 240)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={14} style={{ color: 'oklch(0.55 0.01 240)' }} />
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'oklch(0.55 0.01 240)' }}>Auto Calculation</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs" style={{ color: 'oklch(0.50 0.01 240)' }}>Total Bill</span>
            <span className="text-lg font-bold font-mono" style={{ color: 'oklch(0.88 0.005 240)' }}>
              PKR {totalBill.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-xs" style={{ color: 'oklch(0.50 0.01 240)' }}>Remaining Balance</span>
            <span
              className={`text-lg font-bold font-mono px-3 py-0.5 rounded-lg border ${isOutstanding ? 'badge-outstanding' : 'badge-clear'}`}
            >
              {isOutstanding ? 'PKR ' + remaining.toLocaleString('en-PK') : 'CLEAR'}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 p-5">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all btn-metal disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-emerald disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Save Entry'}
        </button>
      </div>
    </motion.div>
  )
}
