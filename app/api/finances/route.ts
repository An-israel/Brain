import { NextRequest, NextResponse } from 'next/server'
import { getFinances, createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const finances = await getFinances()
    return NextResponse.json({ finances })
  } catch {
    return NextResponse.json({ finances: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, amount, description, category, date, notes } = body

    if (!type || !amount) {
      return NextResponse.json({ error: 'type and amount are required' }, { status: 400 })
    }

    const entryDate = date || new Date().toISOString().split('T')[0]
    const month = entryDate.slice(0, 7)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('finances')
      .insert({ type, amount: Number(amount), description, category, date: entryDate, month, notes })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ entry: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}
