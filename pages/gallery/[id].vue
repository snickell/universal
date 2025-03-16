<script setup>
const universalSessionID = useRoute().params.id
</script>

<template>
  <Universal :universalSessionID="universalSessionID" />
</template>
