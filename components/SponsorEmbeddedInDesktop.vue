<script setup>
import { SPONSOR, SPONSOR_NAME, SPONSOR_URL } from '~/shared/utils/constants.js'
</script>

<template>
  <div
    v-if="SPONSOR"
    class="sponsor"
  >
    Sponsored by <a :href="SPONSOR_URL">{{ SPONSOR_NAME }}</a>
  </div>
</template>

<style scoped>
.sponsor {
  font-family: sans-serif;
  background-color: #ff0000;
  color: white;
  padding: 35px 10px 5px 25px;

  position: absolute;
  right: 0;
  top: 0;

  width: 12em;
  border-radius: 0 0 0 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  font-size: 14px;
}

.sponsor a {
  color: white;
  text-decoration: none;
}
</style>
