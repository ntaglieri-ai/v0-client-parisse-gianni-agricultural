import { getDb } from '@/lib/admin-db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: codice_lotto } = await params
    console.log('[v0] Cercando lotto:', codice_lotto)
    console.log('[v0] DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('[v0] DATABASE_URL_UNPOOLED exists:', !!process.env.DATABASE_URL_UNPOOLED)
    const sql = getDb()
    
    const result = await sql`
      SELECT 
        l.*, 
        l.tmc,
        l.condizioni_conservazione,
        p.nome, p.categoria, p.descrizione, p.immagine, p.unita,
        p.ingredienti, p.valori_nutrizionali, p.allergeni, p.categoria_etichetta
      FROM lotti l
      JOIN prodotti p ON p.id = l.prodotto_id
      WHERE l.codice_lotto = ${codice_lotto}
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Lotto non trovato' }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching lotto:', error)
    return NextResponse.json({ error: 'Errore nel recupero dei dati' }, { status: 500 })
  }
}
