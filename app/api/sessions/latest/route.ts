import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('conversations')
      .select('content, role, created_at')
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error
    return NextResponse.json({ message: data })
  } catch {
    return NextResponse.json({ message: null })
  }
}
