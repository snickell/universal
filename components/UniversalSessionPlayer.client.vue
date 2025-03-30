<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  universalSessionID: {
    type: String,
    required: true
  },
})

const universalSession = ref(null) // set by GET of /api/universal-sessions/${universalSessionID} whenever it changes, see end for example return value
const currentFrameIndex = ref(0) // which of universalSession.frames[] are we displaying?
const nextFrame = computed(() => universalSession.value?.frames?.[currentFrameIndex.value + 1] ?? null)
const currentFrame = computed(() => universalSession.value?.frames?.[currentFrameIndex.value] ?? null)
const screenHTML = computed(() => currentFrame.value?.screenHTML ?? '')

// fetch universalSession and frames when universalSessionID changes:
watch(() => props.universalSessionID, async (newUniversalSessionID) => {
  try {
    // We used to use `const {data, error} = await useFetch(`/api/universal-session/${newUniversalSessionID}`)`
    // but it kept returning null data and no error, even when the network log showed data coming through.
    // It would periodically break on reloads in dev tools.
    //
    // This page doesn't really benefit from SSR, its client side heavy no matter how you slice it.
    // So we just made it UniversalSessionPlayer.client.vue, and now we can use fetch() directly.
    const res = await fetch(`/api/universal-session/${newUniversalSessionID}`)
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`)
    const json = await res.json()
    universalSession.value = json
    console.log("Fetched universal session:", json)
  } catch (err) {
    console.error("Error fetching universal session:", err)
  }
}, { immediate: true })

const nextEvents = computed(() => {
  const nextFrameInputMessage = nextFrame.value?.inputMessage
  if (nextFrameInputMessage?.type === 'events') {
    return JSON.parse(nextFrameInputMessage.content).msg
  } else if (nextFrameInputMessage?.type === 'prompt') {
    return [{
      type: 'prompt',
      prompt: nextFrameInputMessage.content,
      at: nextFrameInputMessage.createdAt,
    }]
  } else {
    console.warn('UniversalSessionPlayer: unknown inputMessage.type:', nextFrameInputMessage)
    return undefined
  }
})

const screenPreview = ref(null)
async function gotoNextFrame() {
  console.log("gotoNextFrame(): nextEvents.value=", nextEvents.value)

  // we don't clear it on submit so it can be read later by slower readers (e.g. non-native readers, etc)
  hideSendMessageFromUser()

  // nextEvents will be something like:
  // [{"type":"click","target":{"id":"file-menu"},"at":"2025-03-15T09:07:05.007Z","button":0,"offsetX":0.1015625,"offsetY":13.5}]
  // [{"type":"prompt","content":"Hello, world!","at":"2025-03-15T09:07:05.007Z"}]
  if (nextEvents.value) {
    for (const event of nextEvents.value) {
      if (event.type === 'click' || event.type === "dblclick") {
        const screenEl = screenPreview.value.screenEl // #screen for the current frame
        console.log("screenEl=", screenEl)
        const targetEl = screenEl.querySelector(`#${event.target.id}`)
        if (!targetEl) {
          console.error(`Could not find target element with id="${event.target.id}"`)
          continue
        }

        const scaleFactor = 1.0 / screenPreview.value.scale
        console.log("scaleFactor=", scaleFactor)

        const {x: screenX, y: screenY} = screenEl.getBoundingClientRect()
        const {x: targetX, y: targetY} = targetEl.getBoundingClientRect()
        const x = (targetX - screenX) + (event.offsetX * scaleFactor)
        const y = (targetY - screenY) + (event.offsetY * scaleFactor)
        console.log("targetEl=", targetEl, "x=", x, "y=", y)
        await animateMovingMouseTo(x, y)
        await animateClickingMouse()
      } else if (event.type === 'prompt') {
        await animateSendMessageFromUser(event)
      } else {
        console.warn(`UniversalSessionPlayer: not showing unsupported event.type=${event.type}, event:`, event)
      }
    }
  }
  
  // Now that we've animated moving the mouse and doing the click where it would have been, we can move to the next frame
  currentFrameIndex.value++
}


const currentMouseX = ref(0)
const currentMouseY = ref(0)

const mouseStyle = computed(() => ({
  '--mouse-x': `${currentMouseX.value}px`,
  '--mouse-y': `${currentMouseY.value}px`,
}))

async function animateMovingMouseTo(x, y) {
  return new Promise((resolve) => {
    const mouseEl = document.querySelector('.mouse')

    function onTransitionEnd() {
      mouseEl.removeEventListener("transitionend", onTransitionEnd)
      resolve()
    }

    mouseEl.addEventListener("transitionend", onTransitionEnd, { once: true })

    // Update position (CSS transition handles smooth movement)
    currentMouseX.value = x
    currentMouseY.value = y
  })
}

async function animateClickingMouse() {
  return new Promise(async (resolve) => {
    const mouseEl = document.querySelector('.mouse')

    await new Promise(resolve => setTimeout(resolve, 250))
    mouseEl.style.transform = "scale(1.5)"

    await new Promise((resolve) => setTimeout(resolve, 250))
    mouseEl.style.transform = "scale(1)"

    await new Promise(resolve => setTimeout(resolve, 500))
    resolve()
  })
}

function flashMessage(msg) {
  flashMessageText.value = msg
  flashMessageVisible.value = true
  setTimeout(() => flashMessageVisible.value = false, 5000)
}

const hasShownClickWarning = ref(false)
function sendMessage(msg) {
  gotoNextFrame()
  
  // Warn the user clicks won't work except to advance frames
  if (!hasShownClickWarning.value) {
    flashMessage("This is a replay, so you can't interact. Clicking advances to the next frame")
    hasShownClickWarning.value = true
  }
}

const sendMessageFromUserVisible = ref(false)
const sendMessageFromUser = ref('')
const flashSendMessageOnSubmit = ref(false)
const flashMessageVisible = ref(false)
const flashMessageText = ref('')
async function animateSendMessageFromUser(event) {
  // Show the SendMessage component
  sendMessageFromUser.value = ''
  sendMessageFromUserVisible.value = true
  
  // Wait for transition to complete
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Animate typing the prompt character by character
  const prompt = event.prompt
  for (let i = 0; i < prompt.length; i++) {
    sendMessageFromUser.value = prompt.slice(0, i + 1) + '|'
    // This is about 200WPM, which is about 50WPM lower than the median adult
    // reading speed in the United States. This is probably too fast for non-native readers
    // but its a hard tradeoff to make. This speed matches Breath of the Wild, I figure
    // they probably know what they are doing:
    const ms_per_character = 25 + Math.random() * 25
    await new Promise(resolve => setTimeout(resolve, ms_per_character))
  }
  sendMessageFromUser.value = prompt
  
  // Pause before "pressing enter"
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Flash the SendMessage component to show we're about to submit
  flashSendMessageOnSubmit.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  flashSendMessageOnSubmit.value = false
  
  await new Promise(resolve => setTimeout(resolve, 500))

  // NOTE: we do not call hideSendMessageFromUser() here because we want to give
  // slower reader's time to catch up. We clear it on the next event/frame
}

function hideSendMessageFromUser() {
  // Clear the input and hide the component
  sendMessageFromUser.value = ''
  sendMessageFromUserVisible.value = false

}
</script>

<template>
<div class="player">
  <transition name="flash-message">
    <div v-if="flashMessageVisible" class="flash_message">
      {{ flashMessageText }}
    </div>
  </transition>
  <div style="position: relative; padding: 20px;">
    <ScreenPreview
      :screenPreviewHTML="screenHTML"
      :scale=1
      :sendMessage="sendMessage"
      ref="screenPreview"
    >
      <div class="mouse" :style="mouseStyle">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0070f3">
          <path d="M551-80 406-392 240-160v-720l560 440H516l144 309-109 51Z" stroke="white" stroke-width="40" stroke-linejoin="miter"/>
        </svg>
      </div>
    </ScreenPreview>
  </div>

  <div class="header">
    <div>
      <span style="font-weight: bold; font-size: 130%">Instant Replay</span><br/>
      <a href="#" @click.prevent="$router.back()">« Back to Gallery</a>
    </div>
    
    <transition name="fade">
      <SendMessage 
        v-if="sendMessageFromUserVisible" 
        class="send_message"
        :sendMessage="sendMessage" 
        :showButton="false"
        :flash="flashSendMessageOnSubmit"
        :disabled="true"
        v-model="sendMessageFromUser" 
      />
    </transition>
    <div v-if="!sendMessageFromUserVisible" style="flex-grow: 1"></div>
    
    <div id="controls">
      <button @click="currentFrameIndex--" :disabled="currentFrameIndex === 0">Previous Frame</button>
      Frame {{ currentFrameIndex + 1 }} of {{ universalSession?.frames?.length }}
      <transition name="flash" appear>
        <button 
          @click="gotoNextFrame" 
          :disabled="universalSession?.frames && currentFrameIndex === universalSession.frames.length - 1"
        ><b>Next Frame</b></button>
      </transition>
    </div>
  </div>
</div>
</template>

<style scoped>

.header {
  display: flex;
  padding: 10px;
  background-color: #0070f3;
  color: white;
  align-items: center;
}

.header a {
  color: white;
}

h2 {
  margin: 0;
}

#controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.flash-enter-active {
  animation: flash-button 1.5s;
}

.send_message {
  flex-grow: 1;
  margin: 0 2em;
}

.send_message.fade-enter-active,
.send_message.fade-leave-active {
  transition: opacity 0.3s ease;
}

.send_message.fade-enter-from,
.send_message.fade-leave-to {
  opacity: 0;
}

@keyframes flash-button {
  0%, 38% {
    background-color: #f5f5f5;
    color: black;
  }
  50% {
    background-color: #0070f3;
    color: white;
  }
  62% {
    background-color: #f5f5f5;
  }
  75% {
    background-color: #0070f3;
    color: white;
  }
  88%, 100% {
    background-color: #f5f5f5;
  }
}

.player {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mouse {
  position: absolute;
  top: var(--mouse-y);
  left: var(--mouse-x);
  font-size: 200%;
  aspect-ratio: 1;
  transition: top 0.5s ease-out, left 0.5s ease-out;
}

.flash_message {
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 10px 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  z-index: 1000;
}

.flash-message-enter-active,
.flash-message-leave-active {
  transition: transform 0.5s ease;
}

.flash-message-enter-from,
.flash-message-leave-to {
  transform: translate(-50%, -100%);
}
</style>
