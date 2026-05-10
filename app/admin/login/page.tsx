'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Playfair_Display } from 'next/font/google'
import { useAuth } from '../layout'

const playfair = Playfair_Display({ subsets: ['latin'] })

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check password - using env var or default
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin'
    
    if (password === adminPassword) {
      login()
      router.push('/admin/dashboard')
    } else {
      setError('Password non corretta')
    }
    
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f0e8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 48,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            background: '#1a3a2a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ fontSize: 28 }}>🔐</span>
          </div>
          <h1 className={playfair.className} style={{
            color: '#1a3a2a',
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
          }}>
            Area Riservata
          </h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
            Gianni Parisse - Azienda Agricola
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              color: '#1a3a2a',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la password"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#c9933a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 24,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: '#1a3a2a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a
            href="/"
            style={{
              color: '#666',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Torna al sito
          </a>
        </div>
      </div>
    </div>
  )
}
