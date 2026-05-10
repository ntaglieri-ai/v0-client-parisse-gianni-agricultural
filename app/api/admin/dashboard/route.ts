import { getDb } from '@/lib/admin-db'
import { NextResponse } from 'next/server'

export async function GET() {
  const sql = getDb()
  
  try {
    // Ordini oggi
    const ordiniOggi = await sql`
      SELECT COUNT(*) as count FROM ordini 
      WHERE DATE(created_at) = CURRENT_DATE
    `
    
    // Ordini questo mese
    const ordiniMese = await sql`
      SELECT COUNT(*) as count FROM ordini 
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `
    
    // Prodotti attivi
    const prodottiAttivi = await sql`
      SELECT COUNT(*) as count FROM prodotti WHERE attivo = true
    `
    
    // Lotti attivi
    const lottiAttivi = await sql`
      SELECT COUNT(*) as count FROM lotti WHERE attivo = true
    `
    
    // Ultimi 5 ordini
    const ultimiOrdini = await sql`
      SELECT id, nome, stato, totale_articoli, created_at 
      FROM ordini 
      ORDER BY created_at DESC 
      LIMIT 5
    `
    
    return NextResponse.json({
      ordiniOggi: parseInt(ordiniOggi[0]?.count || '0'),
      ordiniMese: parseInt(ordiniMese[0]?.count || '0'),
      prodottiAttivi: parseInt(prodottiAttivi[0]?.count || '0'),
      lottiAttivi: parseInt(lottiAttivi[0]?.count || '0'),
      ultimiOrdini
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Errore nel caricamento dashboard' }, { status: 500 })
  }
}
