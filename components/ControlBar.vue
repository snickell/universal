<script setup>
import { ref } from 'vue'
import ControlPopup from './ControlPopup.vue'
import SendMessage from './SendMessage.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  sendMessage: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div class="control-bar">
    <ControlPopup :loading="loading" />
    <SendMessage :sendMessage="sendMessage" />
  </div>
</template>

<style scoped>
.control-bar {
  position: relative;
  display: flex;
  padding: 0px;
  align-items: center;
}
</style>
