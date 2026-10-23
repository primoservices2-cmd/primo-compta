'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PrimoLogo } from '@/components/PrimoLogo'

export default function SuperAdminPage() {
  const [stats, setStats] = useState({ magasins: '--', users: '--', ventes: '--', chiffre: '--' })

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { count: c1 } = await supabase.from('magasins').select('*', { count: 'exact', head: true })
        const { count: c2 } = await supabase.from('organisations').select('*', { count: 'exact', head: true })
        setStats({ magasins: String(c1 ?? 0), users: String(c2 ?? 0), ventes: '--', chiffre: '-- CDF' })
      } catch {
        setStats({ magasins: '--', users: '--', ventes: '--', chiffre: '-- CDF' })
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* HEADER AVEC VRAI LOGO PRIMO COMPTA */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* VRAI LOGO BASE64 - ne dépend plus de /Logo.png */}
            <PrimoLogo size="md" />
            <div className="hidden md:flex items-center gap-2 ml-2">
              <span className="text-gray-300">/</span>
              <span className="text-sm font-bold text-red-600 tracking-widest">SUPER ADMIN</span>
            </div>
          </div>
          <Link href="/" className="text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition">← Accueil</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Super Admin</h1>
            <p className="text-gray-500 mt-2">Contrôle total sur toutes les organisations et magasins.</p>
          </div>
          <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full">Accès restreint</span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Organisations</p>
            <p className="text-2xl font-black mt-2">{stats.users}</p>
            <p className="text-xs text-gray-400 mt-1">Clients PRIMO COMPTA</p>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Magasins</p>
            <p className="text-2xl font-black mt-2">{stats.magasins}</p>
            <Link href="/super-admin/magasins" className="text-xs text-blue-600 mt-1 inline-block">Voir →</Link>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">Ventes aujourd'hui</p>
            <p className="text-2xl font-black mt-2">--</p>
          </div>
          <div className="bg-black text-white rounded-2xl p-6">
            <p className="text-sm text-white/60">Chiffre global</p>
            <p className="text-2xl font-black mt-2">-- CDF</p>
            <p className="text-xs text-white/40 mt-1">Powered by PRIMO COMPTA</p>
          </div>
        </div>

        {/* GESTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/super-admin/organisations" className="bg-white border rounded-2xl p-6 hover:border-black transition group">
            <div className="flex justify-between">
              <h3 className="font-bold flex items-center gap-2">🏢 Gestion des Organisations</h3>
              <span className="group-hover:translate-x-1 transition">→</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Créer les clients, upload leur logo. Leur logo ira sur leurs factures. Accès à <code className="bg-gray-100 px-1 rounded">/organisations</code></p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs border px-3 py-1 rounded-full">Liste</span>
              <span className="text-xs bg-black text-white px-3 py-1 rounded-full">+ Créer</span>
            </div>
          </Link>

          <Link href="/super-admin/magasins" className="bg-white border rounded-2xl p-6 hover:border-black transition group">
            <div className="flex justify-between">
              <h3 className="font-bold flex items-center gap-2">🏪 Gestion des Magasins</h3>
              <span className="group-hover:translate-x-1 transition">→</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Voir, créer, désactiver les points de vente. Chaque magasin lié à une organisation hérite de son logo. Accès à <code className="bg-gray-100 px-1 rounded">/magasins</code></p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs border px-3 py-1 rounded-full">Liste</span>
              <span className="text-xs border px-3 py-1 rounded-full">Créer</span>
              <span className="text-xs border px-3 py-1 rounded-full">Stats</span>
            </div>
          </Link>

          <div className="bg-white border rounded-2xl p-6 opacity-60">
            <h3 className="font-bold">👤 Gestion Utilisateurs</h3>
            <p className="text-sm text-gray-500 mt-2">Rôles, permissions, accès caisse.</p>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full mt-4 inline-block">Bientôt</span>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-bold">🧾 Modèle Facture</h3>
            <p className="text-sm text-gray-500 mt-2">Logo client en grand, footer discret PRIMO COMPTA</p>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
              <PrimoLogo size="sm" showSub={false} />
              <div className="text-xs">
                <p className="font-bold">PRIMO COMPTA</p>
                <p className="text-gray-400">Logo plateforme en footer facture</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

