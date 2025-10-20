import OpenAI from 'openai'

window.debug = {}


const MODEL = 'gpt-4o'
//const MODEL = 'gpt-4o-mini'

function getSystemPrompt() {
  const width = window.innerWidth
  const controlHeight = document.getElementById('control').getBoundingClientRect().height
  const height = window.innerHeight - controlHeight

  return `
    You are a universal desktop operating system in the style of macOS.
    
    1. The user will provide a new mouse/keyboard event or instruction to you.
    2. You will respond to each event or instruction from the user with a single well-formed <svg/> element representing the visual state of the desktop screen after obeying their command.
    3. Don't be afraid to include lots of visual detail.
    4. Details of the SVG element:
      - should be ${width}x${height} pixels
      - use the <g> element to group elements hierarchically
      - every single element in the SVG should have a unique id="" attribute. The user will reference these ids in events and commands. Be sure no SVG elements are missing a unique ID!
      - do not use <image> elements
    5. Do **not** format your response as Markdown. Do **not** use backticks or any other formatting characters.

    **Your response should always be a well-formed SVG document with no extra text.**
  `
}

const openai = new OpenAI({
  apiKey: API_KEY_GOES_HERE,
  dangerouslyAllowBrowser: true,
})

async function openingStanza() {
  const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {"role": "user", "content": "write a haiku about ai"}
      ]
  })
  console.log(completion.choices[0].message.content)
}

await openingStanza()

let history = [
  {"role": "system", "content": getSystemPrompt()},
]

async function renderNextFrame(prompt) {
  history.push({"role": "user", "content": prompt})
  const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: history,
  })

  const promptTokens = completion.usage.prompt_tokens
  const completionTokens = completion.usage.completion_tokens

  const inputCost = (promptTokens / 1_000_000) * 2.50
  const outputCost = (completionTokens / 1_000_000) * 10.00
  const totalCost = inputCost + outputCost

  console.log(`Tokens used: ${completion.usage.total_tokens}`)
  console.log(`Input tokens: ${promptTokens} (Cost: $${inputCost.toFixed(6)})`)
  console.log(`Output tokens: ${completionTokens} (Cost: $${outputCost.toFixed(6)})`)
  console.log(`Total cost: $${totalCost.toFixed(6)}`)

  console.log('completion:', completion)
  history.push(completion.choices[0].message)
  const svg = completion.choices[0].message.content
  debug.svg = svg
  return svg
}

async function tick(prompt) {
  console.log(`tick(${prompt})`)
  const svg = await renderNextFrame(prompt)
  const output = document.getElementById('svg')
  output.innerHTML = svg
  console.log('tick() done')
}

document.getElementById('svg').addEventListener('click', function(event) {
  let clickedElement = event.target

  while (clickedElement && !clickedElement.id) {
    clickedElement = clickedElement.parentElement
  }

  if (clickedElement) {
    const elementId = clickedElement.id
    console.log("Clicked element ID:", elementId)
    tick(`click on element with id="${elementId}"`)
  }
})

const commandInput = document.getElementById('command')
const commandButton = document.getElementById('command-ok')

function handleCommand() {
  const prompt = commandInput.value
  tick(prompt)
  commandInput.value = ''
}

commandButton.addEventListener('click', handleCommand)
commandInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleCommand()
  }
})

window.debug = {
  ...window.debug,
  openai,
  tick,
  history,
}

await tick("open with a typical macos desktop with a dock and a finder window open")
