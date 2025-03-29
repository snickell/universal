<script setup>
definePageMeta({ ssr: false })
const universalSessionID = useRoute().params.id
</script>

<template>
  <div style="background: linear-gradient(to bottom, #999, #444);">
    <Universal :universalSessionID="universalSessionID" />
  </div>
</template>
