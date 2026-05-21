import { getDb } from '@/lib/admin-db'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const sql = getDb()
  const { searchParams } = new URL(request.url)
  const prodotto_id = searchParams.get('prodotto_id')
  
  try {
    let lotti
    if (prodotto_id) {
      lotti = await sql`
        SELECT l.*, p.nome as prodotto_nome, p.categoria as prodotto_categoria
        FROM lotti l
        LEFT JOIN prodotti p ON l.prodotto_id = p.id
        WHERE l.prodotto_id = ${prodotto_id}
        ORDER BY l.created_at DESC
      `
    } else {
      lotti = await sql`
        SELECT l.*, p.nome as prodotto_nome, p.categoria as prodotto_categoria
        FROM lotti l
        LEFT JOIN prodotti p ON l.prodotto_id = p.id
        ORDER BY l.created_at DESC
      `
    }
    return NextResponse.json(lotti)
  } catch (error) {
    console.error('Error fetching lotti:', error)
    return NextResponse.json({ error: 'Errore nel caricamento lotti' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const sql = getDb()
  
  try {
    const body = await request.json()
    const { 
      prodotto_id, codice_lotto, campo, comune, 
      data_semina, data_raccolta, kg_totali, kg_disponibili, 
      prezzo, tmc, condizioni_conservazione, certificazioni, note, attivo 
    } = body
    
    const result = await sql`
      INSERT INTO lotti (
        prodotto_id, codice_lotto, campo, comune, 
        data_semina, data_raccolta, kg_totali, kg_disponibili, 
        prezzo, tmc, condizioni_conservazione, certificazioni, note, attivo, created_at
      )
      VALUES (
        ${prodotto_id}, ${codice_lotto}, ${campo}, ${comune}, 
        ${data_semina || null}, ${data_raccolta || null}, ${kg_totali}, ${kg_disponibili}, 
        ${prezzo}, ${tmc || null}, ${condizioni_conservazione || null}, ${certificazioni}, ${note}, ${attivo ?? true}, NOW()
      )
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error creating lotto:', error)
    return NextResponse.json({ error: 'Errore nella creazione lotto' }, { status: 500 })
  }
}
