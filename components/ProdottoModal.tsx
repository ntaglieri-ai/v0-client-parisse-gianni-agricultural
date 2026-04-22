'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Prodotto } from '@/lib/prodotti'

const QRCode = dynamic(() => import('./QRCode'), { ssr: false })

interface Props {
  prodotto: Prodotto | null
  onClose: () => void
  baseUrl: string
}

export default function ProdottoModal({ prodotto: p, onClose, baseUrl }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!p) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [p])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!p) return null

  const tracciaUrl = `${baseUrl}/store/traccia/${p.id}`

  const handleStampa = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#qr-modal canvas')
    if (!canvas) return
    const win = window.open('')!
    win.document.write(`
      <html><body style="text-align:center;padding:40px;font-family:serif">
        <h2 style="color:#1a3a2a">Gianni Parisse – Azienda Agricola</h2>
        <p style="margin:8px 0">Lotto: <strong>${p.lotto}</strong></p>
        <p style="margin:4px 0;font-size:13px;color:#666">${p.nome}</p>
        <img src="${canvas.toDataURL()}" style="margin:20px auto;display:block;border-radius:8px"/>
        <p style="font-size:11px;color:#888">Scansiona per vedere la filiera completa</p>
      </body></html>
    `)
    win.print()
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        zIndex: 999, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20, animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 18, maxWidth: 680, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 80px rgba(0,0,0,.35)',
        animation: 'slideUp .25s ease',
      }}>
        <div style={{
          background: 'linear-gradient(135deg,#1a3a2a,#2d5c3f)',
          padding: '28px 32px 24px', borderRadius: '18px 18px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 26, margin: 0 }}>{p.nome}</h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, marginTop: 4 }}>
              Lotto {p.lotto} - Raccolta: {p.raccolta}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff',
            width: 36, height: 36, borderRadius: '50%', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>X</button>
        </div>

        <div style={{ padding: '30px 32px' }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#666', marginBottom: 14 }}>
              Filiera di produzione
            </p>
            {p.steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, padding: '14px 0',
                borderBottom: i < p.steps.length - 1 ? '1px solid #ede5d5' : 'none',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: s.done ? '#1a3a2a' : '#f5f0e8',
                  border: `2px solid ${s.done ? '#1a3a2a' : '#ede5d5'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 14, display: 'block' }}>{s.label}</strong>
                  <span style={{ fontSize: 12, color: '#666' }}>{s.data}</span>
                </div>
                <span style={{ alignSelf: 'center', fontSize: 18, color: s.done ? '#1a3a2a' : '#ccc' }}>
                  {s.done ? 'V' : 'O'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Campo', val: p.campo },
              { label: 'Varieta', val: p.varieta },
              { label: 'Metodo', val: p.metodo },
              { label: 'Certificazione', val: p.cert },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: '#f5f0e8', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#666', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#f5f0e8', borderRadius: 14, padding: 24,
            textAlign: 'center', border: '2px dashed #ede5d5',
          }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#666', marginBottom: 4 }}>
              QR Code Tracciabilita
            </p>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Stampa e applica sulla confezione. Il cliente lo scansiona per vedere l&apos;intera filiera.
            </p>
            <div id="qr-modal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <QRCode value={tracciaUrl} size={180} />
            </div>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 14, letterSpacing: .5 }}>
              Lotto: <strong>{p.lotto}</strong>
            </p>
            <button onClick={handleStampa} style={{
              background: '#c9933a', color: '#fff', border: 'none', padding: '10px 24px',
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Lato,sans-serif',
            }}>
              Stampa QR Code
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  )
}
