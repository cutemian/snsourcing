'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Plus,
  Search,
  MessageCircle,
  Phone,
  Factory,
  ShieldCheck,
  Lock,
  Smartphone,
  Filter,
  X,
  SortDesc,
  LayoutGrid,
  BookOpen,
} from 'lucide-react'
import { useTransactions } from '@/hooks/use-transactions'
import { useAdminPin } from '@/hooks/use-admin-pin'
import { usePWAInstall } from '@/hooks/use-pwa-install'
import { PinModal } from '@/components/pin-modal'
import { EntryForm } from '@/components/entry-form'
import { TransactionCard } from '@/components/transaction-card'
import { StatsPanel } from '@/components/stats-panel'
import { ShowcaseTab } from '@/components/showcase-tab'
import type { Transaction } from '@/lib/types'

type ActiveTab = 'showcase' | 'ledger'
type FilterStatus = 'all' | 'outstanding' | 'clear'
type SortOrder = 'newest' | 'oldest' | 'highest'

export default function Page() {
  const { transactions, isLoaded, addTransaction, updateTransaction, deleteTransaction, totals } = useTransactions()
  const { isUnlocked, verifyPin, lock } = useAdminPin()
  const { isInstallable, triggerInstall } = usePWAInstall()

  const [activeTab, setActiveTab] = useState<ActiveTab>('showcase')
  const [showForm, setShowForm] = useState(false)
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null)
  const [pinOpen, setPinOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  // PIN gate
  const requestPin = useCallback(
    (callback: () => void) => {
      if (isUnlocked) {
        callback()
      } else {
        setPendingAction(() => callback)
        setPinOpen(true)
      }
    },
    [isUnlocked]
  )

  const handlePinSuccess = () => {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  const handleAddNew = () => {
    requestPin(() => {
      setEditingTxn(null)
      setShowForm(true)
    })
  }

  const handleSave = (data: Omit<Transaction, 'id' | 'created_at'>) => {
    if (editingTxn) {
      updateTransaction(editingTxn.id, data)
    } else {
      addTransaction(data)
    }
    setShowForm(false)
    setEditingTxn(null)
  }

  const handleEdit = (t: Transaction) => {
    setEditingTxn(t)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id)
  }

  // Filtered + sorted transactions
  const displayed = transactions
    .filter((t) => {
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !q ||
        t.customer_name.toLowerCase().includes(q) ||
        t.phone_number.includes(q) ||
        t.item_description.toLowerCase().includes(q)
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'outstanding' && t.remaining_balance > 0) ||
        (filterStatus === 'clear' && t.remaining_balance === 0)
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortOrder === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return b.total_bill - a.total_bill
    })

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="header-bar sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top row: brand + action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 pb-2">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.25 0.02 240), oklch(0.18 0.015 240))',
                  border: '1px solid oklch(0.35 0.018 240)',
                  boxShadow: '0 0 12px oklch(0.72 0.17 160 / 0.15)',
                }}
              >
                <Factory size={18} style={{ color: 'oklch(0.72 0.17 160)' }} />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest uppercase leading-tight" style={{ color: 'oklch(0.90 0.005 240)' }}>
                  SN Sourcing
                </h1>
                <p className="text-xs leading-tight" style={{ color: 'oklch(0.45 0.01 240)' }}>
                  Battery Components
                </p>
              </div>
            </div>

            {/* Right action buttons */}
            <div className="flex items-center gap-2">
              {/* Admin lock toggle — only relevant on ledger tab */}
              {activeTab === 'ledger' && (
                <button
                  onClick={() => {
                    if (isUnlocked) {
                      lock()
                      setShowForm(false)
                      setEditingTxn(null)
                    } else {
                      requestPin(() => {})
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all btn-metal"
                  title={isUnlocked ? 'Admin unlocked — click to lock' : 'Admin locked'}
                >
                  {isUnlocked ? (
                    <>
                      <ShieldCheck size={14} style={{ color: 'oklch(0.72 0.17 160)' }} />
                      <span className="hidden sm:inline" style={{ color: 'oklch(0.72 0.17 160)' }}>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span className="hidden sm:inline">Admin</span>
                    </>
                  )}
                </button>
              )}

              {/* WhatsApp */}
              <a
                href="https://wa.me/923376316941"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all btn-emerald"
              >
                <MessageCircle size={14} />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Call */}
              <a
                href="tel:03376316941"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all btn-metal"
              >
                <Phone size={14} />
                <span className="hidden sm:inline">Call</span>
              </a>
            </div>
          </div>

          {/* Tab row */}
          <nav className="flex items-center gap-1" role="tablist" aria-label="Main navigation">
            {(
              [
                { id: 'showcase', label: 'Showcase', icon: LayoutGrid },
                { id: 'ledger', label: 'Dispatch Ledger', icon: BookOpen },
              ] as { id: ActiveTab; label: string; icon: typeof LayoutGrid }[]
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── TAB CONTENT ── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'showcase' ? (
            <motion.div
              key="showcase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ShowcaseTab />
            </motion.div>
          ) : (
            <motion.div
              key="ledger"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto w-full px-4 py-6 flex flex-col gap-6"
            >
              {/* PWA Install Banner */}
              <AnimatePresence>
                {isInstallable && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="pwa-pulse rounded-2xl p-4 flex items-center justify-between gap-4"
                    style={{ background: 'oklch(0.72 0.17 160 / 0.08)', border: '1px solid oklch(0.72 0.17 160 / 0.3)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} style={{ color: 'oklch(0.72 0.17 160)' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'oklch(0.85 0.005 240)' }}>Install App on Mobile</p>
                        <p className="text-xs" style={{ color: 'oklch(0.55 0.01 240)' }}>Add SN Sourcing Khata to your home screen</p>
                      </div>
                    </div>
                    <button onClick={triggerInstall} className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold btn-emerald">
                      Install
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats */}
              <section aria-label="Summary statistics">
                <StatsPanel totals={totals} />
              </section>

              {/* Controls */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all btn-emerald"
                  >
                    <Plus size={16} />
                    New Entry
                  </button>

                  <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'oklch(0.42 0.01 240)' }} />
                    <input
                      className="neo-input w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
                      type="text"
                      placeholder="Search customer, phone, item..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                        style={{ color: 'oklch(0.45 0.01 240)' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter size={13} style={{ color: 'oklch(0.42 0.01 240)' }} />
                  {(['all', 'outstanding', 'clear'] as FilterStatus[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                      style={
                        filterStatus === f
                          ? { background: 'oklch(0.30 0.018 240)', border: '1px solid oklch(0.45 0.02 240)', color: 'oklch(0.90 0.005 240)' }
                          : { background: 'oklch(0.16 0.012 240)', border: '1px solid oklch(0.25 0.012 240)', color: 'oklch(0.52 0.01 240)' }
                      }
                    >
                      {f === 'all' ? 'All' : f === 'outstanding' ? 'Outstanding' : 'Cleared'}
                    </button>
                  ))}

                  <div className="ml-auto flex items-center gap-1.5">
                    <SortDesc size={13} style={{ color: 'oklch(0.42 0.01 240)' }} />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      className="neo-input text-xs rounded-lg px-2 py-1.5 cursor-pointer"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="highest">Highest bill</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Entry Form */}
              <AnimatePresence>
                {showForm && (
                  <EntryForm
                    onSave={handleSave}
                    onCancel={() => {
                      setShowForm(false)
                      setEditingTxn(null)
                    }}
                    initialData={editingTxn}
                  />
                )}
              </AnimatePresence>

              {/* Transaction list */}
              <section aria-label="Transaction ledger">
                {!isLoaded ? (
                  <div className="flex items-center justify-center py-16">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'oklch(0.72 0.17 160)' }}
                    />
                  </div>
                ) : displayed.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-4"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'oklch(0.17 0.015 240)', border: '1px solid oklch(0.28 0.015 240)' }}
                    >
                      <Factory size={32} style={{ color: 'oklch(0.38 0.015 240)' }} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'oklch(0.55 0.01 240)' }}>
                        {searchQuery || filterStatus !== 'all' ? 'No matching transactions' : 'No transactions yet'}
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'oklch(0.42 0.01 240)' }}>
                        {searchQuery || filterStatus !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'Tap "New Entry" to add your first record'}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs font-semibold" style={{ color: 'oklch(0.48 0.01 240)' }}>
                      Showing {displayed.length} of {transactions.length} record{transactions.length !== 1 ? 's' : ''}
                    </p>
                    <AnimatePresence mode="popLayout">
                      {displayed.map((t, i) => (
                        <TransactionCard
                          key={t.id}
                          transaction={t}
                          index={i}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isUnlocked={isUnlocked}
                          onRequestPin={requestPin}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center" style={{ borderTop: '1px solid oklch(0.22 0.012 240)' }}>
        <p className="text-xs" style={{ color: 'oklch(0.38 0.01 240)' }}>
          SN Sourcing — Battery Plates &amp; Lead Components · Digital Khata v2.0
        </p>
      </footer>

      {/* PIN Modal */}
      <PinModal
        isOpen={pinOpen}
        onClose={() => {
          setPinOpen(false)
          setPendingAction(null)
        }}
        onSuccess={handlePinSuccess}
        verifyPin={verifyPin}
      />
    </div>
  )
}
