'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CarrelloPage() {
  const { items, rimuovi, aggiornaQuantita, svuota, totaleArticoli } = useCart()
  const router = useRouter()

  if (items.length === 0) {
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
          maxWidth: 400,
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            color: '#1a3a2a',
            marginBottom: 16,
          }}>
            Il carrello e vuoto
          </h1>
          <p style={{
            color: '#5a6b5a',
            marginBottom: 32,
            lineHeight: 1.6,
          }}>
            Esplora i nostri prodotti e aggiungi qualcosa al carrello
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

  return (
    <div style={{
      minHeight: '70vh',
      background: '#faf9f6',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          color: '#1a3a2a',
          marginBottom: 8,
        }}>
          Il tuo Carrello
        </h1>
        <p style={{
          color: '#5a6b5a',
          marginBottom: 32,
        }}>
          {totaleArticoli} {totaleArticoli === 1 ? 'articolo' : 'articoli'}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 32,
        }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* Product Image/Emoji */}
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                background: item.bg || '#f0f4e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
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

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1a3a2a',
                  marginBottom: 4,
                }}>
                  {item.nome}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#5a6b5a',
                }}>
                  {item.cat}
                </p>
              </div>

              {/* Quantity Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <button
                  onClick={() => aggiornaQuantita(item.id, item.quantita - 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: 16,
                  fontWeight: 600,
                  minWidth: 24,
                  textAlign: 'center',
                }}>
                  {item.quantita}
                </span>
                <button
                  onClick={() => aggiornaQuantita(item.id, item.quantita + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => rimuovi(item.id)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid #e74c3c',
                  color: '#e74c3c',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Rimuovi
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 16,
            borderBottom: '1px solid #eee',
          }}>
            <span style={{ fontSize: 18, color: '#1a3a2a' }}>Totale articoli:</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#1a3a2a' }}>{totaleArticoli}</span>
          </div>

          <p style={{
            fontSize: 14,
            color: '#5a6b5a',
            fontStyle: 'italic',
          }}>
            I prezzi verranno comunicati al momento della conferma ordine
          </p>

          <div style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <button
              onClick={svuota}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                color: '#666',
              }}
            >
              Svuota carrello
            </button>
            <Link
              href="/store"
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #1a3a2a',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                color: '#1a3a2a',
              }}
            >
              Continua acquisti
            </Link>
            <button
              onClick={() => router.push('/checkout')}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '14px 32px',
                background: '#1a3a2a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Procedi al Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
