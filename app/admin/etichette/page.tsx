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
  telefono?: string
  sito_web?: string
  logo_url?: string
  origine_default?: string
}

type FormatoEtichetta = 'orizzontale' | 'verticale' | 'rotonda'

interface Elementi {
  logo: boolean
  valoriNutrizionali: boolean
  qrCode: boolean
  allergeni: boolean
  ingredienti: boolean
  lotto: boolean
  origine: boolean
  conservazione: boolean
  pesoNetto: boolean
  piva: boolean
  email: boolean
  telefono: boolean
  tmc: boolean
}

const CM_TO_PX = 37.8

export default function EtichettePage() {
  const [selectedProdottoId, setSelectedProdottoId] = useState<number | null>(null)
  const [selectedLottoId, setSelectedLottoId] = useState<number | null>(null)
  const [formato, setFormato] = useState<FormatoEtichetta>('orizzontale')
  const [larghezza, setLarghezza] = useState(10)
  const [altezza, setAltezza] = useState(6)
  const [diametro, setDiametro] = useState(10)
  const [elementi, setElementi] = useState<Elementi>({
    logo: true,
    valoriNutrizionali: true,
    qrCode: true,
    allergeni: true,
    ingredienti: true,
    lotto: true,
    origine: true,
    conservazione: true,
    pesoNetto: true,
    piva: true,
    email: true,
    telefono: true,
    tmc: true,
  })
  const [tmcValue, setTmcValue] = useState('')
  const [tmcError, setTmcError] = useState('')
  const [pesoNettoValue, setPesoNettoValue] = useState('')
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const etichettaRef = useRef<HTMLDivElement>(null)

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>(
    selectedProdottoId ? `/api/admin/lotti?prodotto_id=${selectedProdottoId}` : null,
    fetcher
  )
  const { data: impostazioni } = useSWR<Impostazioni>('/api/admin/impostazioni', fetcher)

  const selectedProdotto = prodotti?.find(p => p.id === selectedProdottoId)
  const selectedLotto = lotti?.find(l => l.id === selectedLottoId)
  const lottiAttivi = lotti?.filter(l => l.attivo) || []

  // Pre-compila TMC dal lotto se non e "vedi confezione"
  useEffect(() => {
    if (selectedLotto?.tmc && selectedLotto.tmc.toLowerCase() !== 'vedi confezione') {
      // Prova a parsare MM/YYYY dal valore del lotto
      const match = selectedLotto.tmc.match(/^(\d{1,2})\/(\d{4})$/)
      if (match) {
        setTmcValue(selectedLotto.tmc)
        setTmcError('')
      } else {
        setTmcValue('')
      }
    } else {
      setTmcValue('')
    }
  }, [selectedLotto])

  // Pre-compila peso netto dal prodotto
  useEffect(() => {
    if (selectedProdotto?.peso_netto) {
      setPesoNettoValue(selectedProdotto.peso_netto)
    } else {
      setPesoNettoValue('')
    }
  }, [selectedProdotto])

  // Validazione TMC formato MM/YYYY
  const validateTmc = (value: string): string => {
    if (!value) return 'Campo obbligatorio'
    const match = value.match(/^(\d{1,2})\/(\d{4})$/)
    if (!match) return 'Formato non valido (MM/YYYY)'
    const month = parseInt(match[1], 10)
    if (month < 1 || month > 12) return 'Mese non valido (01-12)'
    return ''
  }

  const handleTmcChange = (value: string) => {
    // Auto-format: aggiungi / dopo 2 cifre
    let formatted = value.replace(/[^\d/]/g, '')
    if (formatted.length === 2 && !formatted.includes('/') && tmcValue.length < 2) {
      formatted = formatted + '/'
    }
    if (formatted.length > 7) formatted = formatted.slice(0, 7)
    setTmcValue(formatted)
    if (elementi.tmc) {
      setTmcError(validateTmc(formatted))
    }
  }

  // TMC valido per abilitare PDF
  const isTmcValid = !elementi.tmc || (tmcValue && !validateTmc(tmcValue))
  
  // Peso netto valido per abilitare PDF
  const isPesoNettoValid = !elementi.pesoNetto || (pesoNettoValue && pesoNettoValue.trim() !== '')
  
  // Entrambi i campi devono essere validi
  const canGeneratePdf = isTmcValid && isPesoNettoValid

  // Calcola dimensioni in px
  const widthPx = formato === 'rotonda' ? diametro * CM_TO_PX : larghezza * CM_TO_PX
  const heightPx = formato === 'rotonda' ? diametro * CM_TO_PX : altezza * CM_TO_PX

  // Scala per fit nello schermo con zoom maggiore per visualizzazione
  const maxSize = 550
  const baseScale = maxSize / Math.max(widthPx, heightPx)
  const scale = Math.max(1.3, Math.min(1.6, baseScale)) // zoom tra 1.3x e 1.6x

  const categoria = selectedProdotto?.categoria_etichetta || 'ortaggio_fresco'
  const vn = selectedProdotto?.valori_nutrizionali || {}

  // Dati azienda
  const ragioneSociale = impostazioni?.ragione_sociale || 'Azienda Agricola Parisse Gianni'
  const indirizzoCompleto = [
    impostazioni?.indirizzo,
    impostazioni?.cap,
    impostazioni?.citta,
    impostazioni?.provincia ? `(${impostazioni.provincia})` : null,
  ].filter(Boolean).join(' ') || 'Pescina (AQ)'
  const piva = impostazioni?.partita_iva || ''
  const email = impostazioni?.email || ''
  const telefono = impostazioni?.telefono || ''
  const sitoWeb = impostazioni?.sito_web || 'www.gianniparisse.it'

  const canShowPreview = selectedProdotto && selectedLotto

  const handleStampa = () => window.print()

  const handleGeneraPdf = async () => {
    if (!selectedProdotto || !selectedLotto) return
    setGeneratingPdf(true)
    try {
      const params = new URLSearchParams({
        prodotto_id: String(selectedProdotto.id),
        lotto_id: String(selectedLotto.id),
        formato,
        larghezza: String(larghezza),
        altezza: String(altezza),
        diametro: String(diametro),
        elementi: JSON.stringify(elementi),
      })
      const res = await fetch(`/api/admin/etichette/pdf?${params}`)
      if (!res.ok) throw new Error('Errore generazione PDF')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `etichetta-${selectedLotto.codice_lotto}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Errore nella generazione del PDF')
    } finally {
      setGeneratingPdf(false)
    }
  }

  const toggleElemento = (key: keyof Elementi) => {
    setElementi(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Print styles
  const printSize = formato === 'orizzontale' 
    ? `${larghezza}cm ${altezza}cm` 
    : formato === 'verticale' 
    ? `${larghezza}cm ${altezza}cm` 
    : `${diametro}cm ${diametro}cm`

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #etichetta-print, #etichetta-print * { visibility: visible; }
          #etichetta-print { position: absolute; left: 0; top: 0; transform: none !important; }
          @page { size: ${printSize}; margin: 0; }
        }
      `}</style>

      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 48px)',
        margin: '-24px',
        background: '#f5f0e8',
      }}>
        {/* COLONNA SINISTRA - Pannello di controllo */}
        <div style={{ 
          width: 320, 
          flexShrink: 0,
          background: '#fff', 
          boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <h1 className={playfair.className} style={{ 
              color: '#1a3a2a', 
              fontSize: 22, 
              fontWeight: 700, 
              margin: 0,
            }}>
              Studio Etichette
            </h1>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              Crea etichette professionali
            </p>
          </div>

          {/* SEZIONE 1 - Prodotto e Lotto */}
          <div style={{ padding: 20, borderBottom: '1px solid #c9933a30' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Prodotto e Lotto
            </div>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 6 }}>Prodotto</label>
              <select
                value={selectedProdottoId || ''}
                onChange={(e) => {
                  setSelectedProdottoId(e.target.value ? Number(e.target.value) : null)
                  setSelectedLottoId(null)
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, color: '#333' }}
              >
                <option value="">-- Seleziona --</option>
                {prodotti?.filter(p => p.attivo).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 6 }}>Lotto</label>
              <select
                value={selectedLottoId || ''}
                onChange={(e) => setSelectedLottoId(e.target.value ? Number(e.target.value) : null)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, color: '#333', opacity: selectedProdottoId ? 1 : 0.5 }}
                disabled={!selectedProdottoId}
              >
                <option value="">-- Seleziona --</option>
                {lottiAttivi.map(l => (
                  <option key={l.id} value={l.id}>{l.codice_lotto}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SEZIONE 2 - Formato */}
          <div style={{ padding: 20, borderBottom: '1px solid #c9933a30' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Formato
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Card Orizzontale */}
              <div
                onClick={() => setFormato('orizzontale')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 10,
                  border: formato === 'orizzontale' ? '2px solid #c9933a' : '1px solid #e5e7eb',
                  background: formato === 'orizzontale' ? '#fffbf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {formato === 'orizzontale' && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                )}
                <div style={{ width: 50, height: 30, border: '2px solid #999', borderRadius: 3, margin: '0 auto 8px', background: formato === 'orizzontale' ? '#f5f0e8' : '#f9f9f9' }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1a3a2a' }}>Orizzontale</div>
              </div>

              {/* Card Verticale */}
              <div
                onClick={() => setFormato('verticale')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 10,
                  border: formato === 'verticale' ? '2px solid #c9933a' : '1px solid #e5e7eb',
                  background: formato === 'verticale' ? '#fffbf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {formato === 'verticale' && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                )}
                <div style={{ width: 30, height: 50, border: '2px solid #999', borderRadius: 3, margin: '0 auto 8px', background: formato === 'verticale' ? '#f5f0e8' : '#f9f9f9' }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1a3a2a' }}>Verticale</div>
              </div>

              {/* Card Rotonda */}
              <div
                onClick={() => setFormato('rotonda')}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 10,
                  border: formato === 'rotonda' ? '2px solid #c9933a' : '1px solid #e5e7eb',
                  background: formato === 'rotonda' ? '#fffbf5' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {formato === 'rotonda' && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#22c55e', borderRadius: '50%', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                )}
                <div style={{ width: 40, height: 40, border: '2px solid #999', borderRadius: '50%', margin: '0 auto 8px', background: formato === 'rotonda' ? '#f5f0e8' : '#f9f9f9' }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1a3a2a' }}>Rotonda</div>
              </div>
            </div>
          </div>

          {/* SEZIONE 3 - Dimensioni */}
          <div style={{ padding: 20, borderBottom: '1px solid #c9933a30' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Dimensioni
            </div>
            
            {formato !== 'rotonda' ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 6 }}>Larghezza (cm)</label>
                  <input
                    type="number"
                    value={larghezza}
                    onChange={(e) => setLarghezza(Number(e.target.value) || 10)}
                    min={3}
                    max={20}
                    step={0.5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 6 }}>Altezza (cm)</label>
                  <input
                    type="number"
                    value={altezza}
                    onChange={(e) => setAltezza(Number(e.target.value) || 6)}
                    min={3}
                    max={20}
                    step={0.5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13 }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 6 }}>Diametro (cm)</label>
                <input
                  type="number"
                  value={diametro}
                  onChange={(e) => setDiametro(Number(e.target.value) || 10)}
                  min={3}
                  max={20}
                  step={0.5}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13 }}
                />
              </div>
            )}
          </div>

          {/* SEZIONE 4 - Elementi */}
          <div style={{ padding: 20, borderBottom: '1px solid #c9933a30', flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
              Elementi
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {[
                { key: 'logo', label: 'Logo' },
                { key: 'valoriNutrizionali', label: 'Valori nutrizionali' },
                { key: 'qrCode', label: 'QR Code' },
                { key: 'allergeni', label: 'Allergeni' },
                { key: 'ingredienti', label: 'Ingredienti' },
                { key: 'lotto', label: 'Lotto' },
                { key: 'origine', label: 'Origine' },
                { key: 'conservazione', label: 'Conservazione' },
                { key: 'piva', label: 'P.IVA' },
                { key: 'email', label: 'Email' },
                { key: 'telefono', label: 'Telefono' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#444' }}>
                  <input
                    type="checkbox"
                    checked={elementi[key as keyof Elementi]}
                    onChange={() => toggleElemento(key as keyof Elementi)}
                    style={{ width: 16, height: 16, accentColor: '#c9933a' }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Campo Peso netto separato con input */}
            <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#444', marginBottom: elementi.pesoNetto ? 10 : 0 }}>
                <input
                  type="checkbox"
                  checked={elementi.pesoNetto}
                  onChange={() => toggleElemento('pesoNetto')}
                  style={{ width: 16, height: 16, accentColor: '#c9933a' }}
                />
                Peso netto
              </label>
              {elementi.pesoNetto && (
                <div style={{ marginLeft: 24 }}>
                  <input
                    type="text"
                    value={pesoNettoValue}
                    onChange={(e) => setPesoNettoValue(e.target.value)}
                    placeholder="es. 500g, 1kg"
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: 6, 
                      border: (elementi.pesoNetto && !pesoNettoValue.trim()) ? '1px solid #dc2626' : '1px solid #ddd', 
                      fontSize: 13,
                    }}
                  />
                  {elementi.pesoNetto && !pesoNettoValue.trim() && (
                    <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Campo obbligatorio</div>
                  )}
                </div>
              )}
            </div>

            {/* Campo TMC separato con input MM/YYYY */}
            <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#444', marginBottom: elementi.tmc ? 10 : 0 }}>
                <input
                  type="checkbox"
                  checked={elementi.tmc}
                  onChange={() => {
                    toggleElemento('tmc')
                    if (elementi.tmc) setTmcError('')
                  }}
                  style={{ width: 16, height: 16, accentColor: '#c9933a' }}
                />
                Da consumarsi preferibilmente entro
              </label>
              {elementi.tmc && (
                <div style={{ marginLeft: 24 }}>
                  <input
                    type="text"
                    value={tmcValue}
                    onChange={(e) => handleTmcChange(e.target.value)}
                    placeholder="MM/YYYY (es. 12/2027)"
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: 6, 
                      border: tmcError ? '1px solid #dc2626' : '1px solid #ddd', 
                      fontSize: 13,
                    }}
                  />
                  {tmcError && (
                    <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{tmcError}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BOTTONI */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleGeneraPdf}
              disabled={!canShowPreview || generatingPdf || !canGeneratePdf}
              style={{
                width: '100%',
                padding: '14px',
                background: (canShowPreview && canGeneratePdf) ? '#c9933a' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: (canShowPreview && canGeneratePdf) ? 'pointer' : 'not-allowed',
              }}
            >
              {generatingPdf ? 'Generazione...' : 'Genera PDF'}
            </button>
            <button
              onClick={handleStampa}
              disabled={!canShowPreview}
              style={{
                width: '100%',
                padding: '14px',
                background: canShowPreview ? '#1a3a2a' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: canShowPreview ? 'pointer' : 'not-allowed',
              }}
            >
              Stampa
            </button>
          </div>
        </div>

        {/* COLONNA DESTRA - Anteprima Live */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          padding: 32,
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#c9933a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
            Anteprima Live
          </div>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
            {!canShowPreview ? (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 32 }}>
                  🏷️
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#666', marginBottom: 8 }}>Nessuna anteprima</div>
                <div style={{ fontSize: 13 }}>Seleziona prodotto e lotto</div>
              </div>
            ) : (
              <div style={{ 
                background: '#fff', 
                borderRadius: formato === 'rotonda' ? '50%' : 8,
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}>
                {/* ANTEPRIMA ETICHETTA */}
                {formato === 'orizzontale' && (
                  <div
                    id="etichetta-print"
                    ref={etichettaRef}
                    style={{
                      width: widthPx,
                      height: heightPx,
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '4px 10px', borderBottom: '1px solid #c9933a', background: '#fefdfb' }}>
                      {elementi.logo && <Image src="/images/logo.png" alt="Logo" width={50} height={20} style={{ objectFit: 'contain' }} />}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 7, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.3 }}>{ragioneSociale.toUpperCase()}</div>
                        <div style={{ fontSize: 5, color: '#666' }}>
                          {indirizzoCompleto}
                          {elementi.piva && piva && ` – P.IVA: ${piva}`}
                        </div>
                      </div>
                    </div>

                    {/* Contenuto */}
                    <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ marginBottom: 2 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#1a3a2a', lineHeight: 1.1 }}>{selectedProdotto.nome}</div>
                        {selectedProdotto.descrizione && (
                          <div style={{ fontSize: 5.5, color: '#666', lineHeight: 1.2, marginTop: 1 }}>{selectedProdotto.descrizione}</div>
                        )}
                      </div>

                      {(categoria === 'completo' || categoria === 'trasformato') && (
                        <>
                          {elementi.ingredienti && selectedProdotto.ingredienti && (
                            <div style={{ fontSize: 5.5, marginBottom: 2, lineHeight: 1.2 }}>
                              <strong>Ingredienti:</strong> {selectedProdotto.ingredienti}
                            </div>
                          )}
                          {elementi.allergeni && selectedProdotto.allergeni && (
                            <div style={{ fontSize: 6, fontWeight: 700, marginBottom: 2, color: '#c00' }}>
                              ALLERGENI: {selectedProdotto.allergeni}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 6, flex: 1, minHeight: 0 }}>
                            {/* Tabella valori nutrizionali */}
                            {elementi.valoriNutrizionali && (
                              <div style={{ flex: '1 1 55%', border: '1px solid #ddd', borderRadius: 2, fontSize: 5.5, overflow: 'hidden' }}>
                                <div style={{ background: '#f5f0e8', padding: '2px 4px', fontWeight: 700, fontSize: 5.5 }}>Valori Nutrizionali / 100g</div>
                                <div style={{ padding: '1px 4px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}><span>Energia</span><span>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Grassi</span><span>{vn.grassi ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 6 }}><span>- di cui saturi</span><span>{vn.grassi_saturi ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Carboidrati</span><span>{vn.carboidrati ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 6 }}><span>- di cui zuccheri</span><span>{vn.zuccheri ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Fibre</span><span>{vn.fibre ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}><span>Proteine</span><span>{vn.proteine ?? '-'} g</span></div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Sale</span><span>{vn.sale ?? '-'} g</span></div>
                                </div>
                              </div>
                            )}

                            {/* Colonna destra */}
                            <div style={{ flex: '1 1 45%', fontSize: 5.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div style={{ lineHeight: 1.4 }}>
                                <div><strong>Peso netto:</strong> {pesoNettoValue || '_____'}</div>
                                {elementi.lotto && <div><strong>L:</strong> {selectedLotto.codice_lotto}</div>}
                                <div><strong>Da consumarsi preferibilmente entro:</strong> {tmcValue || '_____'}</div>
                                {elementi.origine && <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>}
                                {elementi.conservazione && selectedLotto.condizioni_conservazione && (
                                  <div style={{ fontSize: 5, color: '#666', marginTop: 2 }}>{selectedLotto.condizioni_conservazione}</div>
                                )}
                              </div>
                              {elementi.qrCode && (
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                  <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                    <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={36} />
                                  </div>
                                  <div style={{ fontSize: 5, color: '#666' }}>{sitoWeb}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {categoria === 'ortaggio_fresco' && (
                        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                          <div style={{ flex: 1, fontSize: 6, lineHeight: 1.5 }}>
                            {elementi.pesoNetto && <div><strong>Peso netto:</strong> {selectedProdotto.peso_netto || '-'}</div>}
                            {elementi.lotto && <div><strong>Lotto:</strong> {selectedLotto.codice_lotto}</div>}
                            {elementi.origine && <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>}
                            {elementi.conservazione && selectedLotto.condizioni_conservazione && (
                              <div style={{ fontSize: 5, color: '#666', marginTop: 4 }}>{selectedLotto.condizioni_conservazione}</div>
                            )}
                          </div>
                          {elementi.qrCode && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={40} />
                              </div>
                              <div style={{ fontSize: 5, color: '#666', marginTop: 2 }}>{sitoWeb}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formato === 'verticale' && (
                  <div
                    id="etichetta-print"
                    ref={etichettaRef}
                    style={{
                      width: widthPx,
                      height: heightPx,
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
                    {/* Header compatto premium */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '4px 8px', borderBottom: '1px solid #c9933a', background: '#fefdfb' }}>
                      {elementi.logo && <Image src="/images/logo.png" alt="Logo" width={40} height={16} style={{ objectFit: 'contain', display: 'block' }} />}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 6, fontWeight: 700, color: '#1a3a2a', letterSpacing: 0.3 }}>{ragioneSociale.toUpperCase()}</div>
                        <div style={{ fontSize: 4.5, color: '#666' }}>{indirizzoCompleto}</div>
                      </div>
                    </div>

                    {/* Nome prodotto */}
                    <div style={{ padding: '6px 8px 4px', borderBottom: '1px solid #c9933a20' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1a3a2a', textAlign: 'center', lineHeight: 1.1 }}>{selectedProdotto.nome}</div>
                      {selectedProdotto.descrizione && (
                        <div style={{ fontSize: 5, color: '#666', textAlign: 'center', marginTop: 2, lineHeight: 1.2 }}>{selectedProdotto.descrizione}</div>
                      )}
                    </div>

                    {/* Contenuto principale */}
                    <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontSize: 5.5 }}>
                      {/* Ingredienti e allergeni */}
                      {elementi.ingredienti && selectedProdotto.ingredienti && (
                        <div style={{ marginBottom: 3, lineHeight: 1.3 }}><strong>Ingredienti:</strong> {selectedProdotto.ingredienti}</div>
                      )}
                      {elementi.allergeni && selectedProdotto.allergeni && (
                        <div style={{ fontSize: 6, fontWeight: 700, color: '#c00', marginBottom: 4 }}>ALLERGENI: {selectedProdotto.allergeni}</div>
                      )}

                      {/* Tabella valori nutrizionali completa */}
                      {elementi.valoriNutrizionali && (categoria === 'completo' || categoria === 'trasformato') && (
                        <div style={{ border: '1px solid #ddd', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                          <div style={{ background: '#f5f0e8', padding: '2px 4px', fontWeight: 700, fontSize: 5.5 }}>Valori Nutrizionali / 100g</div>
                          <div style={{ padding: '1px 4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}><span>Energia</span><span>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Grassi</span><span>{vn.grassi ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 6 }}><span>- di cui saturi</span><span>{vn.grassi_saturi ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Carboidrati</span><span>{vn.carboidrati ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px', paddingLeft: 6 }}><span>- di cui zuccheri</span><span>{vn.zuccheri ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Fibre</span><span>{vn.fibre ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9f9f9', padding: '1px 2px' }}><span>Proteine</span><span>{vn.proteine ?? '-'} g</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 2px' }}><span>Sale</span><span>{vn.sale ?? '-'} g</span></div>
                          </div>
                        </div>
                      )}

                      {/* Info prodotto in due colonne */}
                      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                        <div style={{ flex: 1, lineHeight: 1.4 }}>
                          <div><strong>Peso netto:</strong> {pesoNettoValue || '_____'}</div>
                          {elementi.lotto && <div><strong>L:</strong> {selectedLotto.codice_lotto}</div>}
                          <div style={{ fontSize: 5 }}><strong>Da consumarsi pref. entro:</strong> {tmcValue || '_____'}</div>
                          {elementi.origine && <div><strong>Origine:</strong> {selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>}
                          {elementi.conservazione && selectedLotto.condizioni_conservazione && (
                            <div style={{ fontSize: 5, color: '#666', marginTop: 2 }}>{selectedLotto.condizioni_conservazione}</div>
                          )}
                        </div>
                        
                        {/* QR code nella colonna destra */}
                        {elementi.qrCode && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <div style={{ background: '#fff', padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                              <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={38} />
                            </div>
                            <div style={{ fontSize: 4.5, color: '#666', marginTop: 2 }}>{sitoWeb}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formato === 'rotonda' && (
                  <div
                    id="etichetta-print"
                    ref={etichettaRef}
                    style={{
                      width: widthPx,
                      height: heightPx,
                      borderRadius: '50%',
                      border: '3px solid #c9933a',
                      background: '#fff',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontSize: 7,
                      color: '#333',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Logo watermark */}
                    {elementi.logo && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, width: '60%', pointerEvents: 'none' }}>
                        <Image src="/images/logo.png" alt="" width={200} height={200} style={{ objectFit: 'contain', width: '100%', height: 'auto' }} />
                      </div>
                    )}

                    {/* Contenuto due colonne */}
                    <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 40px' }}>
                      <div style={{ display: 'flex', width: '100%', maxWidth: 280, gap: 12 }}>
                        {/* Colonna sinistra 60% */}
                        <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ fontSize: 7, fontWeight: 600, color: '#c9933a', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                            {ragioneSociale}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a', marginBottom: 8, lineHeight: 1.2 }}>
                            {selectedProdotto.nome}
                          </div>
                          {elementi.allergeni && selectedProdotto.allergeni && (
                            <div style={{ fontSize: 7, fontWeight: 700, marginBottom: 8, padding: '3px 8px', background: '#f97316', borderRadius: 3, color: '#fff', display: 'inline-block', alignSelf: 'flex-start' }}>
                              {selectedProdotto.allergeni}
                            </div>
                          )}
                          {elementi.lotto && <div style={{ fontSize: 7, marginBottom: 3 }}><strong>L:</strong> {selectedLotto.codice_lotto}</div>}
                          <div style={{ fontSize: 7, marginBottom: 3 }}><strong>Entro:</strong> {tmcValue || '_____'}</div>
                          {elementi.origine && <div style={{ fontSize: 7, marginBottom: 3 }}>{selectedProdotto.origine || impostazioni?.origine_default || 'Italia'}</div>}
                          {elementi.conservazione && selectedLotto.condizioni_conservazione && (
                            <div style={{ fontSize: 7, color: '#666' }}>{selectedLotto.condizioni_conservazione}</div>
                          )}
                        </div>

                        {/* Colonna destra 40% */}
                        {elementi.qrCode && (
                          <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: '#fff', padding: 4, border: '1px solid #ddd', borderRadius: 4 }}>
                              <QRCode value={`https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`} size={80} />
                            </div>
                            <div style={{ fontSize: 7, color: '#666', marginTop: 6, textAlign: 'center' }}>{sitoWeb}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
