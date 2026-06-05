import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { saveLearning } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { userMessage, brainReply, sessionId } = await req.json()

    const prompt = `You are analyzing a conversation between Aniekan Israel and his AI Chief of Staff (BRAIN) to extract learnings that will make BRAIN smarter over time.

User said: "${userMessage}"
BRAIN replied: "${brainReply}"

Extract 1-3 high-value learnings from this exchange. A learning is something BRAIN should remember and apply in ALL future conversations to serve Aniekan better.

Examples of good learnings:
- "Aniekan prefers direct, numbered action plans over paragraphs"
- "Aniekan is stressed about rent due in July — always factor this into financial advice"
- "When Aniekan asks about Skryve, he wants market validation tactics, not just strategy"
- "Aniekan responds well to accountability framing — use it more"
- "Aniekan mentioned he struggles with waking up at 4AM consistently"

Categories: preference, fact, pattern, gap, improvement, habit, goal

Return ONLY a JSON array:
[{ "learning": "string", "category": "preference|fact|pattern|gap|improvement|habit|goal", "importance": 1-10 }]

If nothing meaningful to extract, return [].`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find(b => b.type === 'text')?.text || '[]'
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return NextResponse.json({ saved: 0 })

    const learnings = JSON.parse(match[0])
    let saved = 0

    for (const l of learnings) {
      if (l.learning && l.importance >= 6) {
        await saveLearning({
          session_id: sessionId,
          learning: l.learning,
          category: l.category,
          importance: l.importance,
        })
        saved++
      }
    }

    return NextResponse.json({ saved })
  } catch {
    return NextResponse.json({ saved: 0 })
  }
}
