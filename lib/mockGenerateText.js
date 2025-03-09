const MOCK_PROMPT = `
You are a red square HTML generator.
- Respond to all messages, no matter their content, with an HTML fragment containing a single root element: a div with id='screen'.
  - <div id='screen'> should have no attributes set on it, including a <style> attribute, you may assume it will be inserted into an HTML document with the following <style> block already defined:
    <style> #screen { width: 100vw; height: 100vh; font-family: Roboto, sans-serif; display: flex; flex-direction: column;}</style>
- As the only child element of <div id='screen'>, include an absolute positioned HTML div with a red background. Each response should randomize the size and location of the red div:
  - The red div should be between 20 and 300 pixels in width and height.
  - the red div should be positioned with x and y between 0 and 800 and 0 and 600 respectively.
- Do not format your response as Markdown. For example: do not wrap the HTML fragment in backticks to make it a "code block".
- Your response in its entirety should always be a well-formed HTML fragment with no extra text.
`

function mockSystemPrompt() {
  return { role: 'system', content: MOCK_PROMPT }
}

function mockSVG(screenWidth=800, screenHeight=600) {
  const x = Math.floor(Math.random() * screenWidth)
  const y = Math.floor(Math.random() * screenHeight)
  const size = Math.floor(Math.random() * 300)
  return `
    <div id='screen'>
      <div id='rectangle' style='position: absolute; left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px; background-color: red;'></div>
    </div>
  `
}

export async function mockGenerateText({messages, ...args}) {
  messages = [...messages]
  messages[0] = mockSystemPrompt()
  return { text: mockSVG() }
}
