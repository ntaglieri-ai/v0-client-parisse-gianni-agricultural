'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Credenziali admin hardcoded
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin'

type Step = {
  icon: string
  label: string
  data: string
  done: boolean
}

type Prodotto = {
  id: string
  nome: string
  cat: 'ortaggi' | 'legumi' | 'cereali' | 'farine' | 'trasformati' | 'pasta'
  emoji: string
  bio: boolean
  bg: string
  img?: string
  prezzo: string
  unita: string
  desc: string
  lotto: string
  raccolta: string
  campo: string
  varieta: string
  metodo: string
  cert: string
  steps: Step[]
  attivo: boolean
}

const CATEGORIE = [
  { id: 'tutti', label: 'Tutti', color: '#1a3a2a' },
  { id: 'ortaggi', label: 'Ortaggi', color: '#27ae60' },
  { id: 'legumi', label: 'Legumi', color: '#e67e22' },
  { id: 'cereali', label: 'Cereali', color: '#f1c40f' },
  { id: 'farine', label: 'Farine', color: '#9b59b6' },
  { id: 'pasta', label: 'Pasta', color: '#e74c3c' },
  { id: 'trasformati', label: 'Trasformati', color: '#3498db' },
]

// Prodotti iniziali basati su lib/prodotti.ts
const prodottiIniziali: Prodotto[] = [
  // CEREALI
  { id: 'C001', nome: 'Grano Tenero', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/grano_tenero.jpg', prezzo: '', unita: 'kg', desc: "I cereali disegnano il paesaggio e ne scandiscono il tempo.", lotto: '', raccolta: '', campo: '', varieta: 'Grano Tenero', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C002', nome: 'Grano Duro', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/grano_duro.jpg', prezzo: '', unita: 'kg', desc: "I cereali disegnano il paesaggio e ne scandiscono il tempo.", lotto: '', raccolta: '', campo: '', varieta: 'Grano Duro', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C003', nome: 'Grano Solina', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/grano_solina.jpg', prezzo: '', unita: 'kg', desc: "Varieta antica tipica dell'Appennino abruzzese.", lotto: '', raccolta: '', campo: '', varieta: 'Solina', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C004', nome: 'Grano Senatore Cappelli', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/grano_senatore_cappelli.jpg', prezzo: '', unita: 'kg', desc: "Varieta storica di grano duro, ricca di proteine.", lotto: '', raccolta: '', campo: '', varieta: 'Senatore Cappelli', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C005', nome: 'Orzo', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/orzo.jpg', prezzo: '', unita: 'kg', desc: "Cereale versatile e nutriente, coltivato nei campi del Fucino.", lotto: '', raccolta: '', campo: '', varieta: 'Orzo', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C006', nome: 'Mais', cat: 'cereali', emoji: '🌽', bio: false, bg: '#fdf6e3', img: '/images/prodotti/mais.jpg', prezzo: '', unita: 'kg', desc: "Mais coltivato nelle fertili pianure del Fucino.", lotto: '', raccolta: '', campo: '', varieta: 'Mais', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'C007', nome: 'Farro', cat: 'cereali', emoji: '🌾', bio: false, bg: '#fdf6e3', img: '/images/prodotti/farro.jpg', prezzo: '', unita: 'kg', desc: "Antico cereale ricco di proteine, fibre e minerali.", lotto: '', raccolta: '', campo: '', varieta: 'Farro', metodo: '', cert: '', steps: [], attivo: true },
  
  // LEGUMI
  { id: 'L001', nome: 'Fagioli Borlotti', cat: 'legumi', emoji: '🫘', bio: false, bg: '#fdf2e9', img: '/images/prodotti/fagioli_borlotti.jpg', prezzo: '', unita: 'kg', desc: "I legumi rappresentano l'essenza di una cucina semplice e nutriente.", lotto: '', raccolta: '', campo: '', varieta: 'Borlotti', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'L002', nome: 'Fagioli Cannellini', cat: 'legumi', emoji: '🫘', bio: false, bg: '#fdf2e9', img: '/images/prodotti/fagioli_cannellini.jpg', prezzo: '', unita: 'kg', desc: "Legumi dalla consistenza cremosa.", lotto: '', raccolta: '', campo: '', varieta: 'Cannellini', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'L003', nome: 'Ceci', cat: 'legumi', emoji: '🫘', bio: false, bg: '#fdf2e9', img: '/images/prodotti/ceci.jpg', prezzo: '', unita: 'kg', desc: "Ceci coltivati nelle campagne della Marsica.", lotto: '', raccolta: '', campo: '', varieta: 'Ceci', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'L004', nome: 'Lenticchie', cat: 'legumi', emoji: '🫘', bio: false, bg: '#fdf2e9', img: '/images/prodotti/lenticchie.jpg', prezzo: '', unita: 'kg', desc: "Lenticchie della Marsica, piccole e profumate.", lotto: '', raccolta: '', campo: '', varieta: 'Lenticchie', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'L005', nome: 'Piselli', cat: 'legumi', emoji: '🟢', bio: false, bg: '#fdf2e9', img: '/images/prodotti/piselli.jpg', prezzo: '', unita: 'kg', desc: "Piselli freschi coltivati nelle campagne di Pescina.", lotto: '', raccolta: '', campo: '', varieta: 'Piselli', metodo: '', cert: '', steps: [], attivo: true },
  
  // FARINE
  { id: 'F001', nome: 'Farina di Grano Tenero', cat: 'farine', emoji: '🌾', bio: false, bg: '#fef9e7', img: '/images/prodotti/farina_di_grano_tenero.jpg', prezzo: '', unita: 'kg', desc: "Farina derivata da cereali coltivati nei nostri campi.", lotto: '', raccolta: '', campo: '', varieta: 'Grano Tenero', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'F002', nome: 'Farina di Grano Duro', cat: 'farine', emoji: '🌾', bio: false, bg: '#fef9e7', img: '/images/prodotti/farina_di_grano_duro.jpg', prezzo: '', unita: 'kg', desc: "Farina di semola da grano duro coltivato nel Fucino.", lotto: '', raccolta: '', campo: '', varieta: 'Grano Duro', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'F003', nome: 'Farina di Ceci', cat: 'farine', emoji: '🟡', bio: false, bg: '#fef9e7', img: '/images/prodotti/farina_di_ceci.jpg', prezzo: '', unita: 'kg', desc: "Farina di ceci ottenuta da legumi coltivati in azienda.", lotto: '', raccolta: '', campo: '', varieta: 'Ceci', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'F004', nome: 'Farina di Farro', cat: 'farine', emoji: '🌾', bio: false, bg: '#fef9e7', img: '/images/prodotti/farina_di_farro.jpg', prezzo: '', unita: 'kg', desc: "Farina di farro macinata da cereale antico.", lotto: '', raccolta: '', campo: '', varieta: 'Farro', metodo: '', cert: '', steps: [], attivo: true },
  
  // ORTAGGI
  { id: 'O001', nome: 'Patate', cat: 'ortaggi', emoji: '🥔', bio: false, bg: '#f0f4e8', img: '/images/prodotti/patate.jpg', prezzo: '', unita: 'kg', desc: "Patate coltivate nelle campagne di Pescina.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O002', nome: 'Carote', cat: 'ortaggi', emoji: '🥕', bio: false, bg: '#f0f4e8', img: '/images/prodotti/carote.webp', prezzo: '', unita: 'kg', desc: "Carote coltivate nei campi del Fucino.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O003', nome: 'Cipolle', cat: 'ortaggi', emoji: '🧅', bio: false, bg: '#f0f4e8', img: '/images/prodotti/cipolle.webp', prezzo: '', unita: 'kg', desc: "Cipolle coltivate nel cuore della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O004', nome: 'Aglio', cat: 'ortaggi', emoji: '🧄', bio: false, bg: '#f0f4e8', img: '/images/prodotti/aglio.webp', prezzo: '', unita: 'kg', desc: "Aglio coltivato nelle campagne di Pescina.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O005', nome: 'Radicchio', cat: 'ortaggi', emoji: '🥬', bio: false, bg: '#f0f4e8', img: '/images/prodotti/radicchio.jpg', prezzo: '', unita: 'kg', desc: "Radicchio fresco coltivato nei campi della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O006', nome: 'Finocchi', cat: 'ortaggi', emoji: '🌿', bio: false, bg: '#f0f4e8', img: '/images/prodotti/finocchi.jpg', prezzo: '', unita: 'kg', desc: "Finocchi coltivati con cura nel cuore della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O007', nome: 'Cavoli', cat: 'ortaggi', emoji: '🥦', bio: false, bg: '#f0f4e8', img: '/images/prodotti/cavoli.jpg', prezzo: '', unita: 'kg', desc: "Cavoli coltivati nelle campagne di Pescina.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O008', nome: 'Pomodori', cat: 'ortaggi', emoji: '🍅', bio: false, bg: '#f0f4e8', img: '/images/prodotti/pomodori.jpg', prezzo: '', unita: 'kg', desc: "Pomodori coltivati nel cuore della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O009', nome: 'Zucchine', cat: 'ortaggi', emoji: '🥒', bio: false, bg: '#f0f4e8', img: '/images/prodotti/zucchine.webp', prezzo: '', unita: 'kg', desc: "Zucchine coltivate nelle campagne di Pescina.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O010', nome: 'Melanzane', cat: 'ortaggi', emoji: '🍆', bio: false, bg: '#f0f4e8', img: '/images/prodotti/melanzane.jpg', prezzo: '', unita: 'kg', desc: "Melanzane coltivate nel cuore della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O011', nome: 'Peperoni', cat: 'ortaggi', emoji: '🫑', bio: false, bg: '#f0f4e8', img: '/images/prodotti/peperoni.jpg', prezzo: '', unita: 'kg', desc: "Peperoni colorati coltivati nel Fucino.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O012', nome: 'Insalate', cat: 'ortaggi', emoji: '🥗', bio: false, bg: '#f0f4e8', img: '/images/prodotti/insalate.jpg', prezzo: '', unita: 'kg', desc: "Insalate fresche coltivate nella Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'O013', nome: 'Spinaci', cat: 'ortaggi', emoji: '🥬', bio: false, bg: '#f0f4e8', img: '/images/prodotti/spinaci.jpg', prezzo: '', unita: 'kg', desc: "Spinaci freschi dal cuore della Marsica.", lotto: '', raccolta: '', campo: '', varieta: '', metodo: '', cert: '', steps: [], attivo: true },
  
  // PASTA
  { id: 'P001', nome: 'Pasta di Grano Duro', cat: 'pasta', emoji: '🍝', bio: false, bg: '#fef3e2', img: '/images/prodotti/pasta_grano_duro.jpg', prezzo: '', unita: '500g', desc: "Pasta artigianale da grano duro coltivato in azienda.", lotto: '', raccolta: '', campo: '', varieta: 'Grano Duro', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'P002', nome: 'Pasta di Farro', cat: 'pasta', emoji: '🍝', bio: false, bg: '#fef3e2', img: '/images/prodotti/pasta_farro.jpg', prezzo: '', unita: '500g', desc: "Pasta di farro dalla consistenza unica.", lotto: '', raccolta: '', campo: '', varieta: 'Farro', metodo: '', cert: '', steps: [], attivo: true },
  { id: 'P003', nome: 'Pasta Senatore Cappelli', cat: 'pasta', emoji: '🍝', bio: false, bg: '#fef3e2', img: '/images/prodotti/pasta_senatore_cappelli.jpg', prezzo: '', unita: '500g', desc: "Pasta da grano antico Senatore Cappelli.", lotto: '', raccolta: '', campo: '', varieta: 'Senatore Cappelli', metodo: '', cert: '', steps: [], attivo: true },
]

// Componente Login
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true')
        onLogin()
      } else {
        setError('Credenziali non valide')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)',
      fontFamily: "'Lato', sans-serif",
    }}>
      <div style={{
        background: '#fff',
        padding: 48,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: 400,
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
            fontSize: 28,
          }}>
            📦
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a2a', margin: 0 }}>
            Gestione Prodotti
          </h1>
          <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>
            Accedi per gestire i prodotti
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16,
                transition: 'border-color 0.2s',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a3a2a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16,
                transition: 'border-color 0.2s',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1a3a2a'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
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
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: isLoading ? '#ccc' : '#1a3a2a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Dashboard Prodotti
function ProdottiDashboard({ onLogout }: { onLogout: () => void }) {
  const [prodotti, setProdotti] = useState<Prodotto[]>(prodottiIniziali)
  const [filtroCategoria, setFiltroCategoria] = useState('tutti')
  const [prodottoSelezionato, setProdottoSelezionato] = useState<Prodotto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const prodottiFiltrati = prodotti.filter(p => {
    const matchCategoria = filtroCategoria === 'tutti' || p.cat === filtroCategoria
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategoria && matchSearch
  })

  const toggleAttivo = (id: string) => {
    setProdotti(prev => prev.map(p => 
      p.id === id ? { ...p, attivo: !p.attivo } : p
    ))
  }

  const aggiornaProdotto = (prodottoAggiornato: Prodotto) => {
    setProdotti(prev => prev.map(p => 
      p.id === prodottoAggiornato.id ? prodottoAggiornato : p
    ))
    setProdottoSelezionato(null)
  }

  const conteggiCategorie = CATEGORIE.map(cat => ({
    ...cat,
    count: cat.id === 'tutti' 
      ? prodotti.length 
      : prodotti.filter(p => p.cat === cat.id).length
  }))

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Lato', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: '#1a3a2a',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24 }}>📦</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Gestione Prodotti</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/admin/ordini"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              opacity: 0.8,
              transition: 'opacity 0.2s',
            }}
          >
            Ordini
          </Link>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Esci
          </button>
        </div>
      </header>

      <div style={{ padding: 24 }}>
        {/* Filtri e ricerca */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Cerca prodotto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                minWidth: 250,
                outline: 'none',
              }}
            />
            <span style={{ color: '#666', fontSize: 14 }}>
              {prodottiFiltrati.length} prodotti
            </span>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {conteggiCategorie.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFiltroCategoria(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: filtroCategoria === cat.id ? cat.color : '#f0f0f0',
                  color: filtroCategoria === cat.id ? '#fff' : '#666',
                }}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Griglia prodotti */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {prodottiFiltrati.map(prodotto => (
            <div
              key={prodotto.id}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                opacity: prodotto.attivo ? 1 : 0.6,
                border: `2px solid ${prodotto.attivo ? '#e8e8e8' : '#ffcccc'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: prodotto.bg,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}>
                  {prodotto.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#666',
                      background: '#f0f0f0',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}>
                      {prodotto.id}
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#fff',
                      background: CATEGORIE.find(c => c.id === prodotto.cat)?.color || '#666',
                      padding: '2px 8px',
                      borderRadius: 4,
                      textTransform: 'capitalize',
                    }}>
                      {prodotto.cat}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a3a2a', margin: '4px 0' }}>
                    {prodotto.nome}
                  </h3>
                  <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.4 }}>
                    {prodotto.desc.substring(0, 80)}...
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 16,
                fontSize: 13,
              }}>
                <div>
                  <span style={{ color: '#999' }}>Prezzo: </span>
                  <span style={{ color: prodotto.prezzo ? '#1a3a2a' : '#e74c3c', fontWeight: 600 }}>
                    {prodotto.prezzo || 'Da inserire'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Unita: </span>
                  <span style={{ color: '#1a3a2a', fontWeight: 600 }}>{prodotto.unita}</span>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Lotto: </span>
                  <span style={{ color: prodotto.lotto ? '#1a3a2a' : '#e74c3c', fontWeight: 600 }}>
                    {prodotto.lotto || 'Da inserire'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Raccolta: </span>
                  <span style={{ color: prodotto.raccolta ? '#1a3a2a' : '#e74c3c', fontWeight: 600 }}>
                    {prodotto.raccolta || 'Da inserire'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => setProdottoSelezionato(prodotto)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: '#1a3a2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Modifica
                </button>
                <button
                  onClick={() => toggleAttivo(prodotto.id)}
                  style={{
                    padding: '10px 16px',
                    background: prodotto.attivo ? '#e74c3c' : '#27ae60',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {prodotto.attivo ? 'Disattiva' : 'Attiva'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal modifica prodotto */}
      {prodottoSelezionato && (
        <ModificaProdottoModal
          prodotto={prodottoSelezionato}
          onSave={aggiornaProdotto}
          onClose={() => setProdottoSelezionato(null)}
        />
      )}
    </div>
  )
}

// Modal per modificare prodotto
function ModificaProdottoModal({ 
  prodotto, 
  onSave, 
  onClose 
}: { 
  prodotto: Prodotto
  onSave: (p: Prodotto) => void
  onClose: () => void 
}) {
  const [formData, setFormData] = useState(prodotto)

  const handleChange = (field: keyof Prodotto, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1a3a2a' }}>
            Modifica {prodotto.nome}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Nome
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Prezzo
              </label>
              <input
                type="text"
                value={formData.prezzo}
                onChange={(e) => handleChange('prezzo', e.target.value)}
                placeholder="es. 3.50"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Unita
              </label>
              <input
                type="text"
                value={formData.unita}
                onChange={(e) => handleChange('unita', e.target.value)}
                placeholder="es. kg, 500g"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Lotto
              </label>
              <input
                type="text"
                value={formData.lotto}
                onChange={(e) => handleChange('lotto', e.target.value)}
                placeholder="es. L2024-001"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Data Raccolta
              </label>
              <input
                type="text"
                value={formData.raccolta}
                onChange={(e) => handleChange('raccolta', e.target.value)}
                placeholder="es. Ottobre 2024"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Campo
              </label>
              <input
                type="text"
                value={formData.campo}
                onChange={(e) => handleChange('campo', e.target.value)}
                placeholder="es. Campo Nord - Pescina"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Varieta
              </label>
              <input
                type="text"
                value={formData.varieta}
                onChange={(e) => handleChange('varieta', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Metodo
              </label>
              <input
                type="text"
                value={formData.metodo}
                onChange={(e) => handleChange('metodo', e.target.value)}
                placeholder="es. Tradizionale"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
              Descrizione
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleChange('desc', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
              Certificazione
            </label>
            <input
              type="text"
              value={formData.cert}
              onChange={(e) => handleChange('cert', e.target.value)}
              placeholder="es. GlobalGAP, Bio"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="checkbox"
              id="bio"
              checked={formData.bio}
              onChange={(e) => handleChange('bio', e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="bio" style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
              Prodotto Biologico
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: '#f0f0f0',
                color: '#666',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 24px',
                background: '#1a3a2a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente principale
export default function AdminProdottiPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <p style={{ color: '#666' }}>Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <ProdottiDashboard onLogout={handleLogout} />
}
