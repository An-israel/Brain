'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'

const navItems = [
  { href: '/home', label: 'Home', icon: '◈' },
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/finances', label: 'Finances', icon: '₦' },
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/content', label: 'Content', icon: '📅' },
  { href: '/research', label: 'Research', icon: '🔍' },
  { href: '/team', label: 'Team', icon: '👥' },
  { href: '/skryve', label: 'Skryve', icon: '⚡' },
  { href: '/nexus', label: 'Nexus', icon: '🏢' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    const supabase = getBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-30 flex flex-col h-full w-64 bg-[#111111] border-r border-[#C9A84C22]
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#C9A84C22]">
          <div className="font-mono text-2xl font-bold text-[#C9A84C] tracking-widest">BRAIN</div>
          <div className="text-xs text-gray-500 mt-1 tracking-widest font-mono">ANIEKAN ISRAEL</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-[#C9A84C] text-black font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                  }
                `}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#C9A84C22]">
          <div className="text-xs text-gray-600 font-mono">v1.0 — June 2026</div>
          <div className="text-xs text-[#C9A84C66] mt-1">"Light to the World"</div>
          <button
            onClick={handleSignOut}
            className="mt-3 text-xs text-[#C9A84C] font-mono bg-transparent hover:text-[#d4b060] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#C9A84C22] bg-[#111111]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#C9A84C] p-2 rounded"
          >
            ☰
          </button>
          <span className="font-mono text-[#C9A84C] font-bold tracking-widest">BRAIN</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
