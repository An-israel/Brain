import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const client = createServerSupabaseClient()

    // For the main session, return ALL conversations across all session IDs
    // (old messages were stored under random UUIDs before brain-main was fixed)
    const query = client
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(500)

    // If a specific non-main session is requested, filter by it
    if (sessionId !== 'brain-main') {
      query.eq('session_id', sessionId)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ messages: data || [] })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ messages: [] })
  }
}
