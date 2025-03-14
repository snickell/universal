let durableObject = null
export const getDurableObject = () => durableObject
export const getDurableObjectEnv = () => durableObject?.env

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('cloudflare:durable:init', (_durableObject, ...args) => {
    durableObject = _durableObject
  })
})
