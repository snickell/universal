
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '~/lib/agent'
import SVGContainer from './SVGContainer.vue'
import HoldPlease from './HoldPlease.vue'

const svg = ref('')
const msgFromUser = ref('')
const loading = ref(false)

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  const { svg: newSvg } = await agentSendMessage({ msg })
  console.log("sendMessage =>\n", newSvg)
  svg.value = newSvg
  loading.value = false
}

function onMsgFromUser() {
  // Clear input before sending message so you can see the command "took"
  const msg = msgFromUser.value
  msgFromUser.value = ''
  sendMessage(msg)
}
</script>

<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden;">
    <!-- Play hold music while waiting for next frame to render -->
    <HoldPlease :loading="loading" />
    
    <SVGContainer 
      :svg="svg" 
      :loading="loading"
      @send-message="sendMessage"
    />
    
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
