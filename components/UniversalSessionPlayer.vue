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
const currentFrame = computed(() => universalSession.value?.frames?.[currentFrameIndex.value] ?? null)
const nextFrame = computed(() => universalSession.value?.frames?.[currentFrameIndex.value + 1] ?? null)

const screenHTML = computed(() => currentFrame.value?.screenHTML ?? '')

const currentMouseX = ref(0)
const currentMouseY = ref(0)

const screenPreview = ref(null)

const nextEvents = computed(() => {
  const nextFrameInput = nextFrame.value?.inputMessage
  if (nextFrameInput?.type === 'events') {
    return JSON.parse(nextFrameInput.content).msg
  }
})

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

async function gotoNextFrame() {
  console.log("nextEvents.value=", nextEvents.value)
  // nextEvents will be something like:
  // [{"type":"click","target":{"id":"file-menu"},"at":"2025-03-15T09:07:05.007Z","button":0,"offsetX":0.1015625,"offsetY":13.5}]
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
      }
    }
  }
  
  // Now that we've animated moving the mouse and doing the click where it would have been, we can move to the next frame
  currentFrameIndex.value++
}

// fetch universalSession when universalSessionID changes:
watch(() => props.universalSessionID, async (newUniversalSessionID) => {
  const {data, error} = await useFetch(`/api/universal-session/${newUniversalSessionID}`)
  // TODO: don't use useFetch? handle errors?
  universalSession.value = data.value
}, { immediate: true })

const mouseStyle = computed(() => ({
  '--mouse-x': `${currentMouseX.value}px`,
  '--mouse-y': `${currentMouseY.value}px`,
}))

function sendMessage(msg) {
  alert("This is a replay, so you can't click or type.")
}
</script>

<template>
<div class="player">
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
    
    <div style="flex-grow: 1"></div>
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
</style>
