import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/brain'
import { callClaude, ChatMessage } from '@/lib/claude'
import { saveMessage, getSessionMessages } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Missing message or sessionId' }, { status: 400 })
    }

    // Get recent messages for context
    const recentMessages = await getSessionMessages(sessionId, 40)

    // Build system prompt with full context
    const systemPrompt = await buildSystemPrompt(sessionId)

    // Convert stored messages to Claude format
    const chatHistory: ChatMessage[] = recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Add the new user message
    chatHistory.push({ role: 'user', content: message })

    // Save user message to Supabase
    await saveMessage({
      session_id: sessionId,
      role: 'user',
      content: message,
    })

    // Call Claude
    const assistantResponse = await callClaude(systemPrompt, chatHistory)

    // Save assistant response to Supabase
    await saveMessage({
      session_id: sessionId,
      role: 'assistant',
      content: assistantResponse,
    })

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error('Brain API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
