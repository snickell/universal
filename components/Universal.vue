
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '@/lib/agent'
import ScreenContainer from './ScreenContainer.vue'
import HoldPlease from './HoldPlease.vue'
import SendMessageBar from './SendMessageBar.vue'
import AuthPopover from './AuthPopover.vue'
import { USE_HTML } from '~/lib/constants'

const screenHTML = ref('')
const loading = ref(false)
const needAuth = ref(false)

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  try {
    const { svg: newContent } = await agentSendMessage({ msg })
    console.log("sendMessage =>\n", newContent)
    if (USE_HTML) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(newContent, 'text/html')
      screenHTML.value = doc.body.innerHTML
    } else {
      screenHTML.value = newContent
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
    
    <ScreenContainer
      :screenHTML="screenHTML"
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
