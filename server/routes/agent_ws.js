// Implements a WebSocket that forwards messages between agent.js and agentShared.js
import { createAgent } from '~/shared/agent'
import { getDurableObjectEnv } from '@/server/plugins/cache-durable-object'

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
  return frame.id.slice(0, 8)
}

function truncate(str, len=40) {
  return String(str).replace(/\s+/g, ' ').slice(0, len)
}

const debugWS = (...args) => DEBUG_WEBSOCKET ? console.log('DEBUG_WEBSOCKET', ...args) : undefined

export default defineWebSocketHandler({
  async upgrade(request) {
    // Make sure the user is authenticated before upgrading the WebSocket connection
    const userSession = await requireUserSession(request)
    console.log(`websocket upgrade: userSession?.user?.name=`, JSON.stringify(userSession?.user?.name))
  },
  open(peer) {
    debugWS("websocket: open", peer.id);
  },
  close(peer) {
    debugWS("websocket: close", peer.id);
  },
  async message(peer, body) {
    debugWS(`websocket: raw body=${truncate(body)}`)

    async function sendScreenHTMLDelta(frame, textDelta) {
      const screenHTMLDelta = { frameID: frame.id, universalSesssionID: frame.universalSesssionID, screenHTMLDelta: textDelta }
      debugWS(`websocket: sendScreenHTMLDelta(${shortFrameID(frame)}, '${truncate(textDelta)}')`)

      peer.send({screenHTMLDelta})
    }

    async function sendFrame(frame) {
      debugWS(`websocket: sendFrame(${frame.id})`)
      await insertFrame(db, {frame, universalSession})
      peer.send({frame})
    }

    async function sendError(err) {
      debugWS(`websocket: sendError(${err.message})`)
      peer.send({error: err.message})
    }

    const { msg, universalSesssionID, messages, initialPromptName } = body.json()
    console.log(`websocket: received msg=${msg}`)


    // Make sure the user is authenticated before upgrading the WebSocket connection
    const userSession = await requireUserSession(peer)
    console.log(`websocket message: userSession?.user?.name=`, JSON.stringify(userSession?.user?.name))

    // see: ./auth/google.get.ts
    const { name, email, google_auth_id} = userSession.user
    console.log("websocket: google_auth_id=", google_auth_id)
    console.log("websocket: about to useDrizzle")
    const db = useDrizzle()
    const user = await selectOrCreateUser(db, {google_auth_id, name, email})
    console.log("websocket: looked up user.google_auth_id", user.google_auth_id)

    console.log("websocket: about to selectOrCreateSession")
    const universalSession = await selectOrCreateUniversalSession(db, {universalSesssionID, user})
    console.log("websocket: universalSession.id", universalSession.id)

    try {
      await getAgent().sendMessage({
        msg,
        universalSesssionID: universalSession.id,
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
