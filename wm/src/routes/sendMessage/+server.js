import { createAgent, MODE_CHEAP } from '$lib/agentShared'
import { json } from '@sveltejs/kit'

const agent = createAgent({
  openRouterAPIKey: import.meta.env.VITE_UNIVERSAL_OPENROUTER_API_KEY,
  mode: MODE_CHEAP
})

export async function POST({ request }) {
  const data = await request.json()
  const result = await agent.renderNextFrame({
    msg: data.msg,
    messages: data.messages
  })
  
  return json(result)
}
