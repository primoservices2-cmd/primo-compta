'use client'

type Props = {
  organisation: {
    nom: string
    societe_nom?: string
    logo_url?: string
    rccm?: string
    idnat?: string
    nif?: string
    adresse?: string
    ville?: string
    telephone?: string
    email?: string
  }
  documentType?: 'FACTURE' | 'RAPPORT' | 'DEVIS' | 'BON'
  numero?: string
  date?: string
}

export function InvoiceHeader({ organisation, documentType = 'FACTURE', numero = 'FAC-001', date = new Date().toLocaleDateString('fr-CD') }: Props) {
  return (
    <div className="bg-white">
      {/* ENTETE CLIENT - GRAND */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6">
        <div className="flex gap-4">
          {organisation?.logo_url ? (
            <img src={organisation.logo_url} alt="Logo client" className="w-20 h-20 object-contain border rounded-xl bg-white" />
          ) : (
            <img src="/logo.png" alt="PRIMO COMPTA" className="w-20 h-20 object-contain border rounded-xl bg-white p-1" />
          )}
          <div>
            <h1 className="text-xl font-black">{organisation?.societe_nom || organisation?.nom || 'Organisation'}</h1>
            <div className="text-xs text-gray-600 mt-2 space-y-0.5">
              <p>{organisation?.adresse} - {organisation?.ville}</p>
              <p>Tél: {organisation?.telephone} | {organisation?.email}</p>
              <p className="font-mono font-bold">RCCM: {organisation?.rccm || '-'} | IDNAT: {organisation?.idnat || '-'} | NIF: {organisation?.nif || '-'}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">{documentType} {numero}</div>
          <p className="text-xs text-gray-500 mt-2">{date}</p>
        </div>
      </div>

      {/* FOOTER DISCRET PRIMO COMPTA AVEC VRAI LOGO */}
      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PRIMO" className="w-6 h-6 object-contain" />
          <span className="text- text-gray-400">Document généré par PRIMO COMPTA - compta.primo.cd</span>
        </div>
        <span className="text- text-gray-300">ACCOUNTING MANAGEMENT</span>
      </div>
    </div>
  )
}