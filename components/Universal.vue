
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '@/lib/agent'
import ScreenContainer from './ScreenContainer.vue'
import HoldPlease from './HoldPlease.vue'
import SendMessageBar from './SendMessageBar.vue'
import AuthPopover from './AuthPopover.vue'
import { USE_HTML, ENABLE_DATA_USE_CACHED } from '~/lib/constants'

const screenHTML = ref('')
const loading = ref(false)
const needAuth = ref(false)
const lastDocRef = ref(null)

// search doc for any nodes with an id and a data-use-cached attribute, and replace their innerHTML
// in doc with the innerHTML of the corresponding node with the same id= from lastDoc.value
function replaceDataUseCachedElements({doc, prevDoc}) {
  doc.querySelectorAll('[id][data-use-cached]').forEach(node => {
    const id = node.id
    const nodeFromPrevDocWithSameID = prevDoc.getElementById(id)
    if (nodeFromPrevDocWithSameID) {
      console.log(`data-use-cached(node=${node}), replacing with ${nodeFromPrevDocWithSameID.id}`)
      node.innerHTML = nodeFromPrevDocWithSameID.innerHTML
    } else {
      console.error(`data-use-cached(node=${node}) ERROR, no matching node in lastDoc`)
    }
  })
}

async function sendMessage(msg) {
  loading.value = true
  console.log("sendMessage", msg)
  try {
    const { svg: newContent } = await agentSendMessage({ msg })
    console.log("sendMessage =>\n", newContent)
    if (USE_HTML) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(newContent, 'text/html')
      if (ENABLE_DATA_USE_CACHED && lastDocRef.value) {
        replaceDataUseCachedElements({doc, prevDoc: lastDocRef.value})
      } else {
        console.warn("data-use-cached is disabled")
      }
      lastDocRef.value = doc
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
