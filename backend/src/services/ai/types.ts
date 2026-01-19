export interface DeepSeekChatResponse {
  id: string
  object: string
  choices: Array<{
    index: number
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: string
  }>
}
