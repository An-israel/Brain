import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function callClaude(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages,
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return content.text
  }
  return 'I encountered an issue processing your request.'
}
