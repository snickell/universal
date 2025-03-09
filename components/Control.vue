<script setup>
import { ref, watch } from 'vue'
import AuthStatus from './AuthStatus.vue'
import HoldPlease from './HoldPlease.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

const showControl = ref(false)

watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    showControl.value = true
  } else {
    setTimeout(() => {
      showControl.value = false
    }, 1000)
  }
}, { immediate: true })

function toggleControl() {
  showControl.value = !showControl.value
}
</script>

<template>
  <div>
    <div v-if="showControl">
      <div v-if="showControl" @click="showControl = false" class="fullscreen-fadeout" />
        <div class="control-page">
          <button class="close" @click="showControl = false">✕</button>
          
          <HoldPlease :loading="loading" />
          
          <div class="auth-section">
            <AuthStatus />
          </div>
        </div>
    </div>
    <button class="toggle" @click="toggleControl">☰</button>
  </div>
</template>

<style scoped>
.fullscreen-fadeout {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(3px);
}

.control-page {
  bottom: 100%;
  position: absolute;
  left: 0;
  background-color: white;
  border-radius: 10px 10px 10px 0px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  max-width: 60em;
  max-height: 100vh;
  overflow-y: auto;
  padding: 40px;
  padding-top: 60px;
  z-index: 101;
}

button.toggle {
  padding: 8px 12px;
  font-size: 16px;
}

button.close {
  position: absolute;
  right: 10px;
  top: 10px;
}

.auth-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
