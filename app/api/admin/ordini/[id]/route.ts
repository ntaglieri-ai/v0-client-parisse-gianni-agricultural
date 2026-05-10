import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`SELECT * FROM ordini WHERE id = ${id}`
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching ordine:', error)
    return NextResponse.json({ error: 'Errore caricamento ordine' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stato } = body
    
    const result = await sql`
      UPDATE ordini 
      SET stato = ${stato}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating ordine:', error)
    return NextResponse.json({ error: 'Errore aggiornamento ordine' }, { status: 500 })
  }
}
