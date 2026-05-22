'use client'

import { useState, useEffect, useRef } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })

const playfair = Playfair_Display({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Prodotto {
  id: number
  nome: string
  categoria: string
  descrizione: string
  unita: string
  immagine: string
  ingredienti?: string
  allergeni?: string
  categoria_etichetta?: string
  origine?: string
  peso_netto?: string
  valori_nutrizionali?: {
    energia_kj?: number
    energia_kcal?: number
    grassi?: number
    grassi_saturi?: number
    carboidrati?: number
    zuccheri?: number
    fibre?: number
    proteine?: number
    sale?: number
  }
  attivo?: boolean
}

interface Lotto {
  id: number
  prodotto_id: number
  codice_lotto: string
  campo?: string
  comune?: string
  data_raccolta?: string
  kg_totali: number
  kg_disponibili: number
  prezzo: number
  tmc?: string
  condizioni_conservazione?: string
  attivo: boolean
}

interface Impostazioni {
  ragione_sociale?: string
  indirizzo?: string
  cap?: string
  citta?: string
  provincia?: string
  paese?: string
  partita_iva?: string
  email?: string
  sito_web?: string
  logo_url?: string
  origine_default?: string
}

type FormatoEtichetta = 'orizzontale' | 'verticale' | 'rotonda'

export default function EtichettePage() {
  const [selectedProdottoId, setSelectedProdottoId] = useState<number | null>(null)
  const [selectedLottoId, setSelectedLottoId] = useState<number | null>(null)
  const [formato, setFormato] = useState<FormatoEtichetta>('orizzontale')
  const [isMobile, setIsMobile] = useState(false)
  const etichettaRef = useRef<HTMLDivElement>(null)

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>(
    selectedProdottoId ? `/api/admin/lotti?prodotto_id=${selectedProdottoId}` : null,
    fetcher
  )
  const { data: impostazioni } = useSWR<Impostazioni>('/api/admin/impostazioni', fetcher)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const selectedProdotto = prodotti?.find(p => p.id === selectedProdottoId)
  const selectedLotto = lotti?.find(l => l.id === selectedLottoId)
  const lottiAttivi = lotti?.filter(l => l.attivo) || []

  const handleStampa = () => {
    window.print()
  }

  const categoria = selectedProdotto?.categoria_etichetta || 'ortaggio_fresco'
  const vn = selectedProdotto?.valori_nutrizionali || {}

  // Dati azienda completi
  const ragioneSociale = impostazioni?.ragione_sociale || 'Azienda Agricola Parisse Gianni'
  const indirizzoCompleto = [
    impostazioni?.indirizzo,
    impostazioni?.cap,
    impostazioni?.citta,
    impostazioni?.provincia ? `(${impostazioni.provincia})` : null,
  ].filter(Boolean).join(' ') || 'Pescina (AQ)'
  const piva = impostazioni?.partita_iva ? `P.IVA: ${impostazioni.partita_iva}` : ''
  const sitoWeb = impostazioni?.sito_web || 'www.gianniparisse.it'

  // Dimensioni per @media print
  const printSize = formato === 'orizzontale' ? '10cm 6cm' : formato === 'verticale' ? '6cm 10cm' : '10cm 10cm'

  // Check se possiamo mostrare l'anteprima
  const canShowPreview = selectedProdotto && selectedLotto

  // Componente miniatura etichetta per le card
  const MiniEtichetta = ({ type, scale = 0.15 }: { type: FormatoEtichetta, scale?: number }) => {
    const baseWidth = type === 'orizzontale' ? 378 : type === 'verticale' ? 227 : 378
    const baseHeight = type === 'orizzontale' ? 227 : type === 'verticale' ? 378 : 378
    const isRound = type === 'rotonda'

    if (!selectedProdotto) {
      return (
        <div style={{
          width: baseWidth * scale,
          height: baseHeight * scale,
          borderRadius: isRound ? '50%' : 4,
          border: '2px dashed #ccc',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 8,
          textAlign: 'center',
          padding: 4,
        }}>
          Seleziona<br/>prodotto
        </div>
      )
    }

    return (
      <div style={{
        width: baseWidth * scale,
        height: baseHeight * scale,
        borderRadius: isRound ? '50%' : 4,
        border: isRound ? '2px solid #c9933a' : '1px solid #ddd',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isRound ? 8 : 4,
      }}>
        {/* Mini logo */}
        <div style={{ marginBottom: 2 }}>
          <Image src="/images/logo.png" alt="" width={isRound ? 20 : 24} height={isRound ? 20 : 10} style={{ objectFit: 'contain' }} />
        </div>
        {/* Mini nome */}
        <div style={{ fontSize: 6, fontWeight: 700, color: '#1a3a2a', textAlign: 'center', lineHeight: 1.1 }}>
          {selectedProdotto.nome.length > 12 ? selectedProdotto.nome.substring(0, 12) + '...' : selectedProdotto.nome}
        </div>
        {selectedLotto && (
          <div style={{ fontSize: 4, color: '#666', marginTop: 1 }}>
            L: {selectedLotto.codice_lotto}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #etichetta-print, #etichetta-print * { visibility: visible; }
          #etichetta-print { 
            position: absolute; 
            left: 0; 
            top: 0; 
          }
          @page { 
            size: ${printSize}; 
            margin: 0; 
          }
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh', 
        background: '#f5f0e8',
        margin: '-24px',
        padding: isMobile ? 16 : 32,
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 className={playfair.className} style={{ 
            color: '#1a3a2a', 
            fontSize: isMobile ? 28 : 42, 
            fontWeight: 700, 
            marginBottom: 8,
            letterSpacing: -0.5,
          }}>
            Genera Etichette
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: 15, 
            maxWidth: 500, 
            margin: '0 auto',
            lineHeight: 1.5,
          }}>
            Crea etichette professionali per i tuoi prodotti agricoli. Seleziona prodotto, lotto e formato per visualizzare l&apos;anteprima.
          </p>
        </div>

        {/* Main Content - Due colonne */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 24,
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          {/* COLONNA SINISTRA - Configurazione */}
          <div style={{ flex: 1 }}>
            {/* Sezione Prodotto e Lotto */}
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 24, 
              marginBottom: 24, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                color: '#c9933a', 
                letterSpacing: 2, 
                textTransform: 'uppercase', 
                marginBottom: 16,
              }}>
                Prodotto e Lotto
              </div>
              <div style={{ borderTop: '1px solid #c9933a', marginBottom: 20, opacity: 0.3 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Seleziona Prodotto
                  </label>
                  <select
                    value={selectedProdottoId || ''}
                    onChange={(e) => {
                      setSelectedProdottoId(e.target.value ? Number(e.target.value) : null)
                      setSelectedLottoId(null)
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      borderRadius: 10, 
                      border: '2px solid #e5e7eb', 
                      background: '#fff', 
                      fontSize: 15, 
                      color: '#1a3a2a',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <option value="">-- Seleziona un prodotto --</option>
                    {prodotti?.filter(p => p.attivo).map(p => (
                      <option key={p.id} value={p.id}>{p.nome} ({p.categoria})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Seleziona Lotto
                  </label>
                  <select
                    value={selectedLottoId || ''}
                    onChange={(e) => {
                      setSelectedLottoId(e.target.value ? Number(e.target.value) : null)
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      borderRadius: 10, 
                      border: '2px solid #e5e7eb', 
                      background: selectedProdottoId ? '#fff' : '#f5f5f5', 
                      fontSize: 15, 
                      color: '#1a3a2a',
                      fontWeight: 500,
                      cursor: selectedProdottoId ? 'pointer' : 'not-allowed',
                      opacity: selectedProdottoId ? 1 : 0.6,
                      transition: 'border-color 0.2s',
                    }}
                    disabled={!selectedProdottoId}
                  >
                    <option value="">-- Seleziona un lotto --</option>
                    {lottiAttivi.map(l => (
                      <option key={l.id} value={l.id}>{l.codice_lotto}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sezione Formato */}
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 24, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                color: '#c9933a', 
                letterSpacing: 2, 
                textTransform: 'uppercase', 
                marginBottom: 16,
              }}>
                Formato Etichetta
              </div>
              <div style={{ borderTop: '1px solid #c9933a', marginBottom: 20, opacity: 0.3 }} />

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {/* Card Orizzontale */}
                <div
                  onClick={() => setFormato('orizzontale')}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    padding: 20,
                    borderRadius: 14,
                    border: formato === 'orizzontale' ? '3px solid #c9933a' : '2px solid #e5e7eb',
                    background: formato === 'orizzontale' ? '#fffbf5' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    boxShadow: formato === 'orizzontale' ? '0 8px 24px rgba(201,147,58,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { if (formato !== 'orizzontale') e.currentTarget.style.borderColor = '#c9933a50' }}
                  onMouseLeave={e => { if (formato !== 'orizzontale') e.currentTarget.style.borderColor = '#e5e7eb' }}
                >
                  {formato === 'orizzontale' && (
                    <span style={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      width: 24, 
                      height: 24, 
                      background: '#22c55e', 
                      borderRadius: '50%', 
                      color: '#fff', 
                      fontSize: 14, 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.4)',
                    }}>
                      ✓
                    </span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                    <MiniEtichetta type="orizzontale" scale={0.18} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a', marginBottom: 4 }}>Orizzontale</div>
                  <div style={{ fontSize: 12, color: '#888' }}>10 x 6 cm</div>
                </div>

                {/* Card Verticale */}
                <div
                  onClick={() => setFormato('verticale')}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    padding: 20,
                    borderRadius: 14,
                    border: formato === 'verticale' ? '3px solid #c9933a' : '2px solid #e5e7eb',
                    background: formato === 'verticale' ? '#fffbf5' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    boxShadow: formato === 'verticale' ? '0 8px 24px rgba(201,147,58,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { if (formato !== 'verticale') e.currentTarget.style.borderColor = '#c9933a50' }}
                  onMouseLeave={e => { if (formato !== 'verticale') e.currentTarget.style.borderColor = '#e5e7eb' }}
                >
                  {formato === 'verticale' && (
                    <span style={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      width: 24, 
                      height: 24, 
                      background: '#22c55e', 
                      borderRadius: '50%', 
                      color: '#fff', 
                      fontSize: 14, 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.4)',
                    }}>
                      ✓
                    </span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                    <MiniEtichetta type="verticale" scale={0.16} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a', marginBottom: 4 }}>Verticale</div>
                  <div style={{ fontSize: 12, color: '#888' }}>6 x 10 cm</div>
                </div>

                {/* Card Rotonda */}
                <div
                  onClick={() => setFormato('rotonda')}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    padding: 20,
                    borderRadius: 14,
                    border: formato === 'rotonda' ? '3px solid #c9933a' : '2px solid #e5e7eb',
                    background: formato === 'rotonda' ? '#fffbf5' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    boxShadow: formato === 'rotonda' ? '0 8px 24px rgba(201,147,58,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { if (formato !== 'rotonda') e.currentTarget.style.borderColor = '#c9933a50' }}
                  onMouseLeave={e => { if (formato !== 'rotonda') e.currentTarget.style.borderColor = '#e5e7eb' }}
                >
                  {formato === 'rotonda' && (
                    <span style={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      width: 24, 
                      height: 24, 
                      background: '#22c55e', 
                      borderRadius: '50%', 
                      color: '#fff', 
                      fontSize: 14, 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(34,197,94,0.4)',
                    }}>
                      ✓
                    </span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                    <MiniEtichetta type="rotonda" scale={0.15} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a', marginBottom: 4 }}>Rotonda</div>
                  <div style={{ fontSize: 12, color: '#888' }}>10 cm</div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA - Anteprima Live */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 24, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              minHeight: 500,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                color: '#c9933a', 
                letterSpacing: 2, 
                textTransform: 'uppercase', 
                marginBottom: 16,
              }}>
                Anteprima
              </div>
              <div style={{ borderTop: '1px solid #c9933a', marginBottom: 24, opacity: 0.3 }} />

              {!canShowPreview ? (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999',
                  textAlign: 'center',
                }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: '#f5f0e8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: 16,
                    fontSize: 32,
                  }}>
                    🏷️
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#666' }}>
                    Nessuna anteprima
                  </div>
                  <div style={{ fontSize: 13, maxWidth: 280 }}>
                    Seleziona un prodotto e un lotto per visualizzare l&apos;anteprima dell&apos;etichetta
                  </div>
                </div>
              ) : (
                <>
                  {/* Container anteprima con sfondo e ombra */}
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 20,
                  }}>
                    <div style={{ 
                      boxShadow: '0 8px 40px rgba(0,0,0,0.15)', 
                      borderRadius: formato === 'rotonda' ? '50%' : 8,
                    }}>
                      {/* FORMATO ORIZZONTALE */}
                      {formato === 'orizzontale' && (
                        <div
                          id="etichetta-print"
                          ref={etichettaRef}
                          style={{
                            width: 378,
                            height: 227,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            background: '#fff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: 8,
                            color: '#333',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 12px 6px', borderBottom: '1px solid #c9933a' }}>
                            <div style={{ marginBottom: 4 }}>
                              <Image src="/images/logo.png" alt="Logo" width={90} height={36} style={{ objectFit: 'contain', display: 'block' }} />
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.5, textAlign: 'center' }}>
                              {ragioneSociale.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 6, color: '#666', textAlign: 'center' }}>
                              {indirizzoCompleto} {piva && `– ${piva}`}
                            </div>
                          </div>

                          <div style={{ flex: 1, padding: '6px 12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ marginBottom: 4 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a2a' }}>
                                {selectedProdotto.nome}
                              </div>
                              {selectedProdotto.descrizione && (
                                <div style={{ fontSize: 7, color: '#666', lineHeight: 1.3, marginTop: 2 }}>
                                  {selectedProdotto.descrizione}
                                </div>
                              )}
                            </div>

                            {(categoria === 'completo' || categoria === 'trasformato') && (
                              <>
                                {selectedProdotto.ingredienti && (
                                  <div style={{ fontSize: 7, marginBottom: 3, lineHeight: 1.3 }}>
                                    <strong>Ingredienti:</strong> {selectedProdotto.ingredienti}
                                  </div>
                                )}
                                {selectedProdotto.allergeni && (
                                  <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 4, color: '#c00' }}>
                                    ALLERGENI: {selectedProdotto.allergeni}
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
                                  {/* Tabella valori nutrizionali - piu larga */}
                                  <div style={{ flex: '1 1 58%', border: '1px solid #ddd', borderRadius: 3, fontSize: 7, overflow: 'hidden' }}>
                                    <div style={{ background: '#f5f0e8', padding: '3px 6px', fontWeight: 700, fontSize: 7 }}>
                                      Valori Nutrizionali / 100g
                                    </div>
                                    <div style={{ padding: '2px 6px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px' }}>
                                        <span>Energia</span>
                                        <span>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                        <span>Grassi</span>
                                        <span>{vn.grassi ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px', paddingLeft: 10 }}>
                                        <span>- di cui saturi</span>
                                        <span>{vn.grassi_saturi ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                        <span>Carboidrati</span>
                                        <span>{vn.carboidrati ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px', paddingLeft: 10 }}>
                                        <span>- di cui zuccheri</span>
                                        <span>{vn.zuccheri ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                        <span>Fibre</span>
                                        <span>{vn.fibre ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px' }}>
                                        <span>Proteine</span>
                                        <span>{vn.proteine ?? '-'} g</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                        <span>Sale</span>
                                        <span>{vn.sale ?? '-'} g</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Colonna destra - info + QR */}
                                  <div style={{ flex: '1 1 42%', fontSize: 7, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ lineHeight: 1.5 }}>
                                      <div><strong>Peso netto:</strong> {selectedProdotto.peso_netto || '-'}</div>
                                      <div><strong>L:</strong> {selectedLotto.codice_lotto}</div>
                                      <div><strong>TMC:</strong> {selectedLotto.tmc || 'vedi conf.'}</div>
                                      <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia – Altopiano del Fucino'}</div>
                                      {selectedLotto.condizioni_conservazione && (
                                        <div style={{ fontSize: 6, color: '#666', marginTop: 3, lineHeight: 1.3 }}>
                                          {selectedLotto.condizioni_conservazione}
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
                                      <div style={{ background: '#fff', padding: 3, border: '1px solid #ddd', borderRadius: 3 }}>
                                        <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={42} />
                                      </div>
                                      <div style={{ fontSize: 6, color: '#666', lineHeight: 1.3 }}>
                                        {sitoWeb}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {categoria === 'ortaggio_fresco' && (
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: 7 }}>
                                  <div style={{ marginBottom: 3 }}><strong>Peso netto:</strong> {selectedProdotto.peso_netto || 'variabile'}</div>
                                  <div style={{ marginBottom: 3 }}><strong>L:</strong> {selectedLotto.codice_lotto}</div>
                                  <div style={{ marginBottom: 3 }}><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia – Altopiano del Fucino'}</div>
                                  <div style={{ marginBottom: 3 }}><strong>Produttore:</strong> {ragioneSociale} – {indirizzoCompleto}</div>
                                  {selectedLotto.condizioni_conservazione && (
                                    <div style={{ fontSize: 6, color: '#666' }}>
                                      {selectedLotto.condizioni_conservazione}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                  <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                    <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={40} />
                                  </div>
                                  <div style={{ fontSize: 6, color: '#666' }}>
                                    {sitoWeb}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* FORMATO VERTICALE */}
                      {formato === 'verticale' && (
                        <div
                          id="etichetta-print"
                          ref={etichettaRef}
                          style={{
                            width: 227,
                            height: 378,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            background: '#fff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: 7,
                            color: '#333',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <div style={{ textAlign: 'center', padding: '8px 10px 6px', borderBottom: '2px solid #c9933a' }}>
                            <Image src="/images/logo.png" alt="Logo" width={70} height={28} style={{ objectFit: 'contain', marginBottom: 4 }} />
                            <div style={{ fontSize: 7, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.3 }}>
                              {ragioneSociale.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 6, color: '#666', lineHeight: 1.3 }}>
                              {indirizzoCompleto}
                            </div>
                            {piva && <div style={{ fontSize: 5, color: '#888' }}>{piva}</div>}
                          </div>

                          <div style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a' }}>
                              {selectedProdotto.nome}
                            </div>
                            {selectedProdotto.descrizione && (
                              <div style={{ fontSize: 6, color: '#666', marginTop: 2, lineHeight: 1.3 }}>
                                {selectedProdotto.descrizione}
                              </div>
                            )}
                          </div>

                          <div style={{ flex: 1, padding: '6px 10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            {(categoria === 'completo' || categoria === 'trasformato') && (
                              <>
                                {selectedProdotto.ingredienti && (
                                  <div style={{ fontSize: 6, marginBottom: 4, lineHeight: 1.3 }}>
                                    <strong>Ingredienti:</strong> {selectedProdotto.ingredienti}
                                  </div>
                                )}
                                {selectedProdotto.allergeni && (
                                  <div style={{ fontSize: 7, fontWeight: 700, marginBottom: 6, padding: '3px 6px', background: '#fff3cd', borderRadius: 3, color: '#856404' }}>
                                    ALLERGENI: {selectedProdotto.allergeni}
                                  </div>
                                )}

                                <div style={{ border: '1px solid #ddd', borderRadius: 3, fontSize: 6, marginBottom: 6, overflow: 'hidden' }}>
                                  <div style={{ background: '#f5f0e8', padding: '3px 6px', fontWeight: 700, fontSize: 7, textAlign: 'center' }}>
                                    Valori Nutrizionali / 100g
                                  </div>
                                  <div style={{ padding: '2px 6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px' }}>
                                      <span>Energia</span>
                                      <span>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                      <span>Grassi</span>
                                      <span>{vn.grassi ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px', paddingLeft: 10 }}>
                                      <span>- di cui saturi</span>
                                      <span>{vn.grassi_saturi ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                      <span>Carboidrati</span>
                                      <span>{vn.carboidrati ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px', paddingLeft: 10 }}>
                                      <span>- di cui zuccheri</span>
                                      <span>{vn.zuccheri ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                      <span>Fibre</span>
                                      <span>{vn.fibre ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '2px 4px' }}>
                                      <span>Proteine</span>
                                      <span>{vn.proteine ?? '-'} g</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px' }}>
                                      <span>Sale</span>
                                      <span>{vn.sale ?? '-'} g</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div style={{ fontSize: 7, lineHeight: 1.5 }}>
                              <div><strong>Peso netto:</strong> {selectedProdotto.peso_netto || 'variabile'}</div>
                              <div><strong>L:</strong> {selectedLotto.codice_lotto}</div>
                              <div><strong>TMC:</strong> {selectedLotto.tmc || 'vedi confezione'}</div>
                              <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>
                              {selectedLotto.condizioni_conservazione && (
                                <div style={{ fontSize: 6, color: '#666', marginTop: 2 }}>
                                  {selectedLotto.condizioni_conservazione}
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ textAlign: 'center', padding: '6px 10px 8px', borderTop: '1px solid #eee' }}>
                            <div style={{ background: '#fff', padding: 3, border: '1px solid #ddd', borderRadius: 3, display: 'inline-block' }}>
                              <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={50} />
                            </div>
                            <div style={{ fontSize: 6, color: '#666', marginTop: 4 }}>
                              {sitoWeb}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FORMATO ROTONDA */}
                      {formato === 'rotonda' && (
                        <div
                          id="etichetta-print"
                          ref={etichettaRef}
                          style={{
                            width: 378,
                            height: 378,
                            borderRadius: '50%',
                            border: '3px solid #c9933a',
                            background: '#fff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: 8,
                            color: '#333',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0.08,
                            width: '60%',
                            pointerEvents: 'none',
                          }}>
                            <Image src="/images/logo.png" alt="" width={227} height={227} style={{ objectFit: 'contain', width: '100%', height: 'auto' }} />
                          </div>

                          <div style={{ 
                            position: 'relative', 
                            zIndex: 1, 
                            width: '100%', 
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '50px 40px',
                          }}>
                            <div style={{ display: 'flex', width: '100%', maxWidth: 280, gap: 12 }}>
                              <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: 7, fontWeight: 600, color: '#c9933a', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                                  {ragioneSociale}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', marginBottom: 8, lineHeight: 1.2 }}>
                                  {selectedProdotto.nome}
                                </div>
                                {selectedProdotto.allergeni && (
                                  <div style={{ 
                                    fontSize: 7, 
                                    fontWeight: 700, 
                                    marginBottom: 8, 
                                    padding: '3px 8px', 
                                    background: '#f97316', 
                                    borderRadius: 3, 
                                    color: '#fff', 
                                    display: 'inline-block',
                                    alignSelf: 'flex-start',
                                  }}>
                                    {selectedProdotto.allergeni}
                                  </div>
                                )}
                                <div style={{ fontSize: 7, marginBottom: 3 }}>
                                  <strong>L:</strong> {selectedLotto.codice_lotto}
                                </div>
                                <div style={{ fontSize: 7, marginBottom: 3 }}>
                                  {selectedProdotto.origine || impostazioni?.origine_default || 'Italia – Altopiano del Fucino'}
                                </div>
                                {selectedLotto.condizioni_conservazione && (
                                  <div style={{ fontSize: 7, color: '#666' }}>
                                    {selectedLotto.condizioni_conservazione}
                                  </div>
                                )}
                              </div>
                              <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: '#fff', padding: 4, border: '1px solid #ddd', borderRadius: 4 }}>
                                  <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={80} />
                                </div>
                                <div style={{ fontSize: 7, color: '#666', marginTop: 6, textAlign: 'center' }}>
                                  {sitoWeb}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottone Stampa */}
                  <button
                    onClick={handleStampa}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #c9933a 0%, #a87930 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(201,147,58,0.3)',
                      transition: 'all 0.2s ease',
                      letterSpacing: 0.5,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,147,58,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,147,58,0.3)' }}
                  >
                    Stampa Etichetta
                  </button>

                  <p style={{ fontSize: 12, color: '#888', marginTop: 12, textAlign: 'center' }}>
                    Dimensioni: {formato === 'orizzontale' ? '10cm x 6cm' : formato === 'verticale' ? '6cm x 10cm' : 'diametro 10cm'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
