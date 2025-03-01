
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { sendMessage as agentSendMessage } from '~/lib/agent'
import debounce from 'debounce'

const svg = ref('')
const msgFromUser = ref('')
const loading = ref(false)
const svgContainer = ref(null)
let audio = null

// Initialize audio on mount (holdPlease functionality)
onMounted(() => {
  audio = new Audio()
  audio.src = 'https://universal-static.pages.dev/holdplease.mp3'
  audio.loop = true
})

// React to loading state changes - match Next.js behavior
watch(loading, (isLoading) => {
  if (!audio) return
  
  if (isLoading) {
    audio.play().catch(error => console.log(error))
  } else {
    audio.pause()
  }
})

// Clean up audio when component is unmounted
onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio.src = ''
    audio = null
  }
})

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  const { svg: newSvg } = await agentSendMessage({ msg })
  console.log("sendMessage =>\n", newSvg)
  svg.value = newSvg
  loading.value = false
}

// Handle resize and send dimensions
let lastWidth = null
let lastHeight = null
let observer = null

function sendDimensions() {
  if (!svgContainer.value) return
  
  const { clientWidth: width, clientHeight: height } = svgContainer.value
  if (lastWidth === width && lastHeight === height) return
  
  lastWidth = width
  lastHeight = height
  sendMessage(`render all future SVGs with width=${width} and height=${height}`)
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

function onMsgFromUser() {
  // Clear input before sending message, matching Next.js behavior
  const msg = msgFromUser.value
  msgFromUser.value = ''
  sendMessage(msg)
}

function handleSvgClick(event) {
  let el = event.target
  while (el && !el.id) el = el.parentElement
  if (el && el.id) sendMessage(`click on element with id="${el.id}"`)
}
</script>

<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden;">
    <!-- SVG Container -->
    <div 
      ref="svgContainer"
      @click="handleSvgClick"
      style="flex-grow: 1; overflow: hidden; background: linear-gradient(326deg, #300000 0%, #8b0e5e 74%)"
      v-html="svg"
    ></div>
    
    <!-- Control Bar -->
    <div style="position: relative; display: flex; padding: 0px; align-items: center; background-color: black; border-bottom: 1px solid #333;">
      <input
        type="text"
        v-model="msgFromUser"
        @keypress="(e) => e.key === 'Enter' && onMsgFromUser()"
        placeholder="Thy command?"
        :disabled="loading"
        style="flex: 1; padding: 8px; font-size: 16px;"
      />
      
      <button
        @click="onMsgFromUser"
        :disabled="loading"
        style="white-space: nowrap; padding: 8px 12px; font-size: 16px; background-color: #0070f3; color: white; cursor: default;"
      >
        {{ loading ? "Rendering SVG..." : "Send" }}
      </button>
    </div>
  </div>
</template>
