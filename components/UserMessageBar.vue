<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send-message'])
const msgFromUser = ref('')

function onMsgFromUser() {
  const msg = msgFromUser.value
  msgFromUser.value = ''
  emit('send-message', msg)
}
</script>

<template>
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
</template>
