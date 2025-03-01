
<script setup>
import { sendMessage as agentSendMessage } from '@/lib/agent'

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
    <Head>
      <Title>The Universal Program</Title>
    </Head>

    <HoldPlease :loading="loading" />
    
    <SVGContainer
      :svg="svg"
      :sendMessage="sendMessage"
    />
    
    <SendMessageBar
      :loading="loading"
      :sendMessage="sendMessage"
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
