// agent code that can run either server-side or client-side

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import { mockGenerateText } from './mockGenerateText.js'
import { SYSTEM_PROMPT_HTML } from './systemPromptHTML.js'
import { FIRST_SCREEN_HTML } from './cacheFirstScreenHTML.js'
import { USE_CHEAP_MODEL, CACHE_FIRST_SCREEN_HTML, MOCK_GENERATE_TEXT } from './constants.js'

// instruction to render a new frame of the screen with no modifications
const RENDER_SCREEN_MSG = 'render screen'

console.log("\n\nUSING SYSTEM PROMPT:\n", SYSTEM_PROMPT_HTML, "\n\n")

function systemPrompt() {
  return { role: 'system', content: SYSTEM_PROMPT_HTML }
}

export function createAgent({openRouterAPIKey}) {
  if (!openRouterAPIKey) throw new Error('OpenRouter API key is required')
  const openrouter = createOpenRouter({apiKey: openRouterAPIKey})

  const CHEAP_MODEL = openrouter('openai/gpt-4o-mini')
  const NORMAL_MODEL = openrouter('anthropic/claude-3.7-sonnet')
  const model = USE_CHEAP_MODEL ? CHEAP_MODEL : NORMAL_MODEL
  const _generateText = MOCK_GENERATE_TEXT ? mockGenerateText : generateText

  async function sendMessage({msg=RENDER_SCREEN_MSG, messages}) {
    const start = Date.now()

    const firstMessage = !messages
    if (firstMessage) {
      messages = [systemPrompt()]
    }

    messages.push({ role: 'user', content: msg })
    let screenHTML
    if (firstMessage && CACHE_FIRST_SCREEN_HTML) {
      screenHTML = FIRST_SCREEN_HTML
    } else {
      const { text } = await _generateText({ model, messages })
      screenHTML = text
    }
    messages.push({ role: 'assistant', content: screenHTML })

    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`sendMessage() took ${duration} seconds, returning a ${(screenHTML.length/1024).toFixed(3)}kb frame, msg => ${msg.replace(/\s+/g, ' ').slice(0, 40)}`)

    return { screenHTML, messages }
  }

  return { sendMessage }
}
