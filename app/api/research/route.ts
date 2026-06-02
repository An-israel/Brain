import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const client = new Anthropic()

const RESEARCH_PROMPT = `You are BRAIN's research engine for Aniekan Israel, a Nigerian entrepreneur, designer, video editor, website developer, and content creator.

His context:
- Skills: web development (Next.js, Lovable, Claude Code), graphic design, video editing, writing, public speaking
- Monthly guaranteed income: ₦480,000 (EMC salary)
- Target: ₦2,000,000/month within 6 months
- June extra income target: ₦400,000
- Audience: young Africans aged 15-25
- Location: Nigeria
- Startups: SkryveAI (AI client acquisition, pivoting to marketplace), Nexus HQ (HR platform for African SMEs)

Search for REAL, VERIFIED income and business opportunities that match his skills and context. Focus on:
1. Freelance platforms or clients paying in USD for design/dev/editing work from Nigeria
2. African tech grants, accelerators, or funding for his startups
3. Partnership or sponsorship opportunities for Nigerian content creators
4. High-paying online courses or bootcamps he could teach at
5. Remote job opportunities or consulting gigs matching his skills

For each opportunity found, evaluate:
- Is it real and currently active? (cross-check)
- Is it accessible from Nigeria?
- What is the realistic income potential in Naira?
- What specific action does Aniekan need to take?

Only return opportunities with confidence_score >= 7 out of 10.

Return your findings as a JSON array with this structure:
[{
  "title": "string",
  "type": "income|investment|partnership|tool|client",
  "description": "2-3 sentences explaining what it is and why it fits Aniekan",
  "source_url": "actual URL",
  "confidence_score": 7-10,
  "verified": true,
  "recommended": true,
  "action_required": "Specific first step Aniekan must take",
  "relevance_tags": ["design", "nigeria", etc]
}]

Search thoroughly. Return only the JSON array, nothing else.`

export async function POST(_request: NextRequest) {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
      messages: [{ role: 'user', content: RESEARCH_PROMPT }],
    })

    // Extract text from response (after tool use)
    let resultText = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        resultText = block.text
        break
      }
    }

    // Parse opportunities from Claude's response
    let opportunities: Array<Record<string, unknown>> = []
    try {
      const jsonMatch = resultText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        opportunities = JSON.parse(jsonMatch[0])
      }
    } catch {
      console.error('Failed to parse opportunities JSON')
      return NextResponse.json({ error: 'Failed to parse research results' }, { status: 500 })
    }

    // Save to Supabase (only high-confidence ones)
    const supabase = createServerSupabaseClient()
    const toInsert = opportunities
      .filter((o) => (o.confidence_score as number) >= 7)
      .map((o) => ({
        ...o,
        discovered_at: new Date().toISOString(),
        status: 'new',
      }))

    if (toInsert.length > 0) {
      const { error } = await supabase.from('opportunities').insert(toInsert)
      if (error) console.error('Error saving opportunities:', error)
    }

    return NextResponse.json({ opportunities: toInsert, count: toInsert.length })
  } catch (error) {
    console.error('Research pipeline error:', error)
    return NextResponse.json(
      { error: 'Research failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
