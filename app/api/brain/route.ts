import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/brain'
import { callClaude, ChatMessage } from '@/lib/claude'
import { saveMessage, getSessionMessages, createServerSupabaseClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic()

// After BRAIN responds, extract any finance/task data and save it automatically
async function extractAndSave(userMessage: string, brainReply: string) {
  try {
    const extractionPrompt = `You are a data extractor. Given a conversation between Aniekan (user) and BRAIN (assistant), extract any structured data that should be saved to the database.

User said: "${userMessage}"
BRAIN replied: "${brainReply}"

Extract ONLY data explicitly stated by the USER (not hypothetical). Return a JSON object:
{
  "finances": [
    { "type": "income|expense|debt_payment|debt", "amount": number, "description": "string", "category": "string", "date": "YYYY-MM-DD" }
  ],
  "tasks": [
    { "title": "string", "area": "personal_brand|skryve|nexus|emc|church|personal", "priority": "critical|high|medium|low", "due_date": "YYYY-MM-DD or null", "assigned_to": "aniekan" }
  ]
}

Rules:
- Only extract if the user clearly stated they DID something (paid money, received money, completed/created a task)
- "I paid Samuel 5000" → debt_payment, amount: 5000, description: "Paid Samuel"
- "I received 45000 from a course sale" → income, amount: 45000
- "I need to call John tomorrow" → task, title: "Call John"
- If nothing to extract, return { "finances": [], "tasks": [] }
- Return ONLY the JSON object, nothing else`

    const resp = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: extractionPrompt }],
    })

    const text = resp.content.find(b => b.type === 'text')?.text || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return

    const extracted = JSON.parse(jsonMatch[0])
    const supabase = createServerSupabaseClient()
    const today = new Date().toISOString().split('T')[0]
    const month = today.slice(0, 7)

    // Save finance entries
    if (extracted.finances?.length > 0) {
      for (const f of extracted.finances) {
        if (f.amount > 0 && f.description) {
          await supabase.from('finances').insert({
            type: f.type,
            amount: f.amount,
            description: f.description,
            category: f.category || null,
            date: f.date || today,
            month: (f.date || today).slice(0, 7),
            notes: 'Auto-logged from BRAIN chat',
          })
        }
      }
    }

    // Save tasks
    if (extracted.tasks?.length > 0) {
      for (const t of extracted.tasks) {
        if (t.title) {
          await supabase.from('tasks').insert({
            title: t.title,
            area: t.area || 'personal',
            priority: t.priority || 'medium',
            due_date: t.due_date || null,
            assigned_to: t.assigned_to || 'aniekan',
            status: 'todo',
          })
        }
      }
    }
  } catch (err) {
    // Silent fail — don't interrupt the chat experience
    console.error('Extraction error:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Missing message or sessionId' }, { status: 400 })
    }

    const recentMessages = await getSessionMessages(sessionId, 40)
    const systemPrompt = await buildSystemPrompt(sessionId)

    const chatHistory: ChatMessage[] = recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    chatHistory.push({ role: 'user', content: message })

    await saveMessage({ session_id: sessionId, role: 'user', content: message })

    const assistantResponse = await callClaude(systemPrompt, chatHistory)

    await saveMessage({ session_id: sessionId, role: 'assistant', content: assistantResponse })

    // Auto-extract and save any finance/task data mentioned in the conversation
    extractAndSave(message, assistantResponse).catch(console.error)

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error('Brain API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
