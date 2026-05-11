'use client'

import { useState, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'
import QRCode from '@/components/QRCode'

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
  const [isMobile, setIsMobile] = useState(false)
  
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

  const handleDeleteLotto = async (lotto: Lotto) => {
    if (!confirm(`Eliminare il lotto "${lotto.codice_lotto}"?`)) return
    try {
      await fetch(`/api/admin/lotti/${lotto.id}`, { method: 'DELETE' })
      mutate('/api/admin/lotti')
    } catch (error) {
      console.error('Error deleting lotto:', error)
    }
  }

  const openNewLottoForm = (prodottoId: number) => {
    setLottoFormData({ ...lottoFormData, prodotto_id: prodottoId })
    setShowLottoForm(prodottoId)
    setExpandedProdotto(prodottoId)
  }

  const getLottiForProdotto = (prodottoId: number) => lotti?.filter(l => l.prodotto_id === prodottoId) || []

  if (prodottiError) {
    return <div style={{ padding: 20, textAlign: 'center', background: '#fef2f2', borderRadius: 8 }}><p style={{ color: '#dc2626', fontSize: 13 }}>Errore caricamento</p></div>
  }

  const prodottiByCategoria = categorie.reduce((acc, cat) => {
    acc[cat] = prodotti?.filter(p => p.categoria === cat) || []
    return acc
  }, {} as Record<string, Prodotto[]>)

  // Stili responsive
  const styles = {
    header: {
      display: 'flex',
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      justifyContent: 'space-between',
      alignItems: isMobile ? 'stretch' : 'center',
      gap: isMobile ? 12 : 0,
      marginBottom: isMobile ? 20 : 32,
    },
    title: {
      color: '#1a3a2a',
      fontSize: isMobile ? 22 : 32,
      fontWeight: 700,
    },
    addBtn: {
      padding: isMobile ? '10px 16px' : '12px 24px',
      background: '#c9933a',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: isMobile ? 13 : 14,
      fontWeight: 600,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? 12 : 16,
      marginBottom: isMobile ? 12 : 16,
    },
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
    catTitle: {
      color: '#1a3a2a',
      fontSize: isMobile ? 15 : 18,
      fontWeight: 600,
      marginBottom: isMobile ? 10 : 16,
      textTransform: 'capitalize' as const,
      borderBottom: '2px solid #c9933a',
      paddingBottom: 8,
    },
    card: {
      background: '#fff',
      borderRadius: 10,
      padding: isMobile ? 12 : 16,
      marginBottom: isMobile ? 10 : 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    },
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 className={playfair.className} style={styles.title}>Prodotti</h1>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Nuovo Prodotto</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 10, padding: isMobile ? 16 : 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#1a3a2a', fontSize: isMobile ? 15 : 18, fontWeight: 600, marginBottom: isMobile ? 14 : 20 }}>{editingProdotto ? 'Modifica' : 'Nuovo Prodotto'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
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
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16, marginBottom: isMobile ? 12 : 16 }}>
              <div>
                <label style={styles.label}>Prezzo Base</label>
                <input type="number" step="0.01" value={formData.prezzo_base} onChange={(e) => setFormData({ ...formData, prezzo_base: e.target.value })} style={styles.input} />
              </div>
              <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: isMobile ? 12 : 14 }}>
                  <input type="checkbox" checked={formData.attivo} onChange={(e) => setFormData({ ...formData, attivo: e.target.checked })} />
                  Attivo
                </label>
              </div>
            </div>
            <div style={{ marginBottom: isMobile ? 12 : 16 }}>
              <label style={styles.label}>Descrizione</label>
              <textarea value={formData.descrizione} onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })} style={{ ...styles.input, minHeight: 60 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ padding: isMobile ? '8px 14px' : '10px 20px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 6, fontSize: isMobile ? 12 : 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Salvo...' : 'Salva'}</button>
              <button type="button" onClick={resetForm} style={{ padding: isMobile ? '8px 14px' : '10px 20px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 6, fontSize: isMobile ? 12 : 14, cursor: 'pointer' }}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      {categorie.map(categoria => {
        const prodottiCat = prodottiByCategoria[categoria]
        if (!prodottiCat || prodottiCat.length === 0) return null
        
        return (
          <div key={categoria} style={{ marginBottom: isMobile ? 20 : 32 }}>
            <h2 style={styles.catTitle}>{categoria}</h2>
            
            {isMobile ? (
              // Mobile: Card view
              <div>
                {prodottiCat.map(prodotto => {
                  const lottiProdotto = getLottiForProdotto(prodotto.id)
                  const isExpanded = expandedProdotto === prodotto.id
                  
                  return (
                    <div key={prodotto.id} style={styles.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2a' }}>{prodotto.nome}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>{prodotto.prezzo_base ? `€${Number(prodotto.prezzo_base).toFixed(2)}/${prodotto.unita}` : '-'}</div>
                        </div>
                        <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: prodotto.attivo ? '#d1fae5' : '#fee2e2', color: prodotto.attivo ? '#065f46' : '#dc2626' }}>{prodotto.attivo ? 'Attivo' : 'Off'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <button onClick={() => openNewLottoForm(prodotto.id)} style={{ background: '#c9933a', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>+ Lotto</button>
                        <button onClick={() => handleEdit(prodotto)} style={{ background: 'transparent', border: '1px solid #c9933a', color: '#c9933a', padding: '5px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Modifica</button>
                        <button onClick={() => handleToggleAttivo(prodotto)} style={{ background: 'transparent', border: '1px solid #999', color: '#666', padding: '5px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{prodotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                        <button onClick={() => setExpandedProdotto(isExpanded ? null : prodotto.id)} style={{ background: '#f0f0f0', border: 'none', padding: '5px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: '#1a3a2a' }}>{lottiProdotto.length} lotti {isExpanded ? '▲' : '▼'}</button>
                      </div>
                      
                      {isExpanded && (
                        <div style={{ background: '#f9f9f9', borderRadius: 6, padding: 10, marginTop: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#1a3a2a' }}>Lotti</span>
                            <button onClick={() => { setLottoFormData({ ...lottoFormData, prodotto_id: prodotto.id }); setShowLottoForm(prodotto.id) }} style={{ padding: '4px 8px', background: '#c9933a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>+ Nuovo</button>
                          </div>
                          
                          {showLottoForm === prodotto.id && (
                            <div style={{ background: '#fff', padding: 10, borderRadius: 6, marginBottom: 10, border: '1px solid #e0e0e0' }}>
                              <form onSubmit={handleLottoSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Codice</label><input type="text" value={lottoFormData.codice_lotto} onChange={(e) => setLottoFormData({ ...lottoFormData, codice_lotto: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} required /></div>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Prezzo</label><input type="number" step="0.01" value={lottoFormData.prezzo} onChange={(e) => setLottoFormData({ ...lottoFormData, prezzo: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} /></div>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Kg Totali</label><input type="number" value={lottoFormData.kg_totali} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_totali: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} /></div>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Kg Disp.</label><input type="number" value={lottoFormData.kg_disponibili} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_disponibili: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} /></div>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Campo</label><input type="text" value={lottoFormData.campo} onChange={(e) => setLottoFormData({ ...lottoFormData, campo: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} /></div>
                                  <div><label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 }}>Comune</label><input type="text" value={lottoFormData.comune} onChange={(e) => setLottoFormData({ ...lottoFormData, comune: e.target.value })} style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button type="submit" disabled={saving} style={{ padding: '6px 10px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>{saving ? '...' : 'Salva'}</button>
                                  <button type="button" onClick={resetLottoForm} style={{ padding: '6px 10px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Annulla</button>
                                </div>
                              </form>
                            </div>
                          )}
                          
                          {lottiProdotto.length === 0 ? (
                            <p style={{ fontSize: 11, color: '#999' }}>Nessun lotto</p>
                          ) : (
lottiProdotto.map(lotto => (
                                              <div key={lotto.id} style={{ background: '#fff', padding: 8, borderRadius: 4, marginBottom: 6, border: '1px solid #eee' }}>
                                                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                  <div style={{ flexShrink: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                                    <QRCode key={`qr-mobile-${lotto.id}`} value={`https://gianniparisse.it/store/traccia/${lotto.codice_lotto}`} size={48} />
                                                  </div>
                                                  <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1a3a2a' }}>{lotto.codice_lotto}</span>
                                                      <span style={{ padding: '2px 6px', borderRadius: 8, fontSize: 9, background: lotto.attivo ? '#d1fae5' : '#fee2e2', color: lotto.attivo ? '#065f46' : '#dc2626' }}>{lotto.attivo ? 'On' : 'Off'}</span>
                                                    </div>
                                                    <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>€{Number(lotto.prezzo).toFixed(2)} | {lotto.kg_disponibili}/{lotto.kg_totali}kg</div>
                                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                      <button onClick={() => handleEditLotto(lotto)} style={{ background: 'transparent', border: 'none', color: '#c9933a', fontSize: 10, cursor: 'pointer', padding: 0 }}>Modifica</button>
                                                      <button onClick={() => handleToggleLottoAttivo(lotto)} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: 10, cursor: 'pointer', padding: 0 }}>{lotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                                                      <button onClick={() => handleDeleteLotto(lotto)} style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: 10, cursor: 'pointer', padding: 0, fontWeight: 600 }}>Elimina</button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              // Desktop: Table view
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
                              <button onClick={() => openNewLottoForm(prodotto.id)} style={{ background: '#c9933a', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', marginRight: 8 }}>+ Lotto</button>
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
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Codice Lotto</label><input type="text" value={lottoFormData.codice_lotto} onChange={(e) => setLottoFormData({ ...lottoFormData, codice_lotto: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} required /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Campo</label><input type="text" value={lottoFormData.campo} onChange={(e) => setLottoFormData({ ...lottoFormData, campo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Comune</label><input type="text" value={lottoFormData.comune} onChange={(e) => setLottoFormData({ ...lottoFormData, comune: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Prezzo</label><input type="number" step="0.01" value={lottoFormData.prezzo} onChange={(e) => setLottoFormData({ ...lottoFormData, prezzo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Data Semina</label><input type="date" value={lottoFormData.data_semina} onChange={(e) => setLottoFormData({ ...lottoFormData, data_semina: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Data Raccolta</label><input type="date" value={lottoFormData.data_raccolta} onChange={(e) => setLottoFormData({ ...lottoFormData, data_raccolta: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Kg Totali</label><input type="number" value={lottoFormData.kg_totali} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_totali: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a3a2a', marginBottom: 4 }}>Kg Disponibili</label><input type="number" value={lottoFormData.kg_disponibili} onChange={(e) => setLottoFormData({ ...lottoFormData, kg_disponibili: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} /></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                          <button type="submit" disabled={saving} style={{ padding: '8px 14px', background: '#1a3a2a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>{saving ? '...' : 'Salva'}</button>
                                          <button type="button" onClick={resetLottoForm} style={{ padding: '8px 14px', background: '#e0e0e0', color: '#666', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Annulla</button>
                                        </div>
                                      </form>
                                    </div>
                                  )}
                                  {lottiProdotto.length === 0 ? (
                                    <p style={{ color: '#999', fontSize: 13 }}>Nessun lotto</p>
                                  ) : (
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                      <thead>
                                                        <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                          <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666', width: 80 }}>QR</th>
                                                          <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Codice</th>
                                                          <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Campo</th>
                                                          <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Prezzo</th>
                                                          <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Disp.</th>
                                                          <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Stato</th>
                                                          <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#666' }}>Azioni</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {lottiProdotto.map(lotto => (
                                                          <tr key={lotto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                              <div style={{ display: 'inline-block', borderRadius: 4, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                                                                <QRCode key={`qr-desktop-${lotto.id}`} value={`https://gianniparisse.it/store/traccia/${lotto.codice_lotto}`} size={56} />
                                                              </div>
                                                            </td>
                                                            <td style={{ padding: '10px 12px', fontSize: 13, color: '#1a3a2a', fontWeight: 500 }}>{lotto.codice_lotto}</td>
                                                            <td style={{ padding: '10px 12px', fontSize: 13, color: '#666' }}>{lotto.campo || '-'}</td>
                                                            <td style={{ padding: '10px 12px', fontSize: 13, color: '#333', textAlign: 'right' }}>€{Number(lotto.prezzo).toFixed(2)}</td>
                                                            <td style={{ padding: '10px 12px', fontSize: 13, color: '#333', textAlign: 'right' }}>{lotto.kg_disponibili}/{lotto.kg_totali}kg</td>
                                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}><span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, background: lotto.attivo ? '#d1fae5' : '#fee2e2', color: lotto.attivo ? '#065f46' : '#dc2626' }}>{lotto.attivo ? 'On' : 'Off'}</span></td>
                                                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                                              <button onClick={() => handleEditLotto(lotto)} style={{ background: 'transparent', border: 'none', color: '#c9933a', fontSize: 12, cursor: 'pointer', marginRight: 8 }}>Modifica</button>
                                                              <button onClick={() => handleToggleLottoAttivo(lotto)} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer', marginRight: 8 }}>{lotto.attivo ? 'Disattiva' : 'Attiva'}</button>
                                                              <button onClick={() => handleDeleteLotto(lotto)} style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Elimina</button>
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
            )}
          </div>
        )
      })}
    </div>
  )
}
