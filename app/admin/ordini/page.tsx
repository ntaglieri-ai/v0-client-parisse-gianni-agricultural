'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'

type CartItem = {
  id: string
  nome: string
  quantita: number
  cat: string
}

type Ordine = {
  id: number
  nome: string
  email: string
  telefono: string
  indirizzo: string
  citta: string
  cap: string
  note: string
  items: CartItem[]
  totale_articoli: number
  stato: string
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return Array.isArray(data) ? data : []
}

const STATI = [
  { id: 'nuovo', label: 'Nuovo', color: '#3498db' },
  { id: 'confermato', label: 'Confermato', color: '#27ae60' },
  { id: 'in_preparazione', label: 'In Preparazione', color: '#f39c12' },
  { id: 'spedito', label: 'Spedito', color: '#9b59b6' },
  { id: 'consegnato', label: 'Consegnato', color: '#1abc9c' },
  { id: 'annullato', label: 'Annullato', color: '#e74c3c' },
]

export default function AdminOrdiniPage() {
  const { data: ordini, error, isLoading } = useSWR<Ordine[]>('/api/ordini', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })
  const [filtroStato, setFiltroStato] = useState<string>('tutti')
  const [ordineAperto, setOrdineAperto] = useState<Ordine | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateStato = async (ordineId: number, nuovoStato: string) => {
    setIsUpdating(true)
    try {
      await fetch(`/api/ordini/${ordineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stato: nuovoStato }),
      })
      mutate('/api/ordini')
      if (ordineAperto && ordineAperto.id === ordineId) {
        setOrdineAperto({ ...ordineAperto, stato: nuovoStato })
      }
    } catch (err) {
      console.error('Error updating order:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const ordiniArray = Array.isArray(ordini) ? ordini : []
  const ordiniFiltrati = ordiniArray.filter(o => 
    filtroStato === 'tutti' || o.stato === filtroStato
  )

  const getStatoInfo = (stato: string) => 
    STATI.find(s => s.id === stato) || { id: stato, label: stato, color: '#666' }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}>
        <div style={{
          background: '#fff',
          padding: 40,
          borderRadius: 12,
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: 16 }}>Errore</h2>
          <p>Impossibile caricare gli ordini</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: "'Lato', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: '#1a3a2a',
        padding: '24px 40px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            margin: 0,
          }}>
            Gestione Ordini
          </h1>
          <p style={{ opacity: 0.7, margin: '8px 0 0', fontSize: 14 }}>
            Azienda Agricola Parisse
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>
            {ordiniArray.length} ordini totali
          </span>
          <a
            href="/store"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Vai allo Store
          </a>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff',
        padding: '16px 40px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: '#666', marginRight: 8 }}>Filtra per stato:</span>
        <button
          onClick={() => setFiltroStato('tutti')}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: `2px solid ${filtroStato === 'tutti' ? '#1a3a2a' : '#ddd'}`,
            background: filtroStato === 'tutti' ? '#1a3a2a' : '#fff',
            color: filtroStato === 'tutti' ? '#fff' : '#333',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Tutti
        </button>
        {STATI.map(s => (
          <button
            key={s.id}
            onClick={() => setFiltroStato(s.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: `2px solid ${filtroStato === s.id ? s.color : '#ddd'}`,
              background: filtroStato === s.id ? s.color : '#fff',
              color: filtroStato === s.id ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{ padding: '30px 40px', maxWidth: 1400, margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
            Caricamento ordini...
          </div>
        ) : ordiniFiltrati.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h3 style={{ color: '#333', marginBottom: 8 }}>Nessun ordine trovato</h3>
            <p style={{ color: '#666' }}>
              {filtroStato === 'tutti' 
                ? 'Non ci sono ancora ordini'
                : `Non ci sono ordini con stato "${getStatoInfo(filtroStato).label}"`
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: 16,
          }}>
            {ordiniFiltrati.map(ordine => {
              const statoInfo = getStatoInfo(ordine.stato)
              return (
                <div
                  key={ordine.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr',
                    gap: 24,
                    alignItems: 'start',
                    borderLeft: `4px solid ${statoInfo.color}`,
                  }}
                >
                  {/* Order Info */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 12,
                    }}>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#1a3a2a',
                      }}>
                        #{ordine.id}
                      </span>
                      <span style={{
                        background: statoInfo.color,
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {statoInfo.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      {new Date(ordine.created_at).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Customer & Items */}
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <strong style={{ color: '#1a3a2a' }}>{ordine.nome}</strong>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                        {ordine.email} | {ordine.telefono}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        {ordine.indirizzo}, {ordine.cap} {ordine.citta}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}>
                      {ordine.items.map((item, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#f0f4e8',
                            padding: '4px 10px',
                            borderRadius: 16,
                            fontSize: 12,
                            color: '#1a3a2a',
                          }}
                        >
                          {item.nome} x{item.quantita}
                        </span>
                      ))}
                    </div>
                    {ordine.note && (
                      <div style={{
                        marginTop: 12,
                        padding: 12,
                        background: '#fef9e7',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#666',
                        fontStyle: 'italic',
                      }}>
                        Note: {ordine.note}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    alignItems: 'flex-end',
                  }}>
                    <div style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#c9933a',
                      marginBottom: 8,
                    }}>
                      {ordine.totale_articoli} articoli
                    </div>
                    <select
                      value={ordine.stato}
                      onChange={(e) => updateStato(ordine.id, e.target.value)}
                      disabled={isUpdating}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        fontSize: 14,
                        cursor: 'pointer',
                        minWidth: 160,
                      }}
                    >
                      {STATI.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setOrdineAperto(ordine)}
                      style={{
                        padding: '10px 20px',
                        background: '#1a3a2a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        minWidth: 160,
                      }}
                    >
                      Dettagli
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {ordineAperto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setOrdineAperto(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                color: '#1a3a2a',
                margin: 0,
              }}>
                Ordine #{ordineAperto.id}
              </h2>
              <button
                onClick={() => setOrdineAperto(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                x
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#1a3a2a', marginBottom: 8 }}>Cliente</h4>
              <p style={{ margin: 0, color: '#333' }}><strong>{ordineAperto.nome}</strong></p>
              <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>{ordineAperto.email}</p>
              <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>{ordineAperto.telefono}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#1a3a2a', marginBottom: 8 }}>Indirizzo</h4>
              <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                {ordineAperto.indirizzo}<br />
                {ordineAperto.cap} {ordineAperto.citta}
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#1a3a2a', marginBottom: 12 }}>Prodotti</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ordineAperto.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f5f5f5',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{item.nome}</span>
                    <span style={{ color: '#666' }}>x {item.quantita}</span>
                  </div>
                ))}
              </div>
            </div>

            {ordineAperto.note && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#1a3a2a', marginBottom: 8 }}>Note</h4>
                <p style={{
                  margin: 0,
                  padding: 12,
                  background: '#fef9e7',
                  borderRadius: 8,
                  color: '#666',
                  fontStyle: 'italic',
                }}>
                  {ordineAperto.note}
                </p>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#1a3a2a', marginBottom: 8 }}>Stato Ordine</h4>
              <select
                value={ordineAperto.stato}
                onChange={(e) => updateStato(ordineAperto.id, e.target.value)}
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                {STATI.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: '1px solid #eee',
            }}>
              <div style={{ fontSize: 13, color: '#666' }}>
                Creato: {new Date(ordineAperto.created_at).toLocaleString('it-IT')}
              </div>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#c9933a',
              }}>
                {ordineAperto.totale_articoli} articoli
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
