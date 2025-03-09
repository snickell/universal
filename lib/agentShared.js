// agent code that can run either server-side or client-side

import { generateText } from 'ai'
import { mockGenerateText } from './mockGenerateText.js'
import { SYSTEM_PROMPT } from './systemPrompt.js'
import { FIRST_SCREEN_HTML } from './cacheFirstScreenHTML.js'
import { USE_CHEAP_MODEL, CACHE_FIRST_SCREEN_HTML, MOCK_GENERATE_TEXT } from './constants.js'
import { getModel } from './getModel.js'

// instruction to render a new frame of the screen with no modifications
const RENDER_SCREEN_MSG = 'render screen'

console.log("\n\nUSING SYSTEM PROMPT:\n", SYSTEM_PROMPT, "\n\n")

function systemPrompt() {
  return { role: 'system', content: SYSTEM_PROMPT }
}

export function createAgent({openRouterAPIKey}) {
  const model = getModel({openRouterAPIKey, useCheapModel: USE_CHEAP_MODEL})
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

    // Claude never seems to need this, but a number of CHEAP_MODELs do
    if (screenHTML.startsWith('```')) {
      console.warn(`WARNING: LLM model ${model.modelId} did not follow instructions and returned a markdown code block (i.e. it starts with: \`\`\`), stripping first and last line to try to recover`)
      screenHTML = screenHTML.split("\n").slice(1, -1).join("\n")
    }

    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`sendMessage() took ${duration} seconds, returning a ${(screenHTML.length/1024).toFixed(3)}kb frame, msg => ${msg.replace(/\s+/g, ' ').slice(0, 40)}`)

    return { screenHTML, messages }
  }

  return { sendMessage }
}
