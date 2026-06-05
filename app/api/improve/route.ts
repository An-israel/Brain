import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient, saveImprovement, updateBrainContext, getRecentLearnings } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic()

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Get recent conversations (last 50 messages)
    const { data: conversations } = await supabase
      .from('conversations')
      .select('role, content, created_at, context_tags')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!conversations || conversations.length < 4) {
      return NextResponse.json({ message: 'Not enough conversation history yet. Keep chatting with BRAIN first.' })
    }

    const conversationText = conversations
      .reverse()
      .map((c: { role: string; content: string }) => `${c.role.toUpperCase()}: ${c.content.slice(0, 300)}`)
      .join('\n\n')

    const existingLearnings = await getRecentLearnings(20)

    const prompt = `You are BRAIN's self-improvement engine. You are analyzing Aniekan Israel's conversations with his AI Chief of Staff to make BRAIN dramatically better.

RECENT CONVERSATIONS:
${conversationText}

EXISTING LEARNINGS ALREADY CAPTURED:
${existingLearnings.map((l: { learning: string }) => `- ${l.learning}`).join('\n')}

Your job: Identify 3-5 high-impact improvements BRAIN should make to itself. Think about:
1. What topics keep coming up that BRAIN should know more about?
2. What response patterns work well vs poorly for Aniekan?
3. What context is BRAIN missing that would make it more useful?
4. What should BRAIN proactively bring up that it hasn't?
5. What gaps exist in BRAIN's understanding of Aniekan's life/goals?

Return a JSON object:
{
  "improvements": [
    {
      "type": "system_prompt|response_style|new_context|feature_idea|pattern_learned",
      "description": "What this improvement is",
      "content": "The specific addition or change to make (for system_prompt type, write the actual text to add)"
    }
  ],
  "context_updates": {
    "key": "value"
  },
  "summary": "One sentence summary of what was improved"
}`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find(b => b.type === 'text')?.text || '{}'
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ message: 'Improvement cycle complete — no structured output generated.' })

    const result = JSON.parse(match[0])

    // Save each improvement
    for (const imp of (result.improvements || [])) {
      await saveImprovement({
        trigger_source: 'self_improvement_cycle',
        improvement_type: imp.type,
        description: imp.description,
        content: imp.content,
      })
    }

    // Update brain_context with any new insights
    if (result.context_updates && Object.keys(result.context_updates).length > 0) {
      await updateBrainContext({ goals: result.context_updates })
    }

    return NextResponse.json({
      success: true,
      improvements: result.improvements?.length || 0,
      summary: result.summary || 'Improvement cycle complete.',
    })
  } catch (err) {
    console.error('Improve error:', err)
    return NextResponse.json({ error: 'Improvement cycle failed', details: err instanceof Error ? err.message : 'Unknown' }, { status: 500 })
  }
}
