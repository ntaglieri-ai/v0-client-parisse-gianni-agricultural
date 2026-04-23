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
  legumi: "I legumi della nostra azienda sono il frutto di una tradizione agricola che affonda le radici nella storia della Marsica. Coltiviamo lenticchie, ceci, fagioli e cicerchie con metodi sostenibili, rispettando i tempi della natura e preservando la biodiversità del nostro territorio.",
  cereali: "I nostri cereali crescono sui terreni fertili del Fucino, beneficiando del clima unico di questa conca montana. Coltiviamo farro, orzo, grano e altri cereali antichi con tecniche che combinano tradizione e sostenibilità.",
  farine: "Le nostre farine nascono dalla macinazione a pietra dei migliori cereali coltivati sui nostri campi. Un processo lento e naturale che preserva tutte le proprietà nutritive del chicco, per farine genuine e dal sapore autentico.",
  trasformati: "I nostri prodotti trasformati racchiudono i sapori autentici della Marsica. Conserve, sottoli e preparazioni artigianali realizzate con le materie prime dei nostri campi, seguendo ricette tradizionali tramandate di generazione in generazione.",
  pasta: "La nostra pasta artigianale nasce dall'unione delle migliori farine dei nostri cereali e dell'acqua pura del Fucino. Trafilata al bronzo e essiccata lentamente, conserva tutto il sapore e la consistenza della vera pasta fatta in casa.",
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
              background: '#fff',
              borderRadius: 12,
              padding: '24px 28px',
              marginBottom: 32,
              borderLeft: '4px solid #1a3a2a',
              boxShadow: '0 2px 12px rgba(0,0,0,.04)',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 22,
                color: '#1a3a2a',
                marginBottom: 10,
              }}>
                {CATEGORIE.find(c => c.id === catAttiva)?.label}
              </h2>
              <p style={{
                fontSize: 14,
                color: '#555',
                lineHeight: 1.7,
                margin: 0,
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
                }}>
                  {p.emoji}
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
