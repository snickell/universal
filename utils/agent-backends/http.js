import { getUniversalSesssionID, setUniversalSesssionID, getMessages, setMessages } from './shared.js'

export async function sendMessageHTTP({ msg, initialPromptName, receiveFrame, receiveScreenHTMLDelta, onError }) {
  const response = await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      msg,
      universalSesssionID: getUniversalSesssionID(),
      messages: getMessages() ,
      initialPromptName,
    })
  })
  
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
    err.response = response
    err.status = response.status
    onError(err)
    throw err
  } else {
    const frame = await response.json()
    setMessages(frame.messages)
    setUniversalSesssionID(frame.universalSesssionID)

    await receiveFrame(frame, {universalSesssionID: body.frame.universalSesssionID})
  }
}

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
