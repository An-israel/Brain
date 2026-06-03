import { NextRequest, NextResponse } from 'next/server'
import { getSessionMessages } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const messages = await getSessionMessages(sessionId, 500)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ messages: [] })
  }
}
