# The Universal Program

In early 2025, the dominant mindset for application development with LLMs is: "use LLMs to write the code".
The code is then run on computers, which are (sorta) turing complete. But LLMs themselves are (sorta)
turing complete, and contrary to popular opinion, code is a brittle medium with a strong grain.

What if we cut out the middlemen, code and computers, and let the AI/LLM do the execution itself? Why
make them "write the code to do the thing" when they could just... do the thing? Let them draw
directly to the screen, and update it in response to events like mouse clicks. I'm betting the (very real)
"why nots" list will be a lot shorter in 2035.

Describe what you want, it'll draw that interface. Click a button, it'll draw the next frame. Add
a feature by talking about it. I've been thinking of such direct-to-screen LLMs as "the universal program",
because they are authored inside themselves and can adapt to be whatever program you need.

Where code is brittle, the universal program is fluid. Where code is one-size-fits-all, the universal program
is trivial to customize to your particular needs. I predict universal programs will have much higher diversity
of features and interface as a result. Even in Linux, where diversity is highest, to sooome extent, every Linux
desktop is kinda the same `¯\_(ツ)_/¯`.

<p>
  <a href="https://universal.oroborus.org">
    <strong>GO TRY THE DEMO NOW: </strong><br/>
    <img src="https://universal-static.pages.dev/universal-mar-9-2025.png" alt="screenshot of the universal program from mar 9, 2025" height="340">
  </a>
</p>

You just experienced the universal program running on a 2025 LLM: at best, a curious albeit shitty demo.

What would it be like on a 2030 model?

## Draw a straight line and follow it

Code is dead.

Or, more specifically: I believe programming languages as we know them for application development are long-term dead.
I suspect **AI will NOT replace us at writing in programming languages, they will replace programming languages altogether.**

The universal program you experienced today runs on 2025's Claude 3.7 Sonnet, and it sucks:

It forgets state after ~200 clicks, its logic is inconsistent, its UI designs stink,
it costs 5 cent per frame, and it runs at 1/30 FPS (=2 frames per minute) on a [$500k GPU](https://www.nvidia.com/en-us/data-center/dgx-b200/) 🤣.

What will happen if models become 100x faster ([cerebras](https://cerebras.ai/) is already 10x faster),
get 100x longer contexts ([gemini 1.5](https://cloud.google.com/vertex-ai/generative-ai/docs/long-context) is already 10x bigger),
and cost 100x less ([deepseek chat v3](https://api-docs.deepseek.com/quick_start/pricing) is already 10x cheaper)?

I predict, given enough time, the universal program will:
1. Replace programming languages in executing the "business logic" layer of most apps
2. On-the-fly generate+run machine code (WASM?) to optimize reactivity, power consumption and cost
3. Collapse the idea of their being separate "applications" in the first place.
4. Why not boot directly into it?

Draw a straight line and follow it.

## What is the universal program?

The universal program is an AI agent able to draw (bitmap or vector) to a window
or even the whole screen and receive [typical events](https://developer.mozilla.org/en-US/docs/Web/API/Event)
like where you clicked on it, what you types, timers, messages from other agents, etc. In response to events,
it can [use tools](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview),
(including [local APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)
and sending messages to other AI agents), and, critically, update the image on the screen/window.

How do you use it? Just like a normal application, you click buttons, you type, etc. But unlike a normal
application, you can program it just by talking to it. Tell it how you'd like it to work.
What elements should the "application" have? What buttons? What features? Talk to it.

Unlike "LLMs writing code", there's no "hidden rats nest of code" for the LLM or human to get twisted up in.
In the universal program the LLM will act and draw directly. Programs today are rigid because
program code is logic, and therefore is also rigid. "Move that button over here" might require significant
technical re-work (for a human OR LLM) due to the strong grain of programming langauges.

In contrast, the universal program can change fluidly, and they can change themselves too.

## Precedent for the universal program: Smalltalk

Smalltalk is another sort of universal program.

Similarities:
- Smalltalk is simultaneously a programming environment and the program being written just like our universal program.
- A Smalltalk "program" has its real state is not in code, but in a smalltalk image (which contains code!). The LLM's contextis very similar to a smalltalk image in this regard. It contains the instructions you gave it to describe how it works, but also the state of all the objects in its world.
- Smalltalk programs are built using message-passing between objects as the primary mediator of computation. The universal program also operates on message passing, between the LLM and the user, and between the objects we call agents.

## Personal Computers, at last?

Smalltalk already had a massive impact on computers as we know them, but many of
its aspirations were also lost. Computing today is impersonal, and inflexible.
Users, even programmers, even programmers running only open source software, are by and
large disempowered users who don't modify the code of their "kit-home".

At best, maybe you have a custom patch here or there, a long list of custom settings,
and use flexible programs like neovim or vscode where you've assembled a long list
of (prefab) extensions and modules you layer into the program. But, still, cmon: cybperunk
we ain't.

Desktop and application-wise, we all pretty much live in either a Sears Robuck
Craftsman Argyle bungalow, a Montgomery Ward Wardway Florence colonial, or there's 
a few hippies that built their hosues from one of several prefab modular vendors.

In contrast, once they are viable, I expect these to get very personal very fast.

Maybe, finally, eventually, we'll have personal computers.