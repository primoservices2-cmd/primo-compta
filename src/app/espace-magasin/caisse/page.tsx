'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function CaisseContent() {
  const searchParams = useSearchParams()
  const magasinId = searchParams.get('magasin')
  const [org, setOrg] = useState<any>(null)
  const [magasin, setMagasin] = useState<any>(null)

  // ... garde tout le reste de ton code qui était ici après ...
  // Si tu ne sais pas, colle tout ton ancien code à partir de
  // const [org, setOrg]... jusqu'à la fin du return

  return (
    <div>
      {/* tout ton ancien JSX de la caisse */}
      <p>Magasin: {magasinId}</p>
    </div>
  )
}

export default function CaisseFinale() {
  return (
    <Suspense fallback={<div style={{padding:20}}>Chargement caisse...</div>}>
      <CaisseContent />
    </Suspense>
  )
}