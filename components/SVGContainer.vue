<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import debounce from 'debounce'

const props = defineProps({
  svg: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Define the events this component can emit
const emit = defineEmits(['send-message'])

const svgContainer = ref(null)
let lastWidth = null
let lastHeight = null
let observer = null

function handleSvgClick(event) {
  let el = event.target
  while (el && !el.id) el = el.parentElement
  if (el && el.id) emit('send-message', `click on element with id="${el.id}"`)
}

// Handle resize and send dimensions
async function sendDimensions() {
  if (!svgContainer.value) return
  
  const { clientWidth: width, clientHeight: height } = svgContainer.value
  if (lastWidth === width && lastHeight === height) return
  
  lastWidth = width
  lastHeight = height
  
  // Emit events for dimension changes
  emit('send-message') // Initial empty message
  emit('send-message', `render all future SVGs with width=${width} and height=${height}`)
}

onMounted(() => {
  if (!svgContainer.value) return
  
  sendDimensions()
  
  observer = new ResizeObserver(
    debounce(() => sendDimensions(), 1000)
  )
  observer.observe(svgContainer.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div 
    ref="svgContainer"
    @click="handleSvgClick"
    style="flex-grow: 1; overflow: hidden; background: linear-gradient(326deg, #300000 0%, #8b0e5e 74%)"
    v-html="svg"
  ></div>
</template>
