import {
  PROMPT as CUPERTINO_PROMPT,
  CACHED_FIRST_SCREEN_HTML as CUPERTINO_CACHED_FIRST_SCREEN_HTML
} from './cupertino.js'

import {
  PROMPT as REVERSE_CUPERTINO_PROMPT,
  CACHED_FIRST_SCREEN_HTML as REVERSE_CUPERTINO_CACHED_FIRST_SCREEN_HTML
} from './reverseCupertino.js'

import {
  PROMPT as WIN95_PROMPT,
  CACHED_FIRST_SCREEN_HTML as WIN95_CACHED_FIRST_SCREEN_HTML
} from './win95.js'

import { SYSTEM_PROMPT } from './systemPrompt.js'
import { SYSTEM_PROMPT as REVERSE_SYSTEM_PROMPT } from './reverseSystemPrompt.js'

export const initialPrompts = {
  cupertino: {
    prompt: CUPERTINO_PROMPT,
    cachedFirstScreenHtml: CUPERTINO_CACHED_FIRST_SCREEN_HTML,
    systemPrompt: SYSTEM_PROMPT,
  },
  win95: {
    prompt: WIN95_PROMPT,
    cachedFirstScreenHtml: WIN95_CACHED_FIRST_SCREEN_HTML,
    systemPrompt: SYSTEM_PROMPT,
  },
  reverseCupertino: {
    prompt: REVERSE_CUPERTINO_PROMPT,
    cachedFirstScreenHtml: REVERSE_CUPERTINO_CACHED_FIRST_SCREEN_HTML,
    systemPrompt: REVERSE_SYSTEM_PROMPT,
  }
}

