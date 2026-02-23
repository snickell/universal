<template>
  <Html>
    <Head>
      <Title>CHAOS</Title>
      <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg">
    </Head>
    <Body>
      <div>
      </div>
      <NuxtPage />
    </Body>
  </Html>
</template>

<style>
/* 
Roboto is our "OS screen font", this is what the LLM will be using (mostly).
Text rendered in this font should indicate its part of the LLM output, 
rather than part of the Universal VM.
*/
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

/*
Cedarville Cursive is our "logo font", its intended to be visually quite different
to make it easy to see what's part of the OS and what's part of the VM when they're
mixed on the same screen. Should be used sparingly.
*/
@import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

/*
Inter is our "application font", this is what we use in the Universal VM for most
things, particularly for large chunks of text.
*/
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap');

/*
Material Design Symbols (formerly known as Material Icons)
*/
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

body {
  margin: 0;
  padding: 0;

  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
}

input, textarea, select, button {
  /* inputs/buttons need a nudge to inherit Inter font-family: */
  font-family: inherit;
  font-weight: 200;
}

</style>
