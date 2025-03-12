let messages = undefined

globalThis.debug ||= {}

function getMessages() {
  return messages
}

function setMessages(_messages) {
  messages = _messages
  globalThis.debug.messages = messages
}

export async function sendMessage({ msg, initialPromptName, receiveFrame, receiveScreenHTMLDelta, onError }) {
  const response = await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      msg,
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

    await receiveFrame(frame)
  }
}
