'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, ShieldAlert, Delete } from 'lucide-react'

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  verifyPin: (pin: string) => boolean
}

const NUM_DIGITS = 7

export function PinModal({ isOpen, onClose, onSuccess, verifyPin }: PinModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(NUM_DIGITS).fill(''))
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setDigits(Array(NUM_DIGITS).fill(''))
      setError(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleKeypadPress = (val: string) => {
    setError(false)
    setDigits((prev) => {
      const filled = prev.filter((d) => d !== '').length
      if (val === 'del') {
        const last = [...prev]
        for (let i = last.length - 1; i >= 0; i--) {
          if (last[i] !== '') { last[i] = ''; break }
        }
        return last
      }
      if (filled >= NUM_DIGITS) return prev
      const next = [...prev]
      next[filled] = val
      return next
    })
  }

  // Auto-submit when all digits filled
  useEffect(() => {
    const filledCount = digits.filter((d) => d !== '').length
    if (filledCount === NUM_DIGITS) {
      const pin = digits.join('')
      const ok = verifyPin(pin)
      if (ok) {
        onSuccess()
        onClose()
      } else {
        setShaking(true)
        setError(true)
        setTimeout(() => {
          setShaking(false)
          setDigits(Array(NUM_DIGITS).fill(''))
        }, 700)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits])

  const filledCount = digits.filter((d) => d !== '').length

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm rounded-2xl industrial-card overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={shaking
              ? { scale: 1, opacity: 1, x: [0, -10, 10, -8, 8, -4, 4, 0] }
              : { scale: 1, opacity: 1, x: 0, y: 0 }
            }
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: shaking ? 0.5 : 0.25, type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Top accent line */}
            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.17 160), transparent)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.72 0.17 160 / 0.12)', border: '1px solid oklch(0.72 0.17 160 / 0.3)' }}>
                  <Lock size={18} style={{ color: 'oklch(0.72 0.17 160)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide" style={{ color: 'oklch(0.90 0.005 240)' }}>Admin Verification</p>
                  <p className="text-xs" style={{ color: 'oklch(0.55 0.01 240)' }}>Enter your 7-digit PIN</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: 'oklch(0.55 0.01 240)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* PIN Dots */}
            <div className="flex items-center justify-center gap-3 py-5 px-6">
              {digits.map((d, i) => (
                <div
                  key={i}
                  className={`pin-dot ${d !== '' ? 'filled' : ''} ${error ? '!border-red-500 !bg-red-500 !shadow-[0_0_8px_rgba(239,68,68,0.7)]' : ''}`}
                />
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mx-6 mb-4 rounded-lg flex items-center gap-2 px-3 py-2"
                  style={{ background: 'oklch(0.58 0.22 25 / 0.15)', border: '1px solid oklch(0.58 0.22 25 / 0.4)' }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ShieldAlert size={14} style={{ color: 'oklch(0.72 0.20 25)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'oklch(0.72 0.20 25)' }}>
                    Incorrect PIN — Access Denied
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden input for mobile keyboard */}
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              className="sr-only"
              value={digits.join('')}
              onChange={() => {}}
            />

            {/* Keypad */}
            <div className="px-6 pb-6 grid grid-cols-3 gap-3">
              {keys.flat().map((k, idx) => {
                if (k === '') return <div key={idx} />
                if (k === 'del') {
                  return (
                    <button
                      key={idx}
                      onClick={() => handleKeypadPress('del')}
                      className="rounded-xl py-4 flex items-center justify-center transition-all btn-metal"
                      disabled={filledCount === 0}
                      style={{ opacity: filledCount === 0 ? 0.4 : 1 }}
                    >
                      <Delete size={20} />
                    </button>
                  )
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleKeypadPress(k)}
                    className="rounded-xl py-4 text-xl font-bold flex items-center justify-center transition-all btn-metal"
                  >
                    {k}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
