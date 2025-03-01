'use client'

import { useRef, useEffect } from 'react'

export function useHoldPlease(isLoading) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.src = 'https://universal-static.pages.dev/holdplease.mp3'
      audioRef.current.loop = true
    }
    
    if (isLoading) {
        audioRef.current.play().catch(error => console.log(error))
    } else {
      audioRef.current.pause()
    }
    
    return () => audioRef.current && audioRef.current.pause()
  }, [isLoading])
}
