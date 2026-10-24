'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PrimoLogo } from '@/components/PrimoLogo'
import Link from 'next/link'

type Organisation = { id: string, nom: string }
type Magasin = { id: string, nom: string, organisation_id: string }
type Profile = { id: string, email: string, role: string, organisation_id?: string, magasin_id?: string, organisations?: { nom: string }, magasins?: { nom: string } }

export default function UtilisateursPage() {
  const [orgs, setOrgs] = useState<Organisation[]>([])
  const [magasins, setMagasins] = useState<Magasin[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'caissier', organisation_id: '', magasin_id: '' })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    const supabase = createClient()
    const [{ data: o }, { data: m }, { data: u }] = await Promise.all([
      supabase.from('organisations').select('id,nom').order('nom'),
      supabase.from('magasins').select('id,nom,organisation_id').order('nom'),
      supabase.from('profiles').select('*, organisations(nom), magasins(nom)').order('created_at', { ascending: false })
    ])
    setOrgs(o || [])
    setMagasins(m || [])
    // Filtre pour ne pas afficher les super_admin dans la liste (optionnel)
    setUsers((u as any) || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filteredMagasins = magasins.filter(m => !form.organisation_id || m.organisation_id === form.organisation_id)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return alert('Email et mot de passe obligatoires')
    setCreating(true)
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert('Utilisateur créé avec succès')
      setShowModal(false)
      setForm({ email: '', password: '', role: 'caissier', organisation_id: '', magasin_id: '' })
      load()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PrimoLogo size="sm" />
            <span className="text-gray-200 mx-2">/</span>
            <span className="text-sm font-medium">Utilisateurs</span>
            <span className="ml-3 text-xs bg-black text-white px-3 py-1 rounded-full">Super Admin only</span>
          </div>
          <div className="flex gap-2">
            <Link href="/super-admin/organisations" className="text-sm border px-4 py-2 rounded-full">Organisations</Link>
            <Link href="/super-admin/magasins" className="text-sm border px-4 py-2 rounded-full">Magasins</Link>
            <button onClick={() => setShowModal(true)} className="bg-black text-white px-5 py-2 rounded-full text-sm">+ Nouvel utilisateur</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-black text-white rounded-2xl p-6 mb-8">
          <h2 className="font-bold">Gestion manuelle des accès</h2>
          <p className="text-sm text-white/60 mt-1">Toi seul peux créer un org_admin ou un caissier. Il sera lié à une organisation et un magasin.</p>
        </div>

        {loading ? <p>Chargement...</p> : (
          <div className="bg-white border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500">
                <tr><th className="text-left p-4">Email</th><th className="text-left p-4">Rôle</th><th className="text-left p-4">Organisation</th><th className="text-left p-4">Magasin</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{u.email}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'super_admin' ? 'bg-red-100 text-red-700' : u.role === 'org_admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>{u.role}</span></td>
                    <td className="p-4">{(u.organisations as any)?.nom || u.organisation_id || '-'}</td>
                    <td className="p-4">{(u.magasins as any)?.nom || u.magasin_id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="p-8 text-center text-gray-500">Aucun utilisateur. Crée le premier.</p>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="font-bold text-lg">Créer un utilisateur manuellement</h2>
            <p className="text-xs text-gray-500 mt-1">L'utilisateur pourra se connecter immédiatement.</p>
            
            <div className="mt-6 space-y-4">
              <div><label className="text-xs font-medium">Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="caissier@mukendi.cd" /></div>
              <div><label className="text-xs font-medium">Mot de passe temporaire *</label><input required type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="Min 6 caractères" /></div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Rôle *</label>
                  <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1">
                    <option value="caissier">Caissier (caisse seulement)</option>
                    <option value="org_admin">Org Admin (gère ses magasins)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Organisation *</label>
                  <select required value={form.organisation_id} onChange={e=>setForm({...form, organisation_id:e.target.value, magasin_id: ''})} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1">
                    <option value="">Choisir...</option>
                    {orgs.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Magasin (si caissier)</label>
                <select value={form.magasin_id} onChange={e=>setForm({...form, magasin_id:e.target.value})} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1">
                  <option value="">Tous les magasins de l'org (si org_admin)</option>
                  {filteredMagasins.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Si caissier, choisir 1 magasin. Si org_admin, laisser vide = accès à tous ses magasins.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={()=>setShowModal(false)} className="px-5 py-2.5 border rounded-full text-sm">Annuler</button>
              <button disabled={creating} type="submit" className="px-6 py-2.5 bg-black text-white rounded-full text-sm disabled:opacity-50">{creating ? 'Création...' : 'Créer le compte'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
