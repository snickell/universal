<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

const elapsedSeconds = ref(0)
const timerInterval = ref(null)

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
    startTimer()
  } else {
    stopTimer()
  }
}, { immediate: true })

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div>
    <div v-if="loading" class="content">
      <div class="header">
        <h2 class="title">An LLM is rendering the next frame of your desktop OS</h2>
      </div>
      
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
    
    <div v-else class="idle-content">
      <h2 class="idle-title">LLM is idle: if you click somewhere on the desktop, we'll start generating another frame</h2>
      <p class="idle-description">
        Each time you click, we send the click event to the LLM, and it draws another frame of the screen. Rendering a frame is slow, it requires 10s to ~2 minutes.
      </p>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.idle-content {
  padding: 20px 0;
  text-align: center;
}

.idle-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.idle-description {
  color: #666;
  font-size: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
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
