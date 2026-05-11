'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import useSWR from 'swr'
import { useCart } from '@/contexts/CartContext'

const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })

// Types for the new data structure
type Lotto = {
  id: number
  codice_lotto: string
  prezzo: number
  kg_disponibili: number
  campo: string | null
  comune: string | null
  data_raccolta: string | null
}

type ProdottoFromAPI = {
  id: number
  nome: string
  categoria: string
  descrizione: string | null
  unita: string
  immagine: string | null
  lotti: Lotto[] | null
}

const CATEGORIE = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'ortaggi', label: 'Ortaggi' },
  { id: 'legumi', label: 'Legumi' },
  { id: 'cereali', label: 'Cereali' },
  { id: 'farine', label: 'Farine' },
  { id: 'trasformati', label: 'Trasformati' },
  { id: 'pasta', label: 'Pasta' },
]

const DESCRIZIONI_CATEGORIE: Record<string, string> = {
  ortaggi: "I nostri ortaggi nascono nelle campagne di Pescina, nel cuore della Marsica, una terra fertile e autentica dove l'agricoltura segue ancora il ritmo naturale delle stagioni. Qui, tra campi aperti e aria di montagna, coltiviamo patate, aglio, cipolle, zucchine e altri ortaggi con cura quotidiana e rispetto per la terra.",
  legumi: "Piccoli custodi di proteine e tradizione. I nostri legumi raccontano la pazienza del contadino e la generosita di un suolo che non dimentica. Lenticchie, ceci, fagioli: semi antichi che tornano in tavola con tutto il loro valore.",
  cereali: "I cereali disegnano il paesaggio e ne scandiscono il tempo. Dalla semina alla maturazione, accompagnano le stagioni con regolarita, diventando materia prima essenziale, solida, profondamente legata al territorio.",
  farine: "Dalla macina nasce la farina, polvere bianca che custodisce l'anima del chicco. Le nostre farine conservano il profumo del grano appena raccolto, la consistenza di una lavorazione lenta, il sapore di un tempo che non ha fretta.",
  trasformati: "Conservare e la forma piu antica di rispetto. I nostri trasformati nascono dalla volonta di prolungare la stagione, di portare in tavola d'inverno il sole dell'estate. Ogni vasetto racconta una storia di attesa e di cura.",
  pasta: "Acqua e farina, gesto semplice e antico. La nostra pasta nasce cosi, dalla sapienza delle mani e dalla qualita dei nostri cereali. Trafilata al bronzo, essiccata con calma, pronta ad accogliere ogni condimento.",
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StorePage() {
  const [catAttiva, setCatAttiva] = useState('tutti')
  const [baseUrl, setBaseUrl] = useState('')
  const { aggiungi, totaleArticoli } = useCart()
  const [addedFeedback, setAddedFeedback] = useState<number | null>(null)
  const [selectedLotti, setSelectedLotti] = useState<Record<number, number>>({})

  const { data: prodotti, error, isLoading } = useSWR<ProdottoFromAPI[]>('/api/store/prodotti', fetcher)

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  // Initialize selected lotti when products load - only set defaults for products not already selected
  useEffect(() => {
    if (prodotti) {
      setSelectedLotti(prev => {
        const updated = { ...prev }
        prodotti.forEach(p => {
          if (p.lotti && p.lotti.length > 0 && updated[p.id] === undefined) {
            updated[p.id] = 0 // Default to first lotto only if not already set
          }
        })
        return updated
      })
    }
  }, [prodotti])

  const handleAddToCart = (p: ProdottoFromAPI, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!p.lotti || p.lotti.length === 0) return
    
    // Filter only available lotti
    const lottiDisponibili = p.lotti.filter(l => l.kg_disponibili > 0)
    if (lottiDisponibili.length === 0) return
    
    const lottoIndex = selectedLotti[p.id] || 0
    const lotto = lottiDisponibili[lottoIndex] || lottiDisponibili[0]
    
    // Create cart item with lotto info
    const cartItem = {
      id: `${p.id}-${lotto.id}`,
      prodotto_id: p.id,
      lotto_id: lotto.id,
      codice_lotto: lotto.codice_lotto,
      nome: p.nome,
      prezzo: lotto.prezzo,
      unita: p.unita,
      immagine: p.immagine,
      categoria: p.categoria,
    }
    
    aggiungi(cartItem as any)
    setAddedFeedback(p.id)
    setTimeout(() => setAddedFeedback(null), 1500)
  }

  const handleLottoChange = (prodottoId: number, lottoIndex: number) => {
    setSelectedLotti(prev => ({ ...prev, [prodottoId]: lottoIndex }))
  }

  const filtrati = prodotti 
    ? (catAttiva === 'tutti' ? prodotti : prodotti.filter(p => p.categoria === catAttiva))
    : []

  const getSelectedLotto = (p: ProdottoFromAPI): Lotto | null => {
    if (!p.lotti || p.lotti.length === 0) return null
    return p.lotti[selectedLotti[p.id] || 0]
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Lato',sans-serif", background: '#f5f0e8', minHeight: '100vh', color: '#2c2c2c' }}>

        <div style={{
          background: 'linear-gradient(135deg,#1a3a2a 0%,#2d5c3f 60%,#3a6b4a 100%)',
          padding: 'clamp(50px,8vw,80px) 40px 60px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {totaleArticoli > 0 && (
            <Link
              href="/carrello"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#c9933a',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: 30,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>🛒</span>
              <span>{totaleArticoli}</span>
            </Link>
          )}
          <div style={{
            display: 'inline-block', background: 'rgba(201,147,58,.25)',
            border: '1px solid #c9933a', color: '#e8b96a',
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 16px', borderRadius: 20, marginBottom: 18,
          }}>
            Dal Fucino alla Tua Tavola
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(36px,5vw,60px)', color: '#fff',
            margin: '0 0 14px', lineHeight: 1.1,
          }}>
            Il Nostro Store
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Ortaggi, legumi, cereali e molto altro. Coltivati con cura a Pescina (AQ), nel cuore della Marsica.
          </p>
        </div>

        <div style={{
          background: '#fff', borderBottom: '1px solid #ede5d5',
          padding: '18px 40px', display: 'flex', gap: 10,
          flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginRight: 6 }}>
            Filtra:
          </span>
          {CATEGORIE.map(c => (
            <button
              key={c.id}
              onClick={() => setCatAttiva(c.id)}
              style={{
                padding: '8px 20px', borderRadius: 30,
                border: `2px solid ${catAttiva === c.id ? '#1a3a2a' : '#ede5d5'}`,
                background: catAttiva === c.id ? '#1a3a2a' : '#fff',
                color: catAttiva === c.id ? '#fff' : '#2c2c2c',
                fontFamily: "'Lato',sans-serif", fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'all .2s', letterSpacing: .3,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '50px 30px' }}>
          {catAttiva !== 'tutti' && DESCRIZIONI_CATEGORIE[catAttiva] && (
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #faf8f4 100%)',
              borderRadius: 16,
              padding: '36px 40px',
              marginBottom: 40,
              borderLeft: '5px solid #c9933a',
              boxShadow: '0 8px 32px rgba(0,0,0,.06)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                background: 'radial-gradient(circle, rgba(201,147,58,.08) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />
              <p style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 17,
                fontStyle: 'italic',
                color: '#4a4a4a',
                lineHeight: 1.9,
                margin: 0,
                maxWidth: 800,
              }}>
                {DESCRIZIONI_CATEGORIE[catAttiva]}
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
              gap: 28,
            }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                }}>
                  <div style={{
                    height: 200, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ height: 24, background: '#f0f0f0', borderRadius: 4, marginBottom: 8, width: '60%' }} />
                    <div style={{ height: 14, background: '#f0f0f0', borderRadius: 4, marginBottom: 4, width: '100%' }} />
                    <div style={{ height: 14, background: '#f0f0f0', borderRadius: 4, marginBottom: 16, width: '80%' }} />
                    <div style={{ height: 32, background: '#f0f0f0', borderRadius: 4, width: '40%' }} />
                  </div>
                </div>
              ))}
              <style>{`
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
              `}</style>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666',
            }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>Errore nel caricamento dei prodotti</p>
              <p style={{ fontSize: 14 }}>Riprova piu tardi</p>
            </div>
          )}

          {/* Products grid */}
          {!isLoading && !error && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
              gap: 28,
            }}>
              {filtrati.map(p => {
                const lotti = p.lotti || []
                // Filter only available lotti (kg_disponibili > 0)
                const lottiDisponibili = lotti.filter(l => l.kg_disponibili > 0)
                const isDisponibile = lottiDisponibili.length > 0
                const lottoIndex = selectedLotti[p.id] ?? 0
                const selectedLotto = isDisponibile ? lottiDisponibili[lottoIndex] || lottiDisponibili[0] : null
                const whatsappUrl = `https://wa.me/393382726361?text=${encodeURIComponent(`Salve, vorrei informazioni su ${p.nome}`)}`
                
                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#fff', borderRadius: 14, overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                      transition: 'transform .25s, box-shadow .25s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 35px rgba(0,0,0,.12)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = ''
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.06)'
                    }}
                  >
                    <div style={{
                      height: 200, background: '#e8e4dc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 72, position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {p.immagine ? (
                        <img
                          src={p.immagine}
                          alt={p.nome}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 48, opacity: 0.5 }}>📦</span>
                      )}
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: isDisponibile ? '#1a3a2a' : '#e67e22', 
                        color: '#fff', fontSize: 10,
                        fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                        padding: '4px 10px', borderRadius: 20,
                      }}>{isDisponibile ? p.categoria : 'Esaurito'}</span>
                    </div>

                    <div style={{ padding: '18px 20px 20px' }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display',serif", fontSize: 19,
                        marginBottom: 6, color: '#1a3a2a',
                      }}>{p.nome}</h3>
                      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 14 }}>
                        {p.descrizione || 'Prodotto fresco dalla nostra azienda agricola.'}
                      </p>

                      {isDisponibile && lottiDisponibili.length > 1 && (
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                            Seleziona Lotto
                          </label>
                          <select
                            value={selectedLotti[p.id] || 0}
                            onChange={(e) => handleLottoChange(p.id, parseInt(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 8,
                              border: '2px solid #ede5d5',
                              background: '#fff',
                              fontFamily: "'Lato',sans-serif",
                              fontSize: 13,
                              color: '#2c2c2c',
                              cursor: 'pointer',
                            }}
                          >
                            {lottiDisponibili.map((l, idx) => (
                              <option key={l.id} value={idx}>
                                Lotto {l.codice_lotto} — €{Number(l.prezzo).toFixed(2)}/{p.unita}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: isDisponibile ? 26 : 15, fontWeight: 700, color: isDisponibile ? '#c9933a' : '#888', lineHeight: 1 }}>
                          {isDisponibile ? (
                            <>
                              €{Number(selectedLotto?.prezzo || 0).toFixed(2)}
                              <span style={{ fontSize: 12, color: '#666', fontFamily: "'Lato',sans-serif", fontWeight: 400, marginLeft: 4 }}>
                                / {p.unita}
                              </span>
                            </>
                          ) : (
                            <span>Non disponibile al momento</span>
                          )}
                        </div>
                        {isDisponibile && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#999' }}>Lotto</div>
                            <div style={{ fontSize: 11, color: '#444', fontWeight: 700 }}>
                              {selectedLotto?.codice_lotto}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderTop: '1px solid #ede5d5', paddingTop: 14, gap: 12,
                      }}>
                        {isDisponibile && baseUrl && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <div style={{ borderRadius: 6, border: '2px solid #ede5d5', lineHeight: 0, overflow: 'hidden' }}>
                              <QRCode key={`qr-${p.id}-${selectedLotto?.codice_lotto}`} value={`${baseUrl}/store/traccia/${selectedLotto?.codice_lotto}`} size={64} />
                            </div>
                            <span style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Traccia</span>
                          </div>
                        )}
                        {isDisponibile ? (
                          <button
                            onClick={e => handleAddToCart(p, e)}
                            style={{
                              flex: 1, 
                              background: addedFeedback === p.id ? '#27ae60' : '#c9933a', 
                              color: '#fff', 
                              border: 'none',
                              padding: '12px 14px', borderRadius: 8, fontSize: 13,
                              fontWeight: 700, letterSpacing: .4, 
                              cursor: 'pointer',
                              fontFamily: "'Lato',sans-serif", textAlign: 'center',
                              transition: 'background .2s',
                            }}
                            onMouseEnter={e => {
                              if (addedFeedback !== p.id) e.currentTarget.style.background = '#1a3a2a'
                            }}
                            onMouseLeave={e => {
                              if (addedFeedback !== p.id) e.currentTarget.style.background = '#c9933a'
                            }}
                          >
                            {addedFeedback === p.id ? 'Aggiunto!' : '+ Aggiungi'}
                          </button>
                        ) : (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1, 
                              background: '#25D366', 
                              color: '#fff', 
                              border: 'none',
                              padding: '12px 14px', borderRadius: 8, fontSize: 13,
                              fontWeight: 700, letterSpacing: .4, 
                              cursor: 'pointer',
                              fontFamily: "'Lato',sans-serif", textAlign: 'center',
                              textDecoration: 'none',
                              display: 'block',
                              transition: 'background .2s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#128C7E'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#25D366'
                            }}
                          >
                            Contattaci
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filtrati.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666',
            }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>Nessun prodotto trovato</p>
              <p style={{ fontSize: 14 }}>Prova a selezionare una categoria diversa</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
