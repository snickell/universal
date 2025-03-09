<script setup>
  const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()
  const showSettings = ref(false)

  async function onLogout() {
    await clear()
    await navigateTo('/')
  }
</script>

<template>
  <div>
    <div v-if="showSettings">
      <div v-if="showSettings" @click="showSettings = false" class="fullscreen-fadeout" />
        <div class="settings-page">
          <button class="close" @click="showSettings = false">✕</button>

          <div v-if="loggedIn">
            You are logged in as {{ user.email }}
            <button @click="onLogout">Logout</button>
          </div>
          <div v-else>
            <GoogleSigninButton />
          </div>
        </div>

    </div>
    <button class="toggle" @click="showSettings = !showSettings">☰</button>
  </div>
</template>

<style scoped>
.fullscreen-fadeout {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(200,200,200,0.5);
}

.settings-page {
  bottom: 100%;
  position: absolute;
  left: 0;
  background-color: white;
  border-radius: 10px 10px 10px 0px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  max-width: 40em;
  padding: 40px;
  padding-top: 60px;
  z-index: 101;
}

button.toggle {
  padding: 8px 12px;
  font-size: 16px;
}

button.close {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>