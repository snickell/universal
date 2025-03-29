<script setup>
const route = useRoute()
const initialPrompt = route.query.initialPrompt
</script>

<template>
  <Universal :initialPrompt="initialPrompt" />
</template>
