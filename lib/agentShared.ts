// agent code that can run either server-side or client-side

import { streamText, type CoreMessage } from 'ai'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { FIRST_SCREEN_HTML } from '@/lib/cacheFirstScreenHTML'
import { USE_CHEAP_MODEL, CACHE_FIRST_SCREEN_HTML, MOCK_GENERATE_TEXT } from '@/lib/constants'
import { getModel } from '@/lib/getModel'

// instruction to render a new frame of the screen with no modifications
const RENDER_SCREEN_MSG = 'render screen'

console.log("\n\nUSING SYSTEM PROMPT:\n", SYSTEM_PROMPT, "\n\n")

function systemPrompt() : CoreMessage {
  return { role: 'system', content: SYSTEM_PROMPT }
}

async function streamScreenHTML(frame, textStream, sendScreenHTMLDelta) {
  let screenHTML = ''

  let firstLoop = true
  let trimLastLine = false
  for await (let textDelta of textStream) {
    if (firstLoop) {
      firstLoop = false
      // Claude never seems to need this, but a number of CHEAP_MODELs do
      if (textDelta.startsWith('```')) {
        const msg = `WARNING: LLM model did not follow instructions and returned a markdown code block (i.e. it starts with: \`\`\`)`
        if (!textDelta.includes('\n')) throw new Error(msg + ' cannot recover, because the first textDelta is too short and does not contain a newline')
        console.warn(msg + ' stripping first and last line to try to recover')
        textDelta = textDelta.split("\n").slice(1).join("\n")
        trimLastLine = true
      }
    }

    sendScreenHTMLDelta(frame, textDelta)
    screenHTML += textDelta
  }

  if (trimLastLine) {
    screenHTML = screenHTML.split("\n").slice(0, -1).join("\n")
  }

  return screenHTML
}

export class Frame {
  frameID: string = crypto.randomUUID()
  messages: CoreMessage[] = []
  screenHTML: string = ""

  constructor(init?: Partial<Frame>) {
    Object.assign(this, init)
  }
}

type SendFrame = (frame: Frame) => Promise<void>
type SendScreenHTMLDelta = (frame: Frame, textDelta: string) => Promise<void>

export function createAgent({openRouterAPIKey}) {
  const model = getModel({openRouterAPIKey, useCheapModel: USE_CHEAP_MODEL})

  async function sendMessage(
    { msg = RENDER_SCREEN_MSG, messages, sendFrame, sendScreenHTMLDelta }:
    { msg?: string; messages?: CoreMessage[], sendFrame: SendFrame; sendScreenHTMLDelta: SendScreenHTMLDelta },
  ): Promise<Frame> {
    const start = Date.now()

    const firstMessage = !messages
    if (firstMessage) {
      messages = [systemPrompt()]
    }

    const frame = new Frame({
      messages: messages,
    })

    frame.messages.push({ role: 'user', content: msg })
    if (firstMessage && CACHE_FIRST_SCREEN_HTML) {
      frame.screenHTML = FIRST_SCREEN_HTML
    } else {
      const { textStream } = await streamText({ model, messages })
      frame.screenHTML = await streamScreenHTML(frame, textStream, sendScreenHTMLDelta)
    }
    frame.messages.push({ role: 'assistant', content: frame.screenHTML })

    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`sendMessage() took ${duration} seconds, returning a ${(frame.screenHTML.length/1024).toFixed(3)}kb frame, msg => ${msg.replace(/\s+/g, ' ').slice(0, 40)}`)

    sendFrame(frame)

    return frame
  }

  return { sendMessage }
}
