// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-28',
  devtools: { enabled: true },
  typescript: { strict: false },

  future: {
    // opt-in to nuxt 4 features today, hopefully making the future upgrade easier
    compatibilityVersion: 4,
  },

  nitro: {
    sourceMap: true,
    // Enabling websocket: true causes 2x startup errors in nuxt-auth-utils
    // see: https://github.com/atinux/nuxt-auth-utils/issues/372
    experimental: {
      websocket: true
    },
    // see the experimental cloudflare durable PR: https://github.com/nitrojs/nitro/pull/2801
    preset: "cloudflare_durable"
  },

  modules: [
    'nuxt-auth-utils',
    // this causes errors on `npm run dev` if $DurableObject are defined in wrangler.toml:
    //'nitro-cloudflare-dev',
  ],
})
