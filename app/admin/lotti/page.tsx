'use client'

import { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'
import dynamic from 'next/dynamic'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Prodotto {
  id: number
  nome: string
  categoria: string
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
  certificazioni: string
  note: string
  attivo: boolean
  prodotto_nome: string
  prodotto_categoria: string
}

// QR Code component (client-side only)
const QRCodeCanvas = dynamic(
  () => import('qrcode.react').then(mod => mod.QRCodeCanvas),
  { ssr: false }
)

export default function AdminLottiPage() {
  const { data: lotti, error } = useSWR<Lotto[]>('/api/admin/lotti', fetcher)
  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  
  const [showForm, setShowForm] = useState(false)
  const [editingLotto, setEditingLotto] = useState<Lotto | null>(null)
  const [saving, setSaving] = useState(false)
  const [qrLotto, setQrLotto] = useState<Lotto | null>(null)
  
  const [formData, setFormData] = useState({
    prodotto_id: '',
    codice_lotto: '',
    campo: '',
    comune: '',
    data_semina: '',
    data_raccolta: '',
    kg_totali: '',
    kg_disponibili: '',
    prezzo: '',
    certificazioni: '',
    note: '',
    attivo: true,
  })

  const prodottiAttivi = prodotti?.filter(p => p.attivo) || []

  const resetForm = () => {
    setFormData({ prodotto_id: '', codice_lotto: '', campo: '', comune: '', data_semina: '', data_raccolta: '', kg_totali: '', kg_disponibili: '', prezzo: '', certificazioni: '', note: '', attivo: true })
    setEditingLotto(null)
    setShowForm(false)
  }

  const handleEdit = (lotto: Lotto) => {
    setFormData({
      prodotto_id: lotto.prodotto_id.toString(),
      codice_lotto: lotto.codice_lotto,
      campo: lotto.campo || '',
      comune: lotto.comune || '',
      data_semina: lotto.data_semina || '',
      data_raccolta: lotto.data_raccolta || '',
      kg_totali: lotto.kg_totali?.toString() || '',
      kg_disponibili: lotto.kg_disponibili?.toString() || '',
      prezzo: lotto.prezzo?.toString() || '',
      certificazioni: lotto.certificazioni || '',
      note: lotto.note || '',
      attivo: lotto.attivo,
    })
    setEditingLotto(lotto)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingLotto ? `/api/admin/lotti/${editingLotto.id}` : '/api/admin/lotti'
      await fetch(url, {
        method: editingLotto ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          prodotto_id: parseInt(formData.prodotto_id),
          kg_totali: parseFloat(formData.kg_totali) || 0,
          kg_disponibili: parseFloat(formData.kg_disponibili) || 0,
          prezzo: parseFloat(formData.prezzo) || 0,
        }),
      })
      mutate('/api/admin/lotti')
      resetForm()
    } catch (error) {
      console.error('Error saving lotto:', error)
    }
    setSaving(false)
  }

  const handleToggleAttivo = async (lotto: Lotto) => {
    try {
      await fetch(`/api/admin/lotti/${lotto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lotto, attivo: !lotto.attivo }),
      })
      mutate('/api/admin/lotti')
    } catch (error) {
      console.error('Error toggling lotto:', error)
    }
  }

  const downloadQR = () => {
    if (!qrLotto) return
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `QR-${qrLotto.codice_lotto}.png`
      link.href = url
      link.click()
    }
    setQrLotto(null)
  }

  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', background: '#fef2f2', borderRadius: 12 }}><p style={{ color: '#dc2626' }}>Errore nel caricamento lotti</p></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: 32, fontWeight: 700 }}>Lotti</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Nuovo Lotto</button>
      </div>

      {/* QR Modal */}
      {qrLotto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ color: '#1a3a2a', marginBottom: 16 }}>QR Code - {qrLotto.codice_lotto}</h3>
            <QRCodeCanvas id="qr-canvas" value={`https://gianniparisse.it/store/traccia/${qrLotto.codice_lotto}`} size={256} />
            <p style={{ color: '#666', fontSize: 12, marginTop: 12 }}>https://gianniparisse.it/store/traccia/{qrLotto.codice_lotto}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <button onClick={downloadQR} style={{ padding: '10px 20px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Scarica PNG</button>
              <button onClick={() => setQrLotto(null)} style={{ padding: '10px 20px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Chiudi</button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#1a3a2a', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{editingLotto ? 'Modifica Lotto' : 'Nuovo Lotto'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Prodotto</label>
                <select value={formData.prodotto_id} onChange={(e) => setFormData({ ...formData, prodotto_id: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} required>
                  <option value="">Seleziona...</option>
                  {prodottiAttivi.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Codice Lotto</label>
                <input type="text" value={formData.codice_lotto} onChange={(e) => setFormData({ ...formData, codice_lotto: e.target.value })} placeholder="es. GRANO-2025-001" style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Campo</label>
                <input type="text" value={formData.campo} onChange={(e) => setFormData({ ...formData, campo: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Comune</label>
                <input type="text" value={formData.comune} onChange={(e) => setFormData({ ...formData, comune: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Data Semina</label>
                <input type="date" value={formData.data_semina} onChange={(e) => setFormData({ ...formData, data_semina: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Data Raccolta</label>
                <input type="date" value={formData.data_raccolta} onChange={(e) => setFormData({ ...formData, data_raccolta: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Kg Totali</label>
                <input type="number" value={formData.kg_totali} onChange={(e) => setFormData({ ...formData, kg_totali: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Kg Disponibili</label>
                <input type="number" value={formData.kg_disponibili} onChange={(e) => setFormData({ ...formData, kg_disponibili: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Prezzo (EUR)</label>
                <input type="number" step="0.01" value={formData.prezzo} onChange={(e) => setFormData({ ...formData, prezzo: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Certificazioni</label>
                <input type="text" value={formData.certificazioni} onChange={(e) => setFormData({ ...formData, certificazioni: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.attivo} onChange={(e) => setFormData({ ...formData, attivo: e.target.checked })} />
                  <span style={{ fontSize: 14, color: '#1a3a2a' }}>Attivo</span>
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Note</label>
              <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, minHeight: 60 }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Salvataggio...' : 'Salva'}</button>
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista Lotti */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {!lotti || lotti.length === 0 ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#666' }}>Nessun lotto presente</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Codice</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Prodotto</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Campo</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Raccolta</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Kg Disp.</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Prezzo</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Stato</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {lotti.map(lotto => (
                <tr key={lotto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#1a3a2a', fontWeight: 500 }}>{lotto.codice_lotto}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#333' }}>{lotto.prodotto_nome}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{lotto.campo || '-'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{lotto.data_raccolta ? new Date(lotto.data_raccolta).toLocaleDateString('it-IT') : '-'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#333', textAlign: 'right' }}>{lotto.kg_disponibili} kg</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#666', textAlign: 'right' }}>{lotto.prezzo ? `€${Number(lotto.prezzo).toFixed(2)}` : '-'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: lotto.attivo ? '#d1fae5' : '#fee2e2', color: lotto.attivo ? '#065f46' : '#dc2626' }}>{lotto.attivo ? 'Attivo' : 'Disattivo'}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(lotto)} style={{ background: 'transparent', border: '1px solid #c9933a', color: '#c9933a', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', marginRight: 4 }}>Modifica</button>
                    <button onClick={() => setQrLotto(lotto)} style={{ background: '#1a3a2a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', marginRight: 4 }}>QR</button>
                    <button onClick={() => handleToggleAttivo(lotto)} style={{ background: 'transparent', border: '1px solid #999', color: '#666', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{lotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
