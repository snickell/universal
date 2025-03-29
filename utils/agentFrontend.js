import { sendMessageWebSocket } from './agent-backends/websocket.js'
import { sendMessageHTTP } from './agent-backends/http.js'

import { USE_WEB_SOCKET } from '~/shared/constants'

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

export const sendMessageToBackend = USE_WEB_SOCKET ? sendMessageWebSocket : sendMessageHTTP
