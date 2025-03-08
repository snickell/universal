<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import debounce from 'debounce'
import { SEND_RESIZE_MESSAGES } from '~/lib/constants'

const {sendMessage} = defineProps({
  svg: {
    type: String,
    required: true
  },
  sendMessage: {
    type: Function,
    required: true
  }
})
const svgContainer = ref(null)

function handleSvgClick(event) {
  let el = event.target
  while (el && !el.id) el = el.parentElement
  if (el && el.id) sendMessage(`click on element with id="${el.id}"`)
}

let lastWidth = null
let lastHeight = null
// call sendMessage with dimensions to render SVGs at 
async function sendDimensions() {
  if (!svgContainer.value) return
  if (!SEND_RESIZE_MESSAGES) return
  
  const { clientWidth: width, clientHeight: height } = svgContainer.value
  if (lastWidth === width && lastHeight === height) return
  
  lastWidth = width
  lastHeight = height
  
  sendMessage(`render all future SVGs with width=${width} and height=${height}`)
}

let resizeObserver = null
onMounted(async () => {
  // render initial frame, should be cached and therefore 'instant'
  await sendMessage()

  // send initial dimensions, this will render a second frame, which will be slow
  sendDimensions()
  
  // Watch SVGContainer for resize events, transmit them to agent
  resizeObserver = new ResizeObserver(
    debounce(() => sendDimensions(), 1000)
  )
  resizeObserver.observe(svgContainer.value)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div class="svg-container"
    ref="svgContainer"
    @click="handleSvgClick"
    v-html="svg"
  ></div>
</template>

<style scoped>
.svg-container {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background: linear-gradient(326deg, #300000 0%, #8b0e5e 74%);
}

:deep(#screen) { flex: 1; font-family: Roboto, sans-serif; display: flex; flex-direction: column;}
</style>
