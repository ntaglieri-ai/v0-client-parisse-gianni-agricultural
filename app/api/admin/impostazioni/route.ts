import { getDb } from '@/lib/admin-db'
import { NextResponse } from 'next/server'

export async function GET() {
  const sql = getDb()
  
  try {
    const result = await sql`
      SELECT * FROM impostazioni_azienda LIMIT 1
    `
    return NextResponse.json(result[0] || null)
  } catch (error) {
    console.error('Error fetching impostazioni:', error)
    return NextResponse.json({ error: 'Errore nel caricamento impostazioni' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const sql = getDb()
  
  try {
    const body = await request.json()
    const { 
      ragione_sociale, indirizzo, cap, citta, provincia, paese,
      partita_iva, email, telefono, sito_web, origine_default, logo_url
    } = body
    
    // Check if record exists
    const existing = await sql`SELECT id FROM impostazioni_azienda LIMIT 1`
    
    if (existing.length > 0) {
      // Update existing
      const result = await sql`
        UPDATE impostazioni_azienda 
        SET 
          ragione_sociale = ${ragione_sociale || null},
          indirizzo = ${indirizzo || null},
          cap = ${cap || null},
          citta = ${citta || null},
          provincia = ${provincia || null},
          paese = ${paese || null},
          partita_iva = ${partita_iva || null},
          email = ${email || null},
          telefono = ${telefono || null},
          sito_web = ${sito_web || null},
          origine_default = ${origine_default || null},
          logo_url = ${logo_url || null},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    } else {
      // Insert new
      const result = await sql`
        INSERT INTO impostazioni_azienda (
          ragione_sociale, indirizzo, cap, citta, provincia, paese,
          partita_iva, email, telefono, sito_web, origine_default, logo_url
        )
        VALUES (
          ${ragione_sociale || null}, ${indirizzo || null}, ${cap || null},
          ${citta || null}, ${provincia || null}, ${paese || null},
          ${partita_iva || null}, ${email || null}, ${telefono || null},
          ${sito_web || null}, ${origine_default || null}, ${logo_url || null}
        )
        RETURNING *
      `
      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error('Error saving impostazioni:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio impostazioni' }, { status: 500 })
  }
}
