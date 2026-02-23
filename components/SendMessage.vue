<script setup>
import { onMounted, ref, watch } from 'vue'

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
const inputRef = ref(null)

onMounted(() => {
  if (!props.disabled) inputRef.value?.focus()
})

watch(
  () => props.disabled,
  (disabled) => {
    if (!disabled) inputRef.value?.focus()
  }
)

function onMsgFromUser() {
  const msg = msgFromUser.value
  msgFromUser.value = ''
  props.sendMessage(msg)
}
</script>

<template>
  <div class="send-message" :class="{ 'flash-animation': flash }">
    <input
      ref="inputRef"
      type="text"
      v-model="msgFromUser"
      :disabled="disabled"
      @keypress="(e) => e.key === 'Enter' && onMsgFromUser()"
      placeholder="Click something OR describe what you want here."
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
  border-left: 1px solid #000000;
  border-right: 1px solid #000000;
  background-color: #000000;
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
  background-color: #000000;
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
  background-color: #ff0000;
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
  background-color: #ff0000;
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
    background-color: #ff0000;
  }
}
</style>
