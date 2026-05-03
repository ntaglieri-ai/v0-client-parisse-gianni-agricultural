'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totaleArticoli, svuota } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ordineId, setOrdineId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    indirizzo: '',
    citta: '',
    cap: '',
    note: '',
  })

  if (items.length === 0 && !success) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: '#faf9f6',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            color: '#1a3a2a',
            marginBottom: 16,
          }}>
            Carrello vuoto
          </h1>
          <p style={{ color: '#5a6b5a', marginBottom: 32 }}>
            Aggiungi prodotti al carrello prima di procedere al checkout
          </p>
          <Link
            href="/store"
            style={{
              display: 'inline-block',
              background: '#1a3a2a',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Vai allo Store
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: '#faf9f6',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 500,
          background: '#fff',
          padding: 48,
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            width: 80,
            height: 80,
            background: '#e8f5e9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 40,
          }}>
            ✓
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            color: '#1a3a2a',
            marginBottom: 16,
          }}>
            Ordine Confermato!
          </h1>
          <p style={{
            color: '#5a6b5a',
            marginBottom: 8,
            fontSize: 18,
          }}>
            Ordine #{ordineId}
          </p>
          <p style={{
            color: '#5a6b5a',
            marginBottom: 32,
            lineHeight: 1.6,
          }}>
            Grazie per il tuo ordine! Ti contatteremo presto per confermare i dettagli e la consegna.
          </p>
          <Link
            href="/store"
            style={{
              display: 'inline-block',
              background: '#1a3a2a',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Torna allo Store
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/ordini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            id: item.id,
            nome: item.nome,
            quantita: item.quantita,
            cat: item.cat,
          })),
          totale_articoli: totaleArticoli,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore nella creazione ordine')
      }

      setOrdineId(data.ordine_id)
      setSuccess(true)
      svuota()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#1a3a2a',
  }

  return (
    <div style={{
      minHeight: '70vh',
      background: '#faf9f6',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
      }}>
        {/* Form Section */}
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            color: '#1a3a2a',
            marginBottom: 8,
          }}>
            Checkout
          </h1>
          <p style={{
            color: '#5a6b5a',
            marginBottom: 32,
          }}>
            Inserisci i tuoi dati per completare l&apos;ordine
          </p>

          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            padding: 32,
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Nome e Cognome *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Mario Rossi"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="mario@esempio.it"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Telefono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="+39 333 1234567"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Indirizzo *</label>
              <input
                type="text"
                name="indirizzo"
                value={formData.indirizzo}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Via Roma 123"
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 16,
              marginBottom: 20,
            }}>
              <div>
                <label style={labelStyle}>Citta *</label>
                <input
                  type="text"
                  name="citta"
                  value={formData.citta}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Pescina"
                />
              </div>
              <div>
                <label style={labelStyle}>CAP *</label>
                <input
                  type="text"
                  name="cap"
                  value={formData.cap}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{5}"
                  style={inputStyle}
                  placeholder="67057"
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Note (opzionale)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
                placeholder="Istruzioni speciali per la consegna..."
              />
            </div>

            {error && (
              <div style={{
                background: '#fdecea',
                color: '#c0392b',
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 14,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: isSubmitting ? '#8a9a8a' : '#1a3a2a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {isSubmitting ? 'Invio in corso...' : 'Conferma Ordine'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            color: '#1a3a2a',
            marginBottom: 24,
          }}>
            Riepilogo Ordine
          </h2>

          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 24,
            }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    paddingBottom: 16,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    background: item.bg || '#f0f4e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.nome}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      item.emoji
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 500,
                      color: '#1a3a2a',
                      fontSize: 15,
                    }}>
                      {item.nome}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#5a6b5a',
                    }}>
                      Quantita: {item.quantita}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: '2px solid #1a3a2a',
            }}>
              <span style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#1a3a2a',
              }}>
                Totale articoli
              </span>
              <span style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1a3a2a',
              }}>
                {totaleArticoli}
              </span>
            </div>

            <p style={{
              marginTop: 16,
              fontSize: 13,
              color: '#5a6b5a',
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
              I prezzi verranno comunicati al momento della conferma
            </p>
          </div>

          <Link
            href="/carrello"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 16,
              color: '#1a3a2a',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            ← Modifica carrello
          </Link>
        </div>
      </div>
    </div>
  )
}
