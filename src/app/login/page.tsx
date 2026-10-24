'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PrimoLogo } from '@/components/PrimoLogo'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Récupère le rôle pour rediriger
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    
    if (profile?.role === 'super_admin') {
      router.push('/super-admin/organisations')
    } else if (profile?.role === 'org_admin') {
      router.push('/super-admin/magasins')
    } else {
      router.push('/espace-magasin')
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <PrimoLogo size="md" />
        </div>
        
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-xl font-bold text-center">Connexion</h1>
          <p className="text-xs text-gray-500 text-center mt-1">PRIMO COMPTA - Accès sécurisé</p>
          
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium">Email super admin</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1"
                placeholder="ton email super admin"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Mot de passe</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-black text-white rounded-full py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6">Seul le super admin peut créer les comptes manuellement via /super-admin/utilisateurs</p>
        </div>
      </div>
    </main>
  )
}
