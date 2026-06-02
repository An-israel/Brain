'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

type Finance = {
  id?: string
  type: string
  amount: number
  description?: string
  category?: string
  date?: string
}

const STATIC_INCOME = [
  { label: 'EMC (guaranteed)', amount: 480000, type: 'recurring' },
  { label: 'Graphic Design Course', amount: 25000, type: 'course' },
  { label: 'Video Editing Course', amount: 45000, type: 'course' },
  { label: "Book: 'Are You the Problem?'", amount: 3000, type: 'per sale' },
]

const STATIC_EXPENSES = [
  { label: 'YouTube Premium', amount: 2900 },
  { label: 'Google Drive', amount: 3000 },
  { label: 'Claude AI', amount: 27000 },
  { label: 'Feeding', amount: 70000 },
  { label: 'Sun King Solar (installment)', amount: 30000 },
  { label: 'Miscellaneous', amount: 60000 },
]

const STATIC_DEBTS = [
  { label: 'Samuel', amount: 15000 },
  { label: 'Otos', amount: 20000 },
  { label: 'Taker', amount: 100000 },
  { label: 'Emmanuel (gimbal)', amount: 250000 },
  { label: 'Sun King Solar (remaining)', amount: 800000 },
  { label: 'Rent (due next month)', amount: 365000 },
]

const totalExpenses = STATIC_EXPENSES.reduce((s, e) => s + e.amount, 0)
const totalDebts = STATIC_DEBTS.reduce((s, d) => s + d.amount, 0)
const JUNE_TARGET = 880000
const GUARANTEED = 480000

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [juneIncome, setJuneIncome] = useState(0)

  useEffect(() => {
    fetch('/api/finances')
      .then((r) => r.json())
      .then((d) => {
        if (d.finances) {
          setFinances(d.finances)
          const june = d.finances
            .filter((f: Finance) => f.type === 'income')
            .reduce((s: number, f: Finance) => s + Number(f.amount), 0)
          setJuneIncome(june)
        }
      })
      .catch(() => {})
  }, [])

  const progressPct = Math.min(100, Math.round((juneIncome || GUARANTEED) / JUNE_TARGET * 100))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#C9A84C] mb-1">Financial Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">June 2026 — Path to ₦2M/month</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">GUARANTEED MONTHLY</div>
          <div className="text-2xl font-bold text-green-400">{formatNaira(480000)}</div>
          <div className="text-xs text-gray-600 mt-1">EMC · Mon–Fri 2PM–10PM</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">MONTHLY EXPENSES</div>
          <div className="text-2xl font-bold text-orange-400">{formatNaira(totalExpenses)}</div>
          <div className="text-xs text-gray-600 mt-1">Recurring obligations</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 mb-1">TOTAL DEBT LOAD</div>
          <div className="text-2xl font-bold text-red-400">{formatNaira(totalDebts)}</div>
          <div className="text-xs text-gray-600 mt-1">6 creditors</div>
        </div>
      </div>

      {/* June Target Progress */}
      <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold text-white">June Revenue Target</div>
            <div className="text-xs text-gray-500 mt-0.5">₦480K guaranteed + ₦400K extra = ₦880K goal</div>
          </div>
          <div className="text-right">
            <div className="text-[#C9A84C] font-bold text-lg">{progressPct}%</div>
            <div className="text-xs text-gray-500">{formatNaira(juneIncome || GUARANTEED)} / {formatNaira(JUNE_TARGET)}</div>
          </div>
        </div>
        <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#d4b060] rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">₦0</span>
          <span className="text-xs text-gray-600">{formatNaira(JUNE_TARGET)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Streams */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">INCOME STREAMS</h2>
          <div className="space-y-3">
            {STATIC_INCOME.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">{item.label}</div>
                  <div className="text-xs text-gray-600 font-mono">{item.type}</div>
                </div>
                <div className="text-sm font-bold text-green-400 font-mono">{formatNaira(item.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Debt Register */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">DEBT REGISTER</h2>
          <div className="space-y-3">
            {STATIC_DEBTS.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="text-sm text-white">{item.label}</div>
                <div className="text-sm font-bold text-red-400 font-mono">{formatNaira(item.amount)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#222222] mt-4 pt-3 flex justify-between">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-sm font-bold text-red-400 font-mono">{formatNaira(totalDebts)}</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 md:col-span-2">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">MONTHLY EXPENSES</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STATIC_EXPENSES.map((item) => (
              <div key={item.label} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-sm font-bold text-orange-400 font-mono">{formatNaira(item.amount)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#222222] mt-4 pt-3 flex justify-between">
            <span className="text-sm font-bold text-white">Total Monthly</span>
            <span className="text-sm font-bold text-orange-400 font-mono">{formatNaira(totalExpenses)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
