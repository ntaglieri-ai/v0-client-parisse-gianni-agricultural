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

export default function EtichettePage() {
  const [selectedProdottoId, setSelectedProdottoId] = useState<number | null>(null)
  const [selectedLottoId, setSelectedLottoId] = useState<number | null>(null)
  const [showEtichetta, setShowEtichetta] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const etichettaRef = useRef<HTMLDivElement>(null)

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>(
    selectedProdottoId ? `/api/admin/lotti?prodotto_id=${selectedProdottoId}` : null,
    fetcher
  )

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const selectedProdotto = prodotti?.find(p => p.id === selectedProdottoId)
  const selectedLotto = lotti?.find(l => l.id === selectedLottoId)
  const lottiAttivi = lotti?.filter(l => l.attivo) || []

  const handleGeneraEtichetta = () => {
    if (selectedProdotto && selectedLotto) {
      setShowEtichetta(true)
    }
  }

  const handleStampa = () => {
    window.print()
  }

  const categoria = selectedProdotto?.categoria_etichetta || 'ortaggio_fresco'
  const vn = selectedProdotto?.valori_nutrizionali || {}

  const styles = {
    label: { display: 'block', fontSize: 12, fontWeight: 600 as const, color: '#666', marginBottom: 6 },
    select: { width: '100%', padding: '12px 14px', borderRadius: 8, border: '2px solid #e5e7eb', background: '#fff', fontSize: 14, color: '#1a3a2a' },
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
            width: 10cm !important;
            height: 6cm !important;
          }
          @page { 
            size: 10cm 6cm; 
            margin: 0; 
          }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: isMobile ? 24 : 32, fontWeight: 700, marginBottom: 8 }}>
          Genera Etichette
        </h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
          Seleziona prodotto e lotto per generare un&apos;etichetta stampabile
        </p>

        {/* Selezione */}
        <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? 16 : 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={styles.label}>Seleziona Prodotto</label>
              <select
                value={selectedProdottoId || ''}
                onChange={(e) => {
                  setSelectedProdottoId(e.target.value ? Number(e.target.value) : null)
                  setSelectedLottoId(null)
                  setShowEtichetta(false)
                }}
                style={styles.select}
              >
                <option value="">-- Seleziona un prodotto --</option>
                {prodotti?.filter(p => p.attivo).map(p => (
                  <option key={p.id} value={p.id}>{p.nome} ({p.categoria})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Seleziona Lotto</label>
              <select
                value={selectedLottoId || ''}
                onChange={(e) => {
                  setSelectedLottoId(e.target.value ? Number(e.target.value) : null)
                  setShowEtichetta(false)
                }}
                style={styles.select}
                disabled={!selectedProdottoId}
              >
                <option value="">-- Seleziona un lotto --</option>
                {lottiAttivi.map(l => (
                  <option key={l.id} value={l.id}>{l.codice_lotto}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGeneraEtichetta}
            disabled={!selectedProdotto || !selectedLotto}
            style={{
              padding: '12px 28px',
              background: selectedProdotto && selectedLotto ? '#1a3a2a' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: selectedProdotto && selectedLotto ? 'pointer' : 'not-allowed',
            }}
          >
            Genera Etichetta
          </button>
        </div>

        {/* Anteprima Etichetta */}
        {showEtichetta && selectedProdotto && selectedLotto && (
          <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? 16 : 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className={playfair.className} style={{ color: '#1a3a2a', fontSize: 18, fontWeight: 600, margin: 0 }}>
                Anteprima Etichetta
              </h2>
              <button
                onClick={handleStampa}
                style={{
                  padding: '10px 20px',
                  background: '#c9933a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Stampa Etichetta
              </button>
            </div>

            {/* Container per scroll orizzontale su mobile */}
            <div style={{ overflowX: 'auto', paddingBottom: 10 }}>
              {/* ETICHETTA 10cm x 6cm = 378px x 227px */}
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
                {/* Header con logo */}
                <div style={{ textAlign: 'center', padding: '6px 8px 4px', borderBottom: '1px solid #c9933a' }}>
                  <Image src="/images/logo.png" alt="Logo" width={80} height={32} style={{ objectFit: 'contain', marginBottom: 2 }} />
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.3 }}>
                    AZIENDA AGRICOLA PARISSE GIANNI
                  </div>
                  <div style={{ fontSize: 7, color: '#666' }}>
                    Pescina (AQ) – Italia
                  </div>
                </div>

                {/* Corpo etichetta */}
                <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Nome prodotto */}
                  <div style={{ marginBottom: 3 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1a3a2a' }}>
                      {selectedProdotto.nome}
                    </div>
                    {selectedProdotto.descrizione && (
                      <div style={{ fontSize: 7, color: '#666', lineHeight: 1.2 }}>
                        {selectedProdotto.descrizione.substring(0, 60)}
                      </div>
                    )}
                  </div>

                  {/* Layout Completo o Trasformato */}
                  {(categoria === 'completo' || categoria === 'trasformato') && (
                    <>
                      {/* Ingredienti */}
                      {selectedProdotto.ingredienti && (
                        <div style={{ fontSize: 7, marginBottom: 2, lineHeight: 1.2 }}>
                          <strong>Ingredienti:</strong> {selectedProdotto.ingredienti.substring(0, categoria === 'trasformato' ? 120 : 80)}
                        </div>
                      )}
                      {/* Allergeni */}
                      {selectedProdotto.allergeni && (
                        <div style={{ fontSize: 7, fontWeight: 700, marginBottom: 3 }}>
                          ⚠ ALLERGENI: {selectedProdotto.allergeni}
                        </div>
                      )}

                      {/* Tabella valori nutrizionali */}
                      <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
                        <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: 2, fontSize: 6, overflow: 'hidden' }}>
                          <div style={{ background: '#f5f0e8', padding: '2px 4px', fontWeight: 700, fontSize: 7 }}>
                            Valori Nutrizionali / 100g
                          </div>
                          <div style={{ padding: '2px 4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}>
                              <span>Energia</span>
                              <span>{vn.energia_kj || '-'} kJ / {vn.energia_kcal || '-'} kcal</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}>
                              <span>Grassi</span>
                              <span>{vn.grassi ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 8 }}>
                              <span>- di cui saturi</span>
                              <span>{vn.grassi_saturi ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}>
                              <span>Carboidrati</span>
                              <span>{vn.carboidrati ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 8 }}>
                              <span>- di cui zuccheri</span>
                              <span>{vn.zuccheri ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}>
                              <span>Fibre</span>
                              <span>{vn.fibre ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}>
                              <span>Proteine</span>
                              <span>{vn.proteine ?? '-'} g</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}>
                              <span>Sale</span>
                              <span>{vn.sale ?? '-'} g</span>
                            </div>
                          </div>
                        </div>

                        {/* Info lotto dx */}
                        <div style={{ width: 100, fontSize: 7, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div><strong>Peso netto:</strong> {selectedProdotto.peso_netto || '-'}</div>
                            <div><strong>Lotto:</strong> {selectedLotto.codice_lotto}</div>
                            <div><strong>TMC:</strong> {selectedLotto.tmc || 'vedi conf.'}</div>
                            <div><strong>Origine:</strong> {selectedProdotto.origine || 'Italia'}</div>
                            {selectedLotto.condizioni_conservazione && (
                              <div style={{ fontSize: 6, color: '#666', marginTop: 2 }}>
                                {selectedLotto.condizioni_conservazione}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                            <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                              <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={40} />
                            </div>
                            <div style={{ fontSize: 6, color: '#666', lineHeight: 1.2 }}>
                              www.gianniparisse.it
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Layout Ortaggio Fresco */}
                  {categoria === 'ortaggio_fresco' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 8 }}>
                        <div style={{ marginBottom: 4 }}><strong>Peso netto:</strong> {selectedProdotto.peso_netto || 'variabile'}</div>
                        <div style={{ marginBottom: 4 }}><strong>Lotto:</strong> {selectedLotto.codice_lotto}</div>
                        <div style={{ marginBottom: 4 }}><strong>Origine:</strong> {selectedProdotto.origine || 'Italia – Altopiano del Fucino'}</div>
                        <div style={{ marginBottom: 4 }}><strong>Produttore:</strong> Az. Agr. Parisse Gianni – Pescina (AQ)</div>
                        {selectedLotto.condizioni_conservazione && (
                          <div style={{ fontSize: 7, color: '#666' }}>
                            {selectedLotto.condizioni_conservazione}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                          <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={40} />
                        </div>
                        <div style={{ fontSize: 7, color: '#666' }}>
                          www.gianniparisse.it
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#666', marginTop: 16 }}>
              Dimensioni etichetta: 10cm x 6cm. Clicca su &quot;Stampa Etichetta&quot; per stampare.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
