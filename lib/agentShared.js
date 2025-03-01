// agent code that can run either server-side or client-side

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import { mockGenerateText } from './mockGenerateText.js'
import { SYSTEM_PROMPT } from './systemPrompt.js'

// instruction to render a new SVG with no modifications
const RENDER_SVG_MSG = 'render svg'

export const MODE_NORMAL = 'MODE_NORMAL'
export const MODE_CHEAP = 'MODE_CHEAP'
export const MODE_MOCK = 'MODE_MOCK'

let MODE_DEFAULT = MODE_NORMAL
// MODE_DEFAULT = MODE_CHEAP


function systemPrompt() {
  return { role: 'system', content: SYSTEM_PROMPT }
}

export function createAgent({openRouterAPIKey, mode=MODE_DEFAULT}) {
  if (!openRouterAPIKey) throw new Error('OpenRouter API key is required')
  const openrouter = createOpenRouter({apiKey: openRouterAPIKey})

  const CHEAP_MODEL = openrouter('openai/gpt-4o-mini')
  const NORMAL_MODEL = openrouter('anthropic/claude-3.7-sonnet')
  const model = mode === MODE_CHEAP ? CHEAP_MODEL : NORMAL_MODEL
  const _generateText = mode === MODE_MOCK ? mockGenerateText : generateText

  async function sendMessage({msg=RENDER_SVG_MSG, messages}) {
    if (!messages) {
      messages = [systemPrompt()]
    }

    messages.push({ role: 'user', content: msg })
    const { text: svg } = await _generateText({ model, messages })
    messages.push({ role: 'assistant', content: svg })

    console.log(svg)
    return { svg, messages }
  }

  return { sendMessage }
}
