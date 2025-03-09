<script setup>
import { ref, watch, onUnmounted } from 'vue'
import AuthStatus from './AuthStatus.vue'
import HoldPlease from './HoldPlease.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

const showControl = ref(false)
const isMuted = ref(false)
let audio = null

function toggleControl() {
  showControl.value = !showControl.value
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (isMuted.value) {
    stopHoldPleaseMusic()
  } else if (props.loading) {
    startHoldPleaseMusic()
  }
}

function startHoldPleaseMusic() {
  if (isMuted.value) return
  audio = new Audio()
  audio.src = 'https://universal-static.pages.dev/holdplease.mp3'
  audio.loop = true
  audio.play().catch(error => console.log(error))
}

function stopHoldPleaseMusic() {
  if (audio) {
    audio.pause()
    audio.src = ''
    audio = null
  }
}

watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    showControl.value = true
    if (!isMuted.value) startHoldPleaseMusic()
  } else {
    setTimeout(() => {
      showControl.value = false
    }, 1000)
    stopHoldPleaseMusic()
  }
}, { immediate: true })

onUnmounted(stopHoldPleaseMusic)
</script>

<template>
  <div>
    <div v-if="showControl">
      <div v-if="showControl" @click="showControl = false" class="fullscreen-fadeout" />
        <div class="control-page">
          <div class="header-buttons">
            <button class="icon-button" @click="toggleMute">
              <span class="material-symbols-outlined">
                {{ isMuted ? 'volume_off' : 'volume_up' }}
              </span>
            </button>
            <button class="close" @click="showControl = false">✕</button>
          </div>
          
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

.header-buttons {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  gap: 8px;
}

button.toggle {
  padding: 8px 12px;
  font-size: 16px;
}

button.close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.auth-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
