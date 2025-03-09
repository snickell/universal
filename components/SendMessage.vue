<script setup>
import { ref } from 'vue'

const props = defineProps({
  sendMessage: {
    type: Function,
    required: true
  }
})

const msgFromUser = ref('')

function onMsgFromUser() {
  const msg = msgFromUser.value
  msgFromUser.value = ''
  props.sendMessage(msg)
}
</script>

<template>
  <div class="send-message">
    <input
      type="text"
      v-model="msgFromUser"
      @keypress="(e) => e.key === 'Enter' && onMsgFromUser()"
      placeholder="Thy command?"
    />
    
    <button @click="onMsgFromUser">
      Send
    </button>
  </div>
</template>

<style scoped>
.send-message {
  display: flex;
  flex: 1;
}

input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}

button {
  white-space: nowrap;
  padding: 8px 12px;
  font-size: 16px;
  background-color: #0070f3;
  color: white;
  cursor: default;
}
</style>
