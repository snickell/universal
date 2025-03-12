// Implements a WebSocket that forwards messages between agent.js and agentShared.js
import { createAgent } from '@/lib/agentShared'

// This is annoying, but in prod we'll be running as part of a cloudflare durable object
// to access UNIVERSAL_OPENROUTER_API_KEY, we need to use the env variable passed to us
// by cloudflare when it initializes our websocket, NOT process.env.
//
// See: https://github.com/nitrojs/nitro/blob/70beec683c935b63b7e802243d4eb696967d9ed1/src/presets/cloudflare/runtime/cloudflare-durable.ts#L41-L44
import { useNitroApp } from 'nitropack/runtime'
let agent = null
if (process.env.UNIVERSAL_OPENROUTER_API_KEY) {
  // This will work in dev, or in a non-cloudflare prod
  console.log("Using process.env.UNIVERSAL_OPENROUTER_API_KEY")
  agent = createAgent({
    openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
  })
} else {
  console.log("Couldn't see process.env.UNIVERSAL_OPENROUTER_API_KEY, trying to fetch via nitro hook cloudflare:durable:init")
  useNitroApp().hooks.hook('cloudflare:durable:init', (durableObject, {env}) => {
    console.log('Durable Object initialized:', durableObject)
    console.log('Env keys:', Object.keys(env))
    console.log("Using env.UNIVERSAL_OPENROUTER_API_KEY from cloudflare:durable:init")
    agent = createAgent({
      openRouterAPIKey: env.UNIVERSAL_OPENROUTER_API_KEY,
    })
    console.log('Agent initialized:', agent)
  })
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
      await agent.sendMessage({
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
