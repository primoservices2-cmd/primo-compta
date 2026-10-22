import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, role, organisation_id } = body

  // Client secret avec la clé service_role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Crée le compte dans Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // 2. Crée le profil avec le rôle
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    email: email,
    role: role,
    organisation_id: organisation_id
  })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}