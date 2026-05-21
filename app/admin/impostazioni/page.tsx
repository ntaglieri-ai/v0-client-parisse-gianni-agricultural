'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Impostazioni {
  id?: number
  ragione_sociale: string
  indirizzo: string
  cap: string
  citta: string
  provincia: string
  paese: string
  partita_iva: string
  email: string
  telefono: string
  sito_web: string
  origine_default: string
  logo_url: string
}

const defaultImpostazioni: Impostazioni = {
  ragione_sociale: '',
  indirizzo: '',
  cap: '',
  citta: '',
  provincia: '',
  paese: 'Italia',
  partita_iva: '',
  email: '',
  telefono: '',
  sito_web: '',
  origine_default: 'Italia – Altopiano del Fucino',
  logo_url: '',
}

export default function ImpostazioniPage() {
  const { data: impostazioni, isLoading } = useSWR<Impostazioni>('/api/admin/impostazioni', fetcher)
  const [formData, setFormData] = useState<Impostazioni>(defaultImpostazioni)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (impostazioni) {
      setFormData({
        ragione_sociale: impostazioni.ragione_sociale || '',
        indirizzo: impostazioni.indirizzo || '',
        cap: impostazioni.cap || '',
        citta: impostazioni.citta || '',
        provincia: impostazioni.provincia || '',
        paese: impostazioni.paese || 'Italia',
        partita_iva: impostazioni.partita_iva || '',
        email: impostazioni.email || '',
        telefono: impostazioni.telefono || '',
        sito_web: impostazioni.sito_web || '',
        origine_default: impostazioni.origine_default || 'Italia – Altopiano del Fucino',
        logo_url: impostazioni.logo_url || '',
      })
    }
  }, [impostazioni])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    
    try {
      await fetch('/api/admin/impostazioni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      mutate('/api/admin/impostazioni')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
    }
    
    setSaving(false)
  }

  const styles = {
    label: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600 as const,
      color: '#555',
      marginBottom: 6,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid #ddd',
      fontSize: 14,
      fontFamily: 'inherit',
      background: '#fff',
      boxSizing: 'border-box' as const,
    },
  }

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        Caricamento...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <h1 className={playfair.className} style={{
          color: '#1a3a2a',
          fontSize: isMobile ? 26 : 34,
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Impostazioni Azienda
        </h1>
        <p style={{ color: '#666', fontSize: isMobile ? 14 : 15 }}>
          Dati utilizzati su etichette, pagina tracciabilita e documenti
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Sezione Dati Azienda */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: isMobile ? 20 : 28,
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h2 className={playfair.className} style={{
            color: '#1a3a2a',
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            marginBottom: isMobile ? 20 : 24,
            paddingBottom: 12,
            borderBottom: '2px solid #c9933a',
          }}>
            Dati Azienda
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? 16 : 20,
          }}>
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <label style={styles.label}>Ragione Sociale</label>
              <input
                type="text"
                value={formData.ragione_sociale}
                onChange={(e) => setFormData({ ...formData, ragione_sociale: e.target.value })}
                style={styles.input}
                placeholder="es. Azienda Agricola Parisse Gianni"
              />
            </div>

            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <label style={styles.label}>Indirizzo</label>
              <input
                type="text"
                value={formData.indirizzo}
                onChange={(e) => setFormData({ ...formData, indirizzo: e.target.value })}
                style={styles.input}
                placeholder="es. Via Roma 123"
              />
            </div>

            <div>
              <label style={styles.label}>CAP</label>
              <input
                type="text"
                value={formData.cap}
                onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                style={styles.input}
                placeholder="es. 67057"
              />
            </div>

            <div>
              <label style={styles.label}>Citta</label>
              <input
                type="text"
                value={formData.citta}
                onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
                style={styles.input}
                placeholder="es. Pescina"
              />
            </div>

            <div>
              <label style={styles.label}>Provincia</label>
              <input
                type="text"
                value={formData.provincia}
                onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                style={styles.input}
                placeholder="es. AQ"
              />
            </div>

            <div>
              <label style={styles.label}>Paese</label>
              <input
                type="text"
                value={formData.paese}
                onChange={(e) => setFormData({ ...formData, paese: e.target.value })}
                style={styles.input}
                placeholder="es. Italia"
              />
            </div>

            <div>
              <label style={styles.label}>P.IVA</label>
              <input
                type="text"
                value={formData.partita_iva}
                onChange={(e) => setFormData({ ...formData, partita_iva: e.target.value })}
                style={styles.input}
                placeholder="es. 01234567890"
              />
            </div>

            <div>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
                placeholder="es. info@azienda.it"
              />
            </div>

            <div>
              <label style={styles.label}>Telefono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                style={styles.input}
                placeholder="es. +39 0863 123456"
              />
            </div>

            <div>
              <label style={styles.label}>Sito Web</label>
              <input
                type="text"
                value={formData.sito_web}
                onChange={(e) => setFormData({ ...formData, sito_web: e.target.value })}
                style={styles.input}
                placeholder="es. www.gianniparisse.it"
              />
            </div>

            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <label style={styles.label}>Origine Default Prodotti</label>
              <input
                type="text"
                value={formData.origine_default}
                onChange={(e) => setFormData({ ...formData, origine_default: e.target.value })}
                style={styles.input}
                placeholder="es. Italia – Altopiano del Fucino"
              />
            </div>
          </div>
        </div>

        {/* Sezione Logo */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: isMobile ? 20 : 28,
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h2 className={playfair.className} style={{
            color: '#1a3a2a',
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            marginBottom: isMobile ? 20 : 24,
            paddingBottom: 12,
            borderBottom: '2px solid #c9933a',
          }}>
            Logo
          </h2>

          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>URL Logo</label>
            <input
              type="text"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              style={styles.input}
              placeholder="https://esempio.com/logo.png"
            />
          </div>

          {formData.logo_url && (
            <div style={{
              background: '#f5f0e8',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 11, color: '#666', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Anteprima Logo
              </p>
              <img
                src={formData.logo_url}
                alt="Logo azienda"
                style={{
                  maxWidth: 200,
                  maxHeight: 100,
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Bottone Salva */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 32px',
              background: '#c9933a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
          </button>

          {saved && (
            <span style={{
              color: '#16a34a',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              Impostazioni salvate!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
