import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_fTAO9JBPFbi3@ep-delicate-voice-a2soxn5e-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'

function getDb() {
  return neon(DATABASE_URL)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb()
  try {
    const { id } = await params
    const body = await request.json()
    const { stato } = body

    if (!stato) {
      return NextResponse.json({ error: 'Stato richiesto' }, { status: 400 })
    }

    const validStati = ['nuovo', 'confermato', 'in_preparazione', 'spedito', 'consegnato', 'annullato']
    if (!validStati.includes(stato)) {
      return NextResponse.json({ error: 'Stato non valido' }, { status: 400 })
    }

    const result = await sql`
      UPDATE ordini 
      SET stato = ${stato}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Errore aggiornamento ordine' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb()
  try {
    const { id } = await params
    
    const result = await sql`
      SELECT * FROM ordini WHERE id = ${parseInt(id)}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Errore recupero ordine' }, { status: 500 })
  }
}
