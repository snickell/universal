// agent code that can run either server-side or client-side

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { mockGenerateText } from './mockGenerateText';

// instruction to render a new SVG with no modifications
const RENDER_SVG_MSG = 'render svg'

export const MODE_NORMAL = 'MODE_NORMAL'
export const MODE_CHEAP = 'MODE_CHEAP'
export const MODE_MOCK = 'MODE_MOCK'

function systemPrompt() {
  const prompt = `You are a universal desktop operating system in the style of macOS.

1. The user will provide a new mouse/keyboard event or instruction to you.
2. You will respond to each event or instruction from the user with a single well-formed <svg/> element representing the visual state of the desktop screen after obeying their command.
3. Don't be afraid to include lots of visual detail.
4. Details of the SVG element:
- use the <g> element to group elements hierarchically
- every single element in the SVG should have a unique id="" attribute. The user will reference these ids in events and commands. Do not repeat ids. Whenever possible, use the same IDs for the same elements across responses.
- do not use <image> elements
5. Do not format your response as Markdown. For example: do not wrap the SVG in backticks to make it a "code block".

Your response in its entirety should always be a well-formed SVG document with no extra text.`;

  return { role: 'system', content: prompt }
}

export function createAgent({openRouterAPIKey, mode=MODE_NORMAL}) {
  if (!openRouterAPIKey) throw new Error('OpenRouter API key is required')
  const openrouter = createOpenRouter({apiKey: openRouterAPIKey})

  const CHEAP_MODEL = openrouter('openai/gpt-4o-mini')
  const NORMAL_MODEL = openrouter('anthropic/claude-3.7-sonnet')
  const model = mode === MODE_CHEAP ? CHEAP_MODEL : NORMAL_MODEL
  const _generateText = mode === MODE_MOCK ? mockGenerateText : generateText

  async function renderNextFrame({msg=RENDER_SVG_MSG, messages}) {
    if (!messages) {
      messages = [systemPrompt()]
    }

    messages.push({ role: 'user', content: msg })
    const { text: svg } = await _generateText({ model, messages, })
    messages.push({ role: 'assistant', content: svg })

    console.log(svg)
    return { svg, messages }
  }

  return { renderNextFrame }
}
