import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { Document, Page, Text, View, StyleSheet, renderToBuffer, Image } from '@react-pdf/renderer'
import React from 'react'
import QRCode from 'qrcode'

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || ''

// 1cm = 28.35pt
const CM_TO_PT = 28.35

// Colori
const colors = {
  green: '#1a3a2a',
  gold: '#c9933a',
  cream: '#f5f0e8',
  white: '#ffffff',
  gray: '#666666',
  red: '#c00000',
  orange: '#f97316',
}

// Stili base
const styles = StyleSheet.create({
  // Layout orizzontale
  pageHorizontal: {
    width: 10 * CM_TO_PT,
    height: 6 * CM_TO_PT,
    padding: 8,
    fontFamily: 'Helvetica',
    fontSize: 7,
    backgroundColor: colors.white,
  },
  // Layout verticale
  pageVertical: {
    width: 6 * CM_TO_PT,
    height: 10 * CM_TO_PT,
    padding: 8,
    fontFamily: 'Helvetica',
    fontSize: 7,
    backgroundColor: colors.white,
  },
  // Layout rotonda (quadrato che conterra il cerchio)
  pageRound: {
    width: 10 * CM_TO_PT,
    height: 10 * CM_TO_PT,
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 7,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    marginBottom: 4,
    gap: 6,
  },
  headerVertical: {
    alignItems: 'center',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    marginBottom: 4,
  },
  logo: {
    width: 45,
    height: 18,
    objectFit: 'contain',
  },
  logoVertical: {
    width: 50,
    height: 20,
    objectFit: 'contain',
    marginBottom: 2,
  },
  ragioneSociale: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.green,
    textAlign: 'center',
  },
  indirizzo: {
    fontSize: 5,
    color: colors.gray,
    textAlign: 'center',
  },
  nomeProdotto: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.green,
    marginBottom: 2,
  },
  nomeProdottoVertical: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.green,
    marginBottom: 3,
    textAlign: 'center',
  },
  descrizione: {
    fontSize: 5.5,
    color: colors.gray,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  ingredienti: {
    fontSize: 5.5,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  allergeniBox: {
    backgroundColor: colors.orange,
    padding: '2 4',
    borderRadius: 2,
    marginBottom: 3,
    alignSelf: 'flex-start',
  },
  allergeniText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  allergeniRed: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: colors.red,
    marginBottom: 2,
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
  },
  contentColumn: {
    flex: 1,
  },
  nutritionTable: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 2,
  },
  nutritionHeader: {
    backgroundColor: colors.cream,
    padding: '2 4',
    fontFamily: 'Helvetica-Bold',
    fontSize: 5.5,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1 4',
    fontSize: 5.5,
  },
  nutritionRowAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1 4',
    fontSize: 5.5,
    backgroundColor: '#f9f9f9',
  },
  nutritionRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1 4',
    paddingLeft: 8,
    fontSize: 5.5,
    backgroundColor: '#f9f9f9',
  },
  infoColumn: {
    width: 90,
    fontSize: 5.5,
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 5.5,
    lineHeight: 1.4,
    marginBottom: 1,
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 'auto',
  },
  qrCode: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 2,
  },
  qrCodeVertical: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 2,
  },
  sitoWeb: {
    fontSize: 5,
    color: colors.gray,
  },
  // Rotonda
  roundContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 5 * CM_TO_PT,
    borderWidth: 3,
    borderColor: colors.gold,
    overflow: 'hidden',
    position: 'relative',
  },
  roundWatermark: {
    position: 'absolute',
    top: '35%',
    left: '30%',
    width: '40%',
    height: '40%',
    opacity: 0.1,
  },
  roundContent: {
    flexDirection: 'row',
    padding: 40,
    paddingTop: 50,
    paddingBottom: 50,
    height: '100%',
    alignItems: 'center',
  },
  roundLeftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  roundRightColumn: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundRagioneSociale: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  roundNomeProdotto: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.green,
    marginBottom: 8,
    lineHeight: 1.2,
  },
  roundInfo: {
    fontSize: 7,
    marginBottom: 3,
  },
  roundQrCode: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 3,
    backgroundColor: colors.white,
  },
})

async function generateQRCodeDataURL(text: string): Promise<string> {
  return await QRCode.toDataURL(text, { width: 200, margin: 1 })
}

interface Prodotto {
  id: number
  nome: string
  categoria: string
  descrizione?: string
  unita: string
  immagine?: string
  ingredienti?: string
  allergeni?: string
  categoria_etichetta?: string
  origine?: string
  peso_netto?: string
  energia_kj?: number
  energia_kcal?: number
  grassi?: number
  grassi_saturi?: number
  carboidrati?: number
  zuccheri?: number
  fibre?: number
  proteine?: number
  sale?: number
}

interface Lotto {
  id: number
  prodotto_id: number
  codice_lotto: string
  campo?: string
  comune?: string
  data_semina?: string
  data_raccolta?: string
  kg_totali: number
  kg_disponibili: number
  prezzo?: number
  tmc?: string
  condizioni_conservazione?: string
  certificazioni?: string
  note?: string
  attivo: boolean
}

interface Impostazioni {
  ragione_sociale?: string
  indirizzo?: string
  cap?: string
  citta?: string
  provincia?: string
  paese?: string
  partita_iva?: string
  email?: string
  telefono?: string
  sito_web?: string
  origine_default?: string
  logo_url?: string
}

interface Elementi {
  ingredienti?: boolean
  allergeni?: boolean
  valori_nutrizionali?: boolean
  lotto?: boolean
  tmc?: boolean
  origine?: boolean
  conservazione?: boolean
  peso_netto?: boolean
  qr_code?: boolean
  email?: boolean
  telefono?: boolean
  piva?: boolean
}

// Componente PDF Orizzontale
const EtichettaOrizzontale = ({ 
  prodotto, lotto, impostazioni, elementi, qrDataUrl, logoUrl, larghezza, altezza 
}: { 
  prodotto: Prodotto
  lotto: Lotto
  impostazioni: Impostazioni
  elementi: Elementi
  qrDataUrl: string
  logoUrl: string
  larghezza: number
  altezza: number
}) => {
  const vn = {
    energia_kj: prodotto.energia_kj,
    energia_kcal: prodotto.energia_kcal,
    grassi: prodotto.grassi,
    grassi_saturi: prodotto.grassi_saturi,
    carboidrati: prodotto.carboidrati,
    zuccheri: prodotto.zuccheri,
    fibre: prodotto.fibre,
    proteine: prodotto.proteine,
    sale: prodotto.sale,
  }
  
  const indirizzoCompleto = [impostazioni.indirizzo, impostazioni.cap, impostazioni.citta, impostazioni.provincia ? `(${impostazioni.provincia})` : ''].filter(Boolean).join(' ')
  const showNutrition = elementi.valori_nutrizionali && prodotto.categoria_etichetta === 'completo'

  return (
    <Document>
      <Page size={{ width: larghezza * CM_TO_PT, height: altezza * CM_TO_PT }} style={{ padding: 8, fontFamily: 'Helvetica', fontSize: 7, backgroundColor: colors.white }}>
        {/* Header */}
        <View style={styles.header}>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          <View>
            <Text style={styles.ragioneSociale}>{(impostazioni.ragione_sociale || '').toUpperCase()}</Text>
            <Text style={styles.indirizzo}>{indirizzoCompleto} {impostazioni.partita_iva && `– ${impostazioni.partita_iva}`}</Text>
          </View>
        </View>

        {/* Nome prodotto */}
        <Text style={styles.nomeProdotto}>{prodotto.nome}</Text>
        {prodotto.descrizione && <Text style={styles.descrizione}>{prodotto.descrizione}</Text>}

        {/* Ingredienti */}
        {elementi.ingredienti && prodotto.ingredienti && (
          <Text style={styles.ingredienti}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Ingredienti:</Text> {prodotto.ingredienti}</Text>
        )}

        {/* Allergeni */}
        {elementi.allergeni && prodotto.allergeni && (
          <Text style={styles.allergeniRed}>ALLERGENI: {prodotto.allergeni}</Text>
        )}

        {/* Contenuto principale */}
        <View style={styles.contentRow}>
          {/* Tabella nutrizionale */}
          {showNutrition && (
            <View style={styles.nutritionTable}>
              <Text style={styles.nutritionHeader}>Valori Nutrizionali / 100g</Text>
              <View style={styles.nutritionRowAlt}>
                <Text>Energia</Text>
                <Text>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text>Grassi</Text>
                <Text>{vn.grassi ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRowIndent}>
                <Text>- di cui saturi</Text>
                <Text>{vn.grassi_saturi ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text>Carboidrati</Text>
                <Text>{vn.carboidrati ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRowIndent}>
                <Text>- di cui zuccheri</Text>
                <Text>{vn.zuccheri ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text>Fibre</Text>
                <Text>{vn.fibre ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRowAlt}>
                <Text>Proteine</Text>
                <Text>{vn.proteine ?? '-'} g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text>Sale</Text>
                <Text>{vn.sale ?? '-'} g</Text>
              </View>
            </View>
          )}

          {/* Colonna info */}
          <View style={[styles.infoColumn, !showNutrition && { flex: 1 }]}>
            <View>
              {elementi.peso_netto && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Peso netto:</Text> {prodotto.peso_netto || '-'}</Text>}
              {elementi.lotto && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>L:</Text> {lotto.codice_lotto}</Text>}
              {elementi.tmc && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>TMC:</Text> {lotto.tmc || 'vedi conf.'}</Text>}
              {elementi.origine && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Origine:</Text> {prodotto.origine || impostazioni.origine_default || 'Italia'}</Text>}
              {elementi.conservazione && lotto.condizioni_conservazione && (
                <Text style={{ fontSize: 5, color: colors.gray, marginTop: 2 }}>{lotto.condizioni_conservazione}</Text>
              )}
              {elementi.email && impostazioni.email && <Text style={styles.infoText}>{impostazioni.email}</Text>}
              {elementi.telefono && impostazioni.telefono && <Text style={styles.infoText}>{impostazioni.telefono}</Text>}
            </View>
            {elementi.qr_code && (
              <View style={styles.qrContainer}>
                <Image src={qrDataUrl} style={styles.qrCode} />
                <Text style={styles.sitoWeb}>{impostazioni.sito_web || 'www.gianniparisse.it'}</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Componente PDF Verticale
const EtichettaVerticale = ({ 
  prodotto, lotto, impostazioni, elementi, qrDataUrl, logoUrl, larghezza, altezza 
}: { 
  prodotto: Prodotto
  lotto: Lotto
  impostazioni: Impostazioni
  elementi: Elementi
  qrDataUrl: string
  logoUrl: string
  larghezza: number
  altezza: number
}) => {
  const vn = {
    energia_kj: prodotto.energia_kj,
    energia_kcal: prodotto.energia_kcal,
    grassi: prodotto.grassi,
    grassi_saturi: prodotto.grassi_saturi,
    carboidrati: prodotto.carboidrati,
    zuccheri: prodotto.zuccheri,
    fibre: prodotto.fibre,
    proteine: prodotto.proteine,
    sale: prodotto.sale,
  }
  
  const indirizzoCompleto = [impostazioni.indirizzo, impostazioni.cap, impostazioni.citta, impostazioni.provincia ? `(${impostazioni.provincia})` : ''].filter(Boolean).join(' ')
  const showNutrition = elementi.valori_nutrizionali && prodotto.categoria_etichetta === 'completo'

  return (
    <Document>
      <Page size={{ width: larghezza * CM_TO_PT, height: altezza * CM_TO_PT }} style={{ padding: 8, fontFamily: 'Helvetica', fontSize: 7, backgroundColor: colors.white }}>
        {/* Header centrato */}
        <View style={styles.headerVertical}>
          {logoUrl && <Image src={logoUrl} style={styles.logoVertical} />}
          <Text style={styles.ragioneSociale}>{(impostazioni.ragione_sociale || '').toUpperCase()}</Text>
          <Text style={styles.indirizzo}>{indirizzoCompleto}</Text>
          {impostazioni.partita_iva && <Text style={styles.indirizzo}>{impostazioni.partita_iva}</Text>}
        </View>

        {/* Nome prodotto centrato */}
        <Text style={styles.nomeProdottoVertical}>{prodotto.nome}</Text>
        {prodotto.descrizione && <Text style={[styles.descrizione, { textAlign: 'center' }]}>{prodotto.descrizione}</Text>}

        {/* Ingredienti */}
        {elementi.ingredienti && prodotto.ingredienti && (
          <Text style={styles.ingredienti}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Ingredienti:</Text> {prodotto.ingredienti}</Text>
        )}

        {/* Allergeni */}
        {elementi.allergeni && prodotto.allergeni && (
          <View style={styles.allergeniBox}>
            <Text style={styles.allergeniText}>ALLERGENI: {prodotto.allergeni}</Text>
          </View>
        )}

        {/* Tabella nutrizionale full width */}
        {showNutrition && (
          <View style={[styles.nutritionTable, { marginBottom: 4 }]}>
            <Text style={styles.nutritionHeader}>Valori Nutrizionali / 100g</Text>
            <View style={styles.nutritionRowAlt}>
              <Text>Energia</Text>
              <Text>{vn.energia_kj ?? '-'} kJ / {vn.energia_kcal ?? '-'} kcal</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text>Grassi</Text>
              <Text>{vn.grassi ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRowIndent}>
              <Text>- di cui saturi</Text>
              <Text>{vn.grassi_saturi ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text>Carboidrati</Text>
              <Text>{vn.carboidrati ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRowIndent}>
              <Text>- di cui zuccheri</Text>
              <Text>{vn.zuccheri ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text>Fibre</Text>
              <Text>{vn.fibre ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRowAlt}>
              <Text>Proteine</Text>
              <Text>{vn.proteine ?? '-'} g</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text>Sale</Text>
              <Text>{vn.sale ?? '-'} g</Text>
            </View>
          </View>
        )}

        {/* Info lotto */}
        <View style={{ marginBottom: 4 }}>
          {elementi.peso_netto && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Peso netto:</Text> {prodotto.peso_netto || '-'}</Text>}
          {elementi.lotto && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>L:</Text> {lotto.codice_lotto}</Text>}
          {elementi.tmc && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>TMC:</Text> {lotto.tmc || 'vedi conf.'}</Text>}
          {elementi.origine && <Text style={styles.infoText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Origine:</Text> {prodotto.origine || impostazioni.origine_default || 'Italia'}</Text>}
          {elementi.conservazione && lotto.condizioni_conservazione && (
            <Text style={{ fontSize: 5, color: colors.gray }}>{lotto.condizioni_conservazione}</Text>
          )}
        </View>

        {/* QR code centrato */}
        {elementi.qr_code && (
          <View style={{ alignItems: 'center', marginTop: 'auto' }}>
            <Image src={qrDataUrl} style={styles.qrCodeVertical} />
            <Text style={[styles.sitoWeb, { marginTop: 2 }]}>{impostazioni.sito_web || 'www.gianniparisse.it'}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

// Componente PDF Rotonda
const EtichettaRotonda = ({ 
  prodotto, lotto, impostazioni, elementi, qrDataUrl, logoUrl, diametro 
}: { 
  prodotto: Prodotto
  lotto: Lotto
  impostazioni: Impostazioni
  elementi: Elementi
  qrDataUrl: string
  logoUrl: string
  diametro: number
}) => {
  return (
    <Document>
      <Page size={{ width: diametro * CM_TO_PT, height: diametro * CM_TO_PT }} style={{ padding: 0, fontFamily: 'Helvetica', fontSize: 7, backgroundColor: colors.white }}>
        <View style={styles.roundContainer}>
          {/* Watermark logo */}
          {logoUrl && <Image src={logoUrl} style={styles.roundWatermark} />}
          
          {/* Contenuto a due colonne */}
          <View style={styles.roundContent}>
            {/* Colonna sinistra */}
            <View style={styles.roundLeftColumn}>
              <Text style={styles.roundRagioneSociale}>{impostazioni.ragione_sociale || ''}</Text>
              <Text style={styles.roundNomeProdotto}>{prodotto.nome}</Text>
              
              {elementi.allergeni && prodotto.allergeni && (
                <View style={[styles.allergeniBox, { marginBottom: 6 }]}>
                  <Text style={styles.allergeniText}>{prodotto.allergeni}</Text>
                </View>
              )}
              
              {elementi.lotto && <Text style={styles.roundInfo}><Text style={{ fontFamily: 'Helvetica-Bold' }}>L:</Text> {lotto.codice_lotto}</Text>}
              {elementi.origine && <Text style={styles.roundInfo}>{prodotto.origine || impostazioni.origine_default || 'Italia – Altopiano del Fucino'}</Text>}
              {elementi.conservazione && lotto.condizioni_conservazione && (
                <Text style={{ fontSize: 6, color: colors.gray }}>{lotto.condizioni_conservazione}</Text>
              )}
            </View>
            
            {/* Colonna destra */}
            <View style={styles.roundRightColumn}>
              {elementi.qr_code && (
                <>
                  <Image src={qrDataUrl} style={styles.roundQrCode} />
                  <Text style={[styles.sitoWeb, { marginTop: 4, textAlign: 'center' }]}>{impostazioni.sito_web || 'www.gianniparisse.it'}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const prodotto_id = searchParams.get('prodotto_id')
  const lotto_id = searchParams.get('lotto_id')
  const formato = searchParams.get('formato') || 'orizzontale'
  const larghezza = parseFloat(searchParams.get('larghezza') || '10')
  const altezza = parseFloat(searchParams.get('altezza') || '6')
  const diametro = parseFloat(searchParams.get('diametro') || '10')
  const elementiJson = searchParams.get('elementi') || '{}'
  
  let elementi: Elementi = {}
  try {
    elementi = JSON.parse(elementiJson)
  } catch {
    elementi = {
      ingredienti: true,
      allergeni: true,
      valori_nutrizionali: true,
      lotto: true,
      tmc: true,
      origine: true,
      conservazione: true,
      peso_netto: true,
      qr_code: true,
      email: false,
      telefono: false,
      piva: false,
    }
  }

  if (!prodotto_id || !lotto_id) {
    return NextResponse.json({ error: 'prodotto_id e lotto_id sono richiesti' }, { status: 400 })
  }

  try {
    const sql = neon(DATABASE_URL)

    // Fetch prodotto
    const prodottoResult = await sql`SELECT * FROM prodotti WHERE id = ${prodotto_id}`
    if (!prodottoResult.length) {
      return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 })
    }
    const prodotto = prodottoResult[0] as Prodotto

    // Fetch lotto
    const lottoResult = await sql`SELECT * FROM lotti WHERE id = ${lotto_id}`
    if (!lottoResult.length) {
      return NextResponse.json({ error: 'Lotto non trovato' }, { status: 404 })
    }
    const lotto = lottoResult[0] as Lotto

    // Fetch impostazioni
    const impostazioniResult = await sql`SELECT * FROM impostazioni_azienda LIMIT 1`
    const impostazioni = (impostazioniResult[0] || {}) as Impostazioni

    // Generate QR code
    const qrDataUrl = await generateQRCodeDataURL(`https://gianniparisse.it/store/traccia/${lotto.codice_lotto}`)

    // Logo URL (usa il logo dalle impostazioni o default)
    const logoUrl = impostazioni.logo_url || 'https://gianniparisse.it/images/logo.png'

    let pdfBuffer: Buffer

    if (formato === 'verticale') {
      pdfBuffer = await renderToBuffer(
        <EtichettaVerticale
          prodotto={prodotto}
          lotto={lotto}
          impostazioni={impostazioni}
          elementi={elementi}
          qrDataUrl={qrDataUrl}
          logoUrl={logoUrl}
          larghezza={larghezza}
          altezza={altezza}
        />
      )
    } else if (formato === 'rotonda') {
      pdfBuffer = await renderToBuffer(
        <EtichettaRotonda
          prodotto={prodotto}
          lotto={lotto}
          impostazioni={impostazioni}
          elementi={elementi}
          qrDataUrl={qrDataUrl}
          logoUrl={logoUrl}
          diametro={diametro}
        />
      )
    } else {
      // Default: orizzontale
      pdfBuffer = await renderToBuffer(
        <EtichettaOrizzontale
          prodotto={prodotto}
          lotto={lotto}
          impostazioni={impostazioni}
          elementi={elementi}
          qrDataUrl={qrDataUrl}
          logoUrl={logoUrl}
          larghezza={larghezza}
          altezza={altezza}
        />
      )
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="etichetta-${lotto.codice_lotto}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Errore generazione PDF:', error)
    return NextResponse.json({ error: 'Errore nella generazione del PDF' }, { status: 500 })
  }
}
