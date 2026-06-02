import { NextRequest, NextResponse } from 'next/server'
import { getContentCalendar, createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const entries = await getContentCalendar()
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ entries: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = createServerSupabaseClient()
    const { data, error } = await client.from('content_calendar').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ entry: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
