'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function FacturesParMagasin({ params }: { params: { id: string } }) {
  const [factures, setFactures] = useState<any[]>([])
  const [magasin, setMagasin] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: mag } = await supabase.from('magasins').select('*, organisations(*)').eq('id', params.id).single()
      if (mag) {
        setMagasin(mag)
        setOrg(mag.organisations)
        const { data: facs } = await supabase.from('factures').select('*').eq('magasin_id', params.id).order('created_at', { ascending: false })
        setFactures(facs || [])
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {org?.logo_url ? <img src={org.logo_url} className="w-10 h-10 rounded-xl object-cover border" /> : <img src="/Logo.png?v=4" className="h-8 w-auto" />}
            <div>
              <p className="font-bold text-sm">{magasin?.nom} {org && `• ${org.nom}`}</p>
              <p className="text-xs text-zinc-500">Factures avec logo {org?.nom || 'PRIMO COMPTA'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/super-admin/magasins" className="border px-4 py-2 rounded-full text-sm">← Magasins</Link>
            <Link href={`/espace-magasin/caisse?magasin=${params.id}`} className="bg-black text-white px-5 py-2.5 rounded-full text-sm">+ Nouvelle facture</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black">Factures • {magasin?.nom}</h1>
        <p className="text-sm text-zinc-500 mt-1">Clique sur une facture pour voir le PDF A4 + WhatsApp. Logo {org?.nom || 'client'} en grand, PRIMO COMPTA en footer.</p>

        <div className="grid gap-4 mt-8">
          {factures.length === 0 && (
            <div className="bg-white border rounded-2xl p-10 text-center">
              <p className="text-sm text-zinc-500">Aucune facture pour ce magasin.</p>
              <Link href={`/espace-magasin/caisse?magasin=${params.id}`} className="mt-4 inline-block bg-black text-white px-5 py-2.5 rounded-full text-sm">Créer la première facture →</Link>
            </div>
          )}
          
          {factures.map(f => (
            <Link key={f.id} href={`/factures/${f.id}`} className="bg-white border rounded-2xl p-6 flex justify-between items-center hover:border-black hover:shadow-lg transition group">
              <div className="flex gap-4 items-center">
                {org?.logo_url && <img src={org.logo_url} className="w-10 h-10 rounded-xl object-cover border" />}
                <div>
                  <p className="font-bold text-sm group-hover:underline">{f.numero} • {f.client_nom || 'Client divers'}</p>
                  <p className="text-xs text-zinc-500">{new Date(f.created_at).toLocaleString('fr-CD')} • {f.articles?.length || 0} articles</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold">{Number(f.total).toLocaleString()} CDF</p>
                  <p className="text-[10px] tracking-widest text-zinc-400 flex items-center gap-1 justify-end mt-1"><img src="/Logo.png?v=4" className="h-3 w-auto" /> POWERED BY PRIMO COMPTA</p>
                </div>
                <span className="bg-black text-white px-4 py-2 rounded-full text-xs group-hover:bg-zinc-800">Voir PDF →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

