'use client'

import { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import useSWR, { mutate } from 'swr'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

const stati = ['tutti', 'nuovo', 'in_lavorazione', 'spedito', 'consegnato']
const statoColors: Record<string, { bg: string; text: string }> = {
  nuovo: { bg: '#dbeafe', text: '#1e40af' },
  in_lavorazione: { bg: '#fef3c7', text: '#92400e' },
  spedito: { bg: '#d1fae5', text: '#065f46' },
  consegnato: { bg: '#e0e7ff', text: '#3730a3' },
}

interface Ordine {
  id: number
  nome: string
  email: string
  telefono: string
  indirizzo: string
  citta: string
  cap: string
  note: string
  items: any[]
  totale_articoli: number
  stato: string
  created_at: string
}

export default function AdminOrdiniPage() {
  const [filtroStato, setFiltroStato] = useState('tutti')
  const [expandedOrdine, setExpandedOrdine] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  
  const url = filtroStato === 'tutti' ? '/api/admin/ordini' : `/api/admin/ordini?stato=${filtroStato}`
  const { data: ordini, error } = useSWR<Ordine[]>(url, fetcher)

  const handleChangeStato = async (ordineId: number, nuovoStato: string) => {
    setUpdating(ordineId)
    try {
      await fetch(`/api/admin/ordini/${ordineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stato: nuovoStato }),
      })
      mutate(url)
    } catch (error) {
      console.error('Error updating stato:', error)
    }
    setUpdating(null)
  }

  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', background: '#fef2f2', borderRadius: 12 }}><p style={{ color: '#dc2626' }}>Errore nel caricamento ordini</p></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className={playfair.className} style={{ color: '#1a3a2a', fontSize: 32, fontWeight: 700 }}>Ordini</h1>
        <span style={{ color: '#666', fontSize: 14 }}>{ordini?.length || 0} ordini</span>
      </div>

      {/* Filtri */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {stati.map(stato => (
          <button
            key={stato}
            onClick={() => setFiltroStato(stato)}
            style={{
              padding: '8px 16px',
              background: filtroStato === stato ? '#1a3a2a' : '#fff',
              color: filtroStato === stato ? '#fff' : '#666',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {stato.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lista Ordini */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {!ordini || ordini.length === 0 ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#666' }}>Nessun ordine trovato</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Data</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Articoli</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Stato</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#666' }}>Dettagli</th>
              </tr>
            </thead>
            <tbody>
              {ordini.map(ordine => {
                const statoStyle = statoColors[ordine.stato] || statoColors.nuovo
                const isExpanded = expandedOrdine === ordine.id
                
                return (
                  <>
                    <tr key={ordine.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#1a3a2a', fontWeight: 600 }}>#{ordine.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{new Date(ordine.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#333' }}>{ordine.nome}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#666' }}>{ordine.totale_articoli} articoli</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statoStyle.bg, color: statoStyle.text, textTransform: 'capitalize' }}>{ordine.stato?.replace('_', ' ')}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button onClick={() => setExpandedOrdine(isExpanded ? null : ordine.id)} style={{ background: '#f0f0f0', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer', color: '#1a3a2a' }}>{isExpanded ? 'Chiudi' : 'Vedi'}</button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr key={`${ordine.id}-details`}>
                        <td colSpan={6} style={{ padding: 0, background: '#f9f9f9' }}>
                          <div style={{ padding: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 24 }}>
                              {/* Dati Cliente */}
                              <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                                <h4 style={{ color: '#1a3a2a', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Dati Cliente</h4>
                                <p style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><strong>Nome:</strong> {ordine.nome}</p>
                                <p style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><strong>Email:</strong> {ordine.email}</p>
                                <p style={{ fontSize: 13, color: '#333', marginBottom: 4 }}><strong>Telefono:</strong> {ordine.telefono}</p>
                              </div>
                              
                              {/* Indirizzo */}
                              <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                                <h4 style={{ color: '#1a3a2a', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Indirizzo Consegna</h4>
                                <p style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>{ordine.indirizzo}</p>
                                <p style={{ fontSize: 13, color: '#333' }}>{ordine.cap} {ordine.citta}</p>
                                {ordine.note && <p style={{ fontSize: 13, color: '#666', marginTop: 8 }}><strong>Note:</strong> {ordine.note}</p>}
                              </div>
                              
                              {/* Cambia Stato */}
                              <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                                <h4 style={{ color: '#1a3a2a', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Cambia Stato</h4>
                                <select
                                  value={ordine.stato}
                                  onChange={(e) => handleChangeStato(ordine.id, e.target.value)}
                                  disabled={updating === ordine.id}
                                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                                >
                                  <option value="nuovo">Nuovo</option>
                                  <option value="in_lavorazione">In Lavorazione</option>
                                  <option value="spedito">Spedito</option>
                                  <option value="consegnato">Consegnato</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Prodotti */}
                            <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                              <h4 style={{ color: '#1a3a2a', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Prodotti Ordinati</h4>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Prodotto</th>
                                    <th style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#666' }}>Quantita</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(ordine.items || []).map((item: any, idx: number) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                      <td style={{ padding: '10px 0', fontSize: 13, color: '#333' }}>{item.prodotto?.nome || item.nome || 'Prodotto'}</td>
                                      <td style={{ padding: '10px 0', fontSize: 13, color: '#666', textAlign: 'center' }}>{item.quantita || 1}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
