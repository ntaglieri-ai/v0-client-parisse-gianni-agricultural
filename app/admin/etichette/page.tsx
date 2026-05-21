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
  const [showEtichetta, setShowEtichetta] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const etichettaRef = useRef<HTMLDivElement>(null)

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>(
    selectedProdottoId ? `/api/admin/lotti?prodotto_id=${selectedProdottoId}` : null,
    fetcher
  )
  const { data: impostazioni } = useSWR<Impostazioni>('/api/admin/impostazioni', fetcher)

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

  const styles = {
    label: { display: 'block', fontSize: 12, fontWeight: 600 as const, color: '#666', marginBottom: 6 },
    select: { width: '100%', padding: '12px 14px', borderRadius: 8, border: '2px solid #e5e7eb', background: '#fff', fontSize: 14, color: '#1a3a2a' },
  }

  // Dimensioni per @media print
  const printSize = formato === 'orizzontale' ? '10cm 6cm' : formato === 'verticale' ? '6cm 10cm' : '10cm 10cm'

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

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: isMobile ? 24 : 32, fontWeight: 700, marginBottom: 8 }}>
          Genera Etichette
        </h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
          Seleziona prodotto, lotto e formato per generare un&apos;etichetta stampabile
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

          {/* Selezione formato */}
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Formato Etichetta</label>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {/* Card Orizzontale */}
              <div
                onClick={() => { setFormato('orizzontale'); setShowEtichetta(false) }}
                style={{
                  width: 140,
                  padding: 16,
                  borderRadius: 12,
                  border: formato === 'orizzontale' ? '2px solid #c9933a' : '2px solid #e5e7eb',
                  background: formato === 'orizzontale' ? '#fefbf6' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {formato === 'orizzontale' && (
                  <span style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✓
                  </span>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{
                    width: 80,
                    height: 48,
                    border: formato === 'orizzontale' ? '2px solid #c9933a' : '2px solid #999',
                    borderRadius: 4,
                    background: formato === 'orizzontale' ? 'linear-gradient(135deg, #f5f0e8 0%, #fff 100%)' : '#f9f9f9',
                  }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Orizzontale</div>
                <div style={{ fontSize: 11, color: '#666' }}>10 x 6 cm</div>
              </div>

              {/* Card Verticale */}
              <div
                onClick={() => { setFormato('verticale'); setShowEtichetta(false) }}
                style={{
                  width: 140,
                  padding: 16,
                  borderRadius: 12,
                  border: formato === 'verticale' ? '2px solid #c9933a' : '2px solid #e5e7eb',
                  background: formato === 'verticale' ? '#fefbf6' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {formato === 'verticale' && (
                  <span style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✓
                  </span>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{
                    width: 48,
                    height: 80,
                    border: formato === 'verticale' ? '2px solid #c9933a' : '2px solid #999',
                    borderRadius: 4,
                    background: formato === 'verticale' ? 'linear-gradient(135deg, #f5f0e8 0%, #fff 100%)' : '#f9f9f9',
                  }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Verticale</div>
                <div style={{ fontSize: 11, color: '#666' }}>6 x 10 cm</div>
              </div>

              {/* Card Rotonda */}
              <div
                onClick={() => { setFormato('rotonda'); setShowEtichetta(false) }}
                style={{
                  width: 140,
                  padding: 16,
                  borderRadius: 12,
                  border: formato === 'rotonda' ? '2px solid #c9933a' : '2px solid #e5e7eb',
                  background: formato === 'rotonda' ? '#fefbf6' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {formato === 'rotonda' && (
                  <span style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✓
                  </span>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    border: formato === 'rotonda' ? '2px solid #c9933a' : '2px solid #999',
                    borderRadius: '50%',
                    background: formato === 'rotonda' ? 'linear-gradient(135deg, #f5f0e8 0%, #fff 100%)' : '#f9f9f9',
                  }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Rotonda</div>
                <div style={{ fontSize: 11, color: '#666' }}>10 cm</div>
              </div>
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
            <div style={{ overflowX: 'auto', paddingBottom: 10, display: 'flex', justifyContent: 'center' }}>
              
              {/* FORMATO ORIZZONTALE 10cm x 6cm = 378px x 227px */}
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
                  {/* Header con logo centrato */}
                  <div style={{ textAlign: 'center', padding: '6px 8px 4px', borderBottom: '1px solid #c9933a' }}>
                    <Image src="/images/logo.png" alt="Logo" width={80} height={32} style={{ objectFit: 'contain', marginBottom: 2 }} />
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.3 }}>
                      {ragioneSociale.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 6, color: '#666' }}>
                      {indirizzoCompleto} {piva && `– ${piva}`}
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
                        <div style={{ fontSize: 6, color: '#666', lineHeight: 1.2 }}>
                          {selectedProdotto.descrizione}
                        </div>
                      )}
                    </div>

                    {/* Layout Completo o Trasformato */}
                    {(categoria === 'completo' || categoria === 'trasformato') && (
                      <>
                        {/* Ingredienti */}
                        {selectedProdotto.ingredienti && (
                          <div style={{ fontSize: 6, marginBottom: 2, lineHeight: 1.2 }}>
                            <strong>Ingredienti:</strong> {selectedProdotto.ingredienti}
                          </div>
                        )}
                        {/* Allergeni */}
                        {selectedProdotto.allergeni && (
                          <div style={{ fontSize: 7, fontWeight: 700, marginBottom: 3, color: '#c00' }}>
                            ALLERGENI: {selectedProdotto.allergeni}
                          </div>
                        )}

                        {/* Tabella valori nutrizionali + Info lotto */}
                        <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
                          <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: 2, fontSize: 6, overflow: 'hidden' }}>
                            <div style={{ background: '#f5f0e8', padding: '2px 4px', fontWeight: 700, fontSize: 6 }}>
                              Valori Nutrizionali / 100g
                            </div>
                            <div style={{ padding: '1px 4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}>
                                <span>Energia</span>
                                <span>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</span>
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
                          <div style={{ width: 95, fontSize: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div><strong>Peso netto:</strong> {selectedProdotto.peso_netto || '-'}</div>
                              <div><strong>L:</strong> {selectedLotto.codice_lotto}</div>
                              <div><strong>TMC:</strong> {selectedLotto.tmc || 'vedi conf.'}</div>
                              <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>
                              {selectedLotto.condizioni_conservazione && (
                                <div style={{ fontSize: 5, color: '#666', marginTop: 2 }}>
                                  {selectedLotto.condizioni_conservazione}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                              <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={36} />
                              </div>
                              <div style={{ fontSize: 5, color: '#666', lineHeight: 1.2 }}>
                                {sitoWeb}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Layout Ortaggio Fresco */}
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

              {/* FORMATO VERTICALE 6cm x 10cm = 227px x 378px */}
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
                  {/* Header */}
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

                  {/* Nome prodotto grande */}
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

                  {/* Corpo */}
                  <div style={{ flex: 1, padding: '6px 10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Ingredienti + Allergeni */}
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

                        {/* Tabella valori nutrizionali a tutta larghezza */}
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

                    {/* Info lotto */}
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

                  {/* Footer con QR centrato */}
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

              {/* FORMATO ROTONDA diametro 10cm = 378px */}
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 30,
                  }}
                >
                  {/* Logo watermark sfumato */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.12,
                    pointerEvents: 'none',
                  }}>
                    <Image src="/images/logo.png" alt="" width={200} height={200} style={{ objectFit: 'contain' }} />
                  </div>

                  {/* Contenuto sopra il watermark */}
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 280 }}>
                    {/* Ragione sociale in cima */}
                    <div style={{ fontSize: 8, fontWeight: 600, color: '#666', letterSpacing: 0.5, marginBottom: 8 }}>
                      {ragioneSociale.toUpperCase()}
                    </div>

                    {/* Nome prodotto grande */}
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1a3a2a', marginBottom: 10, lineHeight: 1.1 }}>
                      {selectedProdotto.nome}
                    </div>

                    {/* Allergeni se presenti */}
                    {selectedProdotto.allergeni && (
                      <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 10, padding: '4px 10px', background: '#fff3cd', borderRadius: 4, color: '#856404', display: 'inline-block' }}>
                        {selectedProdotto.allergeni}
                      </div>
                    )}

                    {/* Codice lotto */}
                    <div style={{ fontSize: 10, marginBottom: 6 }}>
                      <strong>L:</strong> {selectedLotto.codice_lotto}
                    </div>

                    {/* Origine */}
                    <div style={{ fontSize: 9, color: '#555', marginBottom: 16 }}>
                      {selectedProdotto.origine || impostazioni?.origine_default || 'Italia – Altopiano del Fucino'}
                    </div>

                    {/* QR code piccolo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ background: '#fff', padding: 4, border: '1px solid #ddd', borderRadius: 4 }}>
                        <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={50} />
                      </div>
                      <div style={{ fontSize: 7, color: '#888', marginTop: 6 }}>
                        {sitoWeb}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p style={{ fontSize: 12, color: '#666', marginTop: 16, textAlign: 'center' }}>
              Dimensioni: {formato === 'orizzontale' ? '10cm x 6cm' : formato === 'verticale' ? '6cm x 10cm' : 'diametro 10cm'}. Clicca su &quot;Stampa Etichetta&quot; per stampare.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
