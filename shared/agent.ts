// agent code that can run either server-side or client-side

import { streamText, type CoreMessage } from 'ai'
import { initialPrompts } from '~/shared/prompts'
import { getModel } from '~/shared/getModel'
import { Frame, MessageTypes } from '~/shared/statefulTypes'

// instruction to render a new frame of the screen with no modifications
const RENDER_SCREEN_MSG = 'render screen'

async function streamScreenHTML(frame, textStream, sendScreenHTMLDelta) {
  let screenHTML = ''

  for await (let textDelta of textStream) {
    sendScreenHTMLDelta(frame, textDelta)
    screenHTML += textDelta
  }

  return screenHTML
}

const truncate = str => !str ? String(str) : String(str).replace(/\s+/g, ' ').slice(0, 40)

type SendFrame = (frame: Frame) => Promise<void>
type SendScreenHTMLDelta = (frame: Frame, textDelta: string) => Promise<void>
export type InitialPromptName = keyof typeof initialPrompts

export function createAgent({openRouterAPIKey}) {
  const model = getModel({openRouterAPIKey, useCheapModel: USE_CHEAP_MODEL})
  console.log('createAgent(): model=', model.modelId)

  async function sendMessage(
    { msg, universalSesssionID, messages, initialPromptName, sendFrame, sendScreenHTMLDelta }:
    { msg?: string; universalSesssionID?: string, messages?: CoreMessage[], initialPromptName?: InitialPromptName, sendFrame: SendFrame; sendScreenHTMLDelta: SendScreenHTMLDelta },
  ): Promise<Frame> {
    const isFirstMessage = !messages
    let initialPrompt
    if (isFirstMessage) {
      if (msg && initialPromptName) throw new Error('cannot provide both msg and initialPromptName, chose one or the other')
      if (initialPromptName && !(initialPromptName in initialPrompts)) throw new Error(`initialPromptName must be one of ${initialPrompts.join(', ')}`)

      initialPrompt = initialPrompts[initialPromptName]

      messages = [{ role: 'system', content: initialPrompt.systemPrompt }]
      msg = initialPrompt.prompt
    }

    const frame = new Frame({
      universalSesssionID,
      modelID: model.modelId,
      messages: [...messages],
    })

    frame.setInputMessage(msg)

    if (isFirstMessage && CACHE_FIRST_SCREEN_HTML && initialPrompt.cachedFirstScreenHtml) {
      console.log(`sendMessage(): cached frame ${frame.id}, returning ${initialPromptName}`)
      const rawScreenHTML = initialPrompt.cachedFirstScreenHtml
      frame.setOutputMessage(rawScreenHTML, {type: MessageTypes.RawScreenHTML})
    } else {
      console.log(`sendMessage(): rendering frame ${frame.id}, msg => ${truncate(msg)}`)
      const { textStream } = await streamText({ model, messages: frame.messages })
      const rawScreenHTML = await streamScreenHTML(frame, textStream, sendScreenHTMLDelta)
      frame.setOutputMessage(rawScreenHTML, {type: MessageTypes.RawScreenHTML})
    }

    const renderDuration = frame.stopRenderClock()
    console.log(`sendMessage(): frame complete, took ${renderDuration.toFixed(1)} seconds, returning a ${(frame.outputMessage.content.length/1024).toFixed(3)}kb frame, msg => ${truncate(msg)}`)

    sendFrame(frame)

    // Log full screenHTML on prod, too noisy for dev
    if (!import.meta.dev) {
      console.log(`<screenHTML frameID="${frame.id}">\n${frame.outputMessage.content}"\n</screenHTML>`)
    }

    return frame
  }

  return { sendMessage }
}
