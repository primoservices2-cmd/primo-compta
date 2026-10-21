'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

type Facture = {
  id: string
  numero: string
  total: number
  client_nom: string
  created_at: string
  magasins?: { nom: string }
  organisations?: { nom: string, logo_url?: string, rccm?: string }
}

export default function RapportsPage() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [filtered, setFiltered] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [orgFilter, setOrgFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('factures').select('*, magasins(nom), organisations(nom, logo_url, rccm)').order('created_at', { ascending: false }).limit(500)
      setFactures((data as any) || [])
      setFiltered((data as any) || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let f = [...factures]
    if (dateDebut) f = f.filter(x => new Date(x.created_at) >= new Date(dateDebut))
    if (dateFin) f = f.filter(x => new Date(x.created_at) <= new Date(dateFin + 'T23:59:59'))
    if (orgFilter !== 'all') f = f.filter(x => x.organisations?.nom === orgFilter)
    setFiltered(f)
  }, [dateDebut, dateFin, orgFilter, factures])

  const totalCA = filtered.reduce((s, x) => s + Number(x.total || 0), 0)
  const orgs = Array.from(new Set(factures.map(f => f.organisations?.nom).filter(Boolean)))

  const exportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Header PRIMO COMPTA
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('PRIMO COMPTA', 15, 15)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100,100,100)
    doc.text('ACCOUNTING MANAGEMENT - Rapports', 15, 20)
    doc.setTextColor(0,0,0)
    
    // Titre rapport
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(`Rapport des ventes - ${new Date().toLocaleDateString('fr-CD')}`, 15, 32)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Période: ${dateDebut || 'Début'} au ${dateFin || 'Aujourd\'hui'} | Org: ${orgFilter === 'all' ? 'Toutes' : orgFilter}`, 15, 38)
    doc.text(`Total factures: ${filtered.length} | Chiffre d'affaires: ${totalCA.toLocaleString()} CDF`, 15, 43)

    // Tableau
    let y = 52
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setFillColor(0,0,0)
    doc.setTextColor(255,255,255)
    doc.rect(15, y-5, 180, 8, 'F')
    doc.text('N° FACTURE', 16, y)
    doc.text('DATE', 55, y)
    doc.text('CLIENT', 80, y)
    doc.text('MAGASIN', 115, y)
    doc.text('TOTAL CDF', 195, y, { align: 'right' })
    
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0,0,0)
    doc.setFontSize(8)

    filtered.forEach(f => {
      if (y > 280) { doc.addPage(); y = 15 }
      doc.text(f.numero, 16, y)
      doc.text(new Date(f.created_at).toLocaleDateString('fr-CD'), 55, y)
      doc.text((f.client_nom || 'Divers').substring(0,20), 80, y)
      doc.text((f.magasins?.nom || '-').substring(0,15), 115, y)
      doc.text(Number(f.total).toLocaleString(), 195, y, { align: 'right' })
      y += 5
    })

    // Total
    y += 3
    doc.setLineWidth(0.5)
    doc.line(15, y, 195, y)
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`TOTAL CA: ${totalCA.toLocaleString()} CDF`, 195, y, { align: 'right' })

    // Footer
    doc.setFontSize(7)
    doc.setTextColor(150,150,150)
    doc.setFont('helvetica', 'normal')
    doc.text('Powered by PRIMO COMPTA • compta.primo.cd • Rapport officiel - Document conforme DRC', 15, 292)
    doc.text(`Généré le ${new Date().toLocaleString('fr-CD')} • ${filtered.length} factures`, 15, 295)

    doc.save(`Rapport_PRIMO_COMPTA_${new Date().toISOString().slice(0,10)}.pdf`)
  }

  const exportExcel = () => {
    const data = filtered.map(f => ({
      'N° Facture': f.numero,
      'Date': new Date(f.created_at).toLocaleDateString('fr-CD'),
      'Client': f.client_nom || 'Client divers',
      'Organisation': f.organisations?.nom || '',
      'Magasin': f.magasins?.nom || '',
      'Total CDF': Number(f.total),
      'RCCM Org': f.organisations?.rccm || ''
    }))

    // Ajoute ligne total
    data.push({
      'N° Facture': 'TOTAL',
      'Date': '',
      'Client': '',
      'Organisation': '',
      'Magasin': `${filtered.length} factures`,
      'Total CDF': totalCA,
      'RCCM Org': ''
    } as any)

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rapport Ventes')

    // Feuille 2 - Résumé par organisation
    const resume = orgs.map(o => {
      const fOrg = filtered.filter(x => x.organisations?.nom === o)
      return {
        'Organisation': o,
        'Nombre factures': fOrg.length,
        'Chiffre CDF': fOrg.reduce((s,x)=>s+Number(x.total),0)
      }
    })
    const ws2 = XLSX.utils.json_to_sheet(resume)
    XLSX.utils.book_append_sheet(wb, ws2, 'Résumé par Orga')

    XLSX.writeFile(wb, `Rapport_PRIMO_COMPTA_${new Date().toISOString().slice(0,10)}.xlsx`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement rapports...</div>

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Logo.png?v=4" className="h-8 w-auto" />
            <div>
              <p className="font-black text-sm">Rapports</p>
              <p className="text-[11px] text-zinc-500">Export PDF + Excel avec logo client</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExcel} className="bg-[#107C41] text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">📊 Excel</button>
            <button onClick={exportPDF} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold">📄 PDF</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtres */}
        <div className="bg-white border rounded-2xl p-5 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium">Date début</label>
            <input type="date" value={dateDebut} onChange={e=>setDateDebut(e.target.value)} className="mt-1 border rounded-xl px-3 py-2 text-sm block" />
          </div>
          <div>
            <label className="text-xs font-medium">Date fin</label>
            <input type="date" value={dateFin} onChange={e=>setDateFin(e.target.value)} className="mt-1 border rounded-xl px-3 py-2 text-sm block" />
          </div>
          <div>
            <label className="text-xs font-medium">Organisation</label>
            <select value={orgFilter} onChange={e=>setOrgFilter(e.target.value)} className="mt-1 border rounded-xl px-3 py-2 text-sm block">
              <option value="all">Toutes les organisations</option>
              {orgs.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ml-auto flex gap-6">
            <div className="text-right"><p className="text-xs text-zinc-500">Factures</p><p className="text-xl font-black">{filtered.length}</p></div>
            <div className="text-right"><p className="text-xs text-zinc-500">CA Total</p><p className="text-xl font-black">{totalCA.toLocaleString()} CDF</p></div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white border rounded-2xl mt-6 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-sm">Détail factures - Export PDF + Excel avec logo</h3>
            <span className="text-[10px] tracking-widest text-zinc-400 flex items-center gap-1"><img src="/Logo.png?v=4" className="h-3 w-auto" /> POWERED BY PRIMO COMPTA</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-[11px] tracking-widest">
                <tr><th className="p-3 text-left">N° FACTURE</th><th className="p-3 text-left">DATE</th><th className="p-3 text-left">CLIENT</th><th className="p-3 text-left">ORGANISATION</th><th className="p-3 text-left">MAGASIN</th><th className="p-3 text-right">TOTAL</th></tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} className="border-t hover:bg-zinc-50">
                    <td className="p-3 font-mono text-xs font-bold">{f.numero}</td>
                    <td className="p-3 text-xs">{new Date(f.created_at).toLocaleDateString('fr-CD')}</td>
                    <td className="p-3">{f.client_nom || 'Divers'}</td>
                    <td className="p-3 flex items-center gap-2">{f.organisations?.logo_url && <img src={f.organisations.logo_url} className="w-5 h-5 rounded object-cover border" />}{f.organisations?.nom || '-'}</td>
                    <td className="p-3">{f.magasins?.nom || '-'}</td>
                    <td className="p-3 text-right font-bold">{Number(f.total).toLocaleString()} CDF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-black text-white rounded-2xl p-6 flex justify-between items-center">
          <div>
            <p className="font-bold">Exports certifiés PRIMO COMPTA</p>
            <p className="text-xs text-white/60 mt-1">PDF A4 avec entête PRIMO COMPTA + tableau + footer • Excel avec 2 feuilles (Détail + Résumé par orga) + totaux + RCCM</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExcel} className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold">📊 Export Excel</button>
            <button onClick={exportPDF} className="bg-[#D4B24E] text-black px-5 py-2.5 rounded-full text-sm font-bold">📄 Export PDF</button>
          </div>
        </div>
      </div>
    </main>
  )
}
