'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Fixed session ID — one continuous conversation, always
const MAIN_SESSION = 'brain-main'

const WELCOME_MESSAGE = `Good day, Aniekan. BRAIN is online.

Here's your financial reality right now:
• Guaranteed monthly: ₦480,000 (EMC)
• Total debt load: ₦1,550,000
• Rent due next month: ₦365,000
• June extra target: ₦400,000

You have the skills, the team, and the systems. What requires execution is the **decision to execute**.

Tell me what's on your mind, or pick a command below.`

const QUICK_COMMANDS = [
  { label: "Today's Plan", prompt: "Give me my full time-blocked schedule for today. Include everything — work, church, personal brand, EMC, health, prayer." },
  { label: "June Revenue Plan", prompt: "Give me a concrete plan to make an extra ₦400,000 this June on top of my EMC salary. Break it down by week and income stream." },
  { label: "Debt Clearance Map", prompt: "Review all my debts and give me a prioritized plan to clear them all. Which do I clear first and why?" },
  { label: "Skryve Direction", prompt: "We just pivoted Skryve to a two-sided marketplace. What's the smartest 30-day sprint to validate this direction fast?" },
  { label: "Nexus Growth Plan", prompt: "Nexus HQ has no growth plan. Give me a lean GTM strategy to get the first 10 paying SME clients." },
  { label: "Content This Week", prompt: "Plan my content for this week across TikTok, Instagram, Twitter/X, and YouTube. Tie it to my June growth goals." },
  { label: "Team Review", prompt: "My manager just resigned. Review my current team structure and tell me who I need to hire next and why." },
  { label: "Path to ₦2M/month", prompt: "Map out the exact path from where I am now to ₦2,000,000/month within 6 months before I move to Abuja." },
]

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (!loadingHistory) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading, loadingHistory])

  async function loadHistory() {
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/sessions/${MAIN_SESSION}`)
      if (res.ok) {
        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: Message) => ({
            id: m.id || uuidv4(),
            role: m.role,
            content: m.content,
            created_at: m.created_at,
          })))
          setLoadingHistory(false)
          return
        }
      }
    } catch {
      // fall through to welcome
    }
    setMessages([{ id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE }])
    setLoadingHistory(false)
  }

  async function sendMessage(text?: string) {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMsg: Message = { id: uuidv4(), role: 'user', content: messageText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setLoading(true)

    try {
      const res = await fetch('/api/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId: MAIN_SESSION }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: data.response || 'Something went wrong — try again.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }

  function archiveAndFresh() {
    // Archive: change the session key to a dated archive, start fresh with MAIN_SESSION
    const archiveKey = `brain-archive-${new Date().toISOString().slice(0, 10)}`
    // Just clear the view — the old messages stay in Supabase under brain-main
    // New messages will continue under brain-main but we show a separator
    setMessages([{ id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE }])
    setShowArchiveConfirm(false)
  }

  function formatContent(content: string) {
    return content
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>')
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return `<div class="flex gap-2 my-0.5"><span class="text-[#C9A84C] mt-0.5 flex-shrink-0">•</span><span>${line.substring(2)}</span></div>`
        }
        return `<p class="${line === '' ? 'h-3' : 'my-0.5'}">${line}</p>`
      })
      .join('')
  }

  // Group messages by date for visual separators
  function getDateLabel(dateStr?: string) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-NG', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9A84C22]">
        <div>
          <h1 className="text-lg font-mono font-bold text-[#C9A84C]">BRAIN</h1>
          <p className="text-xs text-gray-500">
            {loadingHistory ? 'Loading history...' : `${messages.length > 0 ? messages.filter(m => m.role === 'user').length : 0} messages · continuous memory`}
          </p>
        </div>
        <button
          onClick={() => setShowArchiveConfirm(true)}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5 border border-[#333] hover:border-[#444] rounded font-mono"
        >
          Clear view
        </button>
      </div>

      {/* Archive confirm modal */}
      {showArchiveConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#111] border border-[#C9A84C44] rounded-xl p-6 max-w-sm w-full">
            <div className="text-sm font-mono font-bold text-[#C9A84C] mb-2">Clear current view?</div>
            <p className="text-xs text-gray-400 mb-4">Your full conversation history stays saved in memory. This only clears what you see on screen right now. You can reload the page to get it all back.</p>
            <div className="flex gap-3">
              <button onClick={archiveAndFresh} className="flex-1 bg-[#C9A84C] text-black text-xs font-bold font-mono py-2 rounded-lg">Clear view</button>
              <button onClick={() => setShowArchiveConfirm(false)} className="flex-1 border border-[#333] text-gray-400 text-xs font-mono py-2 rounded-lg hover:border-[#555]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Commands */}
      <div className="px-6 py-3 border-b border-[#C9A84C11] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => sendMessage(cmd.prompt)}
              disabled={loading || loadingHistory}
              className="text-xs px-3 py-1.5 rounded border border-[#C9A84C33] text-[#C9A84C99] hover:text-[#C9A84C] hover:border-[#C9A84C66] hover:bg-[#C9A84C11] transition-all font-mono whitespace-nowrap disabled:opacity-50"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex gap-1.5 justify-center mb-3">
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-xs text-gray-600 font-mono">Loading your conversation history...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const prevMsg = messages[idx - 1]
              const dateLabel = msg.created_at ? getDateLabel(msg.created_at) : null
              const prevDateLabel = prevMsg?.created_at ? getDateLabel(prevMsg.created_at) : null
              const showDateSeparator = dateLabel && dateLabel !== prevDateLabel && msg.id !== 'welcome'

              return (
                <div key={msg.id}>
                  {showDateSeparator && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-[#222]" />
                      <span className="text-xs text-gray-600 font-mono">{dateLabel}</span>
                      <div className="flex-1 h-px bg-[#222]" />
                    </div>
                  )}
                  <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono ${msg.role === 'assistant' ? 'bg-[#C9A84C] text-black' : 'bg-[#1A1A1A] border border-[#C9A84C44] text-[#C9A84C]'}`}>
                      {msg.role === 'assistant' ? 'B' : 'A'}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-[#111111] border border-[#222222] text-gray-100 rounded-tl-sm' : 'bg-[#C9A84C11] border border-[#C9A84C33] text-white rounded-tr-sm'}`}
                      dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                    />
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-sm font-bold font-mono text-black flex-shrink-0">B</div>
                <div className="bg-[#111111] border border-[#222222] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-[#C9A84C22]">
        <div className="flex gap-3 items-end bg-[#111111] border border-[#C9A84C33] rounded-2xl px-4 py-3 focus-within:border-[#C9A84C66] transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="Ask BRAIN anything..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm resize-none outline-none leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '200px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${input.trim() && !loading ? 'bg-[#C9A84C] text-black hover:bg-[#d4b060]' : 'bg-[#1A1A1A] text-gray-600 cursor-not-allowed'}`}
          >
            ↑
          </button>
        </div>
        <p className="text-center text-xs text-gray-700 mt-2">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}
