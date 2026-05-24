'use client'

import { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'
import QRCode from '@/components/QRCode'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

const categorie = ['cereali', 'legumi', 'farine', 'ortaggi', 'trasformati', 'pasta']
const unitaOptions = ['kg', 'g', 'pz', 'l']

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
  categoria: string
  descrizione: string
  unita: string
  prezzo_base: number
  immagine: string
  attivo: boolean
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

export default function AdminProdottiPage() {
  const { data: prodotti, error: prodottiError } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>('/api/admin/lotti', fetcher)
  
  const [selectedProdotto, setSelectedProdotto] = useState<Prodotto | null>(null)
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false) // true = solo lettura prodotto, form lotto aperto
  const [showNewProdottoForm, setShowNewProdottoForm] = useState(false)
  const [showLottoForm, setShowLottoForm] = useState(false)
  const [editingLotto, setEditingLotto] = useState<Lotto | null>(null)
  const [saving, setSaving] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedProdottoId, setExpandedProdottoId] = useState<number | null>(null)
  const [codiceLottoError, setCodiceLottoError] = useState('')
  const [detailProdotto, setDetailProdotto] = useState<Prodotto | null>(null)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'cereali',
    descrizione: '',
    unita: 'kg',
    prezzo_base: '',
    immagine: '',
    attivo: true,
    ingredienti: '',
    allergeni: '',
    categoria_etichetta: 'ortaggio_fresco',
    origine: 'Italia – Altopiano del Fucino',
    peso_netto: '',
    energia_kj: '',
    energia_kcal: '',
    grassi: '',
    grassi_saturi: '',
    carboidrati: '',
    zuccheri: '',
    fibre: '',
    proteine: '',
    sale: '',
  })
  
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

  const getLottiForProdotto = (prodottoId: number) => lotti?.filter(l => l.prodotto_id === prodottoId) || []
  
  const getTotaleDisponibile = (prodottoId: number) => {
    const lottiProdotto = getLottiForProdotto(prodottoId).filter(l => l.attivo)
    return lottiProdotto.reduce((sum, l) => sum + (Number(l.kg_disponibili) || 0), 0)
  }

  const getTotaleTotale = (prodottoId: number) => {
    const lottiProdotto = getLottiForProdotto(prodottoId).filter(l => l.attivo)
    return lottiProdotto.reduce((sum, l) => sum + (Number(l.kg_totali) || 0), 0)
  }

  const getLottiAttiviCount = (prodottoId: number) => {
    return getLottiForProdotto(prodottoId).filter(l => l.attivo).length
  }

  const generateCodiceLotto = (prodotto: Prodotto) => {
    const sigla = sigleProdotti[prodotto.nome] || prodotto.nome.substring(0, 2).toUpperCase()
    const anno = new Date().getFullYear()
    const lottiEsistenti = getLottiForProdotto(prodotto.id).length
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

  const loadProdottoIntoForm = (prodotto: Prodotto) => {
    const vn = prodotto.valori_nutrizionali || {}
    setFormData({
      nome: prodotto.nome,
      categoria: prodotto.categoria,
      descrizione: prodotto.descrizione || '',
      unita: prodotto.unita,
      prezzo_base: prodotto.prezzo_base?.toString() || '',
      immagine: prodotto.immagine || '',
      attivo: prodotto.attivo,
      ingredienti: prodotto.ingredienti || '',
      allergeni: prodotto.allergeni || '',
      categoria_etichetta: prodotto.categoria_etichetta || 'ortaggio_fresco',
      origine: prodotto.origine || 'Italia – Altopiano del Fucino',
      peso_netto: prodotto.peso_netto || '',
      energia_kj: vn.energia_kj?.toString() || '',
      energia_kcal: vn.energia_kcal?.toString() || '',
      grassi: vn.grassi?.toString() || '',
      grassi_saturi: vn.grassi_saturi?.toString() || '',
      carboidrati: vn.carboidrati?.toString() || '',
      zuccheri: vn.zuccheri?.toString() || '',
      fibre: vn.fibre?.toString() || '',
      proteine: vn.proteine?.toString() || '',
      sale: vn.sale?.toString() || '',
    })
  }

  const resetForm = () => {
    setFormData({ nome: '', categoria: 'cereali', descrizione: '', unita: 'kg', prezzo_base: '', immagine: '', attivo: true, ingredienti: '', allergeni: '', categoria_etichetta: 'ortaggio_fresco', origine: 'Italia – Altopiano del Fucino', peso_netto: '', energia_kj: '', energia_kcal: '', grassi: '', grassi_saturi: '', carboidrati: '', zuccheri: '', fibre: '', proteine: '', sale: '' })
  }

  const resetLottoForm = () => {
    setLottoFormData({ prodotto_id: 0, codice_lotto: '', campo: '', comune: '', data_semina: '', data_raccolta: '', kg_totali: '', kg_disponibili: '', prezzo: '', tmc: '', condizioni_conservazione: '', certificazioni: '', note: '', attivo: true })
    setEditingLotto(null)
    setShowLottoForm(false)
  }

  const handleSelectProdotto = (prodotto: Prodotto, readOnly: boolean = false) => {
    setSelectedProdotto(prodotto)
    setIsReadOnlyMode(readOnly)
    loadProdottoIntoForm(prodotto)
    setCodiceLottoError('')
    if (readOnly) {
      // Modalita + Lotto: apri form nuovo lotto con codice pre-compilato
      const suggestedCode = generateCodiceLotto(prodotto)
      setLottoFormData({ 
        prodotto_id: prodotto.id, 
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
      setShowLottoForm(true)
    } else {
      // Modalita Modifica: form lotto chiuso
      setShowLottoForm(false)
    }
    setEditingLotto(null)
  }

  const handleBackToList = () => {
    setSelectedProdotto(null)
    setIsReadOnlyMode(false)
    resetForm()
    resetLottoForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const valori_nutrizionali = {
        energia_kj: parseFloat(formData.energia_kj) || null,
        energia_kcal: parseFloat(formData.energia_kcal) || null,
        grassi: parseFloat(formData.grassi) || null,
        grassi_saturi: parseFloat(formData.grassi_saturi) || null,
        carboidrati: parseFloat(formData.carboidrati) || null,
        zuccheri: parseFloat(formData.zuccheri) || null,
        fibre: parseFloat(formData.fibre) || null,
        proteine: parseFloat(formData.proteine) || null,
        sale: parseFloat(formData.sale) || null,
      }
      const url = selectedProdotto ? `/api/admin/prodotti/${selectedProdotto.id}` : '/api/admin/prodotti'
      const res = await fetch(url, {
        method: selectedProdotto ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          prezzo_base: parseFloat(formData.prezzo_base) || 0,
          valori_nutrizionali,
        }),
      })
      const updated = await res.json()
      mutate('/api/admin/prodotti')
      if (selectedProdotto) {
        setSelectedProdotto({ ...selectedProdotto, ...updated })
      } else {
        setShowNewProdottoForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving prodotto:', error)
    }
    setSaving(false)
  }

  const handleEditLotto = (lotto: Lotto) => {
    setLottoFormData({
      prodotto_id: lotto.prodotto_id,
      codice_lotto: lotto.codice_lotto,
      campo: lotto.campo || '',
      comune: lotto.comune || '',
      data_semina: lotto.data_semina || '',
      data_raccolta: lotto.data_raccolta || '',
      kg_totali: lotto.kg_totali?.toString() || '',
      kg_disponibili: lotto.kg_disponibili?.toString() || '',
      prezzo: lotto.prezzo?.toString() || '',
      tmc: lotto.tmc || '',
      condizioni_conservazione: lotto.condizioni_conservazione || '',
      certificazioni: lotto.certificazioni || '',
      note: lotto.note || '',
      attivo: lotto.attivo,
    })
    setEditingLotto(lotto)
    setShowLottoForm(true)
  }

  const handleLottoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingLotto ? `/api/admin/lotti/${editingLotto.id}` : '/api/admin/lotti'
      await fetch(url, {
        method: editingLotto ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lottoFormData,
          prodotto_id: selectedProdotto?.id,
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

  const handleDeleteLotto = async (lotto: Lotto) => {
    if (!confirm(`Eliminare il lotto "${lotto.codice_lotto}"?`)) return
    try {
      await fetch(`/api/admin/lotti/${lotto.id}`, { method: 'DELETE' })
      mutate('/api/admin/lotti')
    } catch (error) {
      console.error('Error deleting lotto:', error)
    }
  }

  const handlePrintQR = (lotto: Lotto, prodottoNome: string) => {
    const url = `https://gianniparisse.it/store/traccia/${lotto.codice_lotto}`
    const printWindow = window.open('', '_blank', 'width=600,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${lotto.codice_lotto}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: auto; margin: 10mm; }
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
          .container { text-align: center; padding: 20px; }
          .qr-wrapper { display: inline-block; padding: 16px; border: 3px solid #000; border-radius: 12px; margin-bottom: 16px; }
          #qrcode { display: inline-block; }
          #qrcode canvas, #qrcode img { display: block !important; }
          .product-name { font-size: 24px; font-weight: bold; color: #000; margin-bottom: 8px; text-transform: uppercase; }
          .lotto-code { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 4px; }
          .url { font-size: 11px; color: #666; word-break: break-all; max-width: 300px; margin: 0 auto; }
          .brand { margin-top: 16px; font-size: 14px; color: #444; font-weight: 600; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="qr-wrapper"><div id="qrcode"></div></div>
          <div class="product-name">${prodottoNome}</div>
          <div class="lotto-code">Lotto: ${lotto.codice_lotto}</div>
          <div class="url">${url}</div>
          <div class="brand">Gianni Parisse - Azienda Agricola</div>
        </div>
        <script>
          new QRCode(document.getElementById("qrcode"), { text: "${url}", width: 200, height: 200, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
          setTimeout(function() { window.print(); }, 500);
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (prodottiError) {
    return <div style={{ padding: 20, textAlign: 'center', background: '#fef2f2', borderRadius: 8 }}><p style={{ color: '#dc2626', fontSize: 13 }}>Errore caricamento</p></div>
  }

  const prodottiByCategoria = categorie.reduce((acc, cat) => {
    acc[cat] = prodotti?.filter(p => p.categoria === cat) || []
    return acc
  }, {} as Record<string, Prodotto[]>)

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

  // DETAIL VIEW - Schermo intero quando un prodotto e selezionato
  if (selectedProdotto) {
    const lottiProdotto = getLottiForProdotto(selectedProdotto.id)
    
    return (
      <div>
        {/* Header con bottone torna */}
        <button
          onClick={handleBackToList}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: '#1a3a2a',
            fontSize: isMobile ? 14 : 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: isMobile ? 16 : 24,
            padding: 0,
          }}
        >
          ← Torna ai Prodotti
        </button>

        {/* Form Modifica Prodotto */}
        <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? 16 : 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 className={playfair.className} style={{ color: '#1a3a2a', fontSize: isMobile ? 20 : 26, fontWeight: 700, marginBottom: isMobile ? 16 : 24 }}>
            {selectedProdotto.nome}
          </h2>
          
          {isReadOnlyMode ? (
            // Modalita sola lettura
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16, marginBottom: 16 }}>
                <div><label style={styles.label}>Nome</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.nome}</div></div>
                <div><label style={styles.label}>Categoria</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333', textTransform: 'capitalize' }}>{formData.categoria}</div></div>
                <div><label style={styles.label}>Unita</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.unita}</div></div>
              </div>
              {formData.immagine && <div style={{ marginBottom: 16 }}><label style={styles.label}>Immagine</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333', wordBreak: 'break-all' }}>{formData.immagine}</div></div>}
              {formData.descrizione && <div style={{ marginBottom: 16 }}><label style={styles.label}>Descrizione</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.descrizione}</div></div>}
              
              {/* Info etichetta read-only */}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 20, marginTop: 20 }}>
                <h4 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: '#1a3a2a', marginBottom: 16 }}>Informazioni Etichetta</h4>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                  <div><label style={styles.label}>Categoria Etichetta</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.categoria_etichetta === 'completo' ? 'Completo' : 'Ortaggio Fresco'}</div></div>
                  <div><label style={styles.label}>Origine</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.origine || '-'}</div></div>
                  <div><label style={styles.label}>Peso Netto</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.peso_netto || '-'}</div></div>
                </div>
                {formData.ingredienti && <div style={{ marginBottom: 16 }}><label style={styles.label}>Ingredienti</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.ingredienti}</div></div>}
                {formData.allergeni && <div style={{ marginBottom: 16 }}><label style={styles.label}>Allergeni</label><div style={{ padding: '10px 12px', background: '#f5f5f5', borderRadius: 6, fontSize: 14, color: '#333' }}>{formData.allergeni}</div></div>}
              </div>
            </div>
          ) : (
            // Modalita modifica
            <form onSubmit={handleSubmit}>
            {/* Campi base */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16, marginBottom: 16 }}>
              <div>
                <label style={styles.label}>Nome</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Categoria</label>
                <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} style={styles.input}>
                  {categorie.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Unita</label>
                <select value={formData.unita} onChange={(e) => setFormData({ ...formData, unita: e.target.value })} style={styles.input}>
                  {unitaOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Immagine (URL)</label>
              <input type="text" value={formData.immagine} onChange={(e) => setFormData({ ...formData, immagine: e.target.value })} style={styles.input} placeholder="https://..." />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Descrizione</label>
              <textarea value={formData.descrizione} onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })} style={{ ...styles.input, minHeight: 80 }} />
            </div>
            
            {/* Informazioni Etichetta */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 20, marginTop: 20, marginBottom: 16 }}>
              <h4 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: '#1a3a2a', marginBottom: 16 }}>Informazioni Etichetta</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={styles.label}>Categoria Etichetta</label>
                  <select value={formData.categoria_etichetta} onChange={(e) => setFormData({ ...formData, categoria_etichetta: e.target.value })} style={styles.input}>
                    <option value="ortaggio_fresco">Ortaggio Fresco</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Origine</label>
                  <input type="text" value={formData.origine} onChange={(e) => setFormData({ ...formData, origine: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Peso Netto</label>
                  <input type="text" value={formData.peso_netto} onChange={(e) => setFormData({ ...formData, peso_netto: e.target.value })} style={styles.input} placeholder="es. 1 kg / 500g" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Ingredienti</label>
                <textarea value={formData.ingredienti} onChange={(e) => setFormData({ ...formData, ingredienti: e.target.value })} style={{ ...styles.input, minHeight: 60 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Allergeni</label>
                <input type="text" value={formData.allergeni} onChange={(e) => setFormData({ ...formData, allergeni: e.target.value })} style={styles.input} placeholder="es. Contiene GLUTINE" />
              </div>
            </div>
            
            {/* Valori Nutrizionali */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 20, marginBottom: 20 }}>
              <h4 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: '#1a3a2a', marginBottom: 16 }}>Valori Nutrizionali (per 100g)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: 12 }}>
                <div>
                  <label style={styles.label}>Energia (kJ)</label>
                  <input type="number" step="0.1" value={formData.energia_kj} onChange={(e) => setFormData({ ...formData, energia_kj: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Energia (kcal)</label>
                  <input type="number" step="0.1" value={formData.energia_kcal} onChange={(e) => setFormData({ ...formData, energia_kcal: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Grassi (g)</label>
                  <input type="number" step="0.1" value={formData.grassi} onChange={(e) => setFormData({ ...formData, grassi: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>di cui Saturi (g)</label>
                  <input type="number" step="0.1" value={formData.grassi_saturi} onChange={(e) => setFormData({ ...formData, grassi_saturi: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Carboidrati (g)</label>
                  <input type="number" step="0.1" value={formData.carboidrati} onChange={(e) => setFormData({ ...formData, carboidrati: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>di cui Zuccheri (g)</label>
                  <input type="number" step="0.1" value={formData.zuccheri} onChange={(e) => setFormData({ ...formData, zuccheri: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Fibre (g)</label>
                  <input type="number" step="0.1" value={formData.fibre} onChange={(e) => setFormData({ ...formData, fibre: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Proteine (g)</label>
                  <input type="number" step="0.1" value={formData.proteine} onChange={(e) => setFormData({ ...formData, proteine: e.target.value })} style={styles.input} />
                </div>
                <div>
                  <label style={styles.label}>Sale (g)</label>
                  <input type="number" step="0.01" value={formData.sale} onChange={(e) => setFormData({ ...formData, sale: e.target.value })} style={styles.input} />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </form>
          )}
        </div>

        {/* Sezione Lotti */}
        <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? 16 : 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className={playfair.className} style={{ color: '#1a3a2a', fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0 }}>Lotti</h3>
            <a 
              href="/admin/tracciabilita" 
              style={{ padding: '10px 20px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
            >
              + Nuovo Lotto
            </a>
          </div>

          {/* Form Modifica Lotto */}
          {showLottoForm && editingLotto && (
            <div style={{ background: '#f8f8f8', borderRadius: 10, padding: isMobile ? 14 : 20, marginBottom: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: '#1a3a2a', marginBottom: 16 }}>Modifica Lotto</h4>
              <form onSubmit={handleLottoSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
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
                    <label style={styles.label}>Prezzo (€/{selectedProdotto.unita})</label>
                    <input type="number" step="0.01" value={lottoFormData.prezzo} onChange={(e) => setLottoFormData({ ...lottoFormData, prezzo: e.target.value })} style={styles.input} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
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
                    {saving ? 'Salvataggio...' : 'Aggiorna Lotto'}
                  </button>
                  <button type="button" onClick={resetLottoForm} style={{ padding: '10px 24px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista Lotti */}
          {lottiProdotto.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: 20 }}>Nessun lotto presente</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lottiProdotto.map(lotto => (
                <div key={lotto.id} style={{ 
                  background: lotto.attivo ? '#f9fafb' : '#f3f4f6', 
                  borderRadius: 10, 
                  padding: isMobile ? 14 : 18,
                  border: lotto.attivo ? '1px solid #e5e7eb' : '1px solid #d1d5db',
                  opacity: lotto.attivo ? 1 : 0.7,
                }}>
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? 12 : 0 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#1a3a2a' }}>{lotto.codice_lotto}</span>
                        {!lotto.attivo && <span style={{ background: '#9ca3af', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10 }}>INATTIVO</span>}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 16, fontSize: 13, color: '#666' }}>
                        <div><strong>Campo:</strong> {lotto.campo || '-'}</div>
                        <div><strong>Comune:</strong> {lotto.comune || '-'}</div>
                        <div><strong>Prezzo:</strong> €{Number(lotto.prezzo).toFixed(2)}/{selectedProdotto.unita}</div>
                        <div><strong>TMC:</strong> {lotto.tmc || '-'}</div>
                        <div><strong>Raccolta:</strong> {lotto.data_raccolta ? new Date(lotto.data_raccolta).toLocaleDateString('it-IT') : '-'}</div>
                        <div>
                          <strong>Disponibili:</strong> 
                          <span style={{ color: Number(lotto.kg_disponibili) < 50 ? '#dc2626' : '#1a3a2a', fontWeight: 600 }}> {lotto.kg_disponibili}</span>/{lotto.kg_totali} kg
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 8, alignItems: isMobile ? 'stretch' : 'flex-end' }}>
                      <button onClick={() => handlePrintQR(lotto, selectedProdotto.nome)} style={{ padding: '8px 14px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Stampa QR</button>
                      <button onClick={() => handleEditLotto(lotto)} style={{ padding: '8px 14px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Modifica</button>
                      <button onClick={() => handleDeleteLotto(lotto)} style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Elimina</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // LIST VIEW - Lista prodotti per categoria
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 12 : 0, marginBottom: isMobile ? 20 : 32 }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: isMobile ? 22 : 32, fontWeight: 700 }}>Prodotti</h1>
        <button onClick={() => { resetForm(); setShowNewProdottoForm(true) }} style={{ padding: isMobile ? '10px 16px' : '12px 24px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 8, fontSize: isMobile ? 13 : 14, fontWeight: 600, cursor: 'pointer' }}>
          + Nuovo Prodotto
        </button>
      </div>

      {/* Form nuovo prodotto */}
      {showNewProdottoForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? 16 : 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#1a3a2a', fontSize: isMobile ? 16 : 18, fontWeight: 600, marginBottom: 20 }}>Nuovo Prodotto</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={styles.label}>Nome</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Categoria</label>
                <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} style={styles.input}>
                  {categorie.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Unita</label>
                <select value={formData.unita} onChange={(e) => setFormData({ ...formData, unita: e.target.value })} style={styles.input}>
                  {unitaOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Descrizione</label>
              <textarea value={formData.descrizione} onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })} style={{ ...styles.input, minHeight: 60 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Salvataggio...' : 'Crea Prodotto'}
              </button>
              <button type="button" onClick={() => { setShowNewProdottoForm(false); resetForm() }} style={{ padding: '10px 24px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista per categoria */}
      {categorie.map(cat => {
        const prodottiCat = prodottiByCategoria[cat]
        if (prodottiCat.length === 0) return null
        
        return (
          <div key={cat} style={{ marginBottom: isMobile ? 24 : 32 }}>
            <h2 style={{ color: '#1a3a2a', fontSize: isMobile ? 16 : 20, fontWeight: 600, marginBottom: 12, textTransform: 'capitalize', borderBottom: '2px solid #c9933a', paddingBottom: 8 }}>
              {cat}
            </h2>
            
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {prodottiCat.map((prodotto, idx) => {
                const totaleTotale = getTotaleTotale(prodotto.id)
                const isEmpty = totaleTotale === 0
                const lottiAttiviCount = getLottiAttiviCount(prodotto.id)
                const isExpanded = expandedProdottoId === prodotto.id
                const lottiProdotto = getLottiForProdotto(prodotto.id)
                
                return (
                  <div key={prodotto.id}>
                    <div 
                      style={{ 
                        padding: isMobile ? '14px 16px' : '16px 20px', 
                        borderBottom: (idx < prodottiCat.length - 1 && !isExpanded) ? '1px solid #f0f0f0' : 'none',
                        background: isEmpty ? '#f9fafb' : '#fff',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 12 : 16 }}>
                        {/* Info prodotto */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: '#1a3a2a' }}>{prodotto.nome}</span>
                            {!prodotto.attivo && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10 }}>NASCOSTO</span>}
                            {/* Badge lotti cliccabile */}
                            <button
                              onClick={() => setExpandedProdottoId(isExpanded ? null : prodotto.id)}
                              style={{
                                background: lottiAttiviCount > 0 ? '#e0f2fe' : '#f3f4f6',
                                color: lottiAttiviCount > 0 ? '#0369a1' : '#6b7280',
                                border: 'none',
                                fontSize: 11,
                                padding: '3px 10px',
                                borderRadius: 12,
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              {lottiAttiviCount} {lottiAttiviCount === 1 ? 'lotto' : 'lotti'}
                              <span style={{ fontSize: 10, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                            </button>
                          </div>
                          
                          {/* Progress bar e kg totali */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1, maxWidth: 200, background: '#e5e7eb', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                              <div style={{
                                width: isEmpty ? '0%' : '100%',
                                height: '100%',
                                background: isEmpty ? '#dc2626' : '#22c55e',
                                borderRadius: 4,
                              }} />
                            </div>
                            <span style={{ fontSize: 13, color: isEmpty ? '#dc2626' : '#666', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {totaleTotale.toFixed(0)} kg
                            </span>
                          </div>
                        </div>
                        
                        {/* Bottoni */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/admin/prodotti/${prodotto.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ attivo: !prodotto.attivo }),
                                })
                                if (res.ok) {
                                  mutate('/api/admin/prodotti')
                                }
                              } catch (error) {
                                console.error('Error toggling attivo:', error)
                              }
                            }}
                            style={{ 
                              padding: '8px 14px', 
                              background: prodotto.attivo ? '#22c55e' : '#f59e0b', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: 6, 
                              fontSize: 12, 
                              fontWeight: 600, 
                              cursor: 'pointer' 
                            }}
                          >
                            {prodotto.attivo ? 'Attivo' : 'Nascosto'}
                          </button>
                          <button 
                            onClick={() => setDetailProdotto(prodotto)}
                            style={{ padding: '8px 14px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Dettagli
                          </button>
                          <button 
                            onClick={() => handleSelectProdotto(prodotto, false)}
                            style={{ padding: '8px 14px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Modifica
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sezione espansa lotti inline */}
                    {isExpanded && lottiProdotto.length > 0 && (
                      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: idx < prodottiCat.length - 1 ? '1px solid #e2e8f0' : 'none', padding: isMobile ? 12 : 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {lottiProdotto.map(lotto => (
                            <div key={lotto.id} style={{ 
                              background: '#fff', 
                              borderRadius: 10, 
                              padding: isMobile ? 12 : 16,
                              border: lotto.attivo ? '1px solid #e5e7eb' : '1px solid #d1d5db',
                              opacity: lotto.attivo ? 1 : 0.7,
                            }}>
                              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 16, alignItems: isMobile ? 'stretch' : 'flex-start' }}>
                                {/* QR Code */}
                                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  <div style={{ background: '#fff', padding: 4, borderRadius: 6, border: '1px solid #e5e7eb' }}>
                                    <QRCode value={`https://gianniparisse.it/store/traccia/${lotto.codice_lotto}`} size={80} />
                                  </div>
                                  <span style={{ fontSize: 9, color: '#666', textTransform: 'uppercase' }}>Traccia</span>
                                </div>
                                
                                {/* Info lotto */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{lotto.codice_lotto}</span>
                                    {!lotto.attivo && <span style={{ background: '#9ca3af', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 8 }}>INATTIVO</span>}
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 8, fontSize: 12, color: '#555' }}>
                                    <div><strong>Campo:</strong> {lotto.campo || '-'}</div>
                                    <div><strong>Comune:</strong> {lotto.comune || '-'}</div>
                                    <div><strong>Raccolta:</strong> {lotto.data_raccolta ? new Date(lotto.data_raccolta).toLocaleDateString('it-IT') : '-'}</div>
                                    <div><strong>Disponibili:</strong> <span style={{ color: Number(lotto.kg_disponibili) < 50 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{lotto.kg_disponibili}</span>/{lotto.kg_totali} kg</div>
                                    <div><strong>Prezzo:</strong> €{Number(lotto.prezzo).toFixed(2)}/{prodotto.unita}</div>
                                    <div><strong>TMC:</strong> {lotto.tmc || '-'}</div>
                                  </div>
                                </div>
                                
                                {/* Bottoni lotto */}
                                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 6, flexShrink: 0 }}>
                                  <button 
                                    onClick={() => { handleSelectProdotto(prodotto, false); setTimeout(() => handleEditLotto(lotto), 100) }}
                                    style={{ padding: '6px 12px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                                  >
                                    Modifica
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteLotto(lotto)}
                                    style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                                  >
                                    Elimina
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {isExpanded && lottiProdotto.length === 0 && (
                      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: idx < prodottiCat.length - 1 ? '1px solid #e2e8f0' : 'none', padding: 16, textAlign: 'center', color: '#666', fontSize: 13 }}>
                        Nessun lotto presente per questo prodotto
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Sidebar Dettagli Prodotto */}
      {detailProdotto && (
        <>
          {/* Overlay */}
          <div 
            onClick={() => setDetailProdotto(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 100,
              backdropFilter: 'blur(2px)',
            }}
          />
          
          {/* Sidebar */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: isMobile ? '100%' : 480,
            height: '100vh',
            background: '#fff',
            zIndex: 101,
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header sidebar */}
            <div style={{
              padding: isMobile ? '16px 20px' : '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 className={playfair.className} style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>
                    {detailProdotto.nome}
                  </h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '4px 12px', 
                      borderRadius: 20, 
                      fontSize: 12, 
                      fontWeight: 500,
                      textTransform: 'capitalize',
                    }}>
                      {detailProdotto.categoria}
                    </span>
                    {detailProdotto.attivo ? (
                      <span style={{ background: '#22c55e', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Attivo</span>
                    ) : (
                      <span style={{ background: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Inattivo</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setDetailProdotto(null)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#fff',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  x
                </button>
              </div>
            </div>
            
            {/* Contenuto sidebar scrollabile */}
            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 20 : 32 }}>
              {/* Immagine prodotto */}
              {detailProdotto.immagine && (
                <div style={{ marginBottom: 24 }}>
                  <img 
                    src={detailProdotto.immagine} 
                    alt={detailProdotto.nome}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </div>
              )}
              
              {/* Descrizione */}
              {detailProdotto.descrizione && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: '#c9933a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Descrizione</h4>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>{detailProdotto.descrizione}</p>
                </div>
              )}
              
              {/* Info generali */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#c9933a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Informazioni</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  <div style={{ background: '#f8f8f8', padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Unita</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a3a2a' }}>{detailProdotto.unita}</div>
                  </div>
                  <div style={{ background: '#f8f8f8', padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Prezzo Base</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a3a2a' }}>{detailProdotto.prezzo_base ? `€${Number(detailProdotto.prezzo_base).toFixed(2)}` : '-'}</div>
                  </div>
                  <div style={{ background: '#f8f8f8', padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Origine</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a' }}>{detailProdotto.origine || 'Non specificata'}</div>
                  </div>
                  <div style={{ background: '#f8f8f8', padding: 14, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Peso Netto</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a' }}>{detailProdotto.peso_netto || '-'}</div>
                  </div>
                </div>
              </div>
              
              {/* Ingredienti e Allergeni */}
              {(detailProdotto.ingredienti || detailProdotto.allergeni) && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: '#c9933a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Etichetta</h4>
                  {detailProdotto.ingredienti && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 }}>Ingredienti</div>
                      <p style={{ fontSize: 13, color: '#333', margin: 0, lineHeight: 1.5 }}>{detailProdotto.ingredienti}</p>
                    </div>
                  )}
                  {detailProdotto.allergeni && (
                    <div style={{ 
                      background: '#fef2f2', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1px solid #fecaca',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>ALLERGENI</div>
                      <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 500 }}>{detailProdotto.allergeni}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Valori nutrizionali */}
              {detailProdotto.valori_nutrizionali && Object.values(detailProdotto.valori_nutrizionali).some(v => v !== null) && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: '#c9933a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Valori Nutrizionali (per 100g)</h4>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                    {[
                      { label: 'Energia', value: detailProdotto.valori_nutrizionali.energia_kcal ? `${detailProdotto.valori_nutrizionali.energia_kcal} kcal` : null },
                      { label: 'Grassi', value: detailProdotto.valori_nutrizionali.grassi !== null ? `${detailProdotto.valori_nutrizionali.grassi} g` : null },
                      { label: '- di cui saturi', value: detailProdotto.valori_nutrizionali.grassi_saturi !== null ? `${detailProdotto.valori_nutrizionali.grassi_saturi} g` : null, indent: true },
                      { label: 'Carboidrati', value: detailProdotto.valori_nutrizionali.carboidrati !== null ? `${detailProdotto.valori_nutrizionali.carboidrati} g` : null },
                      { label: '- di cui zuccheri', value: detailProdotto.valori_nutrizionali.zuccheri !== null ? `${detailProdotto.valori_nutrizionali.zuccheri} g` : null, indent: true },
                      { label: 'Fibre', value: detailProdotto.valori_nutrizionali.fibre !== null ? `${detailProdotto.valori_nutrizionali.fibre} g` : null },
                      { label: 'Proteine', value: detailProdotto.valori_nutrizionali.proteine !== null ? `${detailProdotto.valori_nutrizionali.proteine} g` : null },
                      { label: 'Sale', value: detailProdotto.valori_nutrizionali.sale !== null ? `${detailProdotto.valori_nutrizionali.sale} g` : null },
                    ].filter(item => item.value !== null).map((item, idx) => (
                      <div 
                        key={item.label}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          padding: '10px 14px',
                          background: idx % 2 === 0 ? '#f9fafb' : '#fff',
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: '#555', paddingLeft: item.indent ? 12 : 0 }}>{item.label}</span>
                        <span style={{ fontWeight: 600, color: '#1a3a2a' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Statistiche lotti */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#c9933a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Magazzino</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{getLottiAttiviCount(detailProdotto.id)}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>Lotti Attivi</div>
                  </div>
                  <div style={{ background: '#fef3c7', padding: 14, borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#d97706' }}>{getTotaleDisponibile(detailProdotto.id).toFixed(0)}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>Kg Disponibili</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer sidebar */}
            <div style={{
              padding: isMobile ? '16px 20px' : '20px 32px',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              gap: 12,
            }}>
              <button
                onClick={() => { setDetailProdotto(null); handleSelectProdotto(detailProdotto, false) }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#c9933a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Modifica Prodotto
              </button>
              <a
                href="/admin/tracciabilita"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#1a3a2a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                + Nuovo Lotto
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
