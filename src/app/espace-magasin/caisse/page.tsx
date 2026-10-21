'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

type Article = { nom: string, qte: number, prix: number }

export default function CaisseFinale() {
  const searchParams = useSearchParams()
  const magasinId = searchParams.get('magasin')
  const [org, setOrg] = useState<any>(null)
  const [magasin, setMagasin] = useState<any>(null)
  const [articles, setArticles] = useState<Article[]>([{ nom: '', qte: 1, prix: 0 }])
  const [client, setClient] = useState('')
  const [saving, setSaving] = useState(false)
  const [factureCree, setFactureCree] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      if (!magasinId) return
      const { data: mag } = await supabase.from('magasins').select('*, organisations(*)').eq('id', magasinId).single()
      if (mag) {
        setMagasin(mag)
        setOrg(mag.organisations || null)
      }
    }
    load()
  }, [magasinId])

  const total = articles.reduce((s, a) => s + (a.qte * a.prix), 0)

  const handleFacturer = async () => {
    if (!magasinId) return alert('Pas de magasin sélectionné. Va via /super-admin/magasins → Caisse')
    if (total === 0) return alert('Ajoute des articles')
    setSaving(true)
    try {
      const supabase = createClient()
      const numero = `FAC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
      const { data, error } = await supabase.from('factures').insert([{
        numero,
        organisation_id: org?.id || null,
        magasin_id: magasinId,
        client_nom: client,
        total,
        articles
      }]).select().single()
      if (error) throw error
      setFactureCree(data)
      setArticles([{ nom: '', qte: 1, prix: 0 }])
      setClient('')
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (factureCree) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-[800px] mx-auto bg-white rounded-[24px] shadow-xl p-10">
          <div className="flex justify-between items-start border-b-2 border-black pb-6">
            <div className="flex gap-4">
              {org?.logo_url ? <img src={org.logo_url} className="w-16 h-16 rounded-2xl object-cover border" /> : <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center font-black">{org?.nom?.[0] || 'P'}</div>}
              <div>
                <h2 className="font-black text-lg">{org?.societe_nom || org?.nom || 'Organisation cliente'}</h2>
                <p className="text-xs text-zinc-500 mt-1">{org?.adresse} - {org?.ville}</p>
                <p className="text-[11px] font-mono mt-2 bg-zinc-100 px-2 py-1 rounded">RCCM: {org?.rccm || '-'} | IDNAT: {org?.idnat || '-'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">{factureCree.numero}</div>
              <p className="text-xs text-zinc-500 mt-2">{new Date().toLocaleDateString('fr-CD')}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm">Client: <strong>{factureCree.client_nom || 'Client divers'}</strong></p>
            <div className="mt-4 border rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-zinc-50 text-[11px] tracking-widest p-3"><span className="col-span-2">ARTICLE</span><span>QTÉ</span><span className="text-right">TOTAL</span></div>
              {factureCree.articles.map((a: any, i: number) => (
                <div key={i} className="grid grid-cols-4 p-3 text-sm border-t"><span className="col-span-2">{a.nom}</span><span>{a.qte}</span><span className="text-right">{(a.qte*a.prix).toLocaleString()} CDF</span></div>
              ))}
            </div>
            <div className="mt-4 bg-black text-white rounded-2xl p-4 flex justify-between">
              <span className="text-xs opacity-60">TOTAL</span>
              <span className="font-bold text-xl">{factureCree.total.toLocaleString()} CDF</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/Logo.png?v=4" className="h-5 w-auto opacity-70" />
              <span className="text-[10px] tracking-widest text-zinc-400">POWERED BY PRIMO COMPTA • compta.primo.cd</span>
            </div>
            <button onClick={() => setFactureCree(null)} className="text-xs border px-4 py-2 rounded-full">Nouvelle facture</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfbf8]">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {org?.logo_url ? <img src={org.logo_url} className="w-10 h-10 rounded-xl object-cover border" /> : <img src="/Logo.png?v=4" className="h-8 w-auto" />}
            <div>
              <p className="font-bold text-sm leading-none">{org?.nom || magasin?.nom || 'Caisse PRIMO COMPTA'}</p>
              <p className="text-[11px] text-zinc-500">{org ? `Factures avec logo ${org.nom}` : 'Sélectionne un magasin'}</p>
            </div>
          </div>
          <div className="text-[11px] bg-black text-white px-3 py-1 rounded-full">CAISSE CONNECTÉE</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="bg-white border rounded-[20px] p-6">
          <h2 className="font-bold">Articles</h2>
          <div className="mt-4 space-y-3">
            {articles.map((a, i) => (
              <div key={i} className="grid grid-cols-[1fr_90px_130px_40px] gap-2">
                <input value={a.nom} onChange={e => { const c=[...articles]; c[i].nom=e.target.value; setArticles(c)}} placeholder="Nom article" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input type="number" value={a.qte} onChange={e => { const c=[...articles]; c[i].qte=Number(e.target.value); setArticles(c)}} className="border rounded-xl px-3 py-2.5 text-sm" />
                <input type="number" value={a.prix} onChange={e => { const c=[...articles]; c[i].prix=Number(e.target.value); setArticles(c)}} placeholder="Prix" className="border rounded-xl px-3 py-2.5 text-sm" />
                <button onClick={() => setArticles(articles.filter((_,j)=>j!==i))} className="border rounded-xl hover:bg-zinc-50">✕</button>
              </div>
            ))}
          </div>
          <button onClick={() => setArticles([...articles, { nom: '', qte: 1, prix: 0 }])} className="mt-4 text-sm border px-4 py-2 rounded-full">+ Ajouter article</button>

          <div className="mt-8">
            <label className="text-xs font-medium">Client</label>
            <input value={client} onChange={e=>setClient(e.target.value)} placeholder="Nom client (optionnel)" className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="bg-zinc-950 text-white rounded-[24px] p-6 h-fit sticky top-24">
          <h3 className="font-bold">Aperçu facture</h3>
          <div className="mt-4 bg-white text-black rounded-2xl p-4">
            <div className="flex items-center gap-2">
              {org?.logo_url && <img src={org.logo_url} className="w-8 h-8 rounded-lg object-cover border" />}
              <span className="font-bold text-xs">{org?.societe_nom || org?.nom || 'PRIMO COMPTA'}</span>
            </div>
            <div className="mt-3 space-y-1">
              {articles.filter(a=>a.nom).map((a,i)=><div key={i} className="flex justify-between text-xs"><span>{a.nom} x{a.qte}</span><span>{(a.qte*a.prix).toLocaleString()}</span></div>)}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between font-bold text-sm">
              <span>Total</span><span>{total.toLocaleString()} CDF</span>
            </div>
            <div className="mt-3 flex items-center gap-1 opacity-60">
              <img src="/Logo.png?v=4" className="h-3 w-auto" />
              <span className="text-[8px] tracking-widest">POWERED BY PRIMO COMPTA</span>
            </div>
          </div>
          <button disabled={saving} onClick={handleFacturer} className="w-full mt-6 bg-[#D4B24E] text-black font-bold py-3.5 rounded-full text-sm hover:bg-[#c9a843] disabled:opacity-50">
            {saving ? 'Création...' : `Facturer ${total.toLocaleString()} CDF →`}
          </button>
          <p className="text-[11px] text-white/50 mt-3 text-center">Facture avec logo client + footer PRIMO COMPTA</p>
        </div>
      </div>
    </main>
  )
}

