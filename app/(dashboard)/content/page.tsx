'use client'

import { useState, useEffect } from 'react'

const PLATFORMS = ['all', 'TikTok', 'Facebook', 'YouTube', 'Instagram', 'Twitter/X']
const PILLARS = ['Mindset & Thinking', 'AI & Future', 'Personal Brand', 'Lifestyle & Standards', 'Behind the Build']
const STATUSES = ['planned', 'scripted', 'recorded', 'edited', 'published']
const STATUS_COLORS: Record<string, string> = {
  planned: 'text-gray-400 bg-gray-400/10',
  scripted: 'text-blue-400 bg-blue-400/10',
  recorded: 'text-purple-400 bg-purple-400/10',
  edited: 'text-orange-400 bg-orange-400/10',
  published: 'text-green-400 bg-green-400/10',
}

type ContentEntry = {
  id?: string
  platform: string
  content_type?: string
  pillar?: string
  title?: string
  script_notes?: string
  scheduled_date?: string
  status?: string
}

// Get the week's Mon-Sun dates
function getWeekDates(offset = 0) {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ContentPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([])
  const [platformFilter, setPlatformFilter] = useState('all')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<ContentEntry>>({
    platform: 'TikTok', pillar: PILLARS[0], status: 'planned'
  })
  const weekDates = getWeekDates(weekOffset)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((d) => { if (d.entries?.length) setEntries(d.entries) })
      .catch(() => {})
  }, [])

  async function addEntry() {
    if (!newEntry.title?.trim()) return
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      })
      const data = await res.json()
      if (data.entry) setEntries((p) => [data.entry, ...p])
    } catch {}
    setShowForm(false)
    setNewEntry({ platform: 'TikTok', pillar: PILLARS[0], status: 'planned' })
  }

  const filtered = platformFilter === 'all' ? entries : entries.filter((e) => e.platform === platformFilter)

  function getEntriesForDay(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    return filtered.filter((e) => e.scheduled_date === dateStr)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#C9A84C]">Content Calendar</h1>
          <p className="text-gray-500 text-sm mt-0.5">Weekly content planning</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#C9A84C] text-black text-sm font-bold rounded-lg hover:bg-[#d4b060]"
        >
          + Add Content
        </button>
      </div>

      {/* Platform Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
              platformFilter === p
                ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                : 'border-[#C9A84C33] text-gray-500 hover:border-[#C9A84C66] hover:text-[#C9A84C]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-[#111111] border border-[#C9A84C33] rounded-xl p-5 mb-6">
          <h3 className="text-sm font-mono text-[#C9A84C] mb-4">NEW CONTENT ENTRY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title..."
              value={newEntry.title || ''}
              onChange={(e) => setNewEntry((p) => ({ ...p, title: e.target.value }))}
              className="col-span-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#C9A84C44]"
            />
            <select value={newEntry.platform} onChange={(e) => setNewEntry((p) => ({ ...p, platform: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none">
              {PLATFORMS.filter((p) => p !== 'all').map((p) => <option key={p}>{p}</option>)}
            </select>
            <select value={newEntry.pillar} onChange={(e) => setNewEntry((p) => ({ ...p, pillar: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none">
              {PILLARS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type="date" value={newEntry.scheduled_date || ''}
              onChange={(e) => setNewEntry((p) => ({ ...p, scheduled_date: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none" />
            <select value={newEntry.status} onChange={(e) => setNewEntry((p) => ({ ...p, status: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea placeholder="Script notes..."
              value={newEntry.script_notes || ''}
              onChange={(e) => setNewEntry((p) => ({ ...p, script_notes: e.target.value }))}
              className="col-span-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none resize-none h-20"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addEntry} className="px-4 py-2 bg-[#C9A84C] text-black text-sm font-bold rounded-lg hover:bg-[#d4b060]">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#C9A84C33] text-gray-400 text-sm rounded-lg hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setWeekOffset((p) => p - 1)} className="text-[#C9A84C] hover:text-white px-3 py-1.5 border border-[#C9A84C33] rounded font-mono text-sm">← Prev</button>
        <span className="text-gray-400 text-sm font-mono flex-1 text-center">
          {weekDates[0].toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} — {weekDates[6].toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button onClick={() => setWeekOffset((p) => p + 1)} className="text-[#C9A84C] hover:text-white px-3 py-1.5 border border-[#C9A84C33] rounded font-mono text-sm">Next →</button>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dayEntries = getEntriesForDay(date)
          const isToday = date.toDateString() === new Date().toDateString()
          return (
            <div key={i} className={`bg-[#111111] border rounded-xl p-3 min-h-[160px] ${isToday ? 'border-[#C9A84C44]' : 'border-[#222222]'}`}>
              <div className={`text-xs font-mono mb-2 ${isToday ? 'text-[#C9A84C]' : 'text-gray-500'}`}>
                <div>{DAY_NAMES[i]}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
              <div className="space-y-1.5">
                {dayEntries.map((entry, j) => (
                  <div key={j} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded p-1.5">
                    <div className="text-xs text-white truncate">{entry.title}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-600">{entry.platform}</span>
                      <span className={`text-xs rounded px-1 ${STATUS_COLORS[entry.status || 'planned']}`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* All entries list */}
      {entries.length > 0 && (
        <div className="mt-8 bg-[#111111] border border-[#222222] rounded-xl p-5">
          <h2 className="text-sm font-mono font-bold text-[#C9A84C] mb-4">ALL CONTENT ({filtered.length})</h2>
          <div className="space-y-2">
            {filtered.map((entry, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-[#1A1A1A] last:border-0">
                <span className="text-xs text-gray-600 font-mono w-24">{entry.scheduled_date || 'Unscheduled'}</span>
                <span className="text-xs text-[#C9A84C] w-20">{entry.platform}</span>
                <span className="text-sm text-white flex-1">{entry.title}</span>
                <span className={`text-xs rounded px-2 py-0.5 ${STATUS_COLORS[entry.status || 'planned']}`}>{entry.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
