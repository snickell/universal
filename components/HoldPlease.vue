<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  screenPreviewHTML: {
    type: String,
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
    <div class="content">
      <div class="preview">
        <details open class="preview-expander" style="padding: 6px 24px 0px 24px;">
          <summary>
            <span v-if="loading">The LLM is hallucinating the next frame of your desktop OS</span>
            <span v-else>The LLM has <i>finished hallucinating</i>... for now 🌈</span>
          </summary>
          <div>
            <ScreenPreview
              :screenPreviewHTML="screenPreviewHTML"
            >
              <div v-if="loading" class="middle-of-screen">
                <div class="spinner-container">
                  <span class="material-symbols-outlined spinner">progress_activity</span>
                </div>
              </div>
              <div v-else>
                <div class="blurring-backgrop"></div>
                <div class="middle-of-screen">
                  <button
                    @click="$emit('close-popup')"
                    style="font-size: 150%; background-color: #d6e6fa; white-space: nowrap; cursor: pointer;"
                  >
                    frame done - go see it!
                  </button>
                </div>          
              </div>
            </ScreenPreview>

          </div>
        </details>

        <div style="padding: 12px 24px 6px 24px; display: flex;">
          <div class="timer">
            <span v-if="loading">Rendering frame: {{ elapsedSeconds }}s (estimate: 10 to 120s)</span>
            <span v-else>Rendering frame: <i>done</i></span>
          </div>
          <div style="flex-grow: 1"></div>
          <div>
            Tired of waiting? <a href="/gallery" target="_blank" rel="noopener">Instant Replay Gallery</a>
          </div>
        </div>
      </div>

      <div class="info" style="padding: 24px;">
        <h2>How does this work? What is it doing?</h2>

        <p>
          Each time you click, the LLM renders the frame from scratch to respond to your click or command.
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
</template>

<style scoped>
.preview {
  width: 100%;
  background-color: #115db0;
  color: white;
  outline: 3px solid #115db0;
  border: 1px solid #0f2847;
  border-left: 0;
  border-right: 0;
  font-size: 1.1rem;
}

.preview a {
  color: white;
}

.preview-expander summary {
  padding: 5px 10px;
}

.blurring-backgrop {
  background-color: rgba(255,255,255,0.25);
  padding: 10px 20px;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  position: absolute;
  backdrop-filter: blur(10px);
}

.middle-of-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.header h1 {
  margin: 0;
  margin-bottom: 1em;
}

h2 {
  margin: 0;
  margin-bottom: 0.25em;
  font-weight: 500;
}


.spinner-container {
  background-color: rgba(255,255,255,0.25);
  border-radius: 32px;
  height: 64px;
}

.spinner {
  font-size: 64px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info {
  line-height: 1.5;
  margin: 0;
  text-align: left;
  background: linear-gradient(to bottom, #104886, #0f2847);
  color: #d6e6fa;
}

h1, h2 {
  font-size: 1.2em;
}

</style>
