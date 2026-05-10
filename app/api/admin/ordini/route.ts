import { getDb } from '@/lib/admin-db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const sql = getDb()
  const { searchParams } = new URL(request.url)
  const stato = searchParams.get('stato')
  
  try {
    let ordini
    if (stato && stato !== 'tutti') {
      ordini = await sql`
        SELECT * FROM ordini 
        WHERE stato = ${stato}
        ORDER BY created_at DESC
      `
    } else {
      ordini = await sql`
        SELECT * FROM ordini ORDER BY created_at DESC
      `
    }
    return NextResponse.json(ordini)
  } catch (error) {
    console.error('Error fetching ordini:', error)
    return NextResponse.json({ error: 'Errore nel caricamento ordini' }, { status: 500 })
  }
}
