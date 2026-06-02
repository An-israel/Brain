'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const WELCOME_MESSAGE = `Good day, Aniekan. BRAIN is online.

Here's your financial reality right now:
• Guaranteed monthly: ₦480,000 (EMC)
• Total debt load: ₦1,550,000
• Rent due next month: ₦365,000
• June extra target: ₦400,000

You have the skills, the team, and the systems. What requires execution is the **decision to execute**. 

Tell me what's on your mind, or pick a command below.`

const QUICK_COMMANDS = [
  "Today's Plan",
  "June Revenue Plan",
  "Debt Clearance Map",
  "Skryve Direction",
  "Nexus Growth Plan",
  "Content This Week",
  "Team Review",
  "Path to ₦2M/month",
]

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let sid = localStorage.getItem('brain_session_id')
    if (!sid) {
      sid = uuidv4()
      localStorage.setItem('brain_session_id', sid)
    }
    setSessionId(sid)

    // Fetch existing messages for this session
    fetchSessionMessages(sid)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function fetchSessionMessages(sid: string) {
    try {
      const res = await fetch(`/api/sessions/${sid}`)
      if (res.ok) {
        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: { id?: string; role: 'user' | 'assistant'; content: string }) => ({
            id: m.id || uuidv4(),
            role: m.role,
            content: m.content,
          })))
          return
        }
      }
    } catch {
      // fallback to welcome message
    }
    // No existing messages — show welcome
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      },
    ])
  }

  async function sendMessage(text?: string) {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId }),
      })

      const data = await res.json()

      if (data.response) {
        const assistantMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: data.response,
        }
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant',
            content: 'I encountered an issue. Please check your API configuration.',
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: 'Connection error. Please try again.',
        },
      ])
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

  function newSession() {
    const sid = uuidv4()
    localStorage.setItem('brain_session_id', sid)
    setSessionId(sid)
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      },
    ])
  }

  function formatContent(content: string) {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>')
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return `<div key="${i}" class="flex gap-2 my-0.5"><span class="text-[#C9A84C] mt-0.5">•</span><span>${line.substring(2)}</span></div>`
        }
        return `<p key="${i}" class="${line === '' ? 'h-3' : 'my-0.5'}">${line}</p>`
      })
      .join('')
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9A84C22]">
        <div>
          <h1 className="text-lg font-mono font-bold text-[#C9A84C]">BRAIN</h1>
          <p className="text-xs text-gray-500">AI Chief of Staff</p>
        </div>
        <button
          onClick={newSession}
          className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors px-3 py-1.5 border border-[#C9A84C22] hover:border-[#C9A84C44] rounded font-mono"
        >
          + New Session
        </button>
      </div>

      {/* Quick Commands */}
      <div className="px-6 py-3 border-b border-[#C9A84C11] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => sendMessage(cmd)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded border border-[#C9A84C33] text-[#C9A84C99] hover:text-[#C9A84C] hover:border-[#C9A84C66] hover:bg-[#C9A84C11] transition-all font-mono whitespace-nowrap disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono
                ${msg.role === 'assistant'
                  ? 'bg-[#C9A84C] text-black'
                  : 'bg-[#1A1A1A] border border-[#C9A84C44] text-[#C9A84C]'
                }
              `}
            >
              {msg.role === 'assistant' ? 'B' : 'A'}
            </div>

            {/* Bubble */}
            <div
              className={`
                max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'assistant'
                  ? 'bg-[#111111] border border-[#222222] text-gray-100 rounded-tl-sm'
                  : 'bg-[#C9A84C11] border border-[#C9A84C33] text-white rounded-tr-sm'
                }
              `}
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-sm font-bold font-mono text-black flex-shrink-0">
              B
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
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
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
              ${input.trim() && !loading
                ? 'bg-[#C9A84C] text-black hover:bg-[#d4b060]'
                : 'bg-[#1A1A1A] text-gray-600 cursor-not-allowed'
              }
            `}
          >
            ↑
          </button>
        </div>
        <p className="text-center text-xs text-gray-700 mt-2">Press Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}
