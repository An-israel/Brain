'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Task = {
  id?: string
  title: string
  priority?: string
  area?: string
  status?: string
}

type Finance = {
  type: string
  amount: number
  month?: string
  date?: string
}

type ContentEntry = {
  id?: string
  title?: string
  platform?: string
  scheduled_date?: string
  status?: string
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  low: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
}

function formatNaira(n: number) {
  return '₦' + Number(n).toLocaleString('en-NG')
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase()
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [finances, setFinances] = useState<Finance[]>([])
  const [latestMessage, setLatestMessage] = useState<string | null>(null)
  const [contentToday, setContentToday] = useState<ContentEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().slice(0, 7)

    Promise.all([
      fetch('/api/tasks').then(r => r.json()).catch(() => ({ tasks: [] })),
      fetch('/api/finances').then(r => r.json()).catch(() => ({ finances: [] })),
      fetch('/api/sessions/latest').then(r => r.json()).catch(() => ({ message: null })),
      fetch('/api/content').then(r => r.json()).catch(() => ({ entries: [] })),
    ]).then(([tasksData, finData, sessionData, contentData]) => {
      // Top tasks by priority
      const allTasks: Task[] = tasksData.tasks || []
      const sorted = allTasks
        .filter(t => t.status !== 'done' && t.status !== 'completed')
        .sort((a, b) => (PRIORITY_ORDER[a.priority || 'low'] ?? 3) - (PRIORITY_ORDER[b.priority || 'low'] ?? 3))
      setTasks(sorted.slice(0, 3))

      // Finances
      const allFin: Finance[] = finData.finances || []
      const monthEntries = allFin.filter(f => f.month === thisMonth || f.date?.startsWith(thisMonth))
      setFinances(monthEntries)

      // Latest message
      if (sessionData.message?.content) {
        setLatestMessage(sessionData.message.content)
      }

      // Content today
      const allContent: ContentEntry[] = contentData.entries || []
      const todayContent = allContent.filter(c => c.scheduled_date === today)
      setContentToday(todayContent)

      setLoading(false)
    })
  }, [])

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthEntries = finances.filter(f => f.month === thisMonth || f.date?.startsWith(thisMonth))
  const monthIncome = monthEntries.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0)
  const monthExpenses = monthEntries.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0)
  const totalDebt = 1550000 // static total: 15k+20k+100k+250k+365k+800k

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="font-mono text-[#C9A84C] text-xs tracking-widest mb-2">{formatDate()}</div>
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, <span className="text-[#C9A84C]">Aniekan.</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Your daily briefing — June 2026</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Link
          href="/chat"
          className="bg-[#C9A84C] text-black font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#d4b060] transition-colors font-mono"
        >
          Ask BRAIN
        </Link>
        <Link
          href="/finances"
          className="bg-transparent text-[#C9A84C] font-bold text-sm px-5 py-2.5 rounded-lg border border-[#C9A84C] hover:bg-[#C9A84C11] transition-colors font-mono"
        >
          Log Transaction
        </Link>
        <Link
          href="/tasks"
          className="bg-transparent text-[#C9A84C] font-bold text-sm px-5 py-2.5 rounded-lg border border-[#C9A84C] hover:bg-[#C9A84C11] transition-colors font-mono"
        >
          Add Task
        </Link>
      </div>

      {/* 4-section grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Top 3 Tasks */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold text-[#C9A84C] tracking-widest">TOP 3 TASKS</h2>
            <Link href="/tasks" className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors font-mono">View all →</Link>
          </div>
          {loading ? (
            <div className="text-gray-600 text-sm font-mono">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-600 text-sm">No active tasks. <Link href="/tasks" className="text-[#C9A84C] hover:underline">Add one →</Link></div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={task.id || i} className="flex items-start gap-3">
                  <span className="text-[#C9A84C] font-mono text-xs mt-0.5 w-4 shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{task.title}</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {task.area && (
                        <span className="text-xs font-mono text-gray-500 bg-[#1A1A1A] px-2 py-0.5 rounded">{task.area}</span>
                      )}
                      {task.priority && (
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${PRIORITY_COLOR[task.priority] || 'text-gray-400'}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finance Snapshot */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold text-[#C9A84C] tracking-widest">FINANCE SNAPSHOT</h2>
            <Link href="/finances" className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors font-mono">View full dashboard →</Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-500">THIS MONTH INCOME</span>
              <span className="text-sm font-bold text-green-400 font-mono">{formatNaira(monthIncome || 480000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-500">TOTAL EXPENSES</span>
              <span className="text-sm font-bold text-orange-400 font-mono">{formatNaira(monthExpenses || 162900)}</span>
            </div>
            <div className="h-px bg-[#222]" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-500">TOTAL DEBT</span>
              <span className="text-sm font-bold text-red-400 font-mono">{formatNaira(totalDebt)}</span>
            </div>
          </div>
        </div>

        {/* Last BRAIN Message */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold text-[#C9A84C] tracking-widest">LAST BRAIN MESSAGE</h2>
            <Link href="/chat" className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors font-mono">Continue in chat →</Link>
          </div>
          {loading ? (
            <div className="text-gray-600 text-sm font-mono">Loading...</div>
          ) : latestMessage ? (
            <p className="text-sm text-gray-300 leading-relaxed">
              {latestMessage.length > 200 ? latestMessage.slice(0, 200) + '...' : latestMessage}
            </p>
          ) : (
            <div className="text-gray-600 text-sm">
              No conversation yet. <Link href="/chat" className="text-[#C9A84C] hover:underline">Start chatting →</Link>
            </div>
          )}
        </div>

        {/* Content Today */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold text-[#C9A84C] tracking-widest">CONTENT TODAY</h2>
            <Link href="/content" className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors font-mono">Plan content →</Link>
          </div>
          {loading ? (
            <div className="text-gray-600 text-sm font-mono">Loading...</div>
          ) : contentToday.length === 0 ? (
            <div className="text-sm text-gray-500">
              No content scheduled today.{' '}
              <Link href="/content" className="text-[#C9A84C] hover:underline">Plan some →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {contentToday.map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-3 py-1.5 border-b border-[#1A1A1A] last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{item.title || 'Untitled'}</div>
                    {item.platform && (
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{item.platform}</div>
                    )}
                  </div>
                  {item.status && (
                    <span className="text-xs font-mono text-[#C9A84C] bg-[#C9A84C11] px-2 py-0.5 rounded">{item.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
