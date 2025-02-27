# Universal Program - SvelteKit Version

This is a SvelteKit implementation of the Universal Program, an AI-powered direct interface that renders SVG-based UI.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenRouter API key:
   ```
   VITE_UNIVERSAL_OPENROUTER_API_KEY=your_openrouter_api_key_here
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

This SvelteKit app replicates the functionality of the Next.js version while leveraging SvelteKit's features for a cleaner implementation.
