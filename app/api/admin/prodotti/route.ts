import { getDb } from '@/lib/admin-db'
import { NextResponse } from 'next/server'

export async function GET() {
  const sql = getDb()
  
  try {
    const prodotti = await sql`
      SELECT * FROM prodotti ORDER BY categoria, nome
    `
    return NextResponse.json(prodotti)
  } catch (error) {
    console.error('Error fetching prodotti:', error)
    return NextResponse.json({ error: 'Errore nel caricamento prodotti' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const sql = getDb()
  
  try {
    const body = await request.json()
    const { nome, categoria, descrizione, unita, prezzo_base, immagine, attivo } = body
    
    const result = await sql`
      INSERT INTO prodotti (nome, categoria, descrizione, unita, prezzo_base, immagine, attivo, created_at)
      VALUES (${nome}, ${categoria}, ${descrizione}, ${unita}, ${prezzo_base}, ${immagine}, ${attivo ?? true}, NOW())
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating prodotto:', error)
    return NextResponse.json({ error: 'Errore nella creazione prodotto' }, { status: 500 })
  }
}
