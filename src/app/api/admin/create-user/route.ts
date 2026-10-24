import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, role, organisation_id, magasin_id } = await req.json()

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 1. Créer l'utilisateur dans auth.users
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pas besoin de confirmation par email
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 })
  }

  const userId = userData.user.id

  // 2. Créer le profil avec rôle et org/magasin
  const { error: profileError } = await supabaseAdmin.from('profiles').insert([{
    id: userId,
    email,
    role, // 'org_admin' ou 'caissier'
    organisation_id: organisation_id || null,
    magasin_id: magasin_id || null,
  }])

  if (profileError) {
    // Rollback si profil échoue
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, userId })
}
