
<script setup>
import { ref } from 'vue'
import { sendMessage as sendMessageHTTP, sendMessageWebSocket } from '@/lib/agent'
import ScreenContainer from './ScreenContainer.vue'
import ControlBar from './ControlBar.vue'
import { initialPromptName, USE_WEB_SOCKET, DEBUG_STREAMING_PREVIEW } from '~/lib/constants'

const screenHTMLRef = ref('')
const screenPreviewHTMLRef = ref('')
const nextFrameScreenHTMLRef = ref('')
const loading = ref(false)
const lastScreenElRef = ref(null)

const isControlPopupOpen = ref(true)

const { loggedIn } = useUserSession()

globalThis.debug ||= {}

const truncate = str => !str ? String(str) : String(str).replace(/\s+/g, ' ').slice(0, 80)

// search doc for any nodes with an id and a data-use-cached attribute, and replace their outerHTML
// in doc with the innerHTML of the corresponding node with the same id= from lastDoc.value
function replaceDataUseCachedElements({el, prevEl}) {
  el.querySelectorAll('[id][data-use-cached]').forEach(node => {
    const id = node.id
    const nodeFromPrevDocWithSameID = prevEl.querySelector(`#${id}`)
    if (nodeFromPrevDocWithSameID) {
      console.log(`data-use-cached(#${node.id}), replacing:`, node, 'with:', nodeFromPrevDocWithSameID)
      node.outerHTML = nodeFromPrevDocWithSameID.outerHTML
    } else {
      console.error(`data-use-cached(#${node.id}) ERROR replacing`, node, 'no node with a matching id in prevDoc=', prevEl)
    }
  })
}

class InvalidScreenHTMLError extends Error {
  constructor(screenHTML) {
    super("Could not parse screenHTML, or it didn't contain a #screen element")
    this.name = 'InvalidScreenHTMLError'
    this.screenHTML = screenHTML
  }
}

// parse HTML string, extract #screen element, and fill in elements cached from the previous screen
function materializeScreenEl(rawScreenHTML, cacheFromEl) {
  const screenEl = new DOMParser()
    .parseFromString(rawScreenHTML, 'text/html')
    .getElementById('screen')

  if (!screenEl) throw new InvalidScreenHTMLError(rawScreenHTML)

  // remove all attrs from #screen except id="screen"
  Array.from(screenEl.attributes)
    .filter(attr => attr.name !== 'id')
    .forEach(attr => screenEl.removeAttribute(attr.name))

  // implement data-use-cached html attribute in responses
  if (cacheFromEl) {
    replaceDataUseCachedElements({el: screenEl, prevEl: cacheFromEl})
  }

  return screenEl
}

// watch isControlPopupOpen, if it transitions to false and nextFrameScreenHTMLRef is not null
// then set screenHTMLRef to nextFrameScreenHTMLRef and set nextFrameScreenHTMLRef to null
watch(() => isControlPopupOpen.value, (isOpen) => {
  if (!isOpen && nextFrameScreenHTMLRef.value) {
    const nextFrameScreenHTML = nextFrameScreenHTMLRef.value
    nextFrameScreenHTMLRef.value = null
    screenHTMLRef.value = nextFrameScreenHTML
  }
})

async function sendMessage(msg) {
  loading.value = true
  screenPreviewHTMLRef.value = ''

  const truncatedMsg = truncate(msg)
  console.log()
  console.log(`sendMessage('${truncatedMsg}''):`, msg)

  function receiveFrame(frame) {
    loading.value = false

    const rawScreenHTML = frame.screenHTML
    globalThis.debug.rawScreenHTML = rawScreenHTML
    console.log(`agentSendMessage('${truncatedMsg}'') returned '${truncate(rawScreenHTML)}' (see: globalThis.debug.rawScreenHTML)'`)

    const screenEl = materializeScreenEl(rawScreenHTML, lastScreenElRef.value)

    lastScreenElRef.value = screenEl

    const nextFrameScreenHTML = screenEl.outerHTML
    screenPreviewHTMLRef.value = nextFrameScreenHTML

    // Now here we play a little game, if the popup is open we don't immediately swap
    // in the new screen, we wait until the popup is closed. This allows the user to
    // see the new frame transition in, and reminds them what they had clicked on to
    // get the frame. People forget a lot in 1 minute!
    if (isControlPopupOpen.value) {
      nextFrameScreenHTMLRef.value = nextFrameScreenHTML
    } else {
      nextFrameScreenHTMLRef.value = null
      screenHTMLRef.value = nextFrameScreenHTML
    }
  }

  let screenHTMLDeltaAccumulator = ''
  function receiveScreenHTMLDelta({ frameID, screenHTMLDelta}) {
    if (DEBUG_STREAMING_PREVIEW) console.log('receiveScreenHTMLDelta:', screenHTMLDelta)
    screenHTMLDeltaAccumulator += screenHTMLDelta
    try {
      const screenEl = materializeScreenEl(screenHTMLDeltaAccumulator, lastScreenElRef.value)
      screenPreviewHTMLRef.value = screenEl.outerHTML
    } catch (err) {
      // its expected that we might get an InvalidScreenHTMLError until we've received the full screen
      if (!(err instanceof InvalidScreenHTMLError)) {
        throw err
      }
    }
  }

  let firstError = true
  function onError(error) {
    console.error('sendMessage() error:', error)
    firstError = false
    loading.value = false
  }

  const sendMessageToServer = USE_WEB_SOCKET ? sendMessageWebSocket : sendMessageHTTP
  sendMessageToServer({ 
    msg,
    initialPromptName,
    receiveFrame,
    receiveScreenHTMLDelta,
    onError,
  })
}
</script>

<template>
  <div class="universal">
    
    <ScreenContainer
      :screenHTML="screenHTMLRef"
      :sendMessage="sendMessage"
    />
    
    <ControlBar
      :loading="loading"
      :sendMessage="sendMessage"
      :needAuth="!loggedIn"
      :screenPreviewHTML="screenPreviewHTMLRef"
      v-model:isControlPopupOpen="isControlPopupOpen"
    />

    <div style="position: absolute; top: 0; left: 0; z-index: 1000; background-color: red; font-size: 300%">
      isControlPopupOpen: {{ String(isControlPopupOpen) }}
    </div>
  </div>
</template>

<style scoped>
.universal {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

<style>
/* Material Design Symbols (formerly known as Material Icons) */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

/* Roboto is our OS screen font */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

/*
Cedarville Cursive is our "application" font, its intended to be visually quite different
to make it easy to see what's part of the OS and what's part of the VM.
*/
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
</style>
