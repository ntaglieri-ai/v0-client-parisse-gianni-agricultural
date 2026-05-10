'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem('admin_auth', 'true')
        setIsAuthenticated(true)
      } else {
        setError('Credenziali non valide')
      }
      setLoginLoading(false)
    }, 500)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f3ef',
      }}>
        <div style={{ color: '#1a3a2a', fontSize: 18 }}>Caricamento...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f3ef',
        padding: 20,
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 400,
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#1a3a2a',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Area Riservata
          </h1>
          <p style={{
            color: '#666',
            fontSize: 14,
            marginBottom: 32,
            textAlign: 'center',
          }}>
            Accedi per gestire ordini e prodotti
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1a3a2a',
                marginBottom: 8,
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#c9933a'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1a3a2a',
                marginBottom: 8,
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#c9933a'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                required
              />
            </div>

            {error && (
              <div style={{
                background: '#fee',
                color: '#c00',
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 14,
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: loginLoading ? '#ccc' : '#1a3a2a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loginLoading ? 'Accesso...' : 'Accedi'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                color: '#999',
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Torna al sito
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f3ef',
      padding: 20,
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: '#1a3a2a',
        }}>
          Area Riservata
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#1a3a2a',
            border: '1px solid #1a3a2a',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Torna alla Home
        </button>
      </div>

      {/* Main Content - Two Big Buttons */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: '40px 0',
      }}>
        <Link
          href="/admin/prodotti"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            background: '#1a3a2a',
            color: '#fff',
            borderRadius: 16,
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ fontSize: 48, marginBottom: 16 }}>📦</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 700,
          }}>
            Prodotti
          </span>
          <span style={{
            fontSize: 16,
            opacity: 0.8,
            marginTop: 8,
          }}>
            Gestisci catalogo e disponibilita
          </span>
        </Link>

        <Link
          href="/admin/ordini"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            background: '#c9933a',
            color: '#fff',
            borderRadius: 16,
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ fontSize: 48, marginBottom: 16 }}>📋</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 700,
          }}>
            Ordini
          </span>
          <span style={{
            fontSize: 16,
            opacity: 0.8,
            marginTop: 8,
          }}>
            Visualizza e gestisci gli ordini
          </span>
        </Link>
      </div>
    </div>
  )
}
