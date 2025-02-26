'use server';

import { createAgent, MODE_NORMAL, MODE_CHEAP, MODE_MOCK } from './agentShared';

const agent = createAgent({
  openRouterAPIKey: process.env.UNIVERSAL_OPENROUTER_API_KEY,
  mode: MODE_CHEAP,
  // mode: MODE_MOCK,
})

export async function renderNextFrameServerSide({msg, messages}) {
  return await agent.renderNextFrame({msg, messages})
}
