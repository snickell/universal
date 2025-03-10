// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { strict: false },

  nitro: {
    devServer: {
      watch: ['lib'],
    },
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
