
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '@/lib/agent'
import SVGContainer from './SVGContainer.vue'
import HoldPlease from './HoldPlease.vue'
import SendMessageBar from './SendMessageBar.vue'
import AuthPopover from './AuthPopover.vue'
import { USE_HTML } from '@/lib/settings'

const svg = ref('')
const loading = ref(false)
const needAuth = ref(false)

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  try {
    const { svg: newSvg } = await agentSendMessage({ msg })
    console.log("sendMessage =>\n", newSvg)
    if (USE_HTML) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(newSvg, 'text/html')
      svg.value = doc.body.innerHTML
    } else {
      svg.value = newSvg
    }
    
  } catch (e) {
    console.error(e)
    if (e.status === 401) {
      needAuth.value = true
    }
  }
  
  loading.value = false
}
</script>

<template>
  <div class="universal">
    <HoldPlease :loading="loading" />
    
    <SVGContainer
      :svg="svg"
      :sendMessage="sendMessage"
    />
    
    <SendMessageBar
      :loading="loading"
      :sendMessage="sendMessage"
    />

    <AuthPopover :needAuth="needAuth" />
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
