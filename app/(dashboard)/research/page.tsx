'use client'

import { useState, useEffect } from 'react'

type Opportunity = {
  id?: string
  title: string
  type?: string
  description?: string
  source_url?: string
  confidence_score?: number
  verified?: boolean
  recommended?: boolean
  action_required?: string
  relevance_tags?: string[]
  status?: string
}

const STATIC_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Freelance Brand Strategy for Tech Startup',
    type: 'Freelance',
    description: 'Nigerian tech startup looking for brand strategist and web developer. Budget: ₦150,000–₦300,000.',
    confidence_score: 8,
    verified: true,
    recommended: true,
    action_required: 'Send portfolio + proposal within 48 hours',
    relevance_tags: ['brand', 'web dev', 'tech'],
    status: 'new',
  },
  {
    id: '2',
    title: 'Personal Brand Accelerator Course Pre-launch',
    type: 'Product Launch',
    description: 'Launch the Personal Brand Accelerator at ₦50,000/person. Target: 20 students = ₦1,000,000.',
    confidence_score: 9,
    verified: true,
    recommended: true,
    action_required: 'Create landing page + start waitlist this week',
    relevance_tags: ['course', 'income', 'brand'],
    status: 'new',
  },
  {
    id: '3',
    title: 'AI Tools Masterclass Cohort',
    type: 'Course',
    description: 'Teach AI tools to professionals and creators. Target: ₦35,000 x 30 people = ₦1,050,000.',
    confidence_score: 7,
    verified: false,
    recommended: true,
    action_required: 'Validate demand via poll on Facebook (5.6K followers)',
    relevance_tags: ['AI', 'course', 'income'],
    status: 'reviewing',
  },
]

const STATUS_FILTERS = ['new', 'reviewing', 'acting', 'passed']

export default function ResearchPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(STATIC_OPPORTUNITIES)
  const [statusFilter, setStatusFilter] = useState('all')
  const [running, setRunning] = useState(false)
  const [runMsg, setRunMsg] = useState('')

  function loadOpportunities() {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((d) => { if (d.opportunities?.length) setOpportunities(d.opportunities) })
      .catch(() => {})
  }

  useEffect(() => {
    loadOpportunities()
  }, [])

  async function runResearch() {
    setRunning(true)
    setRunMsg('')
    try {
      const res = await fetch('/api/research', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setRunMsg(`Found ${data.count || 0} new opportunities`)
        loadOpportunities()
      } else {
        setRunMsg(data.error || 'Research failed')
      }
    } catch {
      setRunMsg('Network error — try again')
    } finally {
      setRunning(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    setOpportunities((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    try {
      await fetch('/api/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch {}
  }

  const filtered = statusFilter === 'all' ? opportunities : opportunities.filter((o) => o.status === statusFilter)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#C9A84C]">Research & Opportunities</h1>
          <p className="text-gray-500 text-sm mt-0.5">Income opportunities and strategic intelligence</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={runResearch}
            disabled={running}
            className="px-4 py-2 bg-[#C9A84C] text-black text-sm font-bold rounded-lg hover:bg-[#d4b060] disabled:opacity-50 transition-colors"
          >
            {running ? 'Running...' : 'Run Research'}
          </button>
          {runMsg && <span className="text-xs text-gray-400 font-mono">{runMsg}</span>}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...STATUS_FILTERS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
              statusFilter === s
                ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                : 'border-[#C9A84C33] text-gray-500 hover:border-[#C9A84C66] hover:text-[#C9A84C]'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((opp) => (
          <div key={opp.id} className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#C9A84C33] transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                {opp.type && (
                  <span className="text-xs font-mono text-gray-600 block mb-1">{opp.type}</span>
                )}
                <h3 className="text-sm font-semibold text-white leading-snug">{opp.title}</h3>
              </div>
              {opp.verified && (
                <span className="flex-shrink-0 text-xs bg-green-400/10 text-green-400 border border-green-400/20 rounded px-1.5 py-0.5 font-mono">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Description */}
            {opp.description && (
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{opp.description}</p>
            )}

            {/* Confidence Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 font-mono">Confidence</span>
                <span className="text-xs text-[#C9A84C] font-mono font-bold">{opp.confidence_score}/10</span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A84C] rounded-full"
                  style={{ width: `${(opp.confidence_score || 0) * 10}%` }}
                />
              </div>
            </div>

            {/* Action Required */}
            {opp.action_required && (
              <div className="bg-[#C9A84C11] border border-[#C9A84C22] rounded-lg p-2.5 mb-3">
                <div className="text-xs text-[#C9A84C] font-mono mb-0.5">ACTION REQUIRED</div>
                <div className="text-xs text-gray-300">{opp.action_required}</div>
              </div>
            )}

            {/* Tags */}
            {opp.relevance_tags && opp.relevance_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {opp.relevance_tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-[#1A1A1A] text-gray-500 rounded px-2 py-0.5 font-mono">{tag}</span>
                ))}
              </div>
            )}

            {/* Status badge + update */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1A1A1A]">
              <span className="text-xs text-gray-600 font-mono">{opp.status?.toUpperCase()}</span>
              {opp.recommended && (
                <span className="text-xs text-[#C9A84C] font-mono">★ Recommended</span>
              )}
            </div>
            {opp.id && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {STATUS_FILTERS.filter((s) => s !== opp.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(opp.id!, s)}
                    className="text-xs text-gray-600 hover:text-[#C9A84C] transition-colors font-mono"
                  >
                    → {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-sm">No opportunities in this category</div>
        </div>
      )}
    </div>
  )
}
