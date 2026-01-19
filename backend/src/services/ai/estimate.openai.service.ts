import { openaiClient } from './openai.client'
import { estimatePrompt } from '../../prompts/estimate.prompt'


export async function generateEstimateWithOpenAI(text: string) {
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: estimatePrompt },
      { role: 'user', content: text },
    ],
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    throw new Error('Empty response from OpenAI')
  }

  try {
    return JSON.parse(content)
  } catch {
    throw new Error('OpenAI returned invalid JSON')
  }
}
