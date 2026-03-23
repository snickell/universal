import { sendMessageWebSocket } from './agent-backends/websocket.js'
import { sendMessageHTTP } from './agent-backends/http.js'
import { registerSendBackend, getSendBackend, getActiveSendBackendName } from './agent-backends/registry.js'

// Register the built-in send backends so they are always available.
registerSendBackend('websocket', sendMessageWebSocket)
registerSendBackend('http', sendMessageHTTP)

// Re-export registration helpers so Nuxt plugins (or any client code) can add
// new send backends without forking this repo:
//
//   import { registerSendBackend, setActiveSendBackend } from '~/utils/agentFrontend.js'
//
// See plugins/custom-send-backend.client.js.example for a full working example.
export { registerSendBackend, setActiveSendBackend } from './agent-backends/registry.js'

export async function updateScreenHTML({ frameID, screenHTML, onError }) {
  const response = await fetch('/api/updateScreenHTML', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frameID, screenHTML })
  })
  
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
    err.response = response
    err.status = response.status
    onError(err)
    throw err
  }
}

export function sendMessageToBackend(opts) {
  const backendName = getActiveSendBackendName() ?? (USE_WEB_SOCKET ? 'websocket' : 'http')
  return getSendBackend(backendName)(opts)
}
