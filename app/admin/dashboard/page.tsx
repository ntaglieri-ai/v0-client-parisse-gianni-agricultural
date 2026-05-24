'use client'

import { Playfair_Display } from 'next/font/google'
import useSWR from 'swr'
import Link from 'next/link'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statCards = [
  { key: 'ordiniOggi', label: 'Ordini Oggi', icon: '📅', color: '#c9933a' },
  { key: 'ordiniMese', label: 'Ordini Mese', icon: '📆', color: '#1a3a2a' },
  { key: 'prodottiAttivi', label: 'Prodotti Attivi', icon: '📦', color: '#2d5a3d' },
  { key: 'lottiAttivi', label: 'Lotti Attivi', icon: '🏷️', color: '#8b6914' },
]

const statoColors: Record<string, { bg: string; text: string }> = {
  nuovo: { bg: '#dbeafe', text: '#1e40af' },
  in_lavorazione: { bg: '#fef3c7', text: '#92400e' },
  spedito: { bg: '#d1fae5', text: '#065f46' },
  consegnato: { bg: '#e0e7ff', text: '#3730a3' },
}

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useSWR('/api/admin/dashboard', fetcher, {
    refreshInterval: 30000,
  })

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Caricamento dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        background: '#fef2f2',
        borderRadius: 12,
      }}>
        <p style={{ color: '#dc2626' }}>Errore nel caricamento della dashboard</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className={playfair.className} style={{
        color: '#1a3a2a',
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 32,
      }}>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24,
        marginBottom: 40,
      }}>
        {statCards.map((card) => (
          <div
            key={card.key}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 32 }}>{card.icon}</span>
              <span style={{
                fontSize: 36,
                fontWeight: 700,
                color: card.color,
              }}>
                {data?.[card.key] ?? 0}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{card.label}</p>
            {card.key === 'prodottiAttivi' && data?.prodottiNascosti > 0 && (
              <p style={{ 
                color: '#f59e0b', 
                fontSize: 12, 
                margin: '8px 0 0 0',
                fontWeight: 600,
              }}>
                {data.prodottiNascosti} nascost{data.prodottiNascosti === 1 ? 'o' : 'i'}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Ultimi Ordini */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <h2 className={playfair.className} style={{
            color: '#1a3a2a',
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
          }}>
            Ultimi Ordini
          </h2>
          <Link
            href="/admin/ordini"
            style={{
              color: '#c9933a',
              fontSize: 14,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Vedi tutti
          </Link>
        </div>

        {data?.ultimiOrdini?.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>
            Nessun ordine recente
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666', fontSize: 13, fontWeight: 600 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666', fontSize: 13, fontWeight: 600 }}>Cliente</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666', fontSize: 13, fontWeight: 600 }}>Articoli</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666', fontSize: 13, fontWeight: 600 }}>Stato</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666', fontSize: 13, fontWeight: 600 }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {data?.ultimiOrdini?.map((ordine: any) => {
                const statoStyle = statoColors[ordine.stato] || statoColors.nuovo
                return (
                  <tr key={ordine.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '14px 8px', fontSize: 14, color: '#1a3a2a', fontWeight: 600 }}>
                      #{ordine.id}
                    </td>
                    <td style={{ padding: '14px 8px', fontSize: 14, color: '#333' }}>
                      {ordine.nome}
                    </td>
                    <td style={{ padding: '14px 8px', fontSize: 14, color: '#666' }}>
                      {ordine.totale_articoli} articoli
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: statoStyle.bg,
                        color: statoStyle.text,
                        textTransform: 'capitalize',
                      }}>
                        {ordine.stato?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px', fontSize: 14, color: '#666' }}>
                      {new Date(ordine.created_at).toLocaleDateString('it-IT')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
