// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { strict: false },

  nitro: {
    devServer: {
      watch: ['lib'],
    },
    // Enabling websocket: true causes errors (in nuxt-auth-utils maybe?) like:
    /*
      ERROR  / Application error: Cannot read properties of undefined (reading 'runtimeConfig')

          at useRuntimeConfig (node_modules/nitropack/dist/runtime/internal/config.mjs:17:27)
          at _useSession (node_modules/nuxt-auth-utils/dist/runtime/server/utils/session.js:49:27)
          at getUserSession (node_modules/nuxt-auth-utils/dist/runtime/server/utils/session.js:7:25)
          at <anonymous> (node_modules/nuxt-auth-utils/dist/runtime/server/plugins/ws.js:5:11)
    */
    // experimental: {
    //   websocket: true
    // },
    preset: "cloudflare_durable"
  },

  modules: [
    'nuxt-auth-utils',
    'nitro-cloudflare-dev',
  ],
})
