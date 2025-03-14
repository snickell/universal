// Implements a WebSocket that forwards messages between agent.js and agentShared.js
import { createAgent } from '@/lib/agentShared'
import { getDurableObjectEnv } from '@/server/plugins/cache-durable-object'
import { DEBUG_WEBSOCKET } from '@/lib/constants'

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

    const env = getDurableObjectEnv()
    // list all the keys in env:
    console.log("getDurableObjectEnv keys:", Object.keys(env))

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

const debugWS = (...args) => DEBUG_WEBSOCKET ? console.log('DEBUG_WEBSOCKET', ...args) : undefined

export default defineWebSocketHandler({
  open(peer) {
    debugWS("websocket: open", peer.id);
  },
  close(peer) {
    debugWS("websocket: close", peer.id);
  },
  async message(peer, body) {
    debugWS(`websocket: raw body=${truncate(body)}`)
    console.log('websocket: Object.keys(peer)=', Object.keys(peer), "peer=", peer);
    let keys = []
    for (const key in peer) {
      keys += key
    }
    console.log('websocket: peer keys by for loop=', keys)
    console.log('websocket: peer.cfEnv=', peer.cfEnv, 'peer.cfCtx=', peer.cfCtx)

    async function sendScreenHTMLDelta(frame, textDelta) {
      const screenHTMLDelta = { frameID: frame.frameID, screenHTMLDelta: textDelta }
      debugWS(`websocket: sendScreenHTMLDelta(${shortFrameID(frame)}, '${truncate(textDelta)}')`)

      peer.send({screenHTMLDelta})
    }

    async function sendFrame(frame) {
      debugWS(`websocket: sendFrame(${frame.frameID})`)
      peer.send({frame})
    }

    async function sendError(err) {
      debugWS(`websocket: sendError(${err.message})`)
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
