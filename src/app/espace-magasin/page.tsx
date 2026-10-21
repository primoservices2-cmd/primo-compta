import Link from "next/link";

export default function EspaceMagasinFinal() {
  const modules = [
    { name: "Caisse", desc: "Ventes et encaissements", href: "/espace-magasin/caisse", icon: "💰", active: true, color: "bg-black text-white" },
    { name: "Stock", desc: "Produits et inventaire", href: "#", icon: "📦", active: false, color: "bg-gray-100" },
    { name: "Ventes", desc: "Historique des ventes", href: "#", icon: "📈", active: false, color: "bg-gray-100" },
    { name: "Dépenses", desc: "Charges du magasin", href: "#", icon: "💸", active: false, color: "bg-gray-100" },
    { name: "Clients", desc: "Base clients & crédits", href: "#", icon: "👥", active: false, color: "bg-gray-100" },
    { name: "Rapports", desc: "Bilan journalier", href: "#", icon: "📊", active: false, color: "bg-gray-100" },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header PRIMO */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold rounded">P</div>
            <span className="font-bold tracking-widest">PRIMO</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">Espace Magasin</span>
          </div>
          <Link href="/" className="text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition">← Accueil</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Espace Magasin</h1>
          <p className="text-gray-500 mt-2">Gérez votre point de vente au quotidien. Choisissez un module pour commencer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <Link
              key={m.name}
              href={m.href}
              className={`${m.active ? 'bg-black text-white hover:bg-zinc-900' : 'bg-white text-black border hover:border-black'} rounded-2xl p-6 transition-all group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${m.active ? 'bg-white/10' : 'bg-black text-white'}`}>
                  {m.icon}
                </div>
                {m.active && <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Actif</span>}
                {!m.active && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Bientôt</span>}
              </div>
              <h3 className="text-xl font-semibold">{m.name}</h3>
              <p className={`text-sm mt-1 ${m.active ? 'text-white/60' : 'text-gray-500'}`}>{m.desc}</p>
              <div className={`mt-6 text-sm font-medium flex items-center gap-2 ${m.active ? 'text-white' : 'text-black'}`}>
                Ouvrir <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6">
            <h4 className="font-semibold mb-4">Activité du jour</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Caisse ouverte</span><span className="text-gray-400">08:30</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>Aucune vente pour l'instant</span><span className="text-gray-400">Connectez Supabase pour voir les données</span></div>
            </div>
          </div>
          <div className="bg-black text-white rounded-2xl p-6">
            <h4 className="font-semibold">Aide</h4>
            <p className="text-sm text-white/60 mt-2">Ta vraie page caisse est dans <code className="bg-white/10 px-1 rounded">/espace-magasin/caisse</code>. Ce dashboard est la porte d'entrée finale.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

