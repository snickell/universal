// Implements a WebSocket that forwards messages between agent.js and agentShared.js
import { createAgent } from '@/lib/agentShared'
import { getDurableObjectEnv } from '~/server/plugins/cache-durable-object'

// This is annoying, but in prod we'll be running as part of a cloudflare durable object
// to access UNIVERSAL_OPENROUTER_API_KEY, we need to use the env variable passed to us
// by cloudflare when it initializes our websocket, NOT process.env.
//
// See: https://github.com/nitrojs/nitro/blob/70beec683c935b63b7e802243d4eb696967d9ed1/src/presets/cloudflare/runtime/cloudflare-durable.ts#L41-L44
let _agent = null
function getAgent() {
  if (!_agent) {
    const UNIVERSAL_OPENROUTER_API_KEY = process.env.UNIVERSAL_OPENROUTER_API_KEY || getDurableObjectEnv().UNIVERSAL_OPENROUTER_API_KEY
    if (!UNIVERSAL_OPENROUTER_API_KEY) throw new Error("Cannot getAgent(): UNIVERSAL_OPENROUTER_API_KEY is not set in process.env or the DurableObject's env")

    _agent = createAgent({ openRouterAPIKey: UNIVERSAL_OPENROUTER_API_KEY })
  }
  return _agent
}

function shortFrameID(frame) {
  return frame.frameID.slice(0, 8)
}

function truncate(str, len=40) {
  return String(str).replace(/\s+/g, ' ').slice(0, len)
}

export default defineWebSocketHandler({
  open(peer) {
    console.log("websocket: open", peer.id);
  },
  close(peer) {
    console.log("websocket: close", peer.id);
  },
  async message(peer, body) {
    console.log(`websocket: raw body=${truncate(body)}`)

    async function sendScreenHTMLDelta(frame, textDelta) {
      const screenHTMLDelta = { frameID: frame.frameID, screenHTMLDelta: textDelta }
      console.log(`websocket: sendScreenHTMLDelta(${shortFrameID(frame)}, '${truncate(textDelta)}')`)

      peer.send({screenHTMLDelta})
    }

    async function sendFrame(frame) {
      console.log(`websocket: sendFrame(${frame.frameID})`)
      peer.send({frame})
    }

    async function sendError(err) {
      console.error(`websocket: sendError(${err.message})`)
      peer.send({error: err.message})
    }

    const { msg, messages, initialPromptName } = body.json()
    console.log(`websocket: received msg=${msg}`)

    try {
      await getAgent().sendMessage({
        msg,
        messages,
        initialPromptName,
        sendFrame,
        sendScreenHTMLDelta
      })
    } catch (err) {
      sendError(err)
      throw err
    }
  },
})
