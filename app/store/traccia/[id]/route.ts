import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const result = await sql`
      SELECT 
        l.id, l.codice_lotto, l.campo, l.comune, 
        l.data_semina, l.data_raccolta,
        l.kg_totali, l.kg_disponibili, l.prezzo, 
        l.tmc, l.condizioni_conservazione,
        l.allergeni_lotto, l.certificazioni, l.note,
        p.nome, p.categoria, p.descrizione, p.immagine, p.unita,
        p.ingredienti, p.valori_nutrizionali, p.allergeni, 
        p.categoria_etichetta
      FROM lotti l
      JOIN prodotti p ON p.id = l.prodotto_id
      WHERE l.codice_lotto = ${params.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lotto non trovato' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Errore query traccia:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
