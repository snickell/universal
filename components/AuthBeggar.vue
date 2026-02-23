<script setup>
const { openInPopup } = useUserSession()
</script>

<template>
  <div id="auth-popover">
    <div>
      <h1>Google auth required to use expensive LLMs</h1>
      <p>
        I will not email you, disclose your email, sell your email, or whatever. This is for cost-control purposes only: every
        time you click, it costs me about $0.05.
      </p>

      <p>
        PLEASE NOTE: I will not reveal your email, but your interaction with the demo will be anonymously 
        available to the world in the <NuxtLink to="/gallery">instant replay gallery</NuxtLink>, so don't enter
        any personal or sensitive information. This is a public space.
      </p>
      <div style="height: 1em"/>
      <Sponsor />
      <div style="display: flex; gap: 20px; margin-top: 2em; align-items: flex-end;">
        <GoogleSigninButton />
      </div>
      <div style="display: none">
        <h1>TODO</h1>
        <h2>Alternative: use your own OpenRouter account if you have one ❤️</h2>
        <p>
          If you have an OpenRouter account, I would ❤️ it if you'd consider paying for the frames yourself.
          A $1 credit limit is plenty to see what this is about, its so slow I doubt you'll have the patience
          for more anyway. I will not store your OpenRouter credentials, they'll stay in your browser.
        </p>
        <button @click="openInPopup('/auth/openrouter')">Login with OpenRouter</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#auth-popover h1 {
  margin-top: 0;
}

a {
  color: #ff0000;
}

a:visited {
  color: #ff0000;
}
</style>
