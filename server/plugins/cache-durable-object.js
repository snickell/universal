console.log("loading plugins/cloudflare-durable-env.js")

let durableObject = null
export const getDurableObject = () => durableObject
export const getDurableObjectEnv = () => durableObject?.env

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('cloudflare:durable:init', (_durableObject, ...args) => {
    console.log("in plugin hook, setting durableObject=", durableObject)
    durableObject = _durableObject
  })
})
