import { createAgent, MODE_CHEAP } from '~/lib/agentShared'

const agent = createAgent({
  openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
  mode: MODE_CHEAP
})

export default defineEventHandler(async (event) => {
  return agent.sendMessage(await readBody(event))
})
