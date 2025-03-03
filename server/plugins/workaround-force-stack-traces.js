// Recent Nuxt + Nitro is  no longer logging stack traces along with error messages.
// This is a workaround to see stack traces again. It can be removed when the issue is fixed.
//
// Issue: https://github.com/nuxt/nuxt/issues/30102

export default defineNitroPlugin((nitroApp) => {
  // Since nuxt upgrade stack trace was missing and this helps to get it back
  nitroApp.hooks.hook('error', async (error, { event }) => {
    console.error(`${event?.path} Application error:`, error)
  })
})
