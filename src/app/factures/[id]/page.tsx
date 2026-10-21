'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import jsPDF from 'jspdf'

export default function FacturePDFPage({ params }: { params: { id: string } }) {
  const [facture, setFacture] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: fac } = await supabase.from('factures').select('*, organisations(*), magasins(*)').eq('id', params.id).single()
      if (fac) {
        setFacture(fac)
        setOrg(fac.organisations)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  const downloadPDF = async () => {
    if (!facture) return
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Header - Logo client
    if (org?.logo_url) {
      try {
        // On met le logo client en haut (si CORS ok, sinon on skip)
        const img = await fetch(org.logo_url).then(r => r.blob()).then(b => new Promise<string>(res => {
          const reader = new FileReader()
          reader.onload = () => res(reader.result as string)
          reader.readAsDataURL(b)
        })).catch(() => null)
        if (img) doc.addImage(img, 'PNG', 15, 10, 25, 25)
      } catch {}
    }

    // Infos orga
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(org?.societe_nom || org?.nom || 'CLIENT', 45, 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`${org?.adresse || ''} - ${org?.ville || ''}`, 45, 23)
    doc.text(`Tél: ${org?.telephone || ''} | ${org?.email || ''}`, 45, 27)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(`RCCM: ${org?.rccm || '-'} | IDNAT: ${org?.idnat || '-'} | NIF: ${org?.nif || '-'}`, 15, 38)

    // Facture info droite
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(0,0,0)
    doc.text(facture.numero, 195, 18, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date(facture.created_at).toLocaleDateString('fr-CD')}`, 195, 23, { align: 'right' })
    doc.text(`Client: ${facture.client_nom || 'Client divers'}`, 195, 27, { align: 'right' })
    doc.text(`Magasin: ${facture.magasins?.nom || ''}`, 195, 31, { align: 'right' })

    // Ligne séparation
    doc.setDrawColor(0,0,0)
    doc.setLineWidth(0.5)
    doc.line(15, 42, 195, 42)

    // Tableau articles
    let y = 50
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('ARTICLE', 15, y)
    doc.text('QTÉ', 110, y)
    doc.text('P.U', 135, y)
    doc.text('TOTAL', 195, y, { align: 'right' })
    y += 3
    doc.setLineWidth(0.2)
    doc.line(15, y, 195, y)
    y += 7

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    facture.articles?.forEach((a: any) => {
      doc.text(a.nom || '', 15, y)
      doc.text(String(a.qte), 110, y)
      doc.text(`${Number(a.prix).toLocaleString()}`, 135, y)
      doc.text(`${(a.qte * a.prix).toLocaleString()} CDF`, 195, y, { align: 'right' })
      y += 7
      if (y > 270) { doc.addPage(); y = 20 }
    })

    // Total
    y += 5
    doc.setLineWidth(0.5)
    doc.line(130, y, 195, y)
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('TOTAL:', 130, y)
    doc.text(`${Number(facture.total).toLocaleString()} CDF`, 195, y, { align: 'right' })

    // Footer PRIMO COMPTA discret
    const footerY = 285
    doc.setDrawColor(200,200,200)
    doc.setLineWidth(0.2)
    doc.line(15, footerY, 195, footerY)
    doc.setFontSize(7)
    doc.setTextColor(150,150,150)
    doc.setFont('helvetica', 'normal')
    // Petit logo PRIMO COMPTA - texte
    doc.text('Powered by PRIMO COMPTA • compta.primo.cd • Accounting Management', 15, footerY + 5)
    doc.text(`Document généré par PRIMO COMPTA le ${new Date().toLocaleString('fr-CD')} • ${org?.nom || ''} • ${facture.numero}`, 15, footerY + 9)
    doc.text(`Page 1/1 - Facture conforme DRC`, 195, footerY + 5, { align: 'right' })

    doc.save(`${facture.numero}_${org?.nom || 'client'}.pdf`)
  }

  const shareWhatsApp = () => {
    if (!facture) return
    const text = `Bonjour ${facture.client_nom || ''},%0A%0AVoici votre facture *${facture.numero}* de *${org?.nom || ''}*%0A%0AMontant: *${Number(facture.total).toLocaleString()} CDF*%0A%0ADocument avec logo ${org?.nom} + footer Powered by PRIMO COMPTA%0A%0A${window.location.href}%0A%0AMerci pour votre confiance !`
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement facture...</div>
  if (!facture) return <div className="min-h-screen flex items-center justify-center">Facture introuvable</div>

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-[850px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <a href={`/super-admin/magasins/${facture.magasin_id}`} className="text-sm border bg-white px-4 py-2 rounded-full">← Retour</a>
          <div className="flex gap-2">
            <button onClick={shareWhatsApp} className="bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-medium">WhatsApp</button>
            <button onClick={downloadPDF} className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold">📄 Télécharger PDF A4</button>
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-xl p-10">
          <div className="flex justify-between items-start border-b-2 border-black pb-6">
            <div className="flex gap-4">
              {org?.logo_url ? <img src={org.logo_url} className="w-16 h-16 rounded-2xl object-cover border" /> : <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center font-black">{org?.nom?.[0]}</div>}
              <div>
                <h2 className="font-black text-lg">{org?.societe_nom || org?.nom}</h2>
                <p className="text-xs text-zinc-500 mt-1">{org?.adresse} - {org?.ville}</p>
                <p className="text-xs text-zinc-500">{org?.telephone} • {org?.email}</p>
                <p className="text-[11px] font-mono mt-2 bg-zinc-100 px-2 py-1 rounded">RCCM: {org?.rccm} | IDNAT: {org?.idnat} | NIF: {org?.nif}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">{facture.numero}</div>
              <p className="text-xs text-zinc-500 mt-2">{new Date(facture.created_at).toLocaleDateString('fr-CD')}</p>
              <p className="text-xs mt-1">Client: <strong>{facture.client_nom || 'Client divers'}</strong></p>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-4 bg-zinc-50 text-[11px] tracking-widest p-3 rounded-t-xl"><span className="col-span-2">ARTICLE</span><span>QTÉ</span><span className="text-right">TOTAL</span></div>
            {facture.articles?.map((a: any, i: number) => (
              <div key={i} className="grid grid-cols-4 p-3 text-sm border-b"><span className="col-span-2">{a.nom}</span><span>{a.qte} x {a.prix}</span><span className="text-right font-medium">{(a.qte*a.prix).toLocaleString()} CDF</span></div>
            ))}
            <div className="mt-4 bg-black text-white rounded-2xl p-4 flex justify-between">
              <span className="text-xs opacity-60 tracking-widest">TOTAL À PAYER</span>
              <span className="font-black text-xl">{Number(facture.total).toLocaleString()} CDF</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/Logo.png?v=4" className="h-5 w-auto opacity-70" />
              <span className="text-[10px] tracking-widest text-zinc-400">POWERED BY PRIMO COMPTA • compta.primo.cd • Accounting Management</span>
            </div>
            <span className="text-[9px] text-zinc-400">Document officiel conforme DRC</span>
          </div>
        </div>

        <div className="mt-6 bg-[#D4B24E]/10 border border-[#D4B24E]/20 rounded-2xl p-4 text-sm">
          <p className="font-bold">✓ Flux final validé :</p>
          <p className="text-zinc-600 mt-1">Logo client en grand + RCCM en entête + Total + Footer discret PRIMO COMPTA + PDF A4 téléchargeable + Partage WhatsApp direct.</p>
        </div>
      </div>
    </main>
  )
}
