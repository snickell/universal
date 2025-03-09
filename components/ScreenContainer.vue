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

function handleScreenClick(event) {
  let el = event.target
  while (el && !el.id) el = el.parentElement
  if (el && el.id) sendMessage(`click on element with id="${el.id}"`)
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
    @click="handleScreenClick"
    v-html="screenHTML"
  ></div>
</template>

<style scoped>
.screen-container {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background: linear-gradient(326deg, #300000 0%, #8b0e5e 74%);
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
