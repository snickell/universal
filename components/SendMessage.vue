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
      <span>Send Command</span>
    </button>
  </div>
</template>

<style scoped>
.send-message {
  display: flex;
  flex: 1;
  height: 100%;
}

input {
  flex: 1;
  padding: 0 8px;
  font-size: 16px;
  height: 100%;
  border: none;
  outline: none;
  border-left: 1px solid #0f2847;
  border-right: 1px solid #0f2847;
  background-color: #1a365d;
  color: white;
  caret-color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

button {
  white-space: nowrap;
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  background-color: #0070f3;
  color: white;
  cursor: default;
  font-family: "Cedarville Cursive", cursive;
  border: none;
}

button > span {
  transform: translateY(0.2rem);
}

button:hover {
  background-color: #0060df;
}
</style>
