<script setup>
import { ref, watch } from 'vue'
import AuthBeggar from './AuthBeggar.vue'
import HoldPlease from './HoldPlease.vue'
import HoldPleaseMusic from './HoldPleaseMusic.vue'

const { loggedIn, user, session, clear } = useUserSession()

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  needAuth: {
    type: Boolean,
    required: true
  },
  screenPreviewHTML: {
    type: String,
    required: true
  }
})

// This is provided by Universal.vue after it receives the first frame
const universalSessionID = inject('universalSessionID')

const showPopup = defineModel('showPopup')
const showPopupButtonWidth = ref(null)
const showPopupButtonRef = ref(null)

const mute = ref(false)

function hidePopup() {
  if (props.needAuth) return
  showPopup.value = false
}

// Before we show the popup, we have to measure the width of the popup button
// because we morph the button into the titlebar of the popup in a CSS animation
watch(() => showPopup.value, () => 
  showPopupButtonWidth.value = showPopupButtonRef.value?.offsetWidth
)

watch(() => props.needAuth, (needAuth) => {
  if (needAuth) {
    showPopup.value = true
  }
}, { immediate: true })

// Whenever we start loading, show the popup
watch(() => props.loading, (isLoading, wasLoading) => {
  if (isLoading) {
    showPopup.value = true
  } else if (wasLoading) {
    hidePopup();
  }
}, { immediate: true })


async function onLogout() {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="control-popup">
    <HoldPleaseMusic :loading="loading" :mute="mute" v-if="false"/>

    <div v-if="loading" class="hourglass-mask" @click="hidePopup()"></div>
    
    <transition name="popup" duration="400">
      <div v-if="showPopup" class="popup">
        <div class="titlebar" :style="{ '--show-popup-button-width': showPopupButtonWidth + 'px' }">
          <span class="cursive-text-lower-baseline">CHAOS</span>
          
          <div class="titlebar-buttons">
            <button class="icon-button" @click="onLogout" title="Logout" v-if="!needAuth">
              <span class="material-symbols-outlined">
                logout
              </span>
            </button>

            <NuxtLink
              class="icon-button"
              :to="`/gallery/${universalSessionID}`"
              target="_blank"
              rel="noopener"
              title="Share this Session"
            >
              <span class="material-symbols-outlined">
                share
              </span>
            </NuxtLink>

            <button class="icon-button" @click="mute = !mute" title="Mute terrible hold music" v-if="false">
              <span class="material-symbols-outlined">
                {{ mute ? 'volume_off' : 'volume_up' }}
              </span>
            </button>
            <button class="icon-button" @click="hidePopup()" title="Hide popup (don't worry, hiding won't interrupt rendering!)">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      
        <div class="content-area">
          <AuthBeggar v-if="needAuth" style="padding: 24px; "/>
          <template v-else>
            <HoldPlease
              @close-popup="hidePopup"
              :loading="loading"
              :screenPreviewHTML="screenPreviewHTML"
            />
          </template>
        </div>
      </div>
    </transition>
    
    <button class="show-popup-button" ref="showPopupButtonRef" @click="showPopup = true">
      <span class="cursive-text-lower-baseline">CHAOS</span>
      <span v-if="loading" class="spinner"></span>
      <div v-else class="nospinner-spacer"></div>
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
  background-color: #000000;
  color: #ffffff;
  overflow: hidden;
  z-index: 10002;
}

:deep button {
  background-color: #ffffff;
  padding: 0.4em 1.2em;
}

.popup a {
  color: #ff0000;
}

.popup a:visited {
  color: #ff0000;
}

.popup-enter-active,
.popup-leave-active {
  transition: 2.5s ease;
}

.hourglass-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.01);
  cursor: wait;
  z-index: 10001;
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
  background-color: #ff0000;
  color: white;
  font-family: "Cedarville Cursive", cursive;
  border: none;
}

.titlebar {
  transition: all 0.2s ease;
  width: 400px;
  max-width: calc(100vw - 24px);
}

.popup-enter-from .titlebar,
.popup-leave-to .titlebar {
  width: var(--show-popup-button-width);
}

button.show-popup-button:hover {
  background-color: #ff0000;
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
  transition: opacity 0.15s ease;
  font-size: 12px;
  font-family: sans-serif;
  color: white;
}

.popup .titlebar .titlebar-buttons a {
  color: white;
}

.popup-enter-from .titlebar .titlebar-buttons,
.popup-leave-to .titlebar .titlebar-buttons {
  opacity: 0;
}

.popup .titlebar .icon-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  text-decoration: none;
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
  overflow: auto;
  max-height: 100vh;
  
  transition: all 0.2s ease;
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
  transition-delay: 0.2s;
}

button.show-popup-button .spacer {
  flex-grow: 1;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  height: 50%;
  margin: 0 12px 0 0;
}

.auth-section {
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: left;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: rgba(255, 255, 255, 0.8);
  animation: spin 1s linear infinite;
  margin: 0 12px;
  width: 12px;
}

.nospinner-spacer {
  margin: 0 12px;  
  /* include 12px of spinner width + 4px of border width */
  width: calc(12px + 2px * 2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
