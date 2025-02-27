function mockSystemPrompt() {
  const mockPrompt = 'You are a red square SVG generator. Respond to all messages, no matter their content, with a well-formed 800x600 sized SVG with a randomly positioned red square. Do not format your response as Markdown. For example: do not wrap the SVG in backticks to make it a "code block". Your response in its entirety should always be a well-formed SVG document with no extra text.'
  return { role: 'system', content: mockPrompt }
}

function mockSVG(screenWidth=800, screenHeight=600) {
  const x = Math.floor(Math.random() * screenWidth)
  const y = Math.floor(Math.random() * screenHeight)
  const size = Math.floor(Math.random() * 300)
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="red" />`
}

export async function mockGenerateText({messages, ...args}) {
  messages = [...messages]
  messages[0] = mockSystemPrompt()
  return { text: mockSVG() }
}
