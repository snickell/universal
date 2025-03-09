<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  mute: {
    type: Boolean,
    default: false
  }
})

let audio = null

function startHoldPleaseMusic() {
  if (props.mute) return
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

watch(() => props.mute, (isMuted) => {
  if (isMuted) {
    stopHoldPleaseMusic()
  } else if (props.loading) {
    startHoldPleaseMusic()
  }
})

onUnmounted(stopHoldPleaseMusic)
</script>

<template>
  <!-- This component plays music, no visible effect -->
  <div style="display: none;"></div>
</template>
