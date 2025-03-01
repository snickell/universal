<script>
  import { onMount } from 'svelte'
  import { renderNextFrame } from '$lib/agent'
  import debounce from 'debounce'
  
  let svg = ''
  let msgFromUser = ''
  let loading = false
  let svgContainer
  let audio
  
  // Initialize audio on mount (holdPlease functionality)
  onMount(() => {
    audio = new Audio()
    audio.src = 'https://universal-static.pages.dev/holdplease.mp3'
    audio.loop = true
    
    // Clean up on component destroy
    return () => {
      if (audio) {
        audio.pause()
        audio = null
      }
    }
  })
  
  // React to loading state changes
  $: if (audio) {
    if (loading) {
      audio.play().catch(error => console.log(error))
    } else {
      audio.pause()
    }
  }
  
  async function sendMessage(msg) {
    loading = true
    console.log("sendMessage", msg)
    try {
      const result = await renderNextFrame({ msg })
      svg = result.svg
      console.log("renderNextFrame =>\n", svg)
    } catch (error) {
      console.error("Error rendering SVG:", error)
    } finally {
      loading = false
    }
  }
  
  // Handle resize and send dimensions
  let lastWidth = null
  let lastHeight = null
  
  function sendDimensions() {
    if (!svgContainer) return
    
    const { clientWidth: width, clientHeight: height } = svgContainer
    if (lastWidth === width && lastHeight === height) return
    
    lastWidth = width
    lastHeight = height
    sendMessage(`render all future SVGs with width=${width} and height=${height}`)
  }
  
  onMount(() => {
    sendDimensions()
    
    const observer = new ResizeObserver(
      debounce(() => sendDimensions(), 1000)
    )
    
    if (svgContainer) {
      observer.observe(svgContainer)
    }
    
    return () => observer.disconnect()
  })
  
  function onMsgFromUser() {
    const msg = msgFromUser
    msgFromUser = ''
    sendMessage(msg)
  }
  
  function handleSvgClick(event) {
    let el = event.target
    while (el && !el.id) el = el.parentElement
    if (el && el.id) sendMessage(`click on element with id="${el.id}"`)
  }
</script>

<div style="height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden;">
  <!-- SVG Container -->
  <div 
    bind:this={svgContainer}
    on:click={handleSvgClick}
    style="flex-grow: 1; overflow: hidden; background-color: green;"
  >
    {@html svg}
  </div>
  
  <!-- Control Bar -->
  <div style="position: relative; display: flex; padding: 0px; align-items: center; background-color: black; border-bottom: 1px solid #333;">
    <input
      type="text"
      bind:value={msgFromUser}
      on:keypress={(e) => e.key === "Enter" && onMsgFromUser()}
      placeholder="Thy command?"
      disabled={loading}
      style="flex: 1; padding: 8px; font-size: 16px;"
    />
    
    <button
      on:click={onMsgFromUser}
      disabled={loading}
      style="white-space: nowrap; padding: 8px 12px; font-size: 16px; background-color: #0070f3; color: white; cursor: default;"
    >
      {loading ? "Rendering SVG..." : "Send"}
    </button>
  </div>
</div>
