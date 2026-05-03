import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, telefono, indirizzo, citta, cap, note, items, totale_articoli } = body

    // Validate required fields
    if (!nome || !email || !telefono || !indirizzo || !citta || !cap || !items || items.length === 0) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    // Insert order into database
    const result = await sql`
      INSERT INTO ordini (nome, email, telefono, indirizzo, citta, cap, note, items, totale_articoli, stato)
      VALUES (${nome}, ${email}, ${telefono}, ${indirizzo}, ${citta}, ${cap}, ${note || ''}, ${JSON.stringify(items)}, ${totale_articoli}, 'nuovo')
      RETURNING id, created_at
    `

    const ordine = result[0]

    // Send confirmation email (optional - requires Resend API key)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        const itemsList = items.map((item: { nome: string; quantita: number }) => 
          `- ${item.nome} x${item.quantita}`
        ).join('\n')

        await resend.emails.send({
          from: 'Azienda Agricola Parisse <ordini@parisse.it>',
          to: email,
          subject: `Conferma Ordine #${ordine.id} - Azienda Agricola Parisse`,
          text: `
Grazie per il tuo ordine!

Ordine #${ordine.id}
Data: ${new Date(ordine.created_at).toLocaleDateString('it-IT')}

Prodotti ordinati:
${itemsList}

Totale articoli: ${totale_articoli}

Indirizzo di consegna:
${nome}
${indirizzo}
${cap} ${citta}

Ti contatteremo presto per confermare la consegna.

Azienda Agricola Parisse Gianni
Pescina (AQ)
          `.trim()
        })

        // Send notification to admin
        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: 'Ordini Parisse <ordini@parisse.it>',
            to: process.env.ADMIN_EMAIL,
            subject: `Nuovo Ordine #${ordine.id}`,
            text: `
Nuovo ordine ricevuto!

Ordine #${ordine.id}
Cliente: ${nome}
Email: ${email}
Telefono: ${telefono}

Prodotti:
${itemsList}

Totale articoli: ${totale_articoli}

Indirizzo:
${indirizzo}
${cap} ${citta}

Note: ${note || 'Nessuna'}
            `.trim()
          })
        }
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      ordine_id: ordine.id,
      message: 'Ordine ricevuto con successo'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Errore nella creazione ordine' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const stato = searchParams.get('stato')
    
    let ordini
    if (stato) {
      ordini = await sql`
        SELECT * FROM ordini 
        WHERE stato = ${stato}
        ORDER BY created_at DESC
      `
    } else {
      ordini = await sql`
        SELECT * FROM ordini 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(ordini)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Errore nel recupero ordini' }, { status: 500 })
  }
}
