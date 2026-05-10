'use client'

import { useEffect, useRef } from 'react'

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 64 }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (!ref.current) return

    const generate = () => {
      if (!ref.current) return
      // Clear previous QR code
      ref.current.innerHTML = ''
      // @ts-ignore
      new window.QRCode(ref.current, {
        text: value,
        width: size,
        height: size,
        colorDark: '#1a3a2a',
        colorLight: '#ffffff',
        correctLevel: 2,
      })
    }

    // @ts-ignore
    if (window.QRCode) {
      generate()
    } else if (!scriptLoaded.current) {
      scriptLoaded.current = true
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      script.onload = generate
      document.head.appendChild(script)
    }
  }, [value, size])

  return <div ref={ref} style={{ lineHeight: 0 }} />
}
