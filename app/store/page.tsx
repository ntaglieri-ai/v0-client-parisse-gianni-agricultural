'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { prodotti, nomeCat, Prodotto } from '@/lib/prodotti'
import ProdottoModal from '@/components/ProdottoModal'

const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })

const CATEGORIE = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'ortaggi', label: '🥦 Ortaggi' },
  { id: 'legumi', label: '🫘 Legumi' },
  { id: 'cereali', label: '🌾 Cereali' },
  { id: 'farine', label: '🌾 Farine' },
  { id: 'trasformati', label: '🫙 Trasformati' },
  { id: 'pasta', label: '🍝 Pasta' },
]

const DESCRIZIONI_CATEGORIE: Record<string, string> = {
  ortaggi: "I nostri ortaggi nascono nelle campagne di Pescina, nel cuore della Marsica, una terra fertile e autentica dove l'agricoltura segue ancora il ritmo naturale delle stagioni. Qui, tra campi aperti e aria di montagna, coltiviamo patate, aglio, cipolle, zucchine e altri ortaggi con cura quotidiana e rispetto per la terra.",
  legumi: "Piccoli custodi di proteine e tradizione. I nostri legumi raccontano la pazienza del contadino e la generosita di un suolo che non dimentica. Lenticchie, ceci, fagioli: semi antichi che tornano in tavola con tutto il loro valore.",
  cereali: "I cereali disegnano il paesaggio e ne scandiscono il tempo. Dalla semina alla maturazione, accompagnano le stagioni con regolarita, diventando materia prima essenziale, solida, profondamente legata al territorio.",
  farine: "Dalla macina nasce la farina, polvere bianca che custodisce l'anima del chicco. Le nostre farine conservano il profumo del grano appena raccolto, la consistenza di una lavorazione lenta, il sapore di un tempo che non ha fretta.",
  trasformati: "Conservare e la forma piu antica di rispetto. I nostri trasformati nascono dalla volonta di prolungare la stagione, di portare in tavola d'inverno il sole dell'estate. Ogni vasetto racconta una storia di attesa e di cura.",
  pasta: "Acqua e farina, gesto semplice e antico. La nostra pasta nasce cosi, dalla sapienza delle mani e dalla qualita dei nostri cereali. Trafilata al bronzo, essiccata con calma, pronta ad accogliere ogni condimento.",
}

export default function StorePage() {
  const [catAttiva, setCatAttiva] = useState('tutti')
  const [prodottoAperto, setProdottoAperto] = useState<Prodotto | null>(null)
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const filtrati = catAttiva === 'tutti' ? prodotti : prodotti.filter(p => p.cat === catAttiva)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      <div style={{ fontFamily: "'Lato',sans-serif", background: '#f5f0e8', minHeight: '100vh', color: '#2c2c2c' }}>

        <div style={{
          background: 'linear-gradient(135deg,#1a3a2a 0%,#2d5c3f 60%,#3a6b4a 100%)',
          padding: 'clamp(50px,8vw,80px) 40px 60px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
            gap: 28,
          }}>
            {filtrati.map(p => (
              <div
                key={p.id}
                onClick={() => setProdottoAperto(p)}
                style={{
                  background: '#fff', borderRadius: 14, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                  cursor: 'pointer', transition: 'transform .25s, box-shadow .25s',
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
                  height: 200, background: p.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 72, position: 'relative',
                  overflow: 'hidden',
                }}>
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.nome}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    p.emoji
                  )}
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#1a3a2a', color: '#fff', fontSize: 10,
                    fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 20,
                  }}>{nomeCat(p.cat)}</span>
                  {p.bio && (
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      background: '#c9933a', color: '#fff', fontSize: 10,
                      fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 20,
                    }}>🌿 Bio</span>
                  )}
                </div>

                <div style={{ padding: '18px 20px 20px' }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display',serif", fontSize: 19,
                    marginBottom: 6, color: '#1a3a2a',
                  }}>{p.nome}</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 14 }}>{p.desc}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: '#c9933a', lineHeight: 1 }}>
                      &euro; {p.prezzo}
                      <span style={{ fontSize: 12, color: '#666', fontFamily: "'Lato',sans-serif", fontWeight: 400, marginLeft: 4 }}>
                        / {p.unita}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#999' }}>Lotto</div>
                      <div style={{ fontSize: 11, color: '#444', fontWeight: 700 }}>{p.lotto}</div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid #ede5d5', paddingTop: 14, gap: 12,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div style={{ borderRadius: 6, border: '2px solid #ede5d5', lineHeight: 0, overflow: 'hidden' }}>
                        {baseUrl && <QRCode value={`${baseUrl}/store/traccia/${p.id}`} size={64} />}
                      </div>
                      <span style={{ fontSize: 9, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Traccia</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setProdottoAperto(p) }}
                      style={{
                        flex: 1, background: '#1a3a2a', color: '#fff', border: 'none',
                        padding: '10px 14px', borderRadius: 8, fontSize: 12,
                        fontWeight: 700, letterSpacing: .4, cursor: 'pointer',
                        fontFamily: "'Lato',sans-serif", textAlign: 'center',
                        transition: 'background .2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#c9933a')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#1a3a2a')}
                    >
                      🔍 Dettagli &amp; Filiera
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer style={{
          background: '#1a3a2a', color: 'rgba(255,255,255,.7)',
          textAlign: 'center', padding: 30, fontSize: 13,
        }}>
          <strong style={{ color: '#fff' }}>Gianni Parisse – Azienda Agricola</strong><br />
          Pescina (AQ) · Altopiano del Fucino<br />
          <span style={{ fontSize: 11, opacity: .6 }}>© 2025 – Tutti i diritti riservati</span>
        </footer>
      </div>

      {prodottoAperto && (
        <ProdottoModal
          prodotto={prodottoAperto}
          onClose={() => setProdottoAperto(null)}
          baseUrl={baseUrl}
        />
      )}
    </>
  )
}
