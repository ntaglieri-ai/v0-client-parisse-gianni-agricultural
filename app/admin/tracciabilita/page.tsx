'use client'

import { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })

const playfair = Playfair_Display({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Prodotto {
  id: number
  nome: string
  attivo: boolean
}

interface Lotto {
  id: number
  prodotto_id: number
  codice_lotto: string
  attivo: boolean
}

export default function TracciabilitaPage() {
  const [selectedProdottoId, setSelectedProdottoId] = useState<number | null>(null)
  const [selectedLottoId, setSelectedLottoId] = useState<number | null>(null)
  const [qrSize, setQrSize] = useState(200)
  const [copied, setCopied] = useState(false)

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>(
    selectedProdottoId ? `/api/admin/lotti?prodotto_id=${selectedProdottoId}` : null,
    fetcher
  )

  const selectedProdotto = prodotti?.find(p => p.id === selectedProdottoId)
  const selectedLotto = lotti?.find(l => l.id === selectedLottoId)
  const lottiAttivi = lotti?.filter(l => l.attivo) || []

  const traceUrl = selectedLotto 
    ? `https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`
    : ''

  const handleCopyUrl = async () => {
    if (!traceUrl) return
    try {
      await navigator.clipboard.writeText(traceUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Errore copia URL:', err)
    }
  }

  const handleDownloadQR = () => {
    if (!selectedLotto) return
    const canvas = document.querySelector('#qr-container canvas') as HTMLCanvasElement
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `qr-${selectedLotto.codice_lotto}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handlePrintQR = () => {
    window.print()
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #qr-print-area, #qr-print-area * { visibility: visible; }
          #qr-print-area {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className={playfair.className} style={{ 
            color: '#1a3a2a', 
            fontSize: 28, 
            fontWeight: 700, 
            margin: 0,
          }}>
            Tracciabilita
          </h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            Genera QR code per la tracciabilita dei tuoi prodotti
          </p>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Pannello Selezione */}
          <div style={{ 
            flex: '1 1 320px',
            background: '#fff', 
            borderRadius: 16, 
            padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
              Seleziona Prodotto
            </div>

            {/* Prodotto */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                Prodotto
              </label>
              <select
                value={selectedProdottoId || ''}
                onChange={(e) => {
                  setSelectedProdottoId(e.target.value ? Number(e.target.value) : null)
                  setSelectedLottoId(null)
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: 10, 
                  border: '1px solid #e5e7eb', 
                  fontSize: 14, 
                  color: '#333',
                  background: '#fff',
                }}
              >
                <option value="">-- Seleziona prodotto --</option>
                {prodotti?.filter(p => p.attivo).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* Lotto */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                Lotto
              </label>
              <select
                value={selectedLottoId || ''}
                onChange={(e) => setSelectedLottoId(e.target.value ? Number(e.target.value) : null)}
                disabled={!selectedProdottoId}
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: 10, 
                  border: '1px solid #e5e7eb', 
                  fontSize: 14, 
                  color: '#333',
                  background: '#fff',
                  opacity: selectedProdottoId ? 1 : 0.5,
                }}
              >
                <option value="">-- Seleziona lotto --</option>
                {lottiAttivi.map(l => (
                  <option key={l.id} value={l.id}>{l.codice_lotto}</option>
                ))}
              </select>
            </div>

            {/* Dimensione QR */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                Dimensione QR Code
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[100, 150, 200, 300].map(size => (
                  <button
                    key={size}
                    onClick={() => setQrSize(size)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: 8,
                      border: qrSize === size ? '2px solid #c9933a' : '1px solid #e5e7eb',
                      background: qrSize === size ? '#fffbf5' : '#fff',
                      color: qrSize === size ? '#c9933a' : '#666',
                      fontSize: 13,
                      fontWeight: qrSize === size ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* URL Tracciabilita */}
            {selectedLotto && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                  URL Tracciabilita
                </label>
                <div style={{ 
                  display: 'flex', 
                  gap: 8,
                  background: '#f5f5f5',
                  borderRadius: 10,
                  padding: 4,
                }}>
                  <input
                    type="text"
                    value={traceUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: 12,
                      color: '#666',
                    }}
                  />
                  <button
                    onClick={handleCopyUrl}
                    style={{
                      padding: '10px 16px',
                      background: copied ? '#22c55e' : '#c9933a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {copied ? 'Copiato!' : 'Copia'}
                  </button>
                </div>
              </div>
            )}

            {/* Azioni */}
            {selectedLotto && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDownloadQR}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: '#c9933a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Scarica PNG
                </button>
                <button
                  onClick={handlePrintQR}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: '#1a3a2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Stampa
                </button>
              </div>
            )}
          </div>

          {/* Anteprima QR */}
          <div style={{ 
            flex: '1 1 400px',
            background: '#fff', 
            borderRadius: 16, 
            padding: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
          }}>
            {!selectedLotto ? (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <div style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  background: '#f5f0e8', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px',
                  fontSize: 40,
                }}>
                  📱
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#666', marginBottom: 8 }}>
                  Nessun QR Code
                </div>
                <div style={{ fontSize: 14 }}>
                  Seleziona un prodotto e un lotto
                </div>
              </div>
            ) : (
              <div id="qr-print-area" style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: '#c9933a', 
                  letterSpacing: 1.5, 
                  textTransform: 'uppercase', 
                  marginBottom: 20,
                }}>
                  Anteprima QR Code
                </div>
                
                <div id="qr-container" style={{ 
                  background: '#fff', 
                  padding: 20, 
                  borderRadius: 12,
                  border: '2px solid #f5f0e8',
                  display: 'inline-block',
                  marginBottom: 20,
                }}>
                  <QRCode value={traceUrl} size={qrSize} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1a3a2a', marginBottom: 4 }}>
                    {selectedProdotto?.nome}
                  </div>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    Lotto: {selectedLotto.codice_lotto}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          background: '#f5f0e8', 
          borderRadius: 12,
          border: '1px solid #e5d9c3',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 8 }}>
            Come funziona
          </div>
          <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.6 }}>
            Il QR code generato permette ai tuoi clienti di accedere alla pagina di tracciabilita del prodotto. 
            Scansionando il codice, potranno vedere tutte le informazioni sul lotto: origine, data di raccolta, 
            condizioni di conservazione e molto altro. Puoi stampare il QR code direttamente sulle etichette 
            o scaricarlo come immagine PNG per utilizzi personalizzati.
          </p>
        </div>
      </div>
    </>
  )
}
