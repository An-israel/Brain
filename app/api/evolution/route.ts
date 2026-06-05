import { NextResponse } from 'next/server'
import { getRecentLearnings, getImprovements, createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [learnings, improvements] = await Promise.all([
      getRecentLearnings(50),
      getImprovements(20),
    ])

    const supabase = createServerSupabaseClient()
    const { count: totalMessages } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({ learnings, improvements, totalMessages: totalMessages || 0 })
  } catch {
    return NextResponse.json({ learnings: [], improvements: [], totalMessages: 0 })
  }
}
