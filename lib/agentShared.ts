// agent code that can run either server-side or client-side

import { streamText, type CoreMessage } from 'ai'
import { initialPrompts, SYSTEM_PROMPT } from '@/lib/prompts'
import { USE_CHEAP_MODEL, CACHE_FIRST_SCREEN_HTML, MOCK_GENERATE_TEXT } from '@/lib/constants'
import { getModel } from '@/lib/getModel'

// instruction to render a new frame of the screen with no modifications
const RENDER_SCREEN_MSG = 'render screen'

async function streamScreenHTML(frame, textStream, sendScreenHTMLDelta) {
  let screenHTML = ''

  let firstLoop = true
  let firstLoopTextDeltaAccumulator = ''
  let trimLastLine = false
  for await (let textDelta of textStream) {
    if (firstLoop) {
      firstLoop = false
      // Claude never seems to need this, but a number of CHEAP_MODELs do tend to start with a markdown block: ```, ugh
      // this is explicitly against our system prompt directions, but, dumb is dumb
      if (textDelta.startsWith('`')) {
        // keep looping until we have a whole first line to examine
        if (!(firstLoopTextDeltaAccumulator += textDelta).includes('\n') && firstLoopTextDeltaAccumulator.length < 100) continue
        textDelta = firstLoopTextDeltaAccumulator
        if (textDelta.startsWith('```')) {
          console.warn('WARNING: LLM model did not follow instructions and returned a markdown code block (i.e. it starts with: \`\`\`), stripping first and last line to try to recover')
          console.log('textDelta:', textDelta)
          textDelta = textDelta.split("\n").slice(1).join("\n")
          trimLastLine = true
        }
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
export type InitialPromptName = keyof typeof initialPrompts

export function createAgent({openRouterAPIKey}) {
  const model = getModel({openRouterAPIKey, useCheapModel: USE_CHEAP_MODEL})

  async function sendMessage(
    { msg, messages, initialPromptName, sendFrame, sendScreenHTMLDelta }:
    { msg?: string; messages?: CoreMessage[], initialPromptName?: InitialPromptName, sendFrame: SendFrame; sendScreenHTMLDelta: SendScreenHTMLDelta },
  ): Promise<Frame> {
    const start = Date.now()

    const isFirstMessage = !messages
    let initialPrompt
    if (isFirstMessage) {
      if (msg && initialPromptName) throw new Error('cannot provide both msg and initialPromptName, chose one or the other')
      if (initialPromptName && !(initialPromptName in initialPrompts)) throw new Error(`initialPromptName must be one of ${initialPrompts.join(', ')}`)

      initialPrompt = initialPrompts[initialPromptName]

      messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      msg = initialPrompt.prompt
    }

    const frame = new Frame({
      messages: [
        ...messages,
        { role: 'user', content: msg },
      ],
    })

    frame.messages.push({ role: 'user', content: msg })
    if (isFirstMessage && CACHE_FIRST_SCREEN_HTML && initialPrompt.cachedFirstScreenHtml) {
      frame.screenHTML = initialPrompt.cachedFirstScreenHtml
    } else {
      const { textStream } = await streamText({ model, messages: frame.messages })
      frame.screenHTML = await streamScreenHTML(frame, textStream, sendScreenHTMLDelta)
    }
    frame.messages.push({ role: 'assistant', content: frame.screenHTML })

    const end = Date.now()
    const duration = ((end - start) / 1000).toFixed(1)
    console.log(`sendMessage() took ${duration} seconds, returning a ${(frame.screenHTML.length/1024).toFixed(3)}kb frame, msg => ${msg.replace(/\s+/g, ' ').slice(0, 40)}`)

    sendFrame(frame)

    // Log full screenHTML on prod, too noisy for dev
    if (!import.meta.dev) {
      console.log(`<screenHTML>\n${frame.screenHTML}"\n</screenHTML>`)
    }

    return frame
  }

  return { sendMessage }
}
