
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '~/lib/agent'
import SVGContainer from './SVGContainer.vue'
import HoldPlease from './HoldPlease.vue'
import UserMessageBar from './UserMessageBar.vue'

const svg = ref('')
const loading = ref(false)

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  const { svg: newSvg } = await agentSendMessage({ msg })
  console.log("sendMessage =>\n", newSvg)
  svg.value = newSvg
  loading.value = false
}
</script>

<template>
  <div class="universal">
    <HoldPlease :loading="loading" />
    
    <SVGContainer 
      :svg="svg" 
      :loading="loading"
      @send-message="sendMessage"
    />
    
    <UserMessageBar 
      :loading="loading"
      @send-message="sendMessage"
    />
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
