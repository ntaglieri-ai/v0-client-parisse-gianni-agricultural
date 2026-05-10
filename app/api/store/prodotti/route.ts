import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_fTAO9JBPFbi3@ep-delicate-voice-alsoxn5e-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'

export async function GET() {
  try {
    const sql = neon(DATABASE_URL)
    
    const prodotti = await sql`
      SELECT 
        p.id, p.nome, p.categoria, p.descrizione, p.unita, p.immagine,
        json_agg(
          json_build_object(
            'id', l.id,
            'codice_lotto', l.codice_lotto,
            'prezzo', l.prezzo,
            'kg_disponibili', l.kg_disponibili,
            'campo', l.campo,
            'comune', l.comune,
            'data_raccolta', l.data_raccolta
          ) ORDER BY l.created_at DESC
        ) FILTER (WHERE l.id IS NOT NULL AND l.attivo = true) as lotti
      FROM prodotti p
      LEFT JOIN lotti l ON l.prodotto_id = p.id AND l.attivo = true
      WHERE p.attivo = true
      GROUP BY p.id
      ORDER BY p.categoria, p.nome
    `
    
    return NextResponse.json(prodotti)
  } catch (error) {
    console.error('Error fetching store products:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento dei prodotti' },
      { status: 500 }
    )
  }
}
