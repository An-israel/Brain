'use client'

import { useState } from 'react'

const MILESTONES = [
  { week: 'Week 1', title: 'Define marketplace structure', desc: 'Map out the two-sided model: freelancer supply + client demand. Define categories and value props.' },
  { week: 'Week 2', title: 'Build MVP flows', desc: 'Freelancer onboarding flow, client posting flow, basic matching logic. Ship a Figma prototype.' },
  { week: 'Week 3', title: 'Onboard first 10 freelancers', desc: 'Direct outreach to designers, writers, video editors in Nigeria. Offer free early access.' },
  { week: 'Week 4', title: 'Onboard first 10 clients', desc: 'Cold outreach to SMEs and startups needing creative work. Offer first project at reduced rate.' },
  { week: 'Week 5', title: 'First transaction', desc: 'Facilitate end-to-end: client posts job → freelancer accepts → delivery → payment cleared.' },
  { week: 'Week 6', title: 'Iterate from feedback', desc: 'Collect structured feedback from both sides. Fix top 3 friction points and plan month 2.' },
]

const TEAM = [
  { name: 'TBD', role: 'Marketing Expert', desc: 'Growth, brand, acquisition strategy', badge: 'MARKETING' },
  { name: 'TBD', role: 'Product Designer', desc: 'UI/UX for marketplace flows', badge: 'DESIGN' },
  { name: 'TBD', role: 'Visual Designer', desc: 'Brand assets, marketing collateral', badge: 'DESIGN' },
  { name: 'TBD', role: 'Customer Success', desc: 'Onboarding, support, retention', badge: 'CS' },
]

const KPIS = [
  { label: 'First 10 Freelancers', target: '10', unit: 'suppliers', color: 'text-[#C9A84C]' },
  { label: 'First 10 Clients', target: '10', unit: 'buyers', color: 'text-blue-400' },
  { label: 'First Transaction', target: '1', unit: 'completed deal', color: 'text-green-400' },
  { label: 'Monthly GMV Target', target: '₦500K', unit: 'end of month 2', color: 'text-purple-400' },
]

type MilestoneStatus = 'not_started' | 'in_progress' | 'done'

export default function SkryvePage() {
  const [milestoneStatus, setMilestoneStatus] = useState<MilestoneStatus[]>(
    MILESTONES.map(() => 'not_started')
  )

  const STATUS_OPTS: { value: MilestoneStatus; label: string; style: string }[] = [
    { value: 'not_started', label: 'Not Started', style: 'text-gray-500 bg-gray-500/10 border-gray-500/30' },
    { value: 'in_progress', label: 'In Progress', style: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    { value: 'done', label: 'Done ✓', style: 'text-green-400 bg-green-400/10 border-green-400/30' },
  ]

  function cycleStatus(i: number) {
    setMilestoneStatus(prev => {
      const next = [...prev]
      const cycle: MilestoneStatus[] = ['not_started', 'in_progress', 'done']
      const idx = cycle.indexOf(prev[i])
      next[i] = cycle[(idx + 1) % cycle.length]
      return next
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#C9A84C] font-mono tracking-widest">SKRYVE AI</h1>
          <span className="text-xs font-mono bg-[#C9A84C] text-black px-3 py-1 rounded font-bold">IN PIVOT</span>
        </div>
        <p className="text-gray-400 text-sm">AI-powered client acquisition → Two-sided marketplace</p>
      </div>

      {/* Current Direction */}
      <div className="bg-[#111111] border border-[#C9A84C22] rounded-xl p-6 mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-3">CURRENT DIRECTION</div>
        <h2 className="text-white font-semibold text-lg mb-3">The Pivot: From AI Tool to Marketplace</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-3">
          Skryve started as an AI-powered client acquisition tool for freelancers. After discovery research,
          the pivot is to a <span className="text-[#C9A84C]">two-sided marketplace</span> — connecting Nigerian
          SMEs and startups (clients) with vetted creative professionals (freelancers) in a single trusted platform.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          The AI layer still plays a role: smart matching, proposal drafting assistance, and pricing recommendations —
          but the core product is now the marketplace itself. This is a more defensible, scalable, and monetizable model.
        </p>
      </div>

      {/* Team */}
      <div className="mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">TEAM — 4 MEMBERS</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((member, i) => (
            <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono bg-[#C9A84C11] text-[#C9A84C] border border-[#C9A84C33] px-2 py-0.5 rounded">
                  {member.badge}
                </span>
              </div>
              <div className="font-semibold text-white text-sm mb-0.5">{member.role}</div>
              <div className="text-xs text-gray-500 mb-2">{member.desc}</div>
              <div className="text-xs font-mono text-gray-600">{member.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-day Sprint */}
      <div className="mb-8">
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">30-DAY SPRINT — 6 MILESTONES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILESTONES.map((ms, i) => {
            const s = STATUS_OPTS.find(o => o.value === milestoneStatus[i])!
            return (
              <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-[#C9A84C] bg-[#C9A84C11] border border-[#C9A84C33] px-2 py-0.5 rounded">
                    {ms.week}
                  </span>
                  <button
                    onClick={() => cycleStatus(i)}
                    className={`text-xs font-mono px-2 py-0.5 rounded border cursor-pointer transition-all ${s.style}`}
                  >
                    {s.label}
                  </button>
                </div>
                <div className="font-semibold text-white text-sm mb-2">{ms.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{ms.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* KPI Targets */}
      <div>
        <div className="text-xs font-mono text-[#C9A84C] tracking-widest mb-4">KPI TARGETS</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((kpi, i) => (
            <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-5 text-center">
              <div className={`text-2xl font-bold font-mono mb-1 ${kpi.color}`}>{kpi.target}</div>
              <div className="text-xs font-mono text-white mb-1">{kpi.label}</div>
              <div className="text-xs text-gray-600">{kpi.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
