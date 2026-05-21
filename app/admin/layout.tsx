'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })

// Context per l'autenticazione
const AuthContext = createContext<{
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Prodotti', href: '/admin/prodotti', icon: '📦' },
  { name: 'Ordini', href: '/admin/ordini', icon: '🛒' },
  { name: 'Etichette', href: '/admin/etichette', icon: '🏷️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    setIsAuthenticated(auth === 'true')
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const login = () => {
    localStorage.setItem('admin_auth', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    router.push('/')
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f0e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#1a3a2a', fontSize: 16 }}>Caricamento...</div>
      </div>
    )
  }

  // Login page
  if (!isAuthenticated && pathname !== '/admin/login') {
    router.push('/admin/login')
    return null
  }

  // Login page doesn't need layout
  if (pathname === '/admin/login') {
    return (
      <AuthContext.Provider value={{ isAuthenticated: isAuthenticated || false, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: isAuthenticated || false, login, logout }}>
        <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
          
          {/* Mobile Header - Premium */}
          <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5240 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 1001,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: 18,
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <h1 className={playfair.className} style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              letterSpacing: 0.3,
            }}>
              Admin
            </h1>
            <Link
              href="/"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: 12,
                padding: '8px 12px',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              Sito
            </Link>
          </header>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                top: 56,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999,
                backdropFilter: 'blur(2px)',
              }}
            />
          )}

          {/* Mobile Sidebar */}
          <aside style={{
            width: 280,
            background: 'linear-gradient(180deg, #1a3a2a 0%, #152e22 100%)',
            position: 'fixed',
            left: sidebarOpen ? 0 : -280,
            top: 56,
            bottom: 0,
            zIndex: 1000,
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowY: 'auto',
            boxShadow: sidebarOpen ? '4px 0 20px rgba(0,0,0,0.2)' : 'none',
          }}>
            <div style={{ padding: '20px 20px 16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
                Navigazione
              </p>
            </div>

            <nav>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 20px',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      background: isActive ? 'rgba(201,147,58,0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #c9933a' : '3px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div style={{ padding: 20, marginTop: 20 }}>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: 8,
                  color: '#fca5a5',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Esci
              </button>
            </div>
          </aside>

          {/* Main content - Mobile */}
          <main style={{
            paddingTop: 56,
            minHeight: '100vh',
          }}>
            <div style={{ padding: 16 }}>
              {children}
            </div>
          </main>
        </div>
      </AuthContext.Provider>
    )
  }

  // Desktop Layout (unchanged)
  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated || false, login, logout }}>
      <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex' }}>
        
        {/* Desktop Sidebar */}
        <aside style={{
          width: 260,
          background: '#1a3a2a',
          minHeight: '100vh',
          padding: '24px 0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          <div style={{ padding: '0 24px', marginBottom: 40 }}>
            <h1 className={playfair.className} style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
            }}>
              Area Riservata
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
              Gianni Parisse
            </p>
          </div>

          <nav>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 24px',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? 'rgba(201,147,58,0.2)' : 'transparent',
                    borderLeft: isActive ? '3px solid #c9933a' : '3px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <Link
              href="/"
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Vai al Sito
            </Link>
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Esci
            </button>
          </div>
        </aside>

        {/* Desktop Main content */}
        <main style={{
          flex: 1,
          marginLeft: 260,
          padding: 32,
          minHeight: '100vh',
        }}>
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
}
