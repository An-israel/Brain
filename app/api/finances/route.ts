import { NextResponse } from 'next/server'
import { getFinances } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const finances = await getFinances()
    return NextResponse.json({ finances })
  } catch {
    return NextResponse.json({ finances: [] })
  }
}
