import { getDb } from '@/lib/admin-db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface LottoData {
  id: number
  prodotto_id: number
  codice_lotto: string
  campo: string
  comune: string
  data_semina: string
  data_raccolta: string
  kg_disponibili: number
  certificazioni: string
  note: string
  attivo: boolean
  nome: string
  categoria: string
  descrizione: string
  immagine: string
  unita: string
}

async function getLottoData(codice_lotto: string): Promise<LottoData | null> {
  try {
    const sql = getDb()
    const result = await sql`
      SELECT 
        l.*, 
        p.nome, p.categoria, p.descrizione, p.immagine, p.unita
      FROM lotti l
      JOIN prodotti p ON p.id = l.prodotto_id
      WHERE l.codice_lotto = ${codice_lotto}
    `
    return result.length > 0 ? result[0] as LottoData : null
  } catch (error) {
    console.error('Error fetching lotto:', error)
    return null
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function TracciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lotto = await getLottoData(decodeURIComponent(id))
  
  if (!lotto) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        <div style={{ fontFamily: "'Lato',sans-serif", background: '#f5f0e8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            background: 'linear-gradient(135deg,#1a3a2a,#2d5c3f)',
            padding: '50px 30px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif", color: '#fff',
              fontSize: 'clamp(28px,5vw,40px)', marginBottom: 10,
            }}>
              Lotto Non Trovato
            </h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16 }}>
              Il codice lotto scansionato non corrisponde a nessun prodotto nel nostro database.
            </p>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
            <p style={{ color: '#666', fontSize: 16, marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
              Se ritieni che questo sia un errore, contattaci per assistenza.
            </p>
            <Link href="/store" style={{
              background: '#c9933a', color: '#fff', textDecoration: 'none',
              padding: '14px 32px', borderRadius: 8, fontSize: 15,
              fontWeight: 700, fontFamily: "'Lato',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              ← Torna allo Store
            </Link>
          </div>
          
          <footer style={{
            background: '#1a3a2a', color: 'rgba(255,255,255,.7)',
            textAlign: 'center', padding: 24, fontSize: 13,
          }}>
            <strong style={{ color: '#fff' }}>Gianni Parisse - Azienda Agricola</strong><br />
            <span style={{ fontSize: 11, opacity: .6 }}>Pescina (AQ) - Altopiano del Fucino</span>
          </footer>
        </div>
      </>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Lato',sans-serif", background: '#f5f0e8', minHeight: '100vh' }}>

        {/* Header con verifica */}
        <div style={{
          background: 'linear-gradient(135deg,#1a3a2a,#2d5c3f)',
          padding: '50px 30px', textAlign: 'center',
        }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: 'rgba(255,255,255,0.15)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid #c9933a'
          }}>
            <span style={{ fontSize: 40, color: '#c9933a' }}>✓</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", color: '#fff',
            fontSize: 'clamp(28px,5vw,40px)', marginBottom: 10,
          }}>
            Prodotto Autentico Verificato
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16 }}>
            Hai scansionato il QR code di{' '}
            <strong style={{ color: '#c9933a' }}>{lotto.nome}</strong>
          </p>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
          
          {/* Immagine prodotto */}
          {lotto.immagine && (
            <div style={{ 
              borderRadius: 16, overflow: 'hidden', marginBottom: 32,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              position: 'relative',
              height: 280
            }}>
              <Image 
                src={lotto.immagine} 
                alt={lotto.nome}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Nome e categoria */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ 
              fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, 
              color: '#c9933a', marginBottom: 8, fontWeight: 600 
            }}>
              {lotto.categoria}
            </p>
            <h2 style={{ 
              fontFamily: "'Playfair Display',serif", 
              fontSize: 32, color: '#1a3a2a', margin: 0 
            }}>
              {lotto.nome}
            </h2>
            {lotto.descrizione && (
              <p style={{ color: '#666', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
                {lotto.descrizione}
              </p>
            )}
          </div>

          {/* Codice lotto */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              background: '#fff', borderRadius: 12, padding: '24px 32px',
              display: 'inline-block', boxShadow: '0 4px 16px rgba(0,0,0,.06)',
              border: '2px solid #c9933a'
            }}>
              <p style={{ fontSize: 11, color: '#999', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Codice Lotto
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#1a3a2a', letterSpacing: 1, margin: 0 }}>
                {lotto.codice_lotto}
              </p>
            </div>
          </div>

          {/* Info coltivazione */}
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#666', marginBottom: 16 }}>
            Informazioni di Coltivazione
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Campo</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{lotto.campo || '-'}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Comune</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{lotto.comune || '-'}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Data Semina</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{formatDate(lotto.data_semina)}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Data Raccolta</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2a' }}>{formatDate(lotto.data_raccolta)}</div>
            </div>
          </div>

          {/* Disponibilita */}
          <div style={{ 
            background: '#1a3a2a', borderRadius: 12, padding: '20px 24px', 
            marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                Disponibilita
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                {lotto.kg_disponibili} <span style={{ fontSize: 14, fontWeight: 400 }}>{lotto.unita}</span>
              </div>
            </div>
            <div style={{ 
              background: lotto.kg_disponibili > 0 ? '#c9933a' : '#dc2626', 
              color: '#fff', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600 
            }}>
              {lotto.kg_disponibili > 0 ? 'Disponibile' : 'Esaurito'}
            </div>
          </div>

          {/* Certificazioni e note */}
          {(lotto.certificazioni || lotto.note) && (
            <div style={{ marginBottom: 32 }}>
              {lotto.certificazioni && (
                <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Certificazioni</div>
                  <div style={{ fontSize: 14, color: '#1a3a2a', lineHeight: 1.5 }}>{lotto.certificazioni}</div>
                </div>
              )}
              {lotto.note && (
                <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 6 }}>Note</div>
                  <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>{lotto.note}</div>
                </div>
              )}
            </div>
          )}

          {/* Azienda */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(26,58,42,0.05), rgba(201,147,58,0.08))', 
            borderRadius: 12, padding: '24px', textAlign: 'center', marginBottom: 32,
            border: '1px solid rgba(201,147,58,0.2)'
          }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 8 }}>
              Prodotto da
            </p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#1a3a2a', margin: 0, fontWeight: 700 }}>
              Gianni Parisse - Azienda Agricola
            </p>
            <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
              Pescina (AQ) - Altopiano del Fucino
            </p>
          </div>

          {/* Torna allo store */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/store" style={{
              background: '#c9933a', color: '#fff', textDecoration: 'none',
              padding: '14px 32px', borderRadius: 8, fontSize: 15,
              fontWeight: 700, fontFamily: "'Lato',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              ← Torna allo Store
            </Link>
          </div>
        </div>

        <footer style={{
          background: '#1a3a2a', color: 'rgba(255,255,255,.7)',
          textAlign: 'center', padding: 24, fontSize: 13, marginTop: 40,
        }}>
          <strong style={{ color: '#fff' }}>Gianni Parisse - Azienda Agricola</strong><br />
          <span style={{ fontSize: 11, opacity: .6 }}>Pescina (AQ) - Altopiano del Fucino</span>
        </footer>
      </div>
    </>
  )
}
