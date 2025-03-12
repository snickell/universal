// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { strict: false },

  nitro: {
    devServer: {
      watch: ['lib'],
    },
    // Enabling websocket: true causes 2x startup errors in nuxt-auth-utils
    // see: https://github.com/atinux/nuxt-auth-utils/issues/372
    experimental: {
      websocket: true
    },
    preset: "cloudflare_durable"
  },

  modules: [
    'nuxt-auth-utils',
    'nitro-cloudflare-dev',
  ],
})
