'use client'

import { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Prodotto {
  id: number
  nome: string
  categoria: string
  unita: string
  attivo: boolean
}

interface Lotto {
  id: number
  prodotto_id: number
  codice_lotto: string
  campo: string
  kg_totali: number
  kg_disponibili: number
  attivo: boolean
  prodotto_nome: string
}

export default function AdminMagazzinoPage() {
  const { data: prodotti } = useSWR<Prodotto[]>('/api/admin/prodotti', fetcher)
  const { data: lotti } = useSWR<Lotto[]>('/api/admin/lotti', fetcher)
  const [editingLotto, setEditingLotto] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  const prodottiAttivi = prodotti?.filter(p => p.attivo) || []
  
  const getLottiForProdotto = (prodottoId: number) => 
    lotti?.filter(l => l.prodotto_id === prodottoId && l.attivo) || []

  const getTotaleDisponibile = (prodottoId: number) => {
    const lottiProdotto = getLottiForProdotto(prodottoId)
    return lottiProdotto.reduce((sum, l) => sum + (Number(l.kg_disponibili) || 0), 0)
  }

  const getTotaleTotale = (prodottoId: number) => {
    const lottiProdotto = getLottiForProdotto(prodottoId)
    return lottiProdotto.reduce((sum, l) => sum + (Number(l.kg_totali) || 0), 0)
  }

  const handleUpdateKg = async (lottoId: number) => {
    setSaving(true)
    const lotto = lotti?.find(l => l.id === lottoId)
    if (lotto) {
      try {
        await fetch(`/api/admin/lotti/${lottoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lotto, kg_disponibili: parseFloat(editValue) || 0 }),
        })
        mutate('/api/admin/lotti')
      } catch (error) {
        console.error('Error updating kg:', error)
      }
    }
    setEditingLotto(null)
    setSaving(false)
  }

  return (
    <div>
      <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Magazzino</h1>

      {prodottiAttivi.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Nessun prodotto attivo</p>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {prodottiAttivi.map(prodotto => {
            const lottiProdotto = getLottiForProdotto(prodotto.id)
            const totaleDisponibile = getTotaleDisponibile(prodotto.id)
            const totaleTotale = getTotaleTotale(prodotto.id)
            const percentuale = totaleTotale > 0 ? (totaleDisponibile / totaleTotale) * 100 : 0
            const isLow = totaleDisponibile < 50

            return (
              <div key={prodotto.id} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: isLow ? '2px solid #dc2626' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ color: '#1a3a2a', fontSize: 18, fontWeight: 600, margin: 0 }}>{prodotto.nome}</h3>
                    <span style={{ color: '#666', fontSize: 13, textTransform: 'capitalize' }}>{prodotto.categoria}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: isLow ? '#dc2626' : '#1a3a2a' }}>{totaleDisponibile.toFixed(1)} kg</div>
                    <div style={{ fontSize: 13, color: '#666' }}>di {totaleTotale.toFixed(1)} kg totali</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ background: '#f0f0f0', borderRadius: 8, height: 12, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(percentuale, 100)}%`,
                    height: '100%',
                    background: isLow ? '#dc2626' : percentuale < 30 ? '#f59e0b' : '#22c55e',
                    borderRadius: 8,
                    transition: 'width 0.3s',
                  }} />
                </div>

                {isLow && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
                    Attenzione: scorte basse!
                  </div>
                )}

                {/* Lista Lotti */}
                {lottiProdotto.length > 0 && (
                  <div>
                    <h4 style={{ color: '#666', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Lotti Attivi</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Codice</th>
                          <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Campo</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Disponibili</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Totali</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Azione</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lottiProdotto.map(lotto => (
                          <tr key={lotto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '10px 0', fontSize: 13, color: '#1a3a2a', fontWeight: 500 }}>{lotto.codice_lotto}</td>
                            <td style={{ padding: '10px 0', fontSize: 13, color: '#666' }}>{lotto.campo || '-'}</td>
                            <td style={{ padding: '10px 0', fontSize: 13, color: '#333', textAlign: 'right' }}>
                              {editingLotto === lotto.id ? (
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  style={{ width: 80, padding: '4px 8px', border: '1px solid #c9933a', borderRadius: 4, fontSize: 13, textAlign: 'right' }}
                                  autoFocus
                                />
                              ) : (
                                <span>{lotto.kg_disponibili} kg</span>
                              )}
                            </td>
                            <td style={{ padding: '10px 0', fontSize: 13, color: '#666', textAlign: 'right' }}>{lotto.kg_totali} kg</td>
                            <td style={{ padding: '10px 0', textAlign: 'right' }}>
                              {editingLotto === lotto.id ? (
                                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                  <button onClick={() => handleUpdateKg(lotto.id)} disabled={saving} style={{ background: '#1a3a2a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Salva</button>
                                  <button onClick={() => setEditingLotto(null)} style={{ background: '#e0e0e0', color: '#666', border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Annulla</button>
                                </div>
                              ) : (
                                <button onClick={() => { setEditingLotto(lotto.id); setEditValue(lotto.kg_disponibili?.toString() || '0') }} style={{ background: 'transparent', border: '1px solid #c9933a', color: '#c9933a', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Modifica</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {lottiProdotto.length === 0 && (
                  <p style={{ color: '#999', fontSize: 13 }}>Nessun lotto attivo per questo prodotto</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
