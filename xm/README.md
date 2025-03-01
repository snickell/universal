# Universal Program - Nuxt 3 Version

This is a Nuxt 3 implementation of the Universal Program, an AI-powered direct interface that renders SVG-based UI.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenRouter API key:
   ```
   NUXT_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

## Development

Start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Features

- AI-powered SVG rendering using OpenRouter API
- Interactive SVG elements with click handling
- Responsive design that adapts to window size
- Hold music during loading states

## Implementation Details

This Nuxt 3 app replicates the functionality of the original Next.js version while leveraging Vue 3 and Nuxt 3's features for a cleaner implementation.
