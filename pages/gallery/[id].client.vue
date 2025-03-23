<script setup>
definePageMeta({ ssr: false })
const universalSessionID = useRoute().params.id
</script>

<template>
  <Universal :universalSessionID="universalSessionID" />
</template>
