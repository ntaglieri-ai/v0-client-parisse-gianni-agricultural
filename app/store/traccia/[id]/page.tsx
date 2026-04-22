import { prodotti } from '@/lib/prodotti'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return prodotti.map(p => ({ id: p.id }))
}

export default async function TracciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const p = prodotti.find(x => x.id === id)
  if (!p) notFound()

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Lato',sans-serif", background: '#f5f0e8', minHeight: '100vh' }}>

        <div style={{
          background: 'linear-gradient(135deg,#1a3a2a,#2d5c3f)',
          padding: '50px 30px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", color: '#fff',
            fontSize: 'clamp(28px,5vw,40px)', marginBottom: 10,
          }}>
            Prodotto Verificato
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16 }}>
            Hai scansionato il QR code autentico di{' '}
            <strong style={{ color: '#e8b96a' }}>{p.nome}</strong>
          </p>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>

          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#666', marginBottom: 16 }}>
            Filiera Completa
          </p>
          <div style={{ marginBottom: 32 }}>
            {p.steps.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, padding: '14px 0',
                borderBottom: i < p.steps.length - 1 ? '1px solid #ede5d5' : 'none',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: s.done ? '#1a3a2a' : '#f5f0e8',
                  border: `2px solid ${s.done ? '#1a3a2a' : '#ede5d5'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 14, display: 'block', color: '#2c2c2c' }}>{s.label}</strong>
                  <span style={{ fontSize: 12, color: '#666' }}>{s.data}</span>
                </div>
                <span style={{ alignSelf: 'center', fontSize: 18, color: s.done ? '#1a3a2a' : '#ccc' }}>
                  {s.done ? '✓' : '○'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Campo', val: p.campo },
              { label: 'Varieta', val: p.varieta },
              { label: 'Metodo', val: p.metodo },
              { label: 'Certificazione', val: p.cert },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2a' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              background: '#fff', borderRadius: 12, padding: '20px 32px',
              display: 'inline-block', boxShadow: '0 4px 16px rgba(0,0,0,.06)',
            }}>
              <p style={{ fontSize: 12, color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                Lotto Verificato
              </p>
              <p style={{ fontSize: 26, fontWeight: 700, color: '#1a3a2a', letterSpacing: 2, margin: 0 }}>{p.lotto}</p>
              <p style={{ fontSize: 11, color: '#999', marginTop: 6 }}>
                Gianni Parisse Azienda Agricola - Pescina (AQ)
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/store" style={{
              background: '#c9933a', color: '#fff', textDecoration: 'none',
              padding: '12px 28px', borderRadius: 8, fontSize: 14,
              fontWeight: 700, fontFamily: "'Lato',sans-serif", display: 'inline-block',
            }}>
              Torna allo Store
            </Link>
          </div>
        </div>

        <footer style={{
          background: '#1a3a2a', color: 'rgba(255,255,255,.7)',
          textAlign: 'center', padding: 24, fontSize: 13, marginTop: 40,
        }}>
          <strong style={{ color: '#fff' }}>Gianni Parisse - Azienda Agricola</strong><br />
          <span style={{ fontSize: 11, opacity: .6 }}>2025</span>
        </footer>
      </div>
    </>
  )
}
