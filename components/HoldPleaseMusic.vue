<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

let audio = null

function startHoldPleaseMusic() {
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
    startHoldPleaseMusic()
  } else {
    stopHoldPleaseMusic()
  }
}, { immediate: true })

onUnmounted(stopHoldPleaseMusic)
</script>

<template>
  <!-- This component plays music, no visible effect -->
  <div style="display: none;"></div>
</template>
