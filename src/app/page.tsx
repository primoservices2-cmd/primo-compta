'use client'
import { PrimoLogo } from "@/components/PrimoLogo"
import Link from 'next/link'

export default function HomePagePremium() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-black selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PrimoLogo size="md" /> className="h-[36px] w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-500">
            <span>Organisations</span>
            <span>Magasins</span>
            <span>Facturation</span>
            <span>Caisse</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/super-admin" className="text-[13px] font-medium px-4 py-2 rounded-full hover:bg-zinc-100 transition">Super Admin</Link>
            <Link href="/espace-magasin/caisse" className="text-[13px] font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition">Ouvrir la caisse →</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-28 pb-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-3 py-1 text-[11px] font-medium tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#D4B24E] rounded-full"></span>
              PRIMO COMPTA • KINSHASA • RDC
            </div>
            <h1 className="mt-8 text-[56px] md:text-[84px] font-[900] leading-[0.85] tracking-[-0.04em]">
              Compta<br />
              qui <span className="relative inline-block">
                <span className="relative z-10 text-[#D4B24E]">sépare</span>
                <span className="absolute bottom-2 left-0 right-0 h-[14px] bg-[#D4B24E]/20 -rotate-1"></span>
              </span><br />
              les marques.
            </h1>
            <p className="mt-6 text-[17px] leading-7 text-zinc-600 max-w-[520px]">
              <strong className="text-black">PRIMO COMPTA</strong> reste votre plateforme. 
              <strong className="text-black"> Votre client</strong> voit son logo sur ses factures, ses rapports, ses devis. 
              Fini la confusion. Chaque document porte la bonne identité.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/super-admin/organisations" className="bg-black text-white px-7 py-3.5 rounded-full text-[14px] font-medium hover:bg-zinc-900 transition">Créer une organisation cliente →</Link>
              <Link href="/super-admin/magasins" className="bg-white border border-zinc-200 px-7 py-3.5 rounded-full text-[14px] font-medium hover:border-black transition">Voir la démo facture</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-[460px] border-t border-zinc-100 pt-6">
              <div><p className="text-2xl font-bold">100%</p><p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Logo client sur docs</p></div>
              <div><p className="text-2xl font-bold">RCCM</p><p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">IDNAT • NIF • Adresse</p></div>
              <div><p className="text-2xl font-bold">∞</p><p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Magasins par orga</p></div>
            </div>
          </div>

          {/* RIGHT: DASHBOARD PREVIEW */}
          <div className="relative lg:sticky lg:top-28">
            <div className="bg-zinc-950 rounded-[28px] p-3 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]">
              <div className="bg-white rounded-[20px] overflow-hidden">
                <div className="h-10 border-b flex items-center px-4 gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-6 text-[11px] text-zinc-400 font-mono">facture-ETS-MUKENDI-001.pdf</div>
                </div>
                <div className="p-7">
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center text-white font-black text-xl">M</div>
                      <div>
                        <div className="font-bold text-[15px]">ETS MUKENDI SARL</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">12 Av. de la Paix, Gombe • Kinshasa</div>
                        <div className="text-[10px] font-mono mt-2 bg-zinc-100 px-2 py-1 rounded">RCCM: CD/KIN/RCCM/24-B-12345 • IDNAT: 01-123-N45678X</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] tracking-widest text-zinc-400">FACTURE</div>
                      <div className="font-bold text-[14px]">#FAC-2026-001</div>
                      <div className="text-[11px] text-zinc-500 mt-1">14 Oct 2026</div>
                    </div>
                  </div>
                  <div className="mt-7 border-t">
                    <div className="grid grid-cols-4 text-[10px] tracking-widest text-zinc-400 py-3">
                      <span className="col-span-2">ARTICLE</span><span>QTÉ</span><span className="text-right">TOTAL</span>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 text-[13px]"><span className="col-span-2 font-medium">Ciment 50kg</span><span className="text-zinc-500">x20</span><span className="text-right font-medium">480.000 CDF</span></div>
                      <div className="grid grid-cols-4 text-[13px]"><span className="col-span-2 font-medium">Fer à béton 12mm</span><span className="text-zinc-500">x15</span><span className="text-right font-medium">225.000 CDF</span></div>
                    </div>
                  </div>
                  <div className="mt-6 bg-zinc-950 text-white rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-[11px] tracking-widest opacity-60">TOTAL À PAYER</span>
                    <span className="text-xl font-bold">705.000 CDF</span>
                  </div>
                  <div className="mt-5 pt-4 border-t border-dashed flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/Logo.png?v=4" className="h-4 w-auto opacity-60" />
                      <span className="text-[9px] tracking-[0.2em] text-zinc-400">POWERED BY PRIMO COMPTA</span>
                    </div>
                    <span className="text-[9px] text-zinc-400">compta.primo.cd • Document officiel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-[#D4B24E]/20 blur-[50px] rounded-full"></div>
            <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-black/10 blur-[50px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* TRUST + HOW */}
      <section className="bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
              <h3 className="font-bold mt-4">Client crée son organisation</h3>
              <p className="text-sm text-zinc-600 mt-2 leading-6">Il upload son logo, son RCCM, IDNAT, NIF, adresse. C'est son identité qui ira sur ses papiers.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D4B24E] text-black flex items-center justify-center font-bold text-sm">2</div>
              <h3 className="font-bold mt-4">Magasins héritent</h3>
              <p className="text-sm text-zinc-600 mt-2 leading-6">Chaque point de vente lié à l'organisation utilise automatiquement son logo pour factures et rapports.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="font-bold mt-4">PRIMO reste discret</h3>
              <p className="text-sm text-zinc-600 mt-2 leading-6">Notre logo PRIMO COMPTA n'est qu'en footer : “Powered by PRIMO COMPTA”. Le client est mis en avant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/Logo.png?v=4" className="h-6 w-auto" />
          <span className="text-xs text-zinc-500">© 2026 PRIMO COMPTA — Accounting Management — Kinshasa</span>
        </div>
        <div className="text-[11px] tracking-widest text-zinc-400">BUILT FOR DRC • RCCM • IDNAT • NIF • FACTURES CONFORMES</div>
      </footer>
    </main>
  )
}

