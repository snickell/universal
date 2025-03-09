
<script setup>
import { ref } from 'vue'
import { sendMessage as agentSendMessage } from '@/lib/agent'
import ScreenContainer from './ScreenContainer.vue'
import HoldPleaseMusic from './HoldPleaseMusic.vue'
import SendMessageBar from './SendMessageBar.vue'
import AuthPopover from './AuthPopover.vue'
import { ENABLE_DATA_USE_CACHED } from '~/lib/constants'

const screenHTML = ref('')
const loading = ref(false)
const needAuth = ref(false)
const lastDocRef = ref(null)

globalThis.debug ||= {}

const truncate = str => !str ? String(str) : String(str).replace(/\s+/g, ' ').slice(0, 80)

// search doc for any nodes with an id and a data-use-cached attribute, and replace their outerHTML
// in doc with the innerHTML of the corresponding node with the same id= from lastDoc.value
function replaceDataUseCachedElements({doc, prevDoc}) {
  doc.querySelectorAll('[id][data-use-cached]').forEach(node => {
    const id = node.id
    const nodeFromPrevDocWithSameID = prevDoc.getElementById(id)
    if (nodeFromPrevDocWithSameID) {
      console.log(`data-use-cached(#${node.id}), replacing:`, node, 'with:', nodeFromPrevDocWithSameID)
      node.outerHTML = nodeFromPrevDocWithSameID.outerHTML
    } else {
      console.error(`data-use-cached(#${node.id}) ERROR replacing`, node, 'no node with a matching id in prevDoc=', prevDoc)
    }
  })
}

async function sendMessage(msg) {
  loading.value = true
  const truncatedMsg = truncate(msg)
  console.log()
  console.log(`agentSendMessage('${truncatedMsg}''):`, msg)
  try {
    const { screenHTML: newContent } = await agentSendMessage({ msg })

    globalThis.debug.screenHTML = newContent
    console.log(`agentSendMessage('${truncatedMsg}'') returned '${truncate(newContent)}' (see: globalThis.debug.screenHTML)'`)

    const doc = new DOMParser().parseFromString(newContent, 'text/html')
    console.log(`agentSendMessage() returned parsed doc=`, doc)

    // implement data-use-cached html attribute in responses
    if (ENABLE_DATA_USE_CACHED && lastDocRef.value) {
      replaceDataUseCachedElements({doc, prevDoc: lastDocRef.value})
    } else {
      console.warn("data-use-cached is disabled")
    }
    lastDocRef.value = doc

    screenHTML.value = doc.body.innerHTML
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
    
    <ScreenContainer
      :screenHTML="screenHTML"
      :sendMessage="sendMessage"
    />
    
    <SendMessageBar
      :loading="loading"
      :sendMessage="sendMessage"
    />

    <HoldPleaseMusic :loading="loading" />

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
