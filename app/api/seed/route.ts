import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServerSupabaseClient()

  // Check if table is already seeded
  const { count, error: countError } = await supabase
    .from('finances')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }

  if (count && count > 0) {
    return NextResponse.json({ seeded: false, message: 'Already seeded', count })
  }

  const data = [
    // Income
    { type: 'income', description: 'EMC Salary', amount: 480000, category: 'salary', date: '2026-06-01', month: '2026-06' },
    { type: 'income', description: 'Video Editing Course (per sale)', amount: 45000, category: 'course_sale', date: '2026-06-01', month: '2026-06' },
    { type: 'income', description: 'Graphic Design Course (per sale)', amount: 25000, category: 'course_sale', date: '2026-06-01', month: '2026-06' },
    { type: 'income', description: 'Book: Are You the Problem? (per sale)', amount: 3000, category: 'book_sale', date: '2026-06-01', month: '2026-06' },
    // Expenses
    { type: 'expense', description: 'YouTube Premium', amount: 2900, category: 'subscription', date: '2026-06-01', month: '2026-06' },
    { type: 'expense', description: 'Google Drive', amount: 3000, category: 'subscription', date: '2026-06-01', month: '2026-06' },
    { type: 'expense', description: 'Claude Pro', amount: 27000, category: 'subscription', date: '2026-06-01', month: '2026-06' },
    { type: 'expense', description: 'Feeding', amount: 70000, category: 'feeding', date: '2026-06-01', month: '2026-06' },
    { type: 'expense', description: 'Miscellaneous', amount: 60000, category: 'misc', date: '2026-06-01', month: '2026-06' },
    // Debts
    { type: 'debt', description: 'Samuel', amount: 15000, category: 'personal_debt', date: '2026-06-01', month: '2026-06' },
    { type: 'debt', description: 'Otos', amount: 20000, category: 'personal_debt', date: '2026-06-01', month: '2026-06' },
    { type: 'debt', description: 'Taker', amount: 100000, category: 'personal_debt', date: '2026-06-01', month: '2026-06' },
    { type: 'debt', description: 'Emmanuel (Gimbal)', amount: 250000, category: 'personal_debt', date: '2026-06-01', month: '2026-06' },
    { type: 'debt', description: 'Sun King Solar (remaining)', amount: 800000, category: 'solar_debt', date: '2026-06-01', month: '2026-06' },
    { type: 'debt', description: 'Rent (due next month)', amount: 365000, category: 'rent', date: '2026-07-01', month: '2026-07' },
  ]

  const { error } = await supabase.from('finances').insert(data)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ seeded: true, count: data.length })
}
