'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        router.push('/chat')
        router.refresh()
      }
    } catch {
      setError('Network error — check your connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-mono text-4xl font-bold text-[#C9A84C] tracking-widest mb-3">BRAIN</div>
          <div className="text-xs text-gray-500 font-mono tracking-widest">ANIEKAN ISRAEL · EXTENDED MIND</div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-[#C9A84C22] rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">EMAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-700"
              placeholder="aniekaneazy@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider">PASSWORD</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] text-black font-bold font-mono text-sm py-3 rounded-lg hover:bg-[#d4b060] transition-colors disabled:opacity-60 tracking-wider"
          >
            {loading ? 'ACCESSING...' : 'ACCESS BRAIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
