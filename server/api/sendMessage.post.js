import { createAgent } from '@/lib/agentShared'

const agent = createAgent({
  openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return agent.sendMessage(await readBody(event))
})
