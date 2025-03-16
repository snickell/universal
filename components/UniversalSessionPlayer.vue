<script setup>
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
  console.log("animateMovingMouseTo", x, y)
  // TODO: implement this, preferably somehow using CSS animations, but its ok if its manual if that's much simpler
  currentMouseX.value = x
  currentMouseY.value = y
}

async function animateClickingMouse() {
  // TODO: for now just pulse the mouse's size
}

async function gotoNextFrame() {
  console.log("nextEvents.value=", nextEvents.value)
  // nextEvents will be something like:
  // [{"type":"click","target":{"id":"file-menu"},"at":"2025-03-15T09:07:05.007Z","button":0,"offsetX":0.1015625,"offsetY":13.5}]
  if (nextEvents.value) {
    for (const event of nextEvents.value) {
      if (event.type === 'click' || event.type === "dblclick") {
        const shrinkEl = screenPreview.value.$el.querySelector('.shrink')
        const screenEl = shrinkEl.querySelector('#screen')
        const targetEl = screenEl.querySelector(`#${event.target.id}`)
        if (!targetEl) {
          console.error(`Could not find target element with id="${event.target.id}"`)
          continue
        }

        const scaleFactor = parseFloat(getComputedStyle(shrinkEl).transform.split(", ")[0].replace("matrix(", ""))
        console.log("scaleFactor=", scaleFactor)

        const { x: shrinkX, y: shrinkY } = shrinkEl.getBoundingClientRect()
        const {x: targetX, y: targetY} = targetEl.getBoundingClientRect()
        const x = (targetX - shrinkX) / scaleFactor
        const y = (targetY - shrinkY) / scaleFactor
        console.log("targetEl=", targetEl, "x=", x, "y=", y)
        await animateMovingMouseTo(x + event.offsetX, y + event.offsetY)
        await animateClickingMouse()
      }
    }
  }
  
  // Now that we've animated moving the mouse and doing the click where it would have been, we can move to the next frame
  currentFrameIndex.value++
}

// fetch universalSession when universalSessionID changes:
watch(() => props.universalSessionID, async (newUniversalSessionID) => {
  const url = `/api/universal-session/${newUniversalSessionID}`
  console.log("url=", url)
  const {data, error} = await useFetch(url)
  // TODO: don't use useFetch? handle errors?
  universalSession.value = data.value
}, { immediate: true })

const mouseStyle = computed(() => ({
  '--mouse-x': `${currentMouseX.value}px`,
  '--mouse-y': `${currentMouseY.value}px`,
}))
</script>

<template>
<div class="player">
  <div style="position: relative">
    <ScreenPreview
      :screenPreviewHTML="screenHTML"
      ref="screenPreview"
    >
      <template #in-screen-coordinates>
        <div class="mouse" :style="mouseStyle">🐁</div>
      </template>
    </ScreenPreview>
  </div>
  <div id="controls">
    <button @click="currentFrameIndex--" :disabled="currentFrameIndex === 0">Previous</button>
    <button @click="gotoNextFrame" :disabled="universalSession?.frames && currentFrameIndex === universalSession.frames.length - 1">Next</button>
  </div>
</div>
</template>

<style scoped>
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
}
</style>


<!--
// GET of /api/universal-sessions/${universalSessionID} returns, for example:
{
  "id": "01JPCGWVA2M0C2WCM62QZB0V4Y",
  "userID": "01JPCGWTEJDYXE3ZMEPXBYJ584",
  "createdAt": null,
  "frames": [
    {
      "id": "01JPCGWVA32WT868CZBPTFDAES",
      "modelID": "anthropic/claude-3.7-sonnet",
      "screenHTML": "<div id=\"screen\">...snip...</div>",
      "createdAt": "2025-03-15T09:06:54.000Z",
      "renderStartTime": "2025-03-15T09:06:54.000Z",
      "renderEndTime": "2025-03-15T09:06:54.000Z",
      "renderTimeSecs": 0,
      "inputMessageID": "01JPCGWVA39PANZTSB2ZJ2SV55",
      "outputMessageID": "01JPCGWVA3VG6TVXFYZQWHY70Q",
      "universalSessionID": "01JPCGWVA2M0C2WCM62QZB0V4Y",
      "prevFrameID": null,
      "inputMessage": {
        "id": "01JPCGWVA39PANZTSB2ZJ2SV55",
        "type": "prompt",
        "role": "user",
        "content": "...snip...",
        "createdAt": "2025-03-15T09:06:54.000Z",
        "universalSessionID": "01JPCGWVA2M0C2WCM62QZB0V4Y"
      }
    },
    {
      "id": "01JPCGX5P59T4X2WQTT7QBY2E4",
      "modelID": "anthropic/claude-3.7-sonnet",
      "screenHTML": "<div id=\"screen\">...snip...</div>",
      "createdAt": "2025-03-15T09:07:05.000Z",
      "renderStartTime": "2025-03-15T09:07:05.000Z",
      "renderEndTime": "2025-03-15T09:07:18.000Z",
      "renderTimeSecs": 13.54,
      "inputMessageID": "01JPCGX5P54K63XZKMMYP23WZP",
      "outputMessageID": "01JPCGXJX8BNYZS8WT4A5X62F7",
      "universalSessionID": "01JPCGWVA2M0C2WCM62QZB0V4Y",
      "prevFrameID": null,
      "inputMessage": {
        "id": "01JPCGX5P54K63XZKMMYP23WZP",
        "type": "events",
        "role": "user",
        "content": "{\"msg\":[{\"type\":\"click\",\"target\":{\"id\":\"file-menu\"},\"at\":\"2025-03-15T09:07:05.007Z\",\"button\":0,\"offsetX\":0.1015625,\"offsetY\":13.5}]}",
        "createdAt": "2025-03-15T09:07:05.000Z",
        "universalSessionID": "01JPCGWVA2M0C2WCM62QZB0V4Y"
      }
    }
  ]
}
-->