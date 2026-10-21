'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PrimoLogo } from '@/components/PrimoLogo'
import Link from 'next/link'

type Organisation = { id: string, nom: string, logo_url?: string }
type Magasin = { id: string, nom: string, organisation_id?: string, ville?: string }

export default function MagasinsAvecOrg() {
  const [magasins, setMagasins] = useState<Magasin[]>([])
  const [orgs, setOrgs] = useState<Organisation[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nom: '', ville: '', adresse: '', organisation_id: '' })

  const load = async () => {
    const supabase = createClient()
    const [{ data: m }, { data: o }] = await Promise.all([
      supabase.from('magasins').select('*').order('created_at', { ascending: false }),
      supabase.from('organisations').select('id,nom,logo_url').order('nom')
    ])
    setMagasins(m || [])
    setOrgs(o || [])
  }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.from('magasins').insert([{ ...form, organisation_id: form.organisation_id || null }])
    if (error) return alert(error.message)
    setShowModal(false)
    setForm({ nom: '', ville: '', adresse: '', organisation_id: '' })
    load()
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <PrimoLogo size="sm" />
            <span className="text-gray-200">/</span>
            <span className="text-sm">Magasins</span>
          </div>
          <div className="flex gap-2">
            <Link href="/super-admin/organisations" className="text-sm border px-4 py-2 rounded-full">Organisations</Link>
            <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-2 rounded-full text-sm">+ Nouveau magasin</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magasins.map(m => {
            const org = orgs.find(o => o.id === m.organisation_id)
            return (
              <div key={m.id} className="bg-white border rounded-2xl p-6 hover:border-black transition">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold">{m.nom[0]}</div>
                  {org?.logo_url && <img src={org.logo_url} className="w-8 h-8 rounded-lg border object-cover" />}
                </div>
                <h3 className="font-semibold mt-4">{m.nom}</h3>
                <p className="text-xs text-gray-500">{m.ville}</p>
                {org ? (
                  <div className="mt-3 flex items-center gap-2 text-xs bg-gray-50 px-3 py-2 rounded-full">
                    <img src={org.logo_url} className="w-4 h-4 rounded-full" />
                    {org.nom} (factures avec son logo)
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-full">Non lié à une organisation</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link href={`/espace-magasin/caisse?magasin=${m.id}`} className="text-xs bg-black text-white px-3 py-1.5 rounded-full">Caisse</Link>
                  <Link href={`/super-admin/magasins/${m.id}`} className="text-xs border px-3 py-1.5 rounded-full">Factures</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="font-bold text-lg">Créer magasin lié à une organisation</h2>
            <p className="text-xs text-gray-500 mt-1">Le magasin héritera du logo et RCCM de l'organisation pour ses factures.</p>
            <div className="mt-6 space-y-4">
              <div><label className="text-xs">Nom magasin *</label><input required value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
              <div><label className="text-xs">Organisation cliente *</label>
                <select value={form.organisation_id} onChange={e=>setForm({...form, organisation_id:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm">
                  <option value="">Choisir organisation...</option>
                  {orgs.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Si pas dans la liste, va créer dans /organisations d'abord</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.ville} onChange={e=>setForm({...form, ville:e.target.value})} placeholder="Ville" className="border rounded-xl px-3 py-2.5 text-sm" />
                <input value={form.adresse} onChange={e=>setForm({...form, adresse:e.target.value})} placeholder="Adresse" className="border rounded-xl px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={()=>setShowModal(false)} className="px-5 py-2.5 border rounded-full text-sm">Annuler</button>
              <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-full text-sm">Créer</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

