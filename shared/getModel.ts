import { type LanguageModelV3 } from '@ai-sdk/provider'
import { createCerebras } from '@ai-sdk/cerebras'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export function getModel({openRouterAPIKey, cerebrasAPIKey, useCheapModel}: {openRouterAPIKey?: string, cerebrasAPIKey?: string, useCheapModel?: boolean}): LanguageModelV3 {
  if (!openRouterAPIKey) throw new Error('OpenRouter API key is required when useCheapModel=true')
  const openrouter = createOpenRouter({apiKey: openRouterAPIKey})
  const cerebras = createCerebras({apiKey: cerebrasAPIKey})

  let CHEAP_MODEL_NAME=''
  let CHEAP_MODEL!: LanguageModelV3

  // MODEL REVIEWS USING SAMBA NOVA:
  // CHEAP_MODEL = openrouter('openai/chatgpt-4o-latest') // REVIEW: NOT CHEAP, not faster than sonnet, generates sorta almost usable applications, 4/10
  // CHEAP_MODEL = openrouter('google/gemini-2.0-flash-001') // REVIEW: CURRENT BEST CHEAP MODEL: 30x cheaper than claude, 3x faster, generates sorta almost usable applications, 3.5/10
  // CHEAP_MODEL_NAME = 'deepseek/deepseek-r1' // REVIEW: NOT CHEAP, only 3x faster than sonnet 3.7, didn't totally f up, windows work 100%, when pushed made a calendar app that's barebones but you could add an event, and its interactive, 3/10
  // CHEAP_MODEL_NAME = 'qwen/qwen-2.5-coder-32b-instruct' // REVIEW: very fast, can do menus, did window correctly, still very basic not much idea of existing app features even when pushed, 2/10
  // CHEAP_MODEL_NAME = 'meta-llama/llama-3.1-405b-instruct' // NOT a cheap model, only 2x faster than claude, didn't f-up windows, but soooooo basic, cannot make it more complex even when pushed, its just a calendar grid, 2/10
  // CHEAP_MODEL_NAME = 'qwen/qwen-2.5-72b-instruct' // REVIEW: made a window, didn't totally f-up, but not much in it, didn't work with caching, did get window positioning sooooort of right, 1.5/10
  // CHEAP_MODEL_NAME = 'meta-llama/llama-3.2-90b-vision-instruct' // REVIEW: did its own windows that sorta worked but wonk, not very good at following directions, no features possible, 1.5/10
  // CHEAP_MODEL_NAME = 'deepseek/deepseek-r1-distill-llama-70b' // REVIEW: very basic calendar table, used window but didn't understand to use absolute positioning with it, so full width, 1/10

  // If we aren't using Claude, we want SPEED, keep checking out dedicated silicon providers
  // like Groq and SambaNova, these can be 10x faster than sonnet 3.7 is today,
  // but so far none of the models are really any good at making a usable application:
  // - https://openrouter.ai/provider/sambanova
  // - https://openrouter.ai/provider/groq
  const openRouterProvider = {
    order: [
      //'Groq', // 657.1t/s
      'SambaNova', // 532.3t/s
    ],
    'allow_fallbacks': false
  }
  // CHEAP_MODEL = openrouter(CHEAP_MODEL_NAME, { extraBody: { provider: openRouterProvider } })

  // BEST OPTION TODAY, 30x cheaper than claude, 3x faster, and it makes clickable (albeit ugly) interactive barebones apps
  CHEAP_MODEL = openrouter('google/gemini-2.0-flash-001')

  // Claude Sonnet 3.7 is, in Mar of 2025 far and away the best/only model for generating a usable result
  // the problem is that its pretty slow at ~50 tokens/s, and expensive at $15 per million output tokens
  // const NORMAL_MODEL = openrouter('anthropic/claude-3.7-sonnet')

  // LAZY UPDATE Feb 2026: update default to latest claude sonnet (4.5)
  let NORMAL_MODEL: LanguageModelV3 = openrouter('anthropic/claude-sonnet-4.5')

  // Alternative #1 for Feb 2026, seems like openai finally is good enough at grafix:
  // NORMAL_MODEL = openrouter('openai/gpt-5.2-codex')

  // Alternative #2 for Feb 2026, too dumb, but Cerebras sure is fast, totally different feel
  // NORMAL_MODEL = openrouter('qwen/qwen3-32b', { extraBody: { provider: { order: ['Cerebras'], 'allow_fallbacks': false} } })

  // TEST HACK Feb 2026: direct Cerebras for z-ai without OpenRouter in normal mode
  NORMAL_MODEL = cerebras('zai-glm-4.7')

  const model = useCheapModel ? CHEAP_MODEL : NORMAL_MODEL
  return model
}
