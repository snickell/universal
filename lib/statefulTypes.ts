import { type CoreMessage, type CoreSystemMessage, type CoreUserMessage } from 'ai'
import { ulid } from 'ulid'

type ID = string

export class UniversalSession {
  universalSesssionID: string = null
  frames: Frame[] = []

  constructor(init?: Partial<UniversalSession>) {
    Object.assign(this, init)
    this.universalSesssionID ||= ulid()
  }
}

export enum MessageTypes {
  Prompt = 'prompt',
  Events = 'events',
  RawScreenHTML = 'raw_screen_html',
}

class Message {
  messageID: ID = ulid()
  universalSesssionID: string

  content: string
  date: Date = new Date()

  type: MessageTypes

  constructor(init?: Partial<Message>) {
    Object.assign(this, init)
  }
}

export class InputMessage extends Message implements CoreUserMessage {
  role: 'user'
}

export class OutputMessage extends Message implements CoreSystemMessage {
  role: 'system'
}

export class Frame {
  universalSesssionID: ID = null
  frameID: ID = ulid()
  prevFrameID: ID = null

  messages: CoreMessage[] = []
  screenHTML: string = ""
  modelId: string = ""

  universalSession: UniversalSession = null
  inputMessage: InputMessage = null
  outputMessage: OutputMessage = null

  date: Date = new Date()
  renderStartTime: Date = new Date()
  renderEndTime: Date = null
  renderTimeSecs: number = 0

  constructor(init?: Partial<Frame>) {
    Object.assign(this, init)
    this.universalSesssionID ||= ulid()
  }

  setInputMessage(msgString: string) {
    let type: MessageTypes

    let jsonMsg = undefined
    try {
      jsonMsg = JSON.parse(msgString)
    } catch (e) {}
    if (jsonMsg != undefined) {
      if (jsonMsg.events) {
        // events is screwy: its an object with one key, events, but we don't "de-nest" it because
        // its part of the chat flow, and I think it helps the LLM keep track when its knows
        // the list of events are in fact "events", its sort of a label for the input message.
        type = MessageTypes.Events
        msgString = JSON.stringify({ msg: jsonMsg.events })
      } else {
        throw new Error(`invalid input message: '${msgString}'`)
      }
    } else {
      // Its a prompt string not parseable JSON!
      type = MessageTypes.Prompt
    }

    this.inputMessage = new InputMessage({
      universalSesssionID: this.universalSesssionID,
      content: msgString,
      type: type,
    })
    this.messages.push({role: 'user', content: this.inputMessage.content})
    return this.inputMessage
  }

  setOutputMessage(rawScreenHTML: string, {type}: {type: MessageTypes}) {
    this.outputMessage = new OutputMessage({
      universalSesssionID: this.universalSesssionID,
      content: rawScreenHTML,
      type: type,
    })
    this.messages.push({role: 'assistant', content: this.outputMessage.content})
    this.stopRenderClock()
    return this.outputMessage
  }

  stopRenderClock() {
    this.renderEndTime = new Date()
    this.renderTimeSecs = (this.renderEndTime.getTime() - this.renderStartTime.getTime()) / 1000.0
    return this.renderTimeSecs
  }
}
