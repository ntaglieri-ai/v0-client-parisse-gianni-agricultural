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
      nome, categoria, descrizione, unita, prezzo_base, immagine, attivo,
      ingredienti, allergeni, categoria_etichetta, origine, peso_netto, valori_nutrizionali
    } = body
    
    const result = await sql`
      UPDATE prodotti 
      SET 
        nome = ${nome},
        categoria = ${categoria},
        descrizione = ${descrizione || null},
        unita = ${unita},
        prezzo_base = ${prezzo_base || null},
        immagine = ${immagine || null},
        attivo = ${attivo},
        ingredienti = ${ingredienti || null},
        allergeni = ${allergeni || null},
        categoria_etichetta = ${categoria_etichetta || null},
        origine = ${origine || null},
        peso_netto = ${peso_netto || null},
        valori_nutrizionali = ${valori_nutrizionali ? JSON.stringify(valori_nutrizionali) : null}
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating prodotto:', error)
    return NextResponse.json({ error: 'Errore aggiornamento prodotto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await sql`DELETE FROM prodotti WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prodotto:', error)
    return NextResponse.json({ error: 'Errore eliminazione prodotto' }, { status: 500 })
  }
}
