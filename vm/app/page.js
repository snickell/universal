'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { renderNextFrame } from './agent'
import debounce from 'debounce'

export default function Home() {
  const [svg, setSvg] = useState('')
  const [msgFromUser, setMsgFromUser] = useState('')
  const [loading, setLoading] = useState(false)
  const controlRef = useRef(null)
  const svgContainerRef = useRef(null)

  const sendMessage = useCallback(async (msg) => {
    setLoading(true)
    console.log("sendMessage", msg)
    const { svg } = await renderNextFrame({ msg })
    console.log("renderNextFrame =>\n", svg)
    setSvg(svg)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!svgContainerRef.current) return

    let lastWidth = null
    let lastHeight = null
    const sendDimensions = () => {
      const { clientWidth: width, clientHeight: height } = svgContainerRef.current
      if (lastWidth === width && lastHeight === height) return
      lastWidth = width
      lastHeight = height
      sendMessage(`render all future SVGs with width=${width} and height=${height}`)
    }
    sendDimensions()

    const observer = new ResizeObserver(
      debounce(() => sendDimensions(), 1000)
    )
    observer.observe(svgContainerRef.current)
    return () => observer.disconnect()
  }, [sendMessage, svgContainerRef])

  const onMsgFromUser = async () => {
    setMsgFromUser('')
    _renderNextFrame(msgFromUser)
  }

  const handleSvgClick = async (event) => {
    let el = event.target
    while (el && !el.id) el = el.parentElement
    if (el && el.id) sendMessage(`click on element with id="${el.id}"`)
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={svgContainerRef}
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
            flex: "1",
            padding: "8px",
            fontSize: "16px"
          }}
        />
        <button
          onClick={onMsgFromUser}
          disabled={loading}
          style={{
            whiteSpace: "nowrap",
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
