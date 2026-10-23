import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => req.cookies.get(name)?.value, set: (name, value, options) => res.cookies.set({ name, value, ...options }), remove: (name, options) => res.cookies.set({ name, value: '', ...options }) } }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Pas connecté -> login
  if (!user && req.nextUrl.pathname.startsWith('/super-admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    
    // Quelqu'un qui n'est pas super_admin essaie d'aller dans /super-admin
    if (req.nextUrl.pathname.startsWith('/super-admin') && profile?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = { matcher: ['/super-admin/:path*', '/espace-magasin/:path*'] }