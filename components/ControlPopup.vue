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
const toggleButtonWidth = ref(null)
const toggleButtonRef = ref(null)
let audio = null

function measureToggleWidth() {
  if (toggleButtonRef.value) {
    toggleButtonWidth.value = toggleButtonRef.value.offsetWidth
  }
}

function toggleControl() {
  showControl.value = !showControl.value
  if (showControl.value) {
    measureToggleWidth()
  }
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
    measureToggleWidth()
    if (!isMuted.value) startHoldPleaseMusic()
  } else {
    showControl.value = false
    stopHoldPleaseMusic()
  }
}, { immediate: true })

onUnmounted(stopHoldPleaseMusic)
</script>

<template>
  <div class="control-popup">
    <div v-if="showControl" class="fullscreen-blur-mask" @click="showControl = false"></div>
    
    <div v-if="showControl" class="popup">
      <div class="titlebar" :style="{ width: toggleButtonWidth + 'px' }">
        <span class="title-text">The Universal Program</span>
        
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
    
    <button class="toggle" ref="toggleButtonRef" @click="toggleControl">
      <span class="title-text">The Universal Program</span>
      <span class="spacer"></span>
      <span class="material-symbols-outlined">arrow_drop_down</span>
    </button>
  </div>
  
</template>

<style scoped>
.control-popup {
  position: relative;
  height: 100%;
  display: flex;
}

.fullscreen-blur-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(3px);
  opacity: 0;
  animation: fadeInFullscreenBlurMask 0.8s forwards;
  z-index: 10001;
}

@keyframes fadeInFullscreenBlurMask {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* There's two copies of almost the same element, one is a button that toggles the popup on/off,
  the other is the titlebar of the popup. The former morphs into the latter, so they share most style
*/
button.toggle,
.popup .titlebar 
{
  white-space: nowrap;
  font-size: 1.4rem;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background-color: #0070f3;
  color: white;
  font-family: "Cedarville Cursive", cursive;
  border: none;
}

button.toggle {
  gap: 4px;
}

.popup .titlebar {
  animation: expandTitlebarWidth 0.4s forwards;
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

.popup {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: #e6edf5;
  overflow: hidden;
  z-index: 10002;
}



@keyframes expandTitlebarWidth {
  to {
    width: 800px;
  }
}

.header-buttons {
  opacity: 0;
  margin-left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  animation: fadeInButtons 0.3s forwards;
}

@keyframes fadeInButtons {
  to { opacity: 1; }
}

.content-area {
  overflow: hidden;
  padding: 0 24px;

  animation: expandContentAreaHeight 0.4s forwards;
  animation-delay: 0.4s;

  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@keyframes expandContentAreaHeight {
  to {
    max-height: 100vh;
    padding-top: 24px;
    padding-bottom: 24px;
  }
}

.spacer {
  flex-grow: 1;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  height: 50%;
  margin: 0 12px;
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
