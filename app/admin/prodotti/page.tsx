'use client'

import { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

const categorie = ['cereali', 'legumi', 'farine', 'ortaggi', 'trasformati', 'pasta']
const unitaOptions = ['kg', 'g', 'pz', 'l']

interface Prodotto {
  id: number
  nome: string
  categoria: string
  descrizione: string
  unita: string
  prezzo_base: number
  immagine: string
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
}

export default function AdminProdottiPage() {
  const { data: prodotti, error: prodottiError } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>('/api/admin/lotti', fetcher)
  
  const [showForm, setShowForm] = useState(false)
  const [editingProdotto, setEditingProdotto] = useState<Prodotto | null>(null)
  const [showLottoForm, setShowLottoForm] = useState<number | null>(null)
  const [editingLotto, setEditingLotto] = useState<Lotto | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedProdotto, setExpandedProdotto] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'cereali',
    descrizione: '',
    unita: 'kg',
    prezzo_base: '',
    immagine: '',
    attivo: true,
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
    certificazioni: '',
    note: '',
    attivo: true,
  })

  const resetForm = () => {
    setFormData({ nome: '', categoria: 'cereali', descrizione: '', unita: 'kg', prezzo_base: '', immagine: '', attivo: true })
    setEditingProdotto(null)
    setShowForm(false)
  }

  const resetLottoForm = () => {
    setLottoFormData({ prodotto_id: 0, codice_lotto: '', campo: '', comune: '', data_semina: '', data_raccolta: '', kg_totali: '', kg_disponibili: '', prezzo: '', certificazioni: '', note: '', attivo: true })
    setEditingLotto(null)
    setShowLottoForm(null)
  }

  const handleEdit = (prodotto: Prodotto) => {
    setFormData({
      nome: prodotto.nome,
      categoria: prodotto.categoria,
      descrizione: prodotto.descrizione || '',
      unita: prodotto.unita,
      prezzo_base: prodotto.prezzo_base?.toString() || '',
      immagine: prodotto.immagine || '',
      attivo: prodotto.attivo,
    })
    setEditingProdotto(prodotto)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingProdotto ? `/api/admin/prodotti/${editingProdotto.id}` : '/api/admin/prodotti'
      await fetch(url, {
        method: editingProdotto ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, prezzo_base: parseFloat(formData.prezzo_base) || 0 }),
      })
      mutate('/api/admin/prodotti')
      resetForm()
    } catch (error) {
      console.error('Error saving prodotto:', error)
    }
    setSaving(false)
  }

  const handleToggleAttivo = async (prodotto: Prodotto) => {
    try {
      await fetch(`/api/admin/prodotti/${prodotto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prodotto, attivo: !prodotto.attivo }),
      })
      mutate('/api/admin/prodotti')
    } catch (error) {
      console.error('Error toggling prodotto:', error)
    }
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
      certificazioni: lotto.certificazioni || '',
      note: lotto.note || '',
      attivo: lotto.attivo,
    })
    setEditingLotto(lotto)
    setShowLottoForm(lotto.prodotto_id)
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

  const handleToggleLottoAttivo = async (lotto: Lotto) => {
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

  const getLottiForProdotto = (prodottoId: number) => lotti?.filter(l => l.prodotto_id === prodottoId) || []

  if (prodottiError) {
    return <div style={{ padding: 40, textAlign: 'center', background: '#fef2f2', borderRadius: 12 }}><p style={{ color: '#dc2626' }}>Errore nel caricamento prodotti</p></div>
  }

  const prodottiByCategoria = categorie.reduce((acc, cat) => {
    acc[cat] = prodotti?.filter(p => p.categoria === cat) || []
    return acc
  }, {} as Record<string, Prodotto[]>)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: 32, fontWeight: 700 }}>Prodotti & Lotti</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Nuovo Prodotto</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#1a3a2a', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{editingProdotto ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Nome</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Categoria</label>
                <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                  {categorie.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Unita</label>
                <select value={formData.unita} onChange={(e) => setFormData({ ...formData, unita: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                  {unitaOptions.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Prezzo Base (EUR)</label>
                <input type="number" step="0.01" value={formData.prezzo_base} onChange={(e) => setFormData({ ...formData, prezzo_base: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Immagine (URL)</label>
                <input type="text" value={formData.immagine} onChange={(e) => setFormData({ ...formData, immagine: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.attivo} onChange={(e) => setFormData({ ...formData, attivo: e.target.checked })} />
                  <span style={{ fontSize: 14, color: '#1a3a2a' }}>Attivo</span>
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a3a2a', marginBottom: 6 }}>Descrizione</label>
              <textarea value={formData.descrizione} onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, minHeight: 80 }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Salvataggio...' : 'Salva'}</button>
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      {categorie.map(categoria => {
        const prodottiCat = prodottiByCategoria[categoria]
        if (!prodottiCat || prodottiCat.length === 0) return null
        
        return (
          <div key={categoria} style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#1a3a2a', fontSize: 18, fontWeight: 600, marginBottom: 16, textTransform: 'capitalize', borderBottom: '2px solid #c9933a', paddingBottom: 8 }}>{categoria}</h2>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f8f8' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Nome</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Prezzo</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Unita</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Stato</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Lotti</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {prodottiCat.map(prodotto => {
                    const lottiProdotto = getLottiForProdotto(prodotto.id)
                    const isExpanded = expandedProdotto === prodotto.id
                    
                    return (
                      <>
                        <tr key={prodotto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '14px 16px', fontSize: 14, color: '#1a3a2a', fontWeight: 500 }}>{prodotto.nome}</td>
                          <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{prodotto.prezzo_base ? `€${Number(prodotto.prezzo_base).toFixed(2)}` : '-'}</td>
                          <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{prodotto.unita}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: prodotto.attivo ? '#d1fae5' : '#fee2e2', color: prodotto.attivo ? '#065f46' : '#dc2626' }}>{prodotto.attivo ? 'Attivo' : 'Disattivo'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <button onClick={() => setExpandedProdotto(isExpanded ? null : prodotto.id)} style={{ background: '#f0f0f0', border: 'none', padding: '4px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer', color: '#1a3a2a' }}>{lottiProdotto.length} lotti {isExpanded ? '▲' : '▼'}</button>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button onClick={() => handleEdit(prodotto)} style={{ background: 'transparent', border: '1px solid #c9933a', color: '#c9933a', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', marginRight: 8 }}>Modifica</button>
                            <button onClick={() => handleToggleAttivo(prodotto)} style={{ background: 'transparent', border: '1px solid #999', color: '#666', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>{prodotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${prodotto.id}-lotti`}>
                            <td colSpan={6} style={{ padding: 0, background: '#f9f9f9' }}>
                              <div style={{ padding: '16px 24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                  <h4 style={{ color: '#1a3a2a', fontSize: 14, fontWeight: 600, margin: 0 }}>Lotti di {prodotto.nome}</h4>
                                  <button onClick={() => { setLottoFormData({ ...lottoFormData, prodotto_id: prodotto.id }); setShowLottoForm(prodotto.id) }} style={{ padding: '6px 12px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>+ Nuovo Lotto</button>
                                </div>
                                {showLottoForm === prodotto.id && (
                                  <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e0e0e0' }}>
                                    <form onSubmit={handleLottoSubmit}>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Codice Lotto</label><input type="text" value={lottoFormData.codice_lotto} onChange={(e) => setLottoFormData({ ...lottoFormData, codice_lotto: e.target.value })} placeholder="es. GRANO-2025-001" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} required /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Campo</label><input type="text" value={lottoFormData.campo} onChange={(e) => setLottoFormData({ ...lottoFormData, campo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Comune</label><input type="text" value={lottoFormData.comune} onChange={(e) => setLottoFormData({ ...lottoFormData, comune: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Prezzo (EUR)</label><input type="number" step="0.01" value={lottoFormData.prezzo} onChange={(e) => setLottoFormData({ ...lottoFormData, prezzo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                      </div>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Data Semina</label><input type="date" value={lottoFormData.data_semina} onChange={(e) => setLottoFormData({ ...lottoFormData, data_semina: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Data Raccolta</label><input type="date" value={lottoFormData.data_raccolta} onChange={(e) => setLottoFormData({ ...lottoFormData, data_raccolta: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Kg Totali</label><input type="number" value={lottoFormData.kg_totali} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_totali: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                        <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Kg Disponibili</label><input type="number" value={lottoFormData.kg_disponibili} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_disponibili: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }} /></div>
                                      </div>
                                      <div style={{ display: 'flex', gap: 8 }}>
                                        <button type="submit" disabled={saving} style={{ padding: '8px 16px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>{saving ? 'Salvataggio...' : 'Salva Lotto'}</button>
                                        <button type="button" onClick={resetLottoForm} style={{ padding: '8px 16px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>Annulla</button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                                {lottiProdotto.length === 0 ? <p style={{ color: '#666', fontSize: 13 }}>Nessun lotto</p> : (
                                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden' }}>
                                    <thead><tr style={{ background: '#f0f0f0' }}>
                                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Codice</th>
                                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Campo</th>
                                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Raccolta</th>
                                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Kg Disp.</th>
                                      <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Prezzo</th>
                                      <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Stato</th>
                                      <th style={{ textAlign: 'right', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Azioni</th>
                                    </tr></thead>
                                    <tbody>
                                      {lottiProdotto.map(lotto => (
                                        <tr key={lotto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#1a3a2a', fontWeight: 500 }}>{lotto.codice_lotto}</td>
                                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#666' }}>{lotto.campo || '-'}</td>
                                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#666' }}>{lotto.data_raccolta ? new Date(lotto.data_raccolta).toLocaleDateString('it-IT') : '-'}</td>
                                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#666' }}>{lotto.kg_disponibili} kg</td>
                                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#666' }}>{lotto.prezzo ? `€${lotto.prezzo}` : '-'}</td>
                                          <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: lotto.attivo ? '#d1fae5' : '#fee2e2', color: lotto.attivo ? '#065f46' : '#dc2626' }}>{lotto.attivo ? 'Attivo' : 'Disattivo'}</span></td>
                                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                            <button onClick={() => handleEditLotto(lotto)} style={{ background: 'transparent', border: 'none', color: '#c9933a', fontSize: 12, cursor: 'pointer', marginRight: 8 }}>Modifica</button>
                                            <button onClick={() => handleToggleLottoAttivo(lotto)} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer' }}>{lotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
      
      {(!prodotti || prodotti.length === 0) && <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Nessun prodotto presente. Clicca su "Nuovo Prodotto" per iniziare.</p>}
    </div>
  )
}
