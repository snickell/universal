import { resolve } from 'path'

const libPath = resolve(__dirname, './lib/**/*.js')

console.log("libPath", libPath)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { strict: false },

  nitro: {
    devServer: {
      watch: ['lib'],
    },
  },

  hub: {
    // NuxtHub (https://hub.nuxt.com/) options for cloudflare deployment
  },

  modules: ['@nuxthub/core']
})