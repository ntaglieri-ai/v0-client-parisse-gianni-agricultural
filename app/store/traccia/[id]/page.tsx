'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ValoriNutrizionali {
  energia_kj: number;
  energia_kcal: number;
  grassi: number;
  grassi_saturi: number;
  carboidrati: number;
  zuccheri: number;
  fibre: number;
  proteine: number;
  sale: number;
}

interface LottoData {
  codice_lotto: string;
  campo: string;
  comune: string;
  data_semina: string;
  data_raccolta: string;
  kg_totali: number;
  tmc: string;
  condizioni_conservazione: string;
  certificazioni: string;
  note: string;
  nome: string;
  categoria: string;
  descrizione: string;
  immagine: string;
  unita: string;
  ingredienti: string;
  valori_nutrizionali: ValoriNutrizionali;
  allergeni: string;
  categoria_etichetta: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT');
}

export default function TracciaPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<LottoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/store/traccia/${encodeURIComponent(id)}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then(json => {
        if (json) { setData(json); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#f5f0e8] animate-pulse">
      <div className="h-48 bg-[#1a3a2a]" />
      <div className="max-w-2xl mx-auto p-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="bg-[#1a3a2a] py-10 text-center">
        <img src="/images/logo.png" className="h-16 mx-auto brightness-0 invert" alt="Logo" />
        <p className="text-white font-serif text-2xl font-bold mt-3">Azienda Agricola Parisse Gianni</p>
        <p className="text-white/70 text-sm mt-1">Via II Traversa delle Croci, 16 - 67057 Pescina (AQ) – Italia</p>
        <p className="text-[#c9933a] text-sm">Italia – Altopiano del Fucino</p>
      </header>
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <p className="font-serif text-3xl text-[#1a3a2a] font-bold">Lotto non trovato</p>
        <p className="text-gray-500 mt-3">Il codice lotto cercato non esiste o non è più disponibile.</p>
        <Link href="/store" className="inline-block mt-8 px-6 py-3 bg-[#1a3a2a] text-white rounded-lg hover:bg-[#1a3a2a]/90">
          ← Torna allo Store
        </Link>
      </div>
    </div>
  );

  if (!data) return null;

  const vn = data.valori_nutrizionali;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* HEADER */}
      <header className="bg-[#1a3a2a] py-10 text-center px-4">
        <img src="/images/logo.png" className="h-16 mx-auto brightness-0 invert" alt="Logo" />
        <p className="text-white font-serif text-2xl font-bold mt-3">Azienda Agricola Parisse Gianni</p>
        <p className="text-white/70 text-sm mt-1">Via II Traversa delle Croci, 16 - 67057 Pescina (AQ) – Italia</p>
        <p className="text-[#c9933a] text-sm mt-1">Italia – Altopiano del Fucino</p>
        <p className="text-white/50 text-xs mt-1">www.gianniparisse.it</p>
        <span className="inline-block mt-4 px-4 py-1.5 bg-[#c9933a] text-white text-sm rounded-full font-medium">
          ✓ Prodotto Verificato
        </span>
      </header>

      {/* SEZIONE 1: IL PRODOTTO */}
      <section className="bg-[#f5f0e8] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {data.immagine && (
            <div className="relative aspect-[4/3] max-w-sm mx-auto rounded-xl overflow-hidden">
              <Image src={data.immagine} alt={data.nome} fill className="object-cover" />
            </div>
          )}
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 bg-[#1a3a2a] text-white text-xs uppercase rounded-full">
              {data.categoria}
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#1a3a2a] mt-2">{data.nome}</h1>
            <p className="text-gray-600 mt-2">{data.descrizione}</p>
          </div>

          {data.categoria_etichetta === 'completo' && (
            <div className="mt-6 space-y-3">
              {data.ingredienti && (
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs uppercase text-[#c9933a] font-semibold tracking-wider">Ingredienti</p>
                  <p className="text-sm mt-1">{data.ingredienti}</p>
                </div>
              )}

              {data.allergeni && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm font-bold">⚠️ ALLERGENI: {data.allergeni}</p>
                </div>
              )}

              {vn && (
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs uppercase text-[#c9933a] font-semibold tracking-wider mb-3">
                    Valori Nutrizionali medi per 100 g
                  </p>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Energia', `${vn.energia_kj} kJ / ${vn.energia_kcal} kcal`],
                        ['Grassi', `${vn.grassi} g`],
                        ['di cui acidi grassi saturi', `${vn.grassi_saturi} g`],
                        ['Carboidrati', `${vn.carboidrati} g`],
                        ['di cui zuccheri', `${vn.zuccheri} g`],
                        ['Fibre', `${vn.fibre} g`],
                        ['Proteine', `${vn.proteine} g`],
                        ['Sale', `${vn.sale} g`],
                      ].map(([label, value], i) => (
                        <tr key={label} className={i % 2 === 0 ? 'bg-[#f5f0e8]' : ''}>
                          <td className="py-1.5 px-2 text-gray-600">{label}</td>
                          <td className="py-1.5 px-2 text-right font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {data.categoria_etichetta === 'ortaggio_fresco' && (
            <div className="bg-white rounded-xl p-4 mt-6">
              <p className="text-sm">🌱 Prodotto fresco, non trasformato</p>
            </div>
          )}
        </div>
      </section>

      {/* SEZIONE 2: TRACCIABILITÀ */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-[#1a3a2a]">Tracciabilità del Lotto</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-[#f5f0e8] text-xs font-mono rounded">
            {data.codice_lotto}
          </span>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              ['Campo', data.campo],
              ['Comune', data.comune],
              ['Data Semina', formatDate(data.data_semina)],
              ['Data Raccolta', formatDate(data.data_raccolta)],
              ['Quantità prodotta', `${data.kg_totali} kg`],
              ['Da consumarsi entro', data.tmc],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#f5f0e8] rounded-xl p-4">
                <p className="text-xs uppercase text-[#c9933a] font-semibold tracking-wider">{label}</p>
                <p className="text-sm font-medium mt-1">{value || '—'}</p>
              </div>
            ))}
          </div>

          {data.condizioni_conservazione && (
            <div className="bg-[#f5f0e8] rounded-xl p-4 mt-4">
              <p className="text-xs uppercase text-[#c9933a] font-semibold tracking-wider">Conservazione</p>
              <p className="text-sm mt-1">{data.condizioni_conservazione}</p>
            </div>
          )}

          {data.certificazioni && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-3">
              <p className="text-sm font-medium">✓ CERTIFICAZIONI: {data.certificazioni}</p>
            </div>
          )}

          <div className="text-center mt-6">
            <span className="inline-block px-4 py-2 bg-[#1a3a2a] text-[#c9933a] text-sm rounded-full font-medium">
              🌾 Filiera Tracciata ✓
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f5f0e8] py-6 text-center px-4">
        <Link href="/store" className="text-[#1a3a2a] hover:underline font-medium">
          ← Torna allo Store
        </Link>
        <p className="text-xs text-gray-500 mt-2">
          Peso netto: 1 kg / 500g · Da consumarsi preferibilmente entro: vedi confezione
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Prodotto e confezionato da: Gianni Parisse Az. Agri. · Pescina (AQ) – Italia
        </p>
      </footer>
    </div>
  );
}
