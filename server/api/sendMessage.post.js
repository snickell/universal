import { createAgent } from '~/shared/agent'

function shortFrameID(frame) {
  return frame.id.slice(0, 8)
}

function truncate(str, len=40) {
  return str.replace(/\s+/g, ' ').slice(0, len)
}

async function sendScreenHTMLDelta(frame, textDelta) {
  const screenHTMLDelta = { frameID: frame.id, screenHTMLDelta: textDelta }
  // console.log(`sendScreenHTMLDelta(${shortFrameID(frame)}, '${truncate(textDelta)}')`)

  // TODO: if this was a websocket, we would transmit the screenHTMLDelta here
}

async function sendFrame(frame) {
  console.log(`sendFrame(${frame.id})`)

  // TODO: if this was a websocket, we would transmit the frame here
}

const agent = createAgent({
  openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
})

export default defineEventHandler(async (event) => {
  // Make sure we're logged in with Google auth to protect expensive LLM calls
  await requireUserSession(event)

  const { msg, universalSesssionID, messages, initialPromptName } = await readBody(event)

  return agent.sendMessage({
    msg,
    universalSesssionID,
    messages,
    initialPromptName,
    sendFrame,
    sendScreenHTMLDelta
  })
})
