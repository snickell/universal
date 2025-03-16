<script setup>
const props = defineProps({
  screenPreviewHTML: {
    type: String,
    required: false
  }
})

// if both width and height are not fixed, what is the aspect ratio of this preview?
const aspectRatio = ref(3/2)

// scale controls how much bigger the "virtual screen" is than the preview
// you could also think of this as the oversampling / anti-aliasing factor
const scale = ref(2)

const cssVars = computed(() => ({
  '--aspect-ratio': aspectRatio.value,
  '--scale': scale.value,
}))

// expose screenEl to our parents just like ScreenContainer exposed it to us
const screenContainer = ref(null)
const screenEl = computed(() => screenContainer.value?.screenEl)
defineExpose({ screenEl, scale })
</script>

<template>
  <div class="preview" :style="cssVars">
    <div class="shrink">
      <ScreenContainer
        :screenHTML="screenPreviewHTML"
        :sendMessage="() => {}"
        ref="screenContainer"
      />
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.preview {
  aspect-ratio: var(--aspect-ratio);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.shrink {
  position: absolute;
  display: flex;
  width: calc(var(--scale) * 100%);
  height: calc(var(--scale) * 100%);
  transform-origin: top left;
  transform: scale(calc(1 / var(--scale)));
}
</style>