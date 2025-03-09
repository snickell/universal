<script setup>
import { ref, watch } from 'vue'
import AuthStatus from './AuthStatus.vue'
import HoldPlease from './HoldPlease.vue'
import HoldPleaseMusic from './HoldPleaseMusic.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

const showPopup = ref(false)
const showPopupButtonWidth = ref(null)
const showPopupButtonRef = ref(null)

const mute = ref(false)

// Before we show the popup, we have to measure the width of the popup button
// because we morph the button into the titlebar of the popup in a CSS animation
watch(() => showPopup.value, () => 
  showPopupButtonWidth.value = showPopupButtonRef.value?.offsetWidth
)

// Whenever loading changes, set showPopup to be the same (but user can override)
watch(() => props.loading, (isLoading, wasLoading) => {
  if (!isLoading && wasLoading) {
    // wait 5s before hiding the popup when we're done loading, otherwise you're reading
    // and its like whiplash when the LLM finishes. TODO: something better
    setTimeout(() => showPopup.value = false, 5000)
  } else {
    showPopup.value = isLoading
  }
}, { immediate: true })
</script>

<template>
  <div class="control-popup">
    <HoldPleaseMusic :loading="loading" :mute="mute" />

    <transition name="fullscreen-blur-mask">
      <div v-if="showPopup" class="fullscreen-blur-mask" @click="showPopup = false"></div>
    </transition>
    
    <transition name="popup" duration="800">
      <div v-if="showPopup" class="popup">
      <div class="titlebar" :style="{ '--show-popup-button-width': showPopupButtonWidth + 'px' }">
        <span class="cursive-text-lower-baseline">The Universal Program</span>
        
        <div class="titlebar-buttons">
          <button class="icon-button" @click="mute = !mute">
            <span class="material-symbols-outlined">
              {{ mute ? 'volume_off' : 'volume_up' }}
            </span>
          </button>
          <button class="icon-button" @click="showPopup = false">
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
    </transition>
    
    <button class="show-popup-button" ref="showPopupButtonRef" @click="showPopup = true">
      <span class="cursive-text-lower-baseline">The Universal Program</span>
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

.popup {
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 100vw;
  max-height: 100vh;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  background-color: #e6edf5;
  overflow: hidden;
  z-index: 10002;
}

.popup-enter-active,
.popup-leave-active {
  transition: 5s ease;
}

.fullscreen-blur-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(3px);
  z-index: 10001;
}

.fullscreen-blur-mask-enter-active {
  animation: fadeInFullscreenBlurMask 0.8s forwards;
}
.fullscreen-blur-mask-leave-active {
  animation: fadeOutFullscreenBlurMask 0.8s forwards;
}

@keyframes fadeInFullscreenBlurMask {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOutFullscreenBlurMask {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* There's two copies of almost the same element, one is a button that shows the popup,
  the other is the titlebar of the popup. The former morphs into the latter, so they share most style
*/
button.show-popup-button,
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

.titlebar {
  transition: all 0.4s ease;
  width: 800px;
}

.popup-enter-from .titlebar,
.popup-leave-to .titlebar {
  width: var(--show-popup-button-width);
}

button.show-popup-button:hover {
  background-color: #0060df;
}

/* The cursive font looks nice with a slightly lower baseline */
.cursive-text-lower-baseline {
  transform: translateY(0.2rem);
}

button.show-popup-button .material-symbols-outlined {
  font-size: 1.5em;
}

.popup .titlebar .titlebar-buttons {
  opacity: 0;
  margin-left: auto;
  display: flex;
  gap: 8px;

  opacity: 1;
  transition: opacity 0.3s ease;
}

.popup-enter-from .titlebar .titlebar-buttons,
.popup-leave-to .titlebar .titlebar-buttons {
  opacity: 0;
}

.popup .titlebar .icon-button {
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

.popup .titlebar .icon-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.popup .content-area {
  overflow: hidden;
  padding: 0 24px;

  max-height: 100vh;
  padding-top: 24px;
  padding-bottom: 24px;

  transition: all 0.4s ease;
}

.popup-enter-from .content-area,
.popup-leave-to .content-area {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.popup-enter-active .content-area,
.popup-leave-active .titlebar,
.popup-leave-active .titlebar .titlebar-buttons {
  transition-delay: 0.4s;
}

button.show-popup-button .spacer {
  flex-grow: 1;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  height: 50%;
  margin: 0 12px;
  padding-left: 20px;
}

.auth-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: left;
}
</style>
