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

// This is provided by Universal.vue after it receives the first frame
const universalSessionID = inject('universalSessionID')

// This is provided by Universal.vue when it starts rendering a new frame
const renderStartTime = inject('renderStartTime')

// Update elapsedSeconds every second based on renderStartTime
const tick = ref(Date.now())
onMounted(() => {
  const timer = setInterval(() => tick.value = Date.now(), 1000)
  onUnmounted(() => clearInterval(timer))
})
const elapsedSeconds = computed(() => !renderStartTime.value ? 0 : Math.floor((tick.value - renderStartTime.value) / 1000))
</script>

<template>
  <div>
    <div class="content">
      <div class="preview">
        <div>
          <ScreenPreview
            :screenPreviewHTML="screenPreviewHTML"
            :scale="4"
          >
            <div v-if="loading" class="middle-of-screen">
              <span>Just a sec, the LLM is rendering the next frame</span>

              <div class="spinner-container">
                <span class="material-symbols-outlined spinner">progress_activity</span>
              </div>
            </div>
            <div v-else>
              <div class="blurring-backgrop"></div>
                <div class="middle-of-screen">
                  <button
                    @click="$emit('close-popup')"
                    style="font-size: 150%; background-color: #ffffff; white-space: nowrap; cursor: pointer;"
                  >
                    frame done - go see it!
                  </button>
                </div>
            </div>
          </ScreenPreview>

        </div>

        <div style="padding: 12px 24px 6px 24px; display: flex; flex-wrap: wrap;" v-if="false">
          <div class="timer" style="white-space: nowrap;">
            <span v-if="loading">Rendering frame: {{ elapsedSeconds }}s (estimate: 10 to 120s)</span>
            <span v-else>Rendering frame: <i>done</i></span>
          </div>
          <div style="flex-grow: 1"></div>
          <div style="white-space: nowrap; margin-top: 4px;">
            Tired of waiting? <a href="/gallery" target="_blank" rel="noopener">Instant Replay Gallery</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  width: 100%;
  background-color: #ff0000;
  color: white;
  outline: 3px solid #ff0000;
  border: 1px solid #000000;
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
  border-right: 1px solid red;
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


</style>
