<script setup>
const { openInPopup } = useUserSession()
</script>

<template>
  <div id="auth-popover">
    <div>
      <h1>Google auth required to use expensive LLMs</h1>
      <p>
        This demo is an open source art project (<a href="https://github.com/snickell/universal">github</a>)
        and uses Claude Sonnet 3.7 in an unusally expensive way. Each time you click Claude renders a DOM 'frame'
        for a whole OS desktop, and burns $0.05 of tokens in the process.

        I require you to auth with google as a simple way of limiting the number of frames any one individual can generate.
      </p>
      <p>
        I will not email you, disclose your email, sell your email, or whatever. This is for cost-control purposes only.
      </p>
      <div style="height: 1em"/>
      <Sponsor />
      <div style="display: flex; gap: 20px; margin-top: 2em; align-items: flex-end;">
        <GoogleSigninButton />

        <div>
          PLEASE NOTE: your use of this demo will be <b>visible to the world</b> in our anonymous
          <NuxtLink to="/universal-sessions">instant replay gallery</NuxtLink>.
          Think "public art gallery": don't enter personal information.
        </div>
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
  color: #3394f8;
}

a:visited {
  color: #0070f3;
}
</style>
