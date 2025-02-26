'use client'

import { useState, useEffect, useRef } from 'react'
import { renderNextFrame } from './agent'

export default function Home() {
  const [svg, setSvg] = useState('')
  const [msgFromUser, setMsgFromUser] = useState('')
  const [loading, setLoading] = useState(false)
  const controlRef = useRef(null)

  function getDimensions() {
    // TODO
    return {width: 800, height: 600}
  }

  const _renderNextFrame = async (msg) => {
    setLoading(true)
    const {svg} = await renderNextFrame({msg, dimensions: getDimensions()})
    console.log("renderNextFrame => ", svg)
    setSvg(svg)
    setLoading(false)
  }

  const onMsgFromUser = async () => {
    setMsgFromUser('')
    _renderNextFrame(msgFromUser)
  }

  const handleSvgClick = async (event) => {
    let el = event.target
    while (el && !el.id) el = el.parentElement
    if (el && el.id) processCommand(`click on element with id="${el.id}"`)
  }

  useEffect(() => {
    if (!svg) _renderNextFrame()
  }, [svg])

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        onClick={handleSvgClick}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ flexGrow: 1, overflow: "hidden", backgroundColor: "green"}}
      />
      <div 
        ref={controlRef} 
        style={{ 
          position: "relative",
          display: "flex", 
          padding: "0px", 
          alignItems: "center",
          backgroundColor: "black",
          borderBottom: "1px solid #333",
        }}
      >
        <input
          type="text"
          value={msgFromUser}
          onChange={(e) => setMsgFromUser(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onMsgFromUser()}
          placeholder="Yes?"
          disabled={loading}
          style={{ 
            flex: "1",   // Makes input take up all available space
            padding: "8px",
            fontSize: "16px"
          }}
        />
        <button 
          onClick={onMsgFromUser} 
          disabled={loading}
          style={{ 
            whiteSpace: "nowrap", // Ensures button doesn't stretch
            padding: "8px 12px", 
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "default",
          }}
        >
          {loading ? "Rendering SVG..." : "Send"}
        </button>
      </div>
    </div>
  )
}
