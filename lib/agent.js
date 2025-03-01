let messages = undefined

function getMessages() {
  return messages
}

function setMessages(_messages) {
  messages = _messages
}

export async function sendMessage({ msg }) {
  const response = await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      msg, 
      messages: getMessages() 
    })
  })
  
  const result = await response.json()
  setMessages(result.messages)
  return { svg: result.svg }
}
