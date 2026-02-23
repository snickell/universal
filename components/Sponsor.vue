<script setup>
import { SPONSOR, SPONSOR_NAME, SPONSOR_URL } from '~/shared/utils/constants.js'
</script>

<template>
  <div
    v-if="SPONSOR"
    class="sponsor"
  >
    <div>
      <p>
        <b>Sponsored by <a :href="SPONSOR_URL">{{ SPONSOR_NAME }}</a></b>
      </p>
    </div>
  </div>
</template>

<style scoped>
#auth-popover h1 {
  margin-top: 0;
}

.sponsor {
  background-color: #ff0000;
  color: white;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
}


.sponsor a {
  color: white;
  text-decoration: none;
}

</style>
