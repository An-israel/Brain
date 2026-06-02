import { NextResponse } from 'next/server'
import { getOpportunities } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const opportunities = await getOpportunities()
    return NextResponse.json({ opportunities })
  } catch {
    return NextResponse.json({ opportunities: [] })
  }
}
