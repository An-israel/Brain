import { NextRequest, NextResponse } from 'next/server'
import { getOpportunities, createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const opportunities = await getOpportunities()
    return NextResponse.json({ opportunities })
  } catch {
    return NextResponse.json({ opportunities: [] })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ opportunity: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
