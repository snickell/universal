<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import debounce from 'debounce'

const props = defineProps({
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

// This is a bad hack. We can't draw enough FPS to handle character-by-character keyboard
// input events. Therefore, when we send ANOTHER event, we scan the screen for any editable
// text elements, and send each of them as a queued event prior to the event that actually
// triggers a redraw / message send.
function getAllEditableText(parentEl) {
  const EDITABLE_TEXT_SELECTOR = `
    textarea,
    input[type="text"],
    input[type="password"],
    input[type="email"],
    input[type="search"],
    input[type="url"],
    input[type="tel"],
    [contenteditable],
    [contenteditable="true"]
  `

  return [...parentEl.querySelectorAll(EDITABLE_TEXT_SELECTOR)]
    .map(el => ({
      id: el.id || null,
      value:
        el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
          ? el.value
          : el.textContent
    }))
}

function getSyntheticInputEventsFromEditableTextElements() {
  const editableTextElementState = getAllEditableText(screenEl.value)
  return editableTextElementState.map(({ id, value }) => ({
    type: 'input',
    target: { id, value },
    at: new Date().toISOString(),
  }))
}

const isATextInputEl = el =>
  (el.tagName === 'TEXTAREA')
  || (el.tagName === 'INPUT' && ['text', 'password', 'email', 'search', 'url', 'tel'].includes(el.type))
  || el.isContentEditable

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

    // since we block text / input events from firing in real-time, we need to send the
    // current state of all editable text elements as synthetic events
    eventQueue.push(
      ...getSyntheticInputEventsFromEditableTextElements()
    )

    const universalEvent = {
      type: event.type,
      target: { id: el.id },
      at: new Date().toISOString(),
    }

    if (event instanceof MouseEvent) {
      // PSA: if event is missing some of its expected properties, check cloneEvent() below

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
  props.sendMessage(JSON.stringify({events}))
}

function cloneEvent(nativeEvent) {
  const clonedEvent = Object.fromEntries([
    'type', 'target', 'currentTarget', 'clientX', 'clientY', 'offsetX', 'offsetY',
    'pageX', 'pageY', 'screenX', 'screenY', 'key', 'code', 'keyCode', 'shiftKey',
    'ctrlKey', 'altKey', 'metaKey', 'button', 'buttons', 'detail', 'timeStamp', 'defaultPrevented'
  ].map(key => [key, nativeEvent[key]]))
  Object.setPrototypeOf(clonedEvent, Object.getPrototypeOf(nativeEvent))
  return clonedEvent
}

// javascript fires a click before a double-click, it doesn't wait to see if a
// second click is coming so we have to implement that logic ourselves
let pendingSingleClickTimeout = null
const DOUBLE_CLICK_TIMEOUT_MS = 500
function onClickOrDblClick(event) {
  // we need to clone parts of the event, because weird shadow DOM trickery makes
  // the event target and other entries get "retargeted" by the time our setTimeout fires.
  event = cloneEvent(event)
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

// This function registers event handlers for the whole screen that are
// then forwarded to the LLM as a message kinda like:
//   "the user clicked at x=100 y=200 on the element with id='submit-button'"
//
// The LLM can then use that info to update the screen and respond to the click,
// and generates an updated frame based on clicking on the screen in that place.
function forwardUserEventsLikeClickEtcToLLM(screenContainerEl) {
    // Handle single-click and double-click 
    screenContainerEl.addEventListener('click', onClickOrDblClick)
    screenContainerEl.addEventListener('dblclick', onClickOrDblClick)

    // Handle right-click events
    screenContainerEl.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      queueEventToSendAsMessage({event: cloneEvent(event), sendImmediately: true})
    })
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
  
  props.sendMessage(`render all future screens with width=${width} and height=${height}`)
}

const shadowRoot = ref(null)
const screenEl = ref(null)

/* This CSS is injected at the start of the shadow DOM, it lets us tweak things */
const INSIDE_SHADOW_DOM_STYLE = `
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
`

const updateScreenHTML = () => {
  if (shadowRoot.value && props.screenHTML) {
    // Set the contents of the shadow DOM to the HTML returned by the LLM
    // along with injecting a standard <style> block
    shadowRoot.value.innerHTML = `
      ${INSIDE_SHADOW_DOM_STYLE}
      ${props.screenHTML}
    `
    screenEl.value = shadowRoot.value.querySelector('#screen')
  }
}

let resizeObserver = null

onMounted(async () => {
  // Create a shadow DOM to contain the wild HTML/CSS returned by the LLM
  if (screenContainer.value) {
    shadowRoot.value = screenContainer.value.attachShadow({ mode: 'open' })
    
    // Add event listeners directly to shadowRoot, these end up dispatching messages to the LLM
    forwardUserEventsLikeClickEtcToLLM(shadowRoot.value)

    updateScreenHTML()
  }

  // send initial dimensions, this will render a second frame, which will be slow
  sendDimensions()
  
  // Watch ScreenContainer for resize events, transmit them to agent
  resizeObserver = new ResizeObserver(
    debounce(() => sendDimensions(), 1000)
  )
  resizeObserver.observe(screenContainer.value)
})

watch(() => props.screenHTML, updateScreenHTML)

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

defineExpose({ screenEl})
</script>

<template>
  <div class="bg">
    <slot></slot>
    <div class="screen-container"
      ref="screenContainer"
    ></div>
  </div>
</template>

<style scoped>
.screen-container, .bg {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  
  /* Don't let any children inside #screen, returned by the LLM, escape their box */
  overflow: hidden;
  position: relative;
}

.bg {
  background: #4AADCE;
}
</style>

<style scoped>
.screen-container {
  /* 
  By default, clickable things inside the screen, like dock icons, will follow browser
  UX patterns and therefore be the `cursor: pointer` (the "clicky hand"). This is fine UX-wise,
  but OSes don't use this, and therefore it breaks the illusion.

  Additionally, we don't support text input yet, so showing `cursor: text` (the "I-beam")
  misleads people, and they waste demo time trying to input text and get frustrated. We
  should revisit this setting once we support text input events.
  */
  cursor: default;
}
</style>
