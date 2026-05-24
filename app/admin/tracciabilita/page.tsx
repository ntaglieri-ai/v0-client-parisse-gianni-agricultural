'use client'

import { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'
import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })

const playfair = Playfair_Display({ subsets: ['latin'] })
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Mappa sigle prodotti per codice lotto
const sigleProdotti: Record<string, string> = {
  'Farro': 'FA',
  'Grano Tenero': 'GT',
  'Grano Duro': 'GD',
  'Grano Solina': 'GS',
  'Grano Senatore Cappelli': 'SC',
  'Orzo': 'OR',
  'Mais': 'MA',
  'Fagioli Borlotti': 'FB',
  'Fagioli Cannellini': 'FC',
  'Ceci': 'CE',
  'Lenticchie': 'LE',
  'Piselli': 'PI',
  'Farina di Grano Tenero': 'FGT',
  'Farina di Grano Duro': 'FGD',
  'Farina di Ceci': 'FCI',
  'Farina di Farro': 'FFA',
  'Patate': 'PAT',
  'Carote': 'CAR',
  'Cipolle': 'CIP',
  'Aglio': 'AGL',
  'Radicchio': 'RAD',
  'Finocchi': 'FIN',
  'Cavoli': 'CAV',
  'Pomodori': 'POM',
  'Zucchine': 'ZUC',
  'Melanzane': 'MEL',
  'Passata di Pomodoro': 'PP',
  'Aglio Marinato': 'AM',
  'Aglio in Polvere': 'AP',
  'Sottaceti': 'SOT',
  "Sott'oli": 'SOL',
  'Pasta Senatore Cappelli': 'PSC',
}

// Regex validazione codice lotto: XX-YYYY-NNN o XXX-YYYY-NNN
const codiceLottoRegex = /^[A-Z]{2,3}-\d{4}-\d{3}$/

interface Prodotto {
  id: number
  nome: string
  unita: string
  attivo: boolean
}

interface Lotto {
  id: number
  prodotto_id: number
  codice_lotto: string
  campo: string
  comune: string
  data_semina: string
  data_raccolta: string
  kg_totali: number
  kg_disponibili: number
  prezzo: number
  tmc: string
  condizioni_conservazione: string
  certificazioni: string
  note: string
  attivo: boolean
}

export default function TracciabilitaPage() {
  const [selectedProdottoId, setSelectedProdottoId] = useState<number | null>(null)
  const [selectedLottoId, setSelectedLottoId] = useState<number | null>(null)
  const [qrSize, setQrSize] = useState(200)
  const [copied, setCopied] = useState(false)
  const [showLottoForm, setShowLottoForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [codiceLottoError, setCodiceLottoError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [lottoFormData, setLottoFormData] = useState({
    prodotto_id: 0,
    codice_lotto: '',
    campo: '',
    comune: '',
    data_semina: '',
    data_raccolta: '',
    kg_totali: '',
    kg_disponibili: '',
    prezzo: '',
    tmc: '',
    condizioni_conservazione: '',
    certificazioni: '',
    note: '',
    attivo: true,
  })

  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: allLotti } = useSWR<Lotto[]>('/api/admin/lotti', fetcher)

  const selectedProdotto = prodotti?.find(p => p.id === selectedProdottoId)
  const lotti = allLotti?.filter(l => l.prodotto_id === selectedProdottoId) || []
  const selectedLotto = lotti?.find(l => l.id === selectedLottoId)
  const lottiAttivi = lotti?.filter(l => l.attivo) || []

  const traceUrl = selectedLotto 
    ? `https://gianniparisse.it/store/traccia/${selectedLotto.codice_lotto}`
    : ''

  const generateCodiceLotto = (prodotto: Prodotto) => {
    const sigla = sigleProdotti[prodotto.nome] || prodotto.nome.substring(0, 2).toUpperCase()
    const anno = new Date().getFullYear()
    const lottiEsistenti = lotti?.length || 0
    const numero = String(lottiEsistenti + 1).padStart(3, '0')
    return `${sigla}-${anno}-${numero}`
  }

  const validateCodiceLotto = (codice: string) => {
    if (!codice) return ''
    if (!codiceLottoRegex.test(codice)) {
      return 'Formato non valido. Usa: XX-YYYY-NNN (es. FA-2026-001)'
    }
    return ''
  }

  const handleCodiceLottoChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setLottoFormData({ ...lottoFormData, codice_lotto: upperValue })
    setCodiceLottoError(validateCodiceLotto(upperValue))
  }

  const resetLottoForm = () => {
    setLottoFormData({ prodotto_id: 0, codice_lotto: '', campo: '', comune: '', data_semina: '', data_raccolta: '', kg_totali: '', kg_disponibili: '', prezzo: '', tmc: '', condizioni_conservazione: '', certificazioni: '', note: '', attivo: true })
    setShowLottoForm(false)
    setCodiceLottoError('')
  }

  const handleOpenNewLotto = () => {
    if (!selectedProdotto) return
    const suggestedCode = generateCodiceLotto(selectedProdotto)
    setLottoFormData({ 
      prodotto_id: selectedProdotto.id, 
      codice_lotto: suggestedCode, 
      campo: '', 
      comune: '', 
      data_semina: '', 
      data_raccolta: '', 
      kg_totali: '', 
      kg_disponibili: '', 
      prezzo: '', 
      tmc: '', 
      condizioni_conservazione: '', 
      certificazioni: '', 
      note: '', 
      attivo: true 
    })
    setCodiceLottoError('')
    setShowLottoForm(true)
  }

  const handleLottoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProdotto) return
    setSaving(true)
    try {
      await fetch('/api/admin/lotti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lottoFormData,
          prodotto_id: selectedProdotto.id,
          kg_totali: parseFloat(lottoFormData.kg_totali) || 0,
          kg_disponibili: parseFloat(lottoFormData.kg_disponibili) || 0,
          prezzo: parseFloat(lottoFormData.prezzo) || 0,
        }),
      })
      mutate('/api/admin/lotti')
      resetLottoForm()
    } catch (error) {
      console.error('Error saving lotto:', error)
    }
    setSaving(false)
  }

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

  const styles = {
    input: {
      width: '100%',
      padding: isMobile ? '8px 10px' : '10px 12px',
      border: '1px solid #ddd',
      borderRadius: 6,
      fontSize: isMobile ? 13 : 14,
      boxSizing: 'border-box' as const,
    },
    label: {
      display: 'block',
      fontSize: isMobile ? 11 : 13,
      fontWeight: 600,
      color: '#1a3a2a',
      marginBottom: isMobile ? 4 : 6,
    },
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

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className={playfair.className} style={{ 
            color: '#1a3a2a', 
            fontSize: isMobile ? 24 : 28, 
            fontWeight: 700, 
            margin: 0,
          }}>
            Tracciabilita
          </h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            Gestisci i lotti e genera QR code per la tracciabilita dei tuoi prodotti
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Pannello Selezione e Creazione Lotto */}
          <div style={{ 
            flex: '1 1 400px',
            background: '#fff', 
            borderRadius: 16, 
            padding: isMobile ? 16 : 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c9933a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
              Seleziona o Crea Lotto
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
                  setShowLottoForm(false)
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
                  Lotto
                </label>
                {selectedProdottoId && (
                  <button
                    onClick={handleOpenNewLotto}
                    style={{
                      padding: '6px 12px',
                      background: '#1a3a2a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Nuovo Lotto
                  </button>
                )}
              </div>
              <select
                value={selectedLottoId || ''}
                onChange={(e) => {
                  setSelectedLottoId(e.target.value ? Number(e.target.value) : null)
                  setShowLottoForm(false)
                }}
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

            {/* Form Nuovo Lotto */}
            {showLottoForm && selectedProdotto && (
              <div style={{ background: '#f8f8f8', borderRadius: 10, padding: isMobile ? 14 : 20, marginBottom: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: '#1a3a2a', marginBottom: 16 }}>Nuovo Lotto</h4>
                <form onSubmit={handleLottoSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={styles.label}>Codice Lotto</label>
                      <input 
                        type="text" 
                        value={lottoFormData.codice_lotto} 
                        onChange={(e) => handleCodiceLottoChange(e.target.value)} 
                        style={{ ...styles.input, borderColor: codiceLottoError ? '#dc2626' : '#ddd' }} 
                        required 
                        placeholder="XX-YYYY-NNN"
                      />
                      {codiceLottoError && (
                        <span style={{ fontSize: 11, color: '#dc2626', marginTop: 4, display: 'block' }}>{codiceLottoError}</span>
                      )}
                    </div>
                    <div>
                      <label style={styles.label}>Campo</label>
                      <input type="text" value={lottoFormData.campo} onChange={(e) => setLottoFormData({ ...lottoFormData, campo: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Comune</label>
                      <input type="text" value={lottoFormData.comune} onChange={(e) => setLottoFormData({ ...lottoFormData, comune: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Prezzo (EUR/{selectedProdotto.unita})</label>
                      <input type="number" step="0.01" value={lottoFormData.prezzo} onChange={(e) => setLottoFormData({ ...lottoFormData, prezzo: e.target.value })} style={styles.input} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={styles.label}>Data Semina</label>
                      <input type="date" value={lottoFormData.data_semina} onChange={(e) => setLottoFormData({ ...lottoFormData, data_semina: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Data Raccolta</label>
                      <input type="date" value={lottoFormData.data_raccolta} onChange={(e) => setLottoFormData({ ...lottoFormData, data_raccolta: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Scadenza magazzino</label>
                      <input type="text" value={lottoFormData.tmc} onChange={(e) => setLottoFormData({ ...lottoFormData, tmc: e.target.value })} style={styles.input} placeholder="es. 12/2027 o vedi confezione" />
                    </div>
                    <div>
                      <label style={styles.label}>Condizioni Conservazione</label>
                      <input type="text" value={lottoFormData.condizioni_conservazione} onChange={(e) => setLottoFormData({ ...lottoFormData, condizioni_conservazione: e.target.value })} style={styles.input} placeholder="Conservare in luogo fresco..." />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={styles.label}>Kg Totali</label>
                      <input type="number" step="0.1" value={lottoFormData.kg_totali} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_totali: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Kg Disponibili</label>
                      <input type="number" step="0.1" value={lottoFormData.kg_disponibili} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_disponibili: e.target.value })} style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.label}>Certificazioni</label>
                      <input type="text" value={lottoFormData.certificazioni} onChange={(e) => setLottoFormData({ ...lottoFormData, certificazioni: e.target.value })} style={styles.input} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={lottoFormData.attivo} onChange={(e) => setLottoFormData({ ...lottoFormData, attivo: e.target.checked })} />
                        Attivo
                      </label>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={styles.label}>Note</label>
                    <textarea value={lottoFormData.note} onChange={(e) => setLottoFormData({ ...lottoFormData, note: e.target.value })} style={{ ...styles.input, minHeight: 60 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      type="submit" 
                      disabled={saving || (!!codiceLottoError) || !lottoFormData.codice_lotto || !codiceLottoRegex.test(lottoFormData.codice_lotto)} 
                      style={{ 
                        padding: '10px 24px', 
                        background: (codiceLottoError || !lottoFormData.codice_lotto || !codiceLottoRegex.test(lottoFormData.codice_lotto)) ? '#9ca3af' : '#1a3a2a', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        fontSize: 13, 
                        fontWeight: 600, 
                        cursor: (codiceLottoError || !lottoFormData.codice_lotto || !codiceLottoRegex.test(lottoFormData.codice_lotto)) ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      {saving ? 'Salvataggio...' : 'Crea Lotto'}
                    </button>
                    <button type="button" onClick={resetLottoForm} style={{ padding: '10px 24px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Annulla
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Dimensione QR (solo se lotto selezionato) */}
            {selectedLotto && (
              <>
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

                {/* Azioni */}
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
              </>
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
