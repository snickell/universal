
let messages = undefined
let universalSesssionID = undefined

globalThis.debug ||= {}

export function getUniversalSesssionID() {
  return universalSesssionID
}

export function setUniversalSesssionID(_universalSesssionID) {
  universalSesssionID = _universalSesssionID
  globalThis.debug.universalSesssionID = universalSesssionID
}

export function getMessages() {
  return messages
}

export function setMessages(_messages) {
  messages = _messages
  globalThis.debug.messages = messages
}
