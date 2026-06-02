'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

type Task = {
  id?: string
  title: string
  description?: string
  area?: string
  assigned_to?: string
  due_date?: string
  status?: string
  priority?: string
  created_at?: string
}

const AREAS = ['all', 'personal_brand', 'skryve', 'nexus', 'emc', 'church', 'personal']
const STATUSES = ['todo', 'in_progress', 'done', 'blocked']
const PRIORITIES = ['critical', 'high', 'medium', 'low']

const STATUS_LABELS: Record<string, string> = {
  todo: 'TODO',
  in_progress: 'IN PROGRESS',
  done: 'DONE',
  blocked: 'BLOCKED',
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 border-red-400',
  high: 'text-orange-400 border-orange-400',
  medium: 'text-[#C9A84C] border-[#C9A84C]',
  low: 'text-gray-500 border-gray-600',
}

const STATIC_TASKS: Task[] = [
  { id: '1', title: 'Record "On a Detailed" podcast ep 1', area: 'personal_brand', priority: 'high', status: 'todo', assigned_to: 'aniekan' },
  { id: '2', title: 'Post 3x content on TikTok this week', area: 'personal_brand', priority: 'high', status: 'in_progress', assigned_to: 'aniekan' },
  { id: '3', title: 'Set up SkryveAI pivot roadmap', area: 'skryve', priority: 'critical', status: 'todo', assigned_to: 'aniekan' },
  { id: '4', title: 'Hire new social media manager', area: 'personal_brand', priority: 'high', status: 'blocked', assigned_to: 'aniekan' },
  { id: '5', title: 'Complete 5 student designs for EMC', area: 'emc', priority: 'critical', status: 'in_progress', assigned_to: 'aniekan' },
  { id: '6', title: 'Plan June Value Session webinar', area: 'personal_brand', priority: 'high', status: 'todo', assigned_to: 'aniekan' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(STATIC_TASKS)
  const [areaFilter, setAreaFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', area: 'personal_brand', priority: 'medium', status: 'todo', assigned_to: 'aniekan'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks)
      }
    } catch {}
  }

  async function addTask() {
    if (!newTask.title?.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      const data = await res.json()
      if (data.task) {
        setTasks((prev) => [data.task, ...prev])
      }
    } catch {}
    setNewTask({ title: '', area: 'personal_brand', priority: 'medium', status: 'todo', assigned_to: 'aniekan' })
    setShowAddForm(false)
    setLoading(false)
  }

  async function updateStatus(taskId: string, status: string) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t))
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status }),
      })
    } catch {}
  }

  const filtered = areaFilter === 'all' ? tasks : tasks.filter((t) => t.area === areaFilter)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#C9A84C]">Task Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">{tasks.length} tasks total</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#C9A84C] text-black text-sm font-bold rounded-lg hover:bg-[#d4b060] transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Area Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {AREAS.map((area) => (
          <button
            key={area}
            onClick={() => setAreaFilter(area)}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
              areaFilter === area
                ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                : 'border-[#C9A84C33] text-gray-500 hover:border-[#C9A84C66] hover:text-[#C9A84C]'
            }`}
          >
            {area.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-[#111111] border border-[#C9A84C33] rounded-xl p-5 mb-6">
          <h3 className="text-sm font-mono text-[#C9A84C] mb-4">NEW TASK</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Task title..."
              value={newTask.title || ''}
              onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
              className="col-span-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#C9A84C44]"
            />
            <select
              value={newTask.area || 'personal_brand'}
              onChange={(e) => setNewTask((p) => ({ ...p, area: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#C9A84C44]"
            >
              {AREAS.filter((a) => a !== 'all').map((a) => (
                <option key={a} value={a}>{a.replace('_', ' ')}</option>
              ))}
            </select>
            <select
              value={newTask.priority || 'medium'}
              onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#C9A84C44]"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="date"
              value={newTask.due_date || ''}
              onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))}
              className="bg-[#0A0A0A] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#C9A84C44]"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addTask}
              disabled={loading}
              className="px-4 py-2 bg-[#C9A84C] text-black text-sm font-bold rounded-lg hover:bg-[#d4b060] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[#C9A84C33] text-gray-400 text-sm rounded-lg hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const columnTasks = filtered.filter((t) => t.status === status)
          return (
            <div key={status} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-gray-400">{STATUS_LABELS[status]}</h3>
                <span className="text-xs bg-[#1A1A1A] text-gray-500 rounded-full px-2 py-0.5 font-mono">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3 hover:border-[#C9A84C22] transition-colors"
                  >
                    <div className="text-sm text-white mb-2">{task.title}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs border rounded px-1.5 py-0.5 font-mono ${PRIORITY_COLORS[task.priority || 'medium']}`}>
                        {task.priority}
                      </span>
                      {task.area && (
                        <span className="text-xs text-gray-600 font-mono">{task.area.replace('_', ' ')}</span>
                      )}
                    </div>
                    {/* Status change buttons */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {STATUSES.filter((s) => s !== status).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(task.id!, s)}
                          className="text-xs text-gray-600 hover:text-[#C9A84C] transition-colors font-mono"
                        >
                          → {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-xs text-gray-700 text-center py-4">No tasks</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
