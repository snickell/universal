<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import debounce from 'debounce'
import { SEND_RESIZE_MESSAGES } from '~/lib/constants'

const {sendMessage} = defineProps({
  screenHTML: {
    type: String,
    required: true
  },
  sendMessage: {
    type: Function,
    required: true
  }
})

const screenContainer = ref(null)

const isATextInputEl = el =>
  (el.tagName === 'TEXTAREA')
  || (el.tagName === 'INPUT' && ['text', 'password', 'email', 'search', 'url', 'tel'].includes(el.type))
  || el.contentIsEditable

let eventQueue = []
function queueEventToSendAsMessage({event, sendImmediately = false}) {
  let el = event.target

  // The event.target el might not have a id attr if the LLM didn't follow instructions
  // if it doesn't have an id, we walk up the tree until we find a parent el that does have one
  while (el && !el.id) el = el.parentElement
  if (el && el.id) {
    // don't trigger click events on text input elements, eventually with a high frame
    // rate we'd want this, to do auto-complete etc, but 95% of the time, you don't want
    // to wait for a screen redraw when you click in one, you want to enter text and submit 
    // it later
    if (event.type == 'click' && isATextInputEl(el)) return

    const universalEvent = {
      target: { id: el.id },
      type: event.type,
      at: new Date().toISOString(),
    }

    if (event instanceof MouseEvent) {
      universalEvent.button = event.button

      // These are relative to el, the first ancestor with an id:
      universalEvent.offsetX = event.clientX - el.getBoundingClientRect().left
      universalEvent.offsetY = event.clientY - el.getBoundingClientRect().top
    }

    eventQueue.push(universalEvent)

    if (sendImmediately) sendQueuedEventsAsMessage()
  } else {
    console.error('ScreenContainer: no element with an id found for event', event)
  }
}

function sendQueuedEventsAsMessage() {
  console.log(`sendQueuedEventsAsMessage`, eventQueue)
  const events = eventQueue
  eventQueue = []
  sendMessage(JSON.stringify({events}))
}

// javascript fires a click before a double-click, it doesn't wait to see if a
// second click is coming so we have to implement that logic ourselves
let pendingSingleClickTimeout = null
const DOUBLE_CLICK_TIMEOUT_MS = 500
function onClickOrDblClick(event) {
  if (!pendingSingleClickTimeout) {
    // we got a single click, lets wait and see if its a double-click
    pendingSingleClickTimeout = setTimeout(() => {
      // pendingSingleClickTimeout expired and no new clicks were received
      // therefore: its just a single click, send the event:
      pendingSingleClickTimeout = null
      queueEventToSendAsMessage({event, sendImmediately: true})
    }, DOUBLE_CLICK_TIMEOUT_MS)
  } else {
    // a dblclick happened before pendingSingleClickTimeout expired
    // therefore: this is a double-click, send the event:
    clearTimeout(pendingSingleClickTimeout)
    pendingSingleClickTimeout = null
    queueEventToSendAsMessage({event, sendImmediately: true})
  }
}

let lastWidth = null
let lastHeight = null
// call sendMessage with dimensions to render HTML at 
async function sendDimensions() {
  if (!screenContainer.value) return
  if (!SEND_RESIZE_MESSAGES) return
  
  const { clientWidth: width, clientHeight: height } = screenContainer.value
  if (lastWidth === width && lastHeight === height) return
  
  lastWidth = width
  lastHeight = height
  
  sendMessage(`render all future screens with width=${width} and height=${height}`)
}

let resizeObserver = null
onMounted(async () => {
  // render initial frame, should be cached and therefore 'instant'
  await sendMessage()

  // send initial dimensions, this will render a second frame, which will be slow
  sendDimensions()
  
  // Watch ScreenContainer for resize events, transmit them to agent
  resizeObserver = new ResizeObserver(
    debounce(() => sendDimensions(), 1000)
  )
  resizeObserver.observe(screenContainer.value)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div class="screen-container"
    ref="screenContainer"
    @click="onClickOrDblClick"
    @dblclick="onClickOrDblClick"
    v-html="screenHTML"
  ></div>
</template>

<style scoped>
.screen-container {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background: linear-gradient(326deg, #300000 0%, #8b0e5e 74%);
  
  /* Don't let any children inside #screen, returned by the LLM, escape their box */
  overflow: hidden;
  position: relative;
  z-index: 0;
}
</style>

<!-- we must use an unscoped <style> to style the contents of the v-html -->
<style>
/* #screen is defined in the prompt to be the top-level container */
#screen {
  flex: 1;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}
</style>
