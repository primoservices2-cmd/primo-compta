'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PrimoLogo } from '@/components/PrimoLogo'

type Organisation = {
  id: string
  nom: string
  societe_nom?: string
  logo_url?: string
  rccm?: string
  idnat?: string
  nif?: string
  ville?: string
  adresse?: string
}

export default function OrganisationsPage() {
  const [orgs, setOrgs] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ nom: '', societe_nom: '', ville: '', adresse: '', telephone: '', email: '', rccm: '', idnat: '', nif: '', logo_url: '' })

  const load = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('organisations').select('*').order('created_at', { ascending: false })
    setOrgs(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('logos').getPublicUrl(fileName)
      setForm({ ...form, logo_url: data.publicUrl })
    } catch (err: any) {
      alert('Erreur upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom) return alert('Nom organisation obligatoire')
    const supabase = createClient()
    const { error } = await supabase.from('organisations').insert([form])
    if (error) return alert(error.message)
    setShowModal(false)
    setForm({ nom: '', societe_nom: '', ville: '', adresse: '', telephone: '', email: '', rccm: '', idnat: '', nif: '', logo_url: '' })
    load()
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* LOGO PRIMO COMPTA PLATEFORME - BASE64 - partout */}
            <PrimoLogo size="sm" />
            <span className="text-gray-200 mx-2">/</span>
            <span className="text-sm font-medium">Organisations clientes</span>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-sm">+ Nouvelle organisation</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-black text-white rounded-2xl p-6 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-bold">PRIMO COMPTA ≠ Client</h2>
            <p className="text-sm text-white/60 mt-1">Notre logo reste en haut. Le logo du client (uploadé) ira sur SES factures, rapports, devis.</p>
          </div>
          <div className="text-xs bg-white/10 px-3 py-1 rounded-full">Powered by PRIMO COMPTA</div>
        </div>

        {loading ? <p>Chargement...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map(o => (
              <div key={o.id} className="bg-white border rounded-2xl p-6">
                <div className="flex gap-4 items-center">
                  {o.logo_url ? <img src={o.logo_url} alt="logo" className="w-12 h-12 rounded-xl object-cover border" /> : <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold">{o.nom[0]}</div>}
                  <div>
                    <h3 className="font-semibold">{o.nom}</h3>
                    <p className="text-xs text-gray-500">{o.societe_nom}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 space-y-1 font-mono">
                  <p>RCCM: {o.rccm || '-'} | IDNAT: {o.idnat || '-'}</p>
                  <p>{o.ville} - {o.adresse}</p>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase">Aperçu facture</p>
                  <div className="flex items-center gap-2 mt-2">
                    {o.logo_url && <img src={o.logo_url} className="w-6 h-6 rounded" />}
                    <span className="text-xs font-bold">{o.societe_nom || o.nom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Créer une organisation cliente</h2>
              <p className="text-sm text-gray-500">Son logo sera utilisé sur ses documents. PRIMO COMPTA reste en pied de page.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium">Logo de l'organisation * (pour factures)</label>
                <div className="mt-2 flex items-center gap-4">
                  {form.logo_url && <img src={form.logo_url} className="w-16 h-16 rounded-xl border object-cover" />}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
                  {uploading && <span className="text-xs">Upload...</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs">Nom court *</label><input required value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm" placeholder="MUKENDI SHOP" /></div>
                <div><label className="text-xs">Nom société factures</label><input value={form.societe_nom} onChange={e=>setForm({...form, societe_nom:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm" placeholder="ETS MUKENDI SARL" /></div>
                <div><label className="text-xs">RCCM</label><input value={form.rccm} onChange={e=>setForm({...form, rccm:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono" /></div>
                <div><label className="text-xs">IDNAT / NIF</label><input value={form.idnat} onChange={e=>setForm({...form, idnat:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono" /></div>
                <div><label className="text-xs">Ville</label><input value={form.ville} onChange={e=>setForm({...form, ville:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
                <div><label className="text-xs">Adresse</label><input value={form.adresse} onChange={e=>setForm({...form, adresse:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="px-5 py-2.5 border rounded-full text-sm">Annuler</button>
                <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-full text-sm">Créer l'organisation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

