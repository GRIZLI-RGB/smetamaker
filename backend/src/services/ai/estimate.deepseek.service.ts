import { deepseekClient } from './openai.client'
import { estimatePrompt } from '../../prompts/estimate.prompt'


export async function generateEstimate(text: string) {
  const completion = await deepseekClient.chat.completions.create({
    model: 'deepseek-chat',
    temperature: 0.2,
    messages: [
      { role: 'system', content: estimatePrompt },
      { role: 'user', content: text },
    ],
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    throw new Error('Empty response from DeepSeek')
  }

  try {
    return JSON.parse(content)
  } catch {
    throw new Error('DeepSeek returned invalid JSON')
  }
}
