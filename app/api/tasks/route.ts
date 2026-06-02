import { NextRequest, NextResponse } from 'next/server'
import { getAllTasks, createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tasks = await getAllTasks()
    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ tasks: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = createServerSupabaseClient()
    const { data, error } = await client.from('tasks').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ task: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const client = createServerSupabaseClient()
    const { data, error } = await client.from('tasks').update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ task: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
