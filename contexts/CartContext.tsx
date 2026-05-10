'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// New cart item structure that supports lotto info
export type CartItem = {
  id: string // unique identifier: prodotto_id-lotto_id
  prodotto_id: number
  lotto_id: number
  codice_lotto: string
  nome: string
  prezzo: number
  unita: string
  immagine: string | null
  categoria: string
  quantita: number
}

type CartContextType = {
  items: CartItem[]
  aggiungi: (item: Omit<CartItem, 'quantita'>, quantita?: number) => void
  rimuovi: (itemId: string) => void
  aggiorna: (itemId: string, quantita: number) => void
  svuota: () => void
  totaleArticoli: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('carrello')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        // ignore invalid JSON
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('carrello', JSON.stringify(items))
    }
  }, [items, isHydrated])

  const aggiungi = (item: Omit<CartItem, 'quantita'>, quantita = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantita: i.quantita + quantita }
            : i
        )
      }
      return [...prev, { ...item, quantita }]
    })
  }

  const rimuovi = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  const aggiorna = (itemId: string, quantita: number) => {
    if (quantita <= 0) {
      rimuovi(itemId)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, quantita } : i
      )
    )
  }

  const svuota = () => {
    setItems([])
  }

  const totaleArticoli = items.reduce((acc, i) => acc + i.quantita, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        aggiungi,
        rimuovi,
        aggiorna,
        svuota,
        totaleArticoli,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
