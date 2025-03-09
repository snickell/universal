// agent code that can run either server-side or client-side

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import { mockGenerateText } from './mockGenerateText.js'
import { SYSTEM_PROMPT } from './systemPrompt.js'
import { SYSTEM_PROMPT_HTML } from './systemPromptHTML.js'
import { FIRST_SVG } from './cacheFirstSVG.js'
import { USE_CHEAP_MODEL, FIRST_SVG_FROM_CACHE, MOCK_GENERATE_TEXT, USE_HTML } from './constants.js'

// instruction to render a new SVG with no modifications
const RENDER_SVG_MSG = 'render screen'

const _systemPrompt = USE_HTML ? SYSTEM_PROMPT_HTML : SYSTEM_PROMPT
console.log("\n\nUSING SYSTEM PROMPT:\n", _systemPrompt, "\n\n")

function systemPrompt() {
  return { role: 'system', content: _systemPrompt }
}

export function createAgent({openRouterAPIKey}) {
  if (!openRouterAPIKey) throw new Error('OpenRouter API key is required')
  const openrouter = createOpenRouter({apiKey: openRouterAPIKey})

  const CHEAP_MODEL = openrouter('openai/gpt-4o-mini')
  const NORMAL_MODEL = openrouter('anthropic/claude-3.7-sonnet')
  const model = USE_CHEAP_MODEL ? CHEAP_MODEL : NORMAL_MODEL
  const _generateText = MOCK_GENERATE_TEXT ? mockGenerateText : generateText

  async function sendMessage({msg=RENDER_SVG_MSG, messages}) {
    const start = Date.now()
    const firstMessage = !messages
    if (firstMessage) {
      messages = [systemPrompt()]
    }

    messages.push({ role: 'user', content: msg })
    let svg
    if (firstMessage && FIRST_SVG_FROM_CACHE) {
      svg = FIRST_SVG
    } else {
      const { text } = await _generateText({ model, messages })
      svg = text
    }
    messages.push({ role: 'assistant', content: svg })

    console.log(svg)

    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`sendMessage() took ${duration} seconds, returning a ${(svg.length/1024).toFixed(3)}kb frame, msg => ${msg.replace(/\s+/g, ' ').slice(0, 40)}`)

    return { svg, messages }
  }

  return { sendMessage }
}
