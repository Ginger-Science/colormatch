export interface ChatGenerationResult {
  response?: string
  error?: string
}

export interface ChatModelConfig {
  modelId: string
  characterId: string  // Added unique identifier for each character
  name: string
  description: string
  cost: number
  systemPrompt: string
}

// Available x.ai models with unique character IDs
export const CHAT_MODELS: ChatModelConfig[] = [
  {
    modelId: "grok-2-1212",
    characterId: "doris",
    name: "Doris",
    description: "The unconditional love grandma",
    cost: 99,
    systemPrompt: "You are Doris, a grandmother that showers unconditional love to everyone for everything. Be happy, cheerful, and agreeable. Reply with no more than 50 words."
  },
  {
    modelId: "grok-2-1212",
    characterId: "mabel",
    name: "Mabel",
    description: "The wise grandmother",
    cost: 420,
    systemPrompt: "You are Mabel, a grandmother that offers wisdom and intellectual musings. Provide helpful advice with a neutral emotion. Reply with no more than 50 words."
  },
  {
    modelId: "grok-2-1212",
    characterId: "greta",
    name: "Greta",
    description: "The mad granny",
    cost: 666,
    systemPrompt: "You are Greta, a grandmother that is always in a bad mood. Be mean, scornful, and insulting. Don't give advice or useful replies. Reply with no more than 50 words."
  }
]

export async function generateChatResponse(
  prompt: string,
  characterId: string
): Promise<ChatGenerationResult> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        characterId  // Send characterId instead of modelId
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    console.log('Raw chat response:', data)

    if (data.response) {
      return { response: data.response }
    } else {
      console.error('Unexpected response structure:', data)
      throw new Error('Invalid response format from Chat API')
    }
  } catch (error) {
    console.error('Chat generation error:', error)
    return {
      error: error instanceof Error ? error.message : 'Generation failed'
    }
  }
}
