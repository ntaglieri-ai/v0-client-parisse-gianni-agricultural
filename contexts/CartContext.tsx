'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Prodotto } from '@/lib/prodotti'

export type CartItem = {
  prodotto: Prodotto
  quantita: number
}

type CartContextType = {
  items: CartItem[]
  aggiungi: (prodotto: Prodotto, quantita?: number) => void
  rimuovi: (prodottoId: string) => void
  aggiorna: (prodottoId: string, quantita: number) => void
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

  const aggiungi = (prodotto: Prodotto, quantita = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.prodotto.id === prodotto.id)
      if (existing) {
        return prev.map(i =>
          i.prodotto.id === prodotto.id
            ? { ...i, quantita: i.quantita + quantita }
            : i
        )
      }
      return [...prev, { prodotto, quantita }]
    })
  }

  const rimuovi = (prodottoId: string) => {
    setItems(prev => prev.filter(i => i.prodotto.id !== prodottoId))
  }

  const aggiorna = (prodottoId: string, quantita: number) => {
    if (quantita <= 0) {
      rimuovi(prodottoId)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.prodotto.id === prodottoId ? { ...i, quantita } : i
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
