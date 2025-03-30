import { getUniversalSesssionID, setUniversalSesssionID, getMessages, setMessages } from './shared.js'

const debugWS = (...args) => DEBUG_WEBSOCKET ? console.log('DEBUG_WEBSOCKET', ...args) : undefined

async function connectToWebSocket(path) {
  const ws = new WebSocket((`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}${path}`))

  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  return ws
}



export async function sendMessageWebSocket({ msg, initialPromptName, receiveFrame, receiveScreenHTMLDelta, onError }) {
  debugWS('connecting')
  const ws = await connectToWebSocket('/agent_ws')
  debugWS('connected')

  ws.onerror = (event) => {
    debugWS(`ws.onerror:`, event)
    const err = new Error(`websocket: ws.onerror(event=${event})`)
    err.event = event
    ws.close()
    onError(err)
  }

  ws.onmessage = (event) => {
    debugWS(`ws.onmessage:`, event)
    try {
      const body = JSON.parse(event.data)
      if (body.error) {
        onError(body.error)
      } else if (body.frame) {
        ws.close()
        setMessages(body.frame.messages)
        setUniversalSesssionID(body.frame.universalSesssionID)
        const screenHTML = receiveFrame(body.frame, {universalSesssionID: body.frame.universalSesssionID})
        updateScreenHTML({ frameID: body.frame.id, screenHTML, onError })
      } else if (body.screenHTMLDelta) {
        receiveScreenHTMLDelta(body.screenHTMLDelta)
      } else {
        console.error(`websocket: unexpected message, don't know how to handle body=`, body)
        onError(`websocket: unexpected message, don't know how to handle: ${body}`)
      }
    } catch (err) {
      console.error('websocket', err)
      onError({ err, data: event.data})
    }
  }

  const body = { msg, universalSesssionID: getUniversalSesssionID(), messages: getMessages(), initialPromptName }

  debugWS(`sending`, body)
  ws.send(JSON.stringify(body))
}
