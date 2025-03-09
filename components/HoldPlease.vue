<script setup>
import { ref, watch, onUnmounted } from 'vue'
import HoldPleaseMusic from './HoldPleaseMusic.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

const visible = ref(false)
const isMuted = ref(false)
const elapsedSeconds = ref(0)
const timerInterval = ref(null)

function closeOverlay() {
  visible.value = false
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

function startTimer() {
  elapsedSeconds.value = 0
  timerInterval.value = setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    visible.value = true
    startTimer()
  } else {
    stopTimer()
    visible.value = false
  }
}, { immediate: true })

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div>
    <HoldPleaseMusic :loading="loading && !isMuted" />
    
    <div v-if="visible" class="overlay" :class="{ 'loading': props.loading }">
    <div class="modal">
      <div class="header">
        <h2 class="title">An LLM is rendering the next frame of your desktop OS</h2>
        <div class="controls">
          <button class="icon-button" @click="toggleMute">
            <span class="material-symbols-outlined">
              {{ isMuted ? 'volume_off' : 'volume_up' }}
            </span>
          </button>
          <button class="icon-button" @click="closeOverlay">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      
      <div class="content">
        <div class="spinner-container">
          <span class="material-symbols-outlined spinner">progress_activity</span>
        </div>
        
        <div class="timer">
          {{ elapsedSeconds }} seconds elapsed of 10s - 120s
        </div>

        <div class="info">
          <h1>What's happening right now?</h1>

          <p>
            Each time you click, an LLM is rendering the frame from scratch.
            This process can take as little as 10s for a menu click or as much as 1-2 minutes
            for full screen renders of a complex app.
          </p>
          <p>
            This is totally crazy to wait for in early 2025. But even today there are
            large LLMs running on custom silicon that are 10x faster than Claude Sonnet 3.7 like <i>DeepSeek: R1 Distill Llama 70B</i>.
            Unfortunately, despite being very smart and fast, none of these have Claude's skill at visual layout, so they
            make ugly and barely usable pages.
          </p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: opacity 1s ease-out;
  opacity: 1;
}

.overlay.loading {
  opacity: 1;
}

.overlay:not(.loading) {
  opacity: 0;
  pointer-events: none;
}

.modal {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 60em;
  max-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 8px;
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

.content {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.spinner-container {
  margin-bottom: 24px;
}

.spinner {
  font-size: 64px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.timer {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.info {
  max-width: 45em;
  line-height: 1.5;
  margin: 0;
  text-align: left;
}

.info h1 {
  font-size: 1.25em;
}

.info p {
  margin-bottom: 1.5em;
}
</style>
