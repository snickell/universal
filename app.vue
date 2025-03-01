
<script setup>
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()
</script>

<template>
  <Html>
    <Head>
      <Title>The Universal Program</Title>
    </Head>
    <Body>
      <div>
        <div v-if="loggedIn">
          Welcome {{ user.login }}! Logged in since {{ session.loggedInAt }}
          <button @click="clear">Logout</button>
        </div>
        <div v-else>
          <button @click="openInPopup('/auth/google')">Login with Google</button>
        </div>
      </div>
      <Universal />
    </Body>
  </Html>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  cursor: default;
  overflow: clip;
}
</style>
