import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      prodotto_id, codice_lotto, campo, comune, 
      data_semina, data_raccolta, kg_totali, kg_disponibili, 
      prezzo, tmc, condizioni_conservazione, certificazioni, note, attivo 
    } = body
    
    const result = await sql`
      UPDATE lotti 
      SET 
        prodotto_id = ${prodotto_id},
        codice_lotto = ${codice_lotto},
        campo = ${campo || null},
        comune = ${comune || null},
        data_semina = ${data_semina || null},
        data_raccolta = ${data_raccolta || null},
        kg_totali = ${kg_totali || 0},
        kg_disponibili = ${kg_disponibili || 0},
        prezzo = ${prezzo || null},
        tmc = ${tmc || null},
        condizioni_conservazione = ${condizioni_conservazione || null},
        certificazioni = ${certificazioni || null},
        note = ${note || null},
        attivo = ${attivo}
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating lotto:', error)
    return NextResponse.json({ error: 'Errore aggiornamento lotto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await sql`DELETE FROM lotti WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lotto:', error)
    return NextResponse.json({ error: 'Errore eliminazione lotto' }, { status: 500 })
  }
}
