<script setup>
import { ref } from 'vue'

const props = defineProps({
  // we invoke sendMessage when we have something to send to the LLM (on submit) 
  sendMessage: {
    type: Function,
    required: true
  },
  // show submit button?
  showButton: {
    type: Boolean,
    default: true
  },
  // pulse whole component to indicate we're about to submit, used during replay
  flash: {
    type: Boolean,
    default: false
  },
  // disable input but keep appearance similar
  disabled: {
    type: Boolean,
    default: false
  }
})

const msgFromUser = defineModel({ default: '' })

function onMsgFromUser() {
  const msg = msgFromUser.value
  msgFromUser.value = ''
  props.sendMessage(msg)
}
</script>

<template>
  <div class="send-message" :class="{ 'flash-animation': flash }">
    <input
      type="text"
      v-model="msgFromUser"
      :disabled="disabled"
      @keypress="(e) => e.key === 'Enter' && onMsgFromUser()"
      placeholder="To render the next frame: click somewhere OR describe what you want here to both modify and control apps."
    />
    
    <button v-if="showButton" @click="onMsgFromUser">
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

/* A very subtle disabled effect */
input:disabled {
  opacity: 0.95;
  cursor: default;
  background-color: #1a365d;
  color: white;
  /* Remove the typical "disabled" appearance */
  -webkit-text-fill-color: white; /* Override iOS default */
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

/* The cursive font looks nice with a slightly lower baseline */
button > span {
  transform: translateY(0.2rem);
}

button:hover {
  background-color: #0060df;
}

.flash-animation {
  animation: flash-component 0.6s;
}

@keyframes flash-component {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
    background-color: #0070f3;
  }
}
</style>
