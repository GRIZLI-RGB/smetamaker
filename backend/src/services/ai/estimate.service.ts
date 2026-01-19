import { generateEstimate } from './estimate.deepseek.service'
import { generateEstimateWithOpenAI } from './estimate.openai.service'


type Provider = 'deepseek' | 'openai'

export async function generateEstimateUnified(
  text: string,
  provider: Provider = 'deepseek'
) {
  if (provider === 'openai') {
    return generateEstimateWithOpenAI(text)
  }

  return generateEstimate(text)
}
