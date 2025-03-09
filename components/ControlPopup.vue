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
  <div style="display: flex; height: 100%">
    <div>
      <div v-if="showControl" @click="showControl = false" class="fullscreen-fadeout" />
        <div v-if="showControl" class="control-page">
          <div class="titlebar">
            <div class="titlebar-title"></div>
            <div class="header-buttons">
              <button class="icon-button" @click="toggleMute">
                <span class="material-symbols-outlined">
                  {{ isMuted ? 'volume_off' : 'volume_up' }}
                </span>
              </button>
              <button class="icon-button" @click="showControl = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          
          <div class="content-area">
            <HoldPlease :loading="loading" />
            
            <div class="auth-section">
              <AuthStatus />
            </div>
          </div>
        </div>
    </div>
    <button class="toggle" @click="toggleControl">
      <span class="title-text">The Universal Program</span>
      <div class="vertical-line"></div>
      <span class="material-symbols-outlined">arrow_drop_down</span>
    </button>
  </div>
</template>

<style scoped>
.fullscreen-fadeout {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10001;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(3px);
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.control-page {
  bottom: 100%;
  position: absolute;
  left: 0;
  background-color: #e6edf5;
  color: #333;
  border-radius: 10px 10px 10px 0px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  max-width: 50em;
  max-height: 100vh;
  overflow-y: auto;
  padding: 0;
  z-index: 10002;
  animation: slideUp 0.3s forwards;
  transform-origin: bottom left;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.titlebar {
  background-color: #1a365d;
  color: white;
  padding: 12px 16px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.titlebar-title {
  font-size: 1.2rem;
  font-weight: 500;
  text-align: left;
}

.content-area {
  padding: 24px;
  text-align: left;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

button.toggle {
  white-space: nowrap;
  font-size: 1.4rem;
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #0070f3;
  color: white;
  cursor: default;
  font-family: "Cedarville Cursive", cursive;
  border: none;
  position: relative;
  z-index: 10003;
}

button.toggle:hover {
  background-color: #0060df;
}

button.toggle .title-text {
  transform: translateY(0.2rem);
}

button.toggle .material-symbols-outlined {
  font-size: 1.5em;
}

.vertical-line {
  height: 50%;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 4px;
  margin-left: 20px;
}

.icon-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.icon-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.auth-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: left;
}

:deep(.content),
:deep(.idle-content) {
  text-align: left;
  align-items: flex-start;
}

:deep(.header) {
  justify-content: flex-start;
}

:deep(.info) {
  text-align: left;
}
</style>
