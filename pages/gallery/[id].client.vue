<script setup>
definePageMeta({ ssr: false })
const universalSessionID = useRoute().params.id
</script>

<template>
  <div style="background: #4AADCE;">
    <Universal :universalSessionID="universalSessionID" />
  </div>
</template>
