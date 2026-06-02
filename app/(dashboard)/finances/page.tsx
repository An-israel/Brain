'use client'

import { useState, useEffect, useCallback } from 'react'

type Finance = {
  id?: string
  type: string
  amount: number
  description?: string
  category?: string
  date?: string
  month?: string
  notes?: string
}

const JUNE_TARGET = 880000
const GUARANTEED = 480000

const STATIC_DEBTS: Record<string, number> = {
  'Samuel': 15000,
  'Otos': 20000,
  'Taker': 100000,
  'Emmanuel (gimbal)': 250000,
  'Sun King Solar': 800000,
  'Rent (due next month)': 365000,
}

const TYPE_OPTIONS = [
  { value: 'income', label: 'Income Received', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  { value: 'expense', label: 'Expense Paid', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  { value: 'debt_payment', label: 'Debt Payment Made', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  { value: 'debt', label: 'New Debt Incurred', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
]

const CATEGORY_OPTIONS: Record<string, string[]> = {
  income: ['salary', 'course_sale', 'book_sale', 'freelance', 'consulting', 'other'],
  expense: ['subscription', 'feeding', 'transport', 'utilities', 'misc', 'other'],
  debt_payment: ['personal_debt', 'solar_debt', 'rent', 'other'],
  debt: ['personal_debt', 'solar_debt', 'rent', 'other'],
}

function formatNaira(n: number) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [seeding, setSeeding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')

  // Form state
  const [type, setType] = useState('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(today())
  const [notes, setNotes] = useState('')

  const loadFinances = useCallback(() => {
    fetch('/api/finances')
      .then(r => r.json())
      .then(d => { if (d.finances) setFinances(d.finances) })
      .catch(() => {})
  }, [])

  useEffect(() => { loadFinances() }, [loadFinances])

  async function handleSeed() {
    setSeeding(true)
    try { await fetch('/api/seed'); loadFinances() } finally { setSeeding(false) }
  }

  function resetForm() {
    setAmount('')
    setDescription('')
    setCategory('')
    setDate(today())
    setNotes('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !description) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: parseFloat(amount.replace(/,/g, '')), description, category, date, notes }),
      })
      if (res.ok) {
        setSuccess(`${TYPE_OPTIONS.find(t => t.value === type)?.label} logged successfully`)
        resetForm()
        loadFinances()
        setTimeout(() => setSuccess(''), 3000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Compute live stats from DB entries
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthEntries = finances.filter(f => f.month === thisMonth || f.date?.startsWith(thisMonth))

  const monthIncome = monthEntries.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0)
  const monthExpenses = monthEntries.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0)
  const debtPaid = monthEntries.filter(f => f.type === 'debt_payment').reduce((s, f) => s + Number(f.amount), 0)
  const newDebts = finances.filter(f => f.type === 'debt').reduce((s, f) => s + Number(f.amount), 0)
  const staticDebtTotal = Object.values(STATIC_DEBTS).reduce((s, v) => s + v, 0)
  const totalDebt = Math.max(0, (newDebts || staticDebtTotal) - debtPaid)

  const progressPct = Math.min(100, Math.round((monthIncome || GUARANTEED) / JUNE_TARGET * 100))

  // Recent transactions (last 20)
  const recent = [...finances]
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
    .slice(0, 20)

  const selectedType = TYPE_OPTIONS.find(t => t.value === type)!

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-[#C9A84C]">Financial Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(v => !v)}
            className="text-sm font-mono bg-[#C9A84C] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#d4b060] transition-colors"
          >
            {showForm ? '✕ Close' : '+ Log Transaction'}
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="text-xs font-mono text-[#C9A84C] border border-[#C9A84C44] rounded px-3 py-2 bg-transparent hover:bg-[#C9A84C11] transition-colors disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Data'}
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">June 2026 — Path to ₦2M/month</p>

      {/* Transaction Logger */}
      {showForm && (
        <div className="bg-[#111111] border border-[#C9A84C44] rounded-xl p-6 mb-8">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-5">LOG TRANSACTION</h2>

          {/* Type selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setType(opt.value); setCategory('') }}
                className={`text-xs font-mono py-2.5 px-3 rounded-lg border transition-all text-center ${
                  type === opt.value ? opt.bg + ' ' + opt.color + ' font-bold' : 'border-[#222] text-gray-500 hover:border-[#444] hover:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-500 mb-1.5">DESCRIPTION *</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={
                  type === 'income' ? 'e.g. EMC salary for June, Course sale to John...' :
                  type === 'expense' ? 'e.g. Bought airtime, Transport to church...' :
                  type === 'debt_payment' ? 'e.g. Paid Samuel ₦5,000, Paid Taker installment...' :
                  'e.g. Borrowed from Emeka, Bought on credit...'
                }
                required
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">AMOUNT (₦) *</label>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 45000"
                required
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-600 font-mono"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">DATE</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors font-mono"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">CATEGORY</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors"
              >
                <option value="">Select category</option>
                {(CATEGORY_OPTIONS[type] || []).map(c => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">NOTES (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any extra context..."
                className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting || !amount || !description}
                className="bg-[#C9A84C] text-black font-bold text-sm px-8 py-3 rounded-lg hover:bg-[#d4b060] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-mono"
              >
                {submitting ? 'Saving...' : `Save ${selectedType.label}`}
              </button>
              {success && (
                <span className="text-green-400 text-sm font-mono">{success}</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">THIS MONTH INCOME</div>
          <div className="text-2xl font-bold text-green-400 font-mono">{formatNaira(monthIncome || GUARANTEED)}</div>
          <div className="text-xs text-gray-600 mt-1">{monthIncome > 0 ? 'logged this month' : 'EMC guaranteed'}</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">THIS MONTH EXPENSES</div>
          <div className="text-2xl font-bold text-orange-400 font-mono">{formatNaira(monthExpenses || 162900)}</div>
          <div className="text-xs text-gray-600 mt-1">{monthExpenses > 0 ? 'logged this month' : 'estimated recurring'}</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">TOTAL DEBT LOAD</div>
          <div className="text-2xl font-bold text-red-400 font-mono">{formatNaira(totalDebt || staticDebtTotal)}</div>
          <div className="text-xs text-gray-600 mt-1">{debtPaid > 0 ? `${formatNaira(debtPaid)} paid so far` : '6 creditors'}</div>
        </div>
      </div>

      {/* June Progress */}
      <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold text-white">June Revenue Target</div>
            <div className="text-xs text-gray-500 mt-0.5">₦480K guaranteed + ₦400K extra = ₦880K goal</div>
          </div>
          <div className="text-right">
            <div className="text-[#C9A84C] font-bold text-lg font-mono">{progressPct}%</div>
            <div className="text-xs text-gray-500 font-mono">{formatNaira(monthIncome || GUARANTEED)} / {formatNaira(JUNE_TARGET)}</div>
          </div>
        </div>
        <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#d4b060] rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Recent Transactions + Debt Register */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Transactions */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">RECENT TRANSACTIONS</h2>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">
              No transactions yet.<br/>
              <span className="text-[#C9A84C] cursor-pointer hover:underline" onClick={() => setShowForm(true)}>Log your first one</span> or seed data above.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {recent.map((f) => {
                const t = TYPE_OPTIONS.find(opt => opt.value === f.type)
                return (
                  <div key={f.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{f.description || f.category}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-mono ${t?.color || 'text-gray-500'}`}>{t?.label || f.type}</span>
                        <span className="text-xs text-gray-600">{f.date}</span>
                      </div>
                    </div>
                    <div className={`text-sm font-bold font-mono ml-3 ${t?.color || 'text-white'}`}>
                      {f.type === 'income' ? '+' : f.type === 'debt_payment' ? '-' : ''}
                      {formatNaira(Number(f.amount))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Debt Register */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">DEBT REGISTER</h2>
          <div className="space-y-2">
            {Object.entries(STATIC_DEBTS).map(([label, amount]) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1A1A1A] last:border-0">
                <div className="text-sm text-white">{label}</div>
                <div className="text-sm font-bold text-red-400 font-mono">{formatNaira(amount)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#333] mt-3 pt-3 flex justify-between">
            <span className="text-sm font-bold text-white">Total Owed</span>
            <span className="text-sm font-bold text-red-400 font-mono">{formatNaira(staticDebtTotal)}</span>
          </div>
          {debtPaid > 0 && (
            <div className="mt-2 flex justify-between">
              <span className="text-xs text-gray-500">Paid off</span>
              <span className="text-xs font-mono text-blue-400">− {formatNaira(debtPaid)}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
