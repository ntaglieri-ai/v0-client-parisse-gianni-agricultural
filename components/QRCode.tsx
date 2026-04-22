'use client'

import { useEffect, useRef } from 'react'

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 64 }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const generated = useRef(false)

  useEffect(() => {
    if (!ref.current || generated.current) return

    const generate = () => {
      if (!ref.current) return
      ref.current.innerHTML = ''
      generated.current = true
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
    } else {
      const existing = document.querySelector('script[data-qr]')
      if (existing) {
        existing.addEventListener('load', generate)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      script.setAttribute('data-qr', '1')
      script.onload = generate
      document.head.appendChild(script)
    }
  }, [value, size])

  return <div ref={ref} style={{ lineHeight: 0 }} />
}
