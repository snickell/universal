<script setup>
const { openInPopup } = useUserSession()

const props = defineProps({
  needAuth: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div v-if="needAuth" id="auth-popover">
    <div>
      <h1>Authentication Required to use expensive LLMs</h1>
      <p>
        This demo makes fairly expensive use of a Claude Sonnet 3.7 model. Each frame costs me about $0.05,
        and I'd like as many people as possible to see it before I run out of money.
        I require Google auth so I can limit the number of frames an individual can generate.
      </p>
      <GoogleSigninButton />
      <div style="opacity: 0.25">
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
#auth-popover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.75);
}

#auth-popover > div {
  border: 0px;
  border-radius: 10px;
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 100vw;
  max-height: 100vw;
  overflow: scroll;
  background-color: white;
  border: 1px solid black;
  padding: 40px;
}
</style>
