// Implements a WebSocket that forwards messages between agent.js and agentShared.js

import { createAgent } from '@/lib/agentShared'

function shortFrameID(frame) {
  return frame.frameID.slice(0, 8)
}

function truncate(str, len=40) {

  return String(str).replace(/\s+/g, ' ').slice(0, len)
}

const agent = createAgent({
  openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
})

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
