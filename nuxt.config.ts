// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { strict: false },

  nitro: {
    sourceMap: true,
    devServer: {
      watch: ['lib'],
    },
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
