import { NextRequest, NextResponse } from 'next/server'
import { updateBrainContext, getBrainContext } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await updateBrainContext(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Context update error:', error)
    return NextResponse.json({ error: 'Failed to update context' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const context = await getBrainContext()
    return NextResponse.json({ context })
  } catch (error) {
    console.error('Context fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 })
  }
}
