import {
  PROMPT as CUPERTINO_PROMPT,
  CACHED_FIRST_SCREEN_HTML as CUPERTINO_CACHED_FIRST_SCREEN_HTML
} from './cupertino.js'

import {
  PROMPT as WIN95_PROMPT,
  CACHED_FIRST_SCREEN_HTML as WIN95_CACHED_FIRST_SCREEN_HTML
} from './win95.js'

export const initialPrompts = {
  cupertino: {
    prompt: CUPERTINO_PROMPT,
    cachedFirstScreenHtml: CUPERTINO_CACHED_FIRST_SCREEN_HTML
  },
  win95: {
    prompt: WIN95_PROMPT,
    cachedFirstScreenHtml: WIN95_CACHED_FIRST_SCREEN_HTML
  },
}

export { SYSTEM_PROMPT } from './systemPrompt.js'
