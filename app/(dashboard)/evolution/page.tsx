'use client'

import { useEffect, useState } from 'react'

type Learning = {
  id: string
  learning: string
  category: string | null
  importance: number | null
  created_at: string
}

type Improvement = {
  id: string
  improvement_type: string
  description: string
  content: string | null
  trigger_source: string | null
  created_at: string
}

type EvolutionData = {
  learnings: Learning[]
  improvements: Improvement[]
  totalMessages: number
}

const categoryColors: Record<string, string> = {
  preference: 'bg-blue-900/40 text-blue-300 border-blue-800',
  fact: 'bg-gray-800/60 text-gray-300 border-gray-700',
  pattern: 'bg-[#C9A84C22] text-[#C9A84C] border-[#C9A84C44]',
  gap: 'bg-orange-900/40 text-orange-300 border-orange-800',
  improvement: 'bg-green-900/40 text-green-300 border-green-800',
  habit: 'bg-purple-900/40 text-purple-300 border-purple-800',
  goal: 'bg-[#C9A84C22] text-[#C9A84C] border-[#C9A84C44]',
}

const typeColors: Record<string, string> = {
  system_prompt: 'bg-blue-900/40 text-blue-300 border-blue-800',
  response_style: 'bg-purple-900/40 text-purple-300 border-purple-800',
  new_context: 'bg-green-900/40 text-green-300 border-green-800',
  feature_idea: 'bg-orange-900/40 text-orange-300 border-orange-800',
  pattern_learned: 'bg-[#C9A84C22] text-[#C9A84C] border-[#C9A84C44]',
}

function ImportanceDots({ importance }: { importance: number | null }) {
  const val = importance ?? 5
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < val ? 'bg-[#C9A84C]' : 'bg-[#333]'}`}
        />
      ))}
    </div>
  )
}

export default function EvolutionPage() {
  const [data, setData] = useState<EvolutionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [cycleResult, setCycleResult] = useState<string | null>(null)
  const [daysRunning, setDaysRunning] = useState(0)

  useEffect(() => {
    // Approximate days since June 2025 launch
    const launchDate = new Date('2025-06-01')
    const now = new Date()
    const days = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
    setDaysRunning(Math.max(days, 1))

    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/evolution')
      const json = await res.json()
      setData(json)
    } catch {
      setData({ learnings: [], improvements: [], totalMessages: 0 })
    } finally {
      setLoading(false)
    }
  }

  async function runImprovementCycle() {
    setRunning(true)
    setCycleResult(null)
    try {
      const res = await fetch('/api/improve', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setCycleResult(`${json.improvements} improvement(s) applied. ${json.summary}`)
        fetchData()
      } else {
        setCycleResult(json.message || json.error || 'Cycle complete.')
      }
    } catch {
      setCycleResult('Something went wrong. Try again.')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#C9A84C] font-mono animate-pulse">Loading evolution data...</div>
      </div>
    )
  }

  const { learnings = [], improvements = [], totalMessages = 0 } = data || {}

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-wide">BRAIN Evolution</h1>
          <p className="text-gray-500 text-sm mt-1">Recursive self-improvement — every conversation makes BRAIN smarter.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={runImprovementCycle}
            disabled={running}
            className="px-5 py-2.5 bg-[#C9A84C] text-black font-bold text-sm font-mono rounded-lg hover:bg-[#d4b060] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running ? 'BRAIN is analyzing...' : 'Run Improvement Cycle'}
          </button>
          {cycleResult && (
            <div className="text-xs text-[#C9A84C] max-w-xs text-right">{cycleResult}</div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: totalMessages },
          { label: 'Learnings Captured', value: learnings.length },
          { label: 'Improvements Applied', value: improvements.length },
          { label: 'Days Running', value: daysRunning },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#C9A84C] font-mono">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Learnings */}
      <section>
        <h2 className="text-lg font-bold text-white font-mono mb-4">
          BRAIN&apos;s Learnings <span className="text-gray-600 font-normal text-sm">({learnings.length})</span>
        </h2>
        {learnings.length === 0 ? (
          <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-8 text-center text-gray-500 text-sm">
            Start chatting with BRAIN. Every conversation teaches it something new.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {learnings.map((l) => {
              const cat = l.category || 'fact'
              const colorClass = categoryColors[cat] || categoryColors.fact
              return (
                <div key={l.id} className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${colorClass}`}>
                      {cat}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(l.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{l.learning}</p>
                  <ImportanceDots importance={l.importance} />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Improvements Applied */}
      <section>
        <h2 className="text-lg font-bold text-white font-mono mb-4">
          Improvements Applied <span className="text-gray-600 font-normal text-sm">({improvements.length})</span>
        </h2>
        {improvements.length === 0 ? (
          <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-8 text-center text-gray-500 text-sm">
            Run an improvement cycle after a few conversations.
          </div>
        ) : (
          <div className="space-y-3">
            {improvements.map((imp) => {
              const typeClass = typeColors[imp.improvement_type] || typeColors.pattern_learned
              return (
                <div key={imp.id} className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${typeClass}`}>
                      {imp.improvement_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(imp.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">{imp.description}</p>
                  {imp.content && (
                    <p className="text-xs text-gray-500 leading-relaxed border-t border-[#1A1A1A] pt-2">{imp.content}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
