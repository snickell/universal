<script setup>
const { loggedIn, user, session, clear } = useUserSession()

async function onLogout() {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div>
    <div v-if="loggedIn">
      You are logged in as {{ user.email }}
      <button @click="onLogout">Logout</button>
    </div>
    <div v-else>
      <GoogleSigninButton />
    </div>
  </div>
</template>
