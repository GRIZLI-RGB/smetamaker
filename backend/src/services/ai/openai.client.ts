import OpenAI from 'openai'
import { config } from '../../config'


export const deepseekClient = new OpenAI({
  baseURL: config.deepseek.baseURL,
  apiKey: config.deepseek.apiKey,
})
