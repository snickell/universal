import { renderNextFrameServerSide } from './agentServerSide'

// Eventually, we'll want to let people run totally client-side using their own openrouter api key
// import { createAgent } from './agentShared'

let messages = undefined

function getMessages() {
  return messages
}

function setMessages(_messages) {
  messages = _messages
}

export async function renderNextFrame(args) {
  const {messages, ...result} = await renderNextFrameServerSide({...args, messages: getMessages()})
  setMessages(messages)
  return result
}
